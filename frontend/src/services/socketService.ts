import { io, Socket } from "socket.io-client";

/**
 * Socket.IO Client Service
 * Manages WebSocket connection to backend for real-time features
 */
class SocketService {
  private socket: Socket | null = null;
  private token: string | null = null;

  /**
   * Initialize and connect to the Socket.IO server
   * @param token - JWT authentication token
   */
  connect(token: string): void {
    if (this.socket?.connected) {
      console.log("Socket already connected");
      return;
    }

    this.token = token;

    // Get API URL from environment or use default
    const SOCKET_URL =
      (import.meta as any).env?.VITE_API_URL || "http://localhost:3000";

    // Create socket connection with authentication
    this.socket = io(SOCKET_URL, {
      auth: {
        token: this.token,
      },
      transports: ["websocket", "polling"], // Try websocket first, fallback to polling
      reconnection: true, // Auto-reconnect on disconnect
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    // Connection event handlers
    this.socket.on("connect", () => {
      console.log("✅ Socket connected:", this.socket?.id);
    });

    this.socket.on("disconnect", (reason) => {
      console.log("❌ Socket disconnected:", reason);
    });

    this.socket.on("connect_error", (error) => {
      console.error("Socket connection error:", error.message);
    });

    this.socket.on("error", (error) => {
      console.error("Socket error:", error);
    });
  }

  /**
   * Disconnect from Socket.IO server
   */
  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      console.log("Socket disconnected manually");
    }
  }

  /**
   * Check if socket is connected
   */
  isConnected(): boolean {
    return this.socket?.connected || false;
  }

  /**
   * Get the socket instance
   * Throws error if not connected
   */
  getSocket(): Socket {
    if (!this.socket) {
      throw new Error("Socket not initialized. Call connect() first.");
    }
    return this.socket;
  }

  // ============================================================
  // ROOMS EVENTS
  // ============================================================

  /**
   * Request the list of rooms from server
   * @param search - Optional search query
   */
  getRooms(search?: string): void {
    this.getSocket().emit("getRooms", { search });
  }

  /**
   * Listen for rooms list updates
   * @param callback - Function to handle rooms data
   */
  onRoomsList(callback: (data: { rooms: any[] }) => void): void {
    this.getSocket().on("roomsList", callback);
  }

  /**
   * Listen for room updates (e.g., new last message)
   * @param callback - Function to handle room update
   */
  onRoomUpdated(callback: (data: { room: any }) => void): void {
    this.getSocket().on("roomUpdated", callback);
  }

  /**
   * Join a specific room to receive messages
   * @param roomId - Room ID to join
   */
  joinRoom(roomId: string): void {
    this.getSocket().emit("joinRoom", { roomId });
  }

  /**
   * Leave a specific room
   * @param roomId - Room ID to leave
   */
  leaveRoom(roomId: string): void {
    this.getSocket().emit("leaveRoom", { roomId });
  }

  /**
   * Listen for successful room join
   * @param callback - Function to handle join confirmation
   */
  onJoinedRoom(callback: (data: { roomId: string }) => void): void {
    this.getSocket().on("joinedRoom", callback);
  }

  /**
   * Listen for successful room leave
   * @param callback - Function to handle leave confirmation
   */
  onLeftRoom(callback: (data: { roomId: string }) => void): void {
    this.getSocket().on("leftRoom", callback);
  }

  // ============================================================
  // MESSAGES EVENTS
  // ============================================================

  /**
   * Request messages for a specific room
   * @param roomId - Room ID
   * @param limit - Number of messages to fetch
   * @param cursor - Cursor for pagination
   */
  getMessages(roomId: string, limit?: number, cursor?: string): void {
    this.getSocket().emit("getMessages", { roomId, limit, cursor });
  }

  /**
   * Listen for messages list
   * @param callback - Function to handle messages data
   */
  onMessagesList(
    callback: (data: {
      roomId: string;
      messages: any[];
      pagination: { hasMore: boolean; nextCursor: string | null };
    }) => void,
  ): void {
    this.getSocket().on("messagesList", callback);
  }

  /**
   * Send a message to a room
   * @param roomId - Room ID
   * @param content - Message content
   */
  sendMessage(roomId: string, content: string): void {
    this.getSocket().emit("sendMessage", { roomId, content });
  }

  /**
   * Listen for new messages in real-time
   * @param callback - Function to handle new message
   */
  onNewMessage(
    callback: (data: { roomId: string; message: any }) => void,
  ): void {
    this.getSocket().on("newMessage", callback);
  }

  /**
   * Mark messages as read in a room
   * @param roomId - Room ID
   */
  markMessagesAsRead(roomId: string): void {
    this.getSocket().emit("markMessagesAsRead", { roomId });
  }

  /**
   * Listen for messages marked as read confirmation
   * @param callback - Function to handle confirmation
   */
  onMessagesMarkedAsRead(callback: (data: { roomId: string }) => void): void {
    this.getSocket().on("messagesMarkedAsRead", callback);
  }

  /**
   * Send typing indicator
   * @param roomId - Room ID
   * @param isTyping - Whether user is typing
   */
  sendTyping(roomId: string, isTyping: boolean): void {
    this.getSocket().emit("typing", { roomId, isTyping });
  }

  /**
   * Listen for typing indicators from other users
   * @param callback - Function to handle typing status
   */
  onUserTyping(
    callback: (data: {
      roomId: string;
      userId: string;
      isTyping: boolean;
    }) => void,
  ): void {
    this.getSocket().on("userTyping", callback);
  }

  // ============================================================
  // NOTIFICATIONS EVENTS
  // ============================================================

  /**
   * Request notifications list
   * @param limit - Number of notifications to fetch
   * @param skip - Number to skip for pagination
   */
  getNotifications(limit?: number, skip?: number): void {
    this.getSocket().emit("getNotifications", { limit, skip });
  }

  /**
   * Listen for notifications list
   * @param callback - Function to handle notifications data
   */
  onNotificationsList(
    callback: (data: { notifications: any[]; unreadCount: number }) => void,
  ): void {
    this.getSocket().on("notificationsList", callback);
  }

  /**
   * Listen for new notifications in real-time
   * @param callback - Function to handle new notification
   */
  onNewNotification(callback: (data: { notification: any }) => void): void {
    this.getSocket().on("newNotification", callback);
  }

  // ============================================================
  // CLEANUP METHODS
  // ============================================================

  /**
   * Remove a specific event listener
   * @param event - Event name
   * @param callback - Callback to remove
   */
  off(event: string, callback?: (...args: any[]) => void): void {
    if (callback) {
      this.getSocket().off(event, callback);
    } else {
      this.getSocket().off(event);
    }
  }

  /**
   * Remove all listeners for rooms events
   */
  offRoomsEvents(): void {
    this.getSocket().off("roomsList");
    this.getSocket().off("roomUpdated");
    this.getSocket().off("joinedRoom");
    this.getSocket().off("leftRoom");
  }

  /**
   * Remove all listeners for messages events
   */
  offMessagesEvents(): void {
    this.getSocket().off("messagesList");
    this.getSocket().off("newMessage");
    this.getSocket().off("messagesMarkedAsRead");
    this.getSocket().off("userTyping");
  }

  /**
   * Remove all listeners for notifications events
   */
  offNotificationsEvents(): void {
    this.getSocket().off("notificationsList");
    this.getSocket().off("newNotification");
  }
}

// Export a singleton instance
export const socketService = new SocketService();
