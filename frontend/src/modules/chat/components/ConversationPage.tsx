import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowLeft, Send, MoreVertical, Phone, Video } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../../components/ui/avatar";
import { RoomBackground } from "./RoomBackground";
import { BackgroundDecor } from "./BackgroundDecor";
import { useAuthStore } from "../../../store";
import { Message, Room } from "../../../types";
import { useAppQuery } from "../../../hooks";
import { apiRoutes } from "../../../helpers/apiRoutes";
import { toast } from "sonner";
import { socketService } from "../../../services/socketService";

interface GetRoomResponse {
  room: Room;
}

export function ConversationPage() {
  const navigate = useNavigate();
  const { roomId } = useParams<{ roomId: string }>();
  const currentUser = useAuthStore((state) => state.user);
  const token = useAuthStore((state) => state.token);

  const [newMessage, setNewMessage] = useState("");
  const [isEntering, setIsEntering] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoadingMessages, setIsLoadingMessages] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const [typingUserId, setTypingUserId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Fetch room data (using REST API for initial load)
  const {
    data: roomData,
    isLoading: isLoadingRoom,
    error: roomError,
  } = useAppQuery<GetRoomResponse>(
    ["room", roomId || ""],
    apiRoutes.rooms.getRoomById(roomId!),
    {},
    {
      enabled: !!roomId,
      showError: false,
    },
  );

  const room = roomData?.room;
  const otherUser = room?.participants.find((p) => p._id !== currentUser?._id);

  // ============================================================
  // Initialize Socket Connection and Join Room
  // ============================================================
  useEffect(() => {
    if (!roomId || !currentUser) return;

    if (!token) {
      navigate("/login");
      return;
    }

    // Connect to socket if not already connected
    if (!socketService.isConnected()) {
      socketService.connect(token);
    }

    // Join the specific room to receive messages
    socketService.joinRoom(roomId);

    // Request initial messages
    socketService.getMessages(roomId, 20);

    // ============================================================
    // Listen for messages list (initial load)
    // ============================================================
    const handleMessagesList = (data: {
      roomId: string;
      messages: Message[];
      pagination: { hasMore: boolean; nextCursor: string | null };
    }) => {
      if (data.roomId === roomId) {
        setMessages(data.messages);
        setIsLoadingMessages(false);
      }
    };

    // ============================================================
    // Listen for new messages in real-time
    // Updates UI instantly when someone sends a message
    // ============================================================
    const handleNewMessage = (data: { roomId: string; message: Message }) => {
      if (data.roomId === roomId) {
        setMessages((prevMessages) => [...prevMessages, data.message]);

        // Mark messages as read when viewing the conversation
        socketService.markMessagesAsRead(roomId);
      }
    };

    // ============================================================
    // Listen for typing indicators
    // Show when other user is typing
    // ============================================================
    const handleUserTyping = (data: {
      roomId: string;
      userId: string;
      isTyping: boolean;
    }) => {
      if (data.roomId === roomId && data.userId !== currentUser._id) {
        setTypingUserId(data.isTyping ? data.userId : null);
      }
    };

    // Register event listeners
    socketService.onMessagesList(handleMessagesList);
    socketService.onNewMessage(handleNewMessage);
    socketService.onUserTyping(handleUserTyping);

    // Mark messages as read when opening conversation
    socketService.markMessagesAsRead(roomId);

    // Cleanup on unmount
    return () => {
      socketService.off("messagesList", handleMessagesList);
      socketService.off("newMessage", handleNewMessage);
      socketService.off("userTyping", handleUserTyping);
      socketService.leaveRoom(roomId);
    };
  }, [roomId, currentUser, navigate]);

  // Start door animation after loading is complete
  useEffect(() => {
    if (!isLoadingRoom && !isLoadingMessages && roomData) {
      setIsEntering(true);
      const timer = setTimeout(() => {
        setIsEntering(false);
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [isLoadingRoom, isLoadingMessages, roomData]);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  useEffect(() => {
    if (roomError) {
      toast.error("Failed to load room");
      navigate("/app/chats");
    }
  }, [roomError, navigate]);

  // ============================================================
  // Handle Send Message via Socket
  // ============================================================
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !currentUser || !roomId) return;

    // Send message via socket
    socketService.sendMessage(roomId, newMessage.trim());
    setNewMessage("");

    // Stop typing indicator
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    socketService.sendTyping(roomId, false);
  };

  // ============================================================
  // Handle Typing Indicator
  // ============================================================
  const handleMessageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewMessage(e.target.value);

    if (!roomId) return;

    // Send typing indicator
    if (!isTyping) {
      setIsTyping(true);
      socketService.sendTyping(roomId, true);
    }

    // Clear previous timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Stop typing after 2 seconds of inactivity
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
      socketService.sendTyping(roomId, false);
    }, 2000);
  };

  if (!currentUser) {
    navigate("/login");
    return null;
  }

  if (isLoadingRoom || isLoadingMessages) {
    return (
      <div className="relative min-h-[100dvh] overflow-hidden bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground text-lg mb-2">
            Loading conversation...
          </p>
          <div className="flex justify-center gap-2">
            <div
              className="w-2 h-2 bg-primary rounded-full animate-bounce"
              style={{ animationDelay: "0ms" }}
            />
            <div
              className="w-2 h-2 bg-primary rounded-full animate-bounce"
              style={{ animationDelay: "150ms" }}
            />
            <div
              className="w-2 h-2 bg-primary rounded-full animate-bounce"
              style={{ animationDelay: "300ms" }}
            />
          </div>
        </div>
      </div>
    );
  }

  if (!room || !otherUser) {
    return (
      <div className="relative min-h-[100dvh] overflow-hidden bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Room not found</p>
      </div>
    );
  }

  return (
    <div className="relative min-h-[100dvh] overflow-hidden bg-background">
      {/* Door Opening Animation Overlay */}
      <AnimatePresence>
        {isEntering && (
          <motion.div
            className="fixed inset-0 z-50 flex"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            {/* Left Door */}
            <motion.div
              className="w-1/2 h-full bg-card border-r-2 border-primary/30 relative"
              initial={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
            >
              {/* Realistic doorknob on left door */}
              <div className="absolute right-8 top-1/2 -translate-y-1/2">
                {/* Backplate */}
                <div className="absolute -left-4 -top-6 w-12 h-16 rounded-lg bg-gradient-to-br from-primary/30 to-primary/15 border border-primary/40" />
                {/* Doorknob sphere */}
                <div className="relative w-8 h-8 rounded-full bg-gradient-to-br from-primary via-primary/70 to-primary/40 border-4 border-primary/90 shadow-xl">
                  <div className="absolute top-1 left-2 w-3 h-3 rounded-full bg-white/40 blur-[2px]" />
                  <div className="absolute -inset-2 rounded-full bg-primary/20 blur-md -z-10" />
                </div>
              </div>
            </motion.div>

            {/* Right Door */}
            <motion.div
              className="w-1/2 h-full bg-card border-l-2 border-primary/30 relative"
              initial={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
            >
              {/* Realistic doorknob on right door */}
              <div className="absolute left-8 top-1/2 -translate-y-1/2">
                {/* Backplate */}
                <div className="absolute -left-4 -top-6 w-12 h-16 rounded-lg bg-gradient-to-br from-primary/30 to-primary/15 border border-primary/40" />
                {/* Doorknob sphere */}
                <div className="relative w-8 h-8 rounded-full bg-gradient-to-br from-primary via-primary/70 to-primary/40 border-4 border-primary/90 shadow-xl">
                  <div className="absolute top-1 left-2 w-3 h-3 rounded-full bg-white/40 blur-[2px]" />
                  <div className="absolute -inset-2 rounded-full bg-primary/20 blur-md -z-10" />
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bird's Eye View Background */}
      <RoomBackground currentUser={currentUser!} otherUser={otherUser} />

      {/* Decorative Background Elements */}
      <BackgroundDecor />

      {/* Chat Interface */}
      <div className="relative z-10 flex flex-col h-screen">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.4 }}
          className="bg-card/80 backdrop-blur-lg border-b border-border px-4 py-3"
        >
          <div className="flex items-center justify-between max-w-5xl mx-auto">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate("/app/chats")}
                className="hover:bg-background/50"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>

              <Avatar className="w-10 h-10 border-2 border-primary/20">
                <AvatarImage
                  src={otherUser.avatar}
                  alt={`${otherUser.firstName} ${otherUser.lastName}`}
                />
                <AvatarFallback>
                  {otherUser.firstName[0]}
                  {otherUser.lastName[0]}
                </AvatarFallback>
              </Avatar>

              <div>
                <h2 className="font-medium">
                  {otherUser.firstName} {otherUser.lastName}
                </h2>
                <p className="text-xs text-muted-foreground">
                  {otherUser.status === "online" ? "Active now" : "Offline"}
                </p>
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="hover:bg-background/50"
              >
                <Phone className="w-5 h-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="hover:bg-background/50"
              >
                <Video className="w-5 h-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="hover:bg-background/50"
              >
                <MoreVertical className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Messages Area */}
        <div
          ref={messagesContainerRef}
          className="flex-1 overflow-y-auto px-4 pt-6 pb-0"
        >
          <div className="max-w-4xl mx-auto space-y-4">
            {messages.map((message: Message, index: number) => (
              <motion.div
                key={message._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`flex ${
                  message.type === "system"
                    ? "justify-center"
                    : message.senderId === currentUser._id
                      ? "justify-end"
                      : "justify-start"
                }`}
              >
                <div
                  className={`${
                    message.type === "system"
                      ? "max-w-[60%] md:max-w-[50%] rounded-md px-3 py-1.5 backdrop-blur-lg bg-card border border-border/50"
                      : `max-w-[70%] rounded-2xl px-4 py-3 backdrop-blur-lg opacity-80 ${
                          message.senderId === currentUser._id
                            ? "bg-primary text-primary-foreground rounded-br-sm"
                            : "bg-card border border-border rounded-bl-sm"
                        }`
                  }`}
                >
                  <p
                    className={`break-words ${
                      message.type === "system" ? "text-xs opacity-60" : ""
                    }`}
                  >
                    {message.content}
                  </p>
                  <p
                    className={`mt-1 ${
                      message.type === "system"
                        ? "text-[10px] text-center text-muted-foreground/70 opacity-60"
                        : `text-xs ${
                            message.senderId === currentUser._id
                              ? "text-primary-foreground/70"
                              : "text-muted-foreground"
                          }`
                    }`}
                  >
                    {new Date(message.timestamp).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </motion.div>
            ))}

            {/* Typing Indicator */}
            {typingUserId && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex justify-start"
              >
                <div className="max-w-[70%] rounded-2xl px-4 py-3 backdrop-blur-lg bg-card border border-border rounded-bl-sm">
                  <div className="flex gap-1">
                    <div
                      className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                      style={{ animationDelay: "0ms" }}
                    />
                    <div
                      className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                      style={{ animationDelay: "150ms" }}
                    />
                    <div
                      className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                      style={{ animationDelay: "300ms" }}
                    />
                  </div>
                </div>
              </motion.div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Message Input */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.4 }}
          className="bg-card/80 backdrop-blur-lg border-t border-border px-4 py-4"
        >
          <form
            onSubmit={handleSendMessage}
            className="max-w-4xl mx-auto flex gap-3"
          >
            <Input
              type="text"
              placeholder="Type a message..."
              value={newMessage}
              onChange={handleMessageChange}
              className="flex-1 bg-background border-border rounded-full px-6"
            />
            <Button
              type="submit"
              size="icon"
              disabled={!newMessage.trim()}
              className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full w-12 h-12"
            >
              <Send className="w-5 h-5" />
            </Button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
