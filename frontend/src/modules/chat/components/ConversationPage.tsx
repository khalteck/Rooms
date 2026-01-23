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
import { rooms, messages as initialMessages } from "../../../mockData";
import { useAuthStore } from "../../../store";
import { Message } from "../../../types";

export function ConversationPage() {
  const navigate = useNavigate();
  const { roomId } = useParams<{ roomId: string }>();
  const currentUser = useAuthStore((state) => state.user);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isEntering, setIsEntering] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const room = rooms.find((r) => r.id === roomId);
  const otherUser = room?.participants.find((p) => p.id !== currentUser?.id);

  useEffect(() => {
    if (!roomId) return;
    // Load messages for this room
    const roomMessages = initialMessages.filter((m) => m.roomId === roomId);
    setMessages(roomMessages);

    // Door opening animation
    const timer = setTimeout(() => {
      setIsEntering(false);
    }, 800);

    return () => clearTimeout(timer);
  }, [roomId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !currentUser || !roomId) return;

    const message: Message = {
      id: `msg-${Date.now()}`,
      roomId,
      senderId: currentUser.id,
      content: newMessage,
      timestamp: new Date(),
      read: false,
    };

    setMessages([...messages, message]);
    setNewMessage("");
  };

  if (!room || !otherUser || !currentUser) return null;

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
      <RoomBackground currentUser={currentUser} otherUser={otherUser} />

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
                <AvatarImage src={otherUser.avatar} alt={otherUser.name} />
                <AvatarFallback>{otherUser.name[0]}</AvatarFallback>
              </Avatar>

              <div>
                <h2 className="font-medium">{otherUser.name}</h2>
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
        <div className="flex-1 overflow-y-auto px-4 pt-6 pb-12">
          <div className="max-w-4xl mx-auto space-y-4">
            {messages.map((message, index) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`flex ${
                  message.senderId === currentUser.id
                    ? "justify-end"
                    : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[70%] rounded-2xl px-4 py-3  backdrop-blur-lg opacity-70 ${
                    message.senderId === currentUser.id
                      ? "bg-primary text-primary-foreground rounded-br-sm"
                      : "bg-card border border-border rounded-bl-sm"
                  }`}
                >
                  <p className="break-words">{message.content}</p>
                  <p
                    className={`text-xs mt-1 ${
                      message.senderId === currentUser.id
                        ? "text-primary-foreground/70"
                        : "text-muted-foreground"
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
              onChange={(e) => setNewMessage(e.target.value)}
              className="flex-1 bg-background border-border rounded-full px-6"
            />
            <Button
              type="submit"
              size="icon"
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
