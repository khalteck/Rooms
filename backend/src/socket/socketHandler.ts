import { Server, Socket } from "socket.io";
import jwt from "jsonwebtoken";
import Room from "../models/rooms";
import Message from "../models/messages";
import Notification from "../models/notifications";
import User from "../models/users";

interface AuthSocket extends Socket {
  userId?: string;
}

/**
 * Initialize Socket.IO server with authentication and event handlers
 * @param io - Socket.IO server instance
 */
export const initializeSocketIO = (io: Server) => {
  // ============================================================
  // MIDDLEWARE: Authentication
  // Verify JWT token before allowing socket connection
  // ============================================================
  io.use(async (socket: AuthSocket, next) => {
    try {
      // Extract token from handshake auth or query parameters
      const token = socket.handshake.auth.token || socket.handshake.query.token;

      if (!token) {
        return next(new Error("Authentication error: No token provided"));
      }

      // Verify and decode the JWT token
      const decoded = jwt.verify(
        token as string,
        process.env.JWT_SECRET as string,
      ) as { id: string };

      // Attach userId to socket for use in event handlers
      socket.userId = decoded.id;

      // Update user status to online
      await User.findByIdAndUpdate(decoded.id, { status: "online" });

      next();
    } catch (error) {
      next(new Error("Authentication error: Invalid token"));
    }
  });

  // ============================================================
  // CONNECTION EVENT
  // Triggered when a client successfully connects
  // ============================================================
  io.on("connection", async (socket: AuthSocket) => {
    const userId = socket.userId;
    console.log(`✅ User connected: ${userId} (Socket ID: ${socket.id})`);

    // ============================================================
    // JOIN USER ROOM
    // Create a personal room for the user to receive targeted events
    // This allows us to emit events to specific users
    // ============================================================
    if (userId) {
      socket.join(`user:${userId}`);
      console.log(`👤 User ${userId} joined personal room`);
    }

    // ============================================================
    // EVENT: getRooms
    // Client requests the initial list of rooms they're part of
    // Returns all rooms with participants, last message, and unread count
    // ============================================================
    socket.on("getRooms", async (data: { search?: string }) => {
      try {
        if (!userId) return;

        const query: any = {
          "participants._id": userId,
        };

        // Add search filter if provided
        if (data?.search) {
          query.$or = [
            { name: { $regex: data.search, $options: "i" } },
            {
              "participants.firstName": { $regex: data.search, $options: "i" },
            },
            { "participants.lastName": { $regex: data.search, $options: "i" } },
            { "participants.username": { $regex: data.search, $options: "i" } },
          ];
        }

        const rooms = await Room.find(query).sort({ updatedAt: -1 });

        // Emit rooms data back to the requesting client only
        socket.emit("roomsList", { rooms });
      } catch (error) {
        console.error("Error fetching rooms:", error);
        socket.emit("error", { message: "Failed to fetch rooms" });
      }
    });

    // ============================================================
    // EVENT: joinRoom
    // Client joins a specific room to receive messages and updates
    // Socket rooms allow targeted broadcasting to room participants
    // ============================================================
    socket.on("joinRoom", async (data: { roomId: string }) => {
      try {
        const { roomId } = data;

        if (!userId || !roomId) return;

        // Verify user is a participant of this room
        const room = await Room.findById(roomId);
        if (
          !room ||
          !room.participants.some((p) => p._id.toString() === userId)
        ) {
          socket.emit("error", { message: "Not authorized to join this room" });
          return;
        }

        // Join the socket room for real-time updates
        socket.join(`room:${roomId}`);
        console.log(`🚪 User ${userId} joined room ${roomId}`);

        // Notify the user they successfully joined
        socket.emit("joinedRoom", { roomId });
      } catch (error) {
        console.error("Error joining room:", error);
        socket.emit("error", { message: "Failed to join room" });
      }
    });

    // ============================================================
    // EVENT: leaveRoom
    // Client leaves a specific room (stops receiving its updates)
    // ============================================================
    socket.on("leaveRoom", (data: { roomId: string }) => {
      const { roomId } = data;
      socket.leave(`room:${roomId}`);
      console.log(`🚪 User ${userId} left room ${roomId}`);
      socket.emit("leftRoom", { roomId });
    });

    // ============================================================
    // EVENT: getMessages
    // Client requests messages for a specific room
    // Supports pagination with cursor-based approach
    // ============================================================
    socket.on(
      "getMessages",
      async (data: { roomId: string; limit?: number; cursor?: string }) => {
        try {
          const { roomId, limit = 20, cursor } = data;

          if (!userId || !roomId) return;

          // Verify user is a participant
          const room = await Room.findById(roomId);
          if (
            !room ||
            !room.participants.some((p) => p._id.toString() === userId)
          ) {
            socket.emit("error", {
              message: "Not authorized to view messages",
            });
            return;
          }

          const query: Record<string, any> = { roomId };

          // Cursor-based pagination for efficient loading
          if (cursor) {
            query._id = { $lt: cursor };
          }

          const messages = await Message.find(query)
            .sort({ _id: -1 }) // Newest first
            .limit(limit);

          const hasMore = messages.length === limit;
          const nextCursor = messages.length
            ? messages[messages.length - 1]._id
            : null;

          // Emit messages back to the requesting client
          socket.emit("messagesList", {
            roomId,
            messages: messages.reverse(), // Oldest first for display
            pagination: {
              hasMore,
              nextCursor,
            },
          });
        } catch (error) {
          console.error("Error fetching messages:", error);
          socket.emit("error", { message: "Failed to fetch messages" });
        }
      },
    );

    // ============================================================
    // EVENT: sendMessage
    // Client sends a new message in a room
    // Broadcasts the message to all participants in real-time
    // Updates room's last message and triggers notifications
    // ============================================================
    socket.on(
      "sendMessage",
      async (data: { roomId: string; content: string }) => {
        try {
          const { roomId, content } = data;

          if (!userId || !roomId || !content?.trim()) {
            socket.emit("error", { message: "Invalid message data" });
            return;
          }

          // Verify user is a participant
          const room = await Room.findById(roomId);
          if (
            !room ||
            !room.participants.some((p) => p._id.toString() === userId)
          ) {
            socket.emit("error", { message: "Not authorized to send message" });
            return;
          }

          // Create and save the new message
          const message = new Message({
            roomId,
            senderId: userId,
            content: content.trim(),
            read: false,
            type: "user",
          });

          await message.save();

          // Update room's last message and timestamp
          room.lastMessage = {
            id: message._id.toString(),
            content: message.content,
            timestamp: new Date(),
          };
          await room.save();

          // ============================================================
          // REAL-TIME BROADCAST: New message to all room participants
          // This ensures everyone in the room sees the message instantly
          // ============================================================
          io.to(`room:${roomId}`).emit("newMessage", {
            roomId,
            message: message.toObject(),
          });

          // ============================================================
          // REAL-TIME BROADCAST: Update room for all participants
          // This updates the room list with the new last message
          // ============================================================
          room.participants.forEach((participant) => {
            io.to(`user:${participant._id}`).emit("roomUpdated", {
              room: room.toObject(),
            });
          });

          // ============================================================
          // CREATE NOTIFICATIONS for other participants
          // Send notification to users not currently viewing the room
          // ============================================================
          const sender = room.participants.find(
            (p) => p._id.toString() === userId,
          );
          const otherParticipants = room.participants.filter(
            (p) => p._id.toString() !== userId,
          );

          for (const participant of otherParticipants) {
            // Create notification in database
            const notification = new Notification({
              userId: participant._id,
              type: "message",
              title: `${sender?.firstName} ${sender?.lastName}`,
              message: content.trim(),
              roomId: roomId,
              read: false,
            });

            await notification.save();

            // ============================================================
            // REAL-TIME BROADCAST: New notification to recipient
            // User receives instant notification about the new message
            // ============================================================
            io.to(`user:${participant._id}`).emit("newNotification", {
              notification: notification.toObject(),
            });
          }
        } catch (error) {
          console.error("Error sending message:", error);
          socket.emit("error", { message: "Failed to send message" });
        }
      },
    );

    // ============================================================
    // EVENT: markMessagesAsRead
    // Client marks all messages in a room as read
    // Updates the database and notifies other participants
    // ============================================================
    socket.on("markMessagesAsRead", async (data: { roomId: string }) => {
      try {
        const { roomId } = data;

        if (!userId || !roomId) return;

        // Mark all unread messages in the room as read
        await Message.updateMany(
          { roomId, senderId: { $ne: userId }, read: false },
          { read: true },
        );

        // Reset unread count in the room
        await Room.findByIdAndUpdate(roomId, { unreadCount: 0 });

        // Notify the client that messages were marked as read
        socket.emit("messagesMarkedAsRead", { roomId });
      } catch (error) {
        console.error("Error marking messages as read:", error);
        socket.emit("error", { message: "Failed to mark messages as read" });
      }
    });

    // ============================================================
    // EVENT: getNotifications
    // Client requests their notification list
    // Returns all notifications with unread count
    // ============================================================
    socket.on(
      "getNotifications",
      async (data: { limit?: number; skip?: number }) => {
        try {
          if (!userId) return;

          const { limit = 20, skip = 0 } = data || {};

          const notifications = await Notification.find({ userId })
            .sort({ createdAt: -1 })
            .limit(limit)
            .skip(skip);

          const unreadCount = await Notification.countDocuments({
            userId,
            read: false,
          });

          // Emit notifications back to the requesting client
          socket.emit("notificationsList", {
            notifications,
            unreadCount,
          });
        } catch (error) {
          console.error("Error fetching notifications:", error);
          socket.emit("error", { message: "Failed to fetch notifications" });
        }
      },
    );

    // ============================================================
    // EVENT: typing
    // Client indicates they are typing in a room
    // Broadcasts typing status to other room participants
    // ============================================================
    socket.on("typing", (data: { roomId: string; isTyping: boolean }) => {
      const { roomId, isTyping } = data;

      if (!userId || !roomId) return;

      // Broadcast typing status to all other users in the room
      socket.to(`room:${roomId}`).emit("userTyping", {
        roomId,
        userId,
        isTyping,
      });
    });

    // ============================================================
    // DISCONNECT EVENT
    // Triggered when a client disconnects (close tab, network issue, etc.)
    // Clean up: update user status and leave all rooms
    // ============================================================
    socket.on("disconnect", async () => {
      console.log(`❌ User disconnected: ${userId} (Socket ID: ${socket.id})`);

      if (userId) {
        try {
          // Update user status to offline
          await User.findByIdAndUpdate(userId, { status: "offline" });

          // Leave personal room
          socket.leave(`user:${userId}`);
        } catch (error) {
          console.error("Error during disconnect cleanup:", error);
        }
      }
    });

    // ============================================================
    // ERROR HANDLING
    // Catch any socket errors and log them
    // ============================================================
    socket.on("error", (error) => {
      console.error("Socket error:", error);
    });
  });
};
