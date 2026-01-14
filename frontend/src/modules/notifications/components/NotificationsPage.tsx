import { motion } from "motion/react";
import { ArrowLeft, MessageSquare, UserPlus, Bell } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../../components/ui/button";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../../components/ui/avatar";
import { AnimatedBackground } from "../../../components/AnimatedBackground";

interface Notification {
  id: string;
  type: "message" | "friend_request" | "system";
  title: string;
  message: string;
  timestamp: Date;
  avatar?: string;
  read: boolean;
}

const notifications: Notification[] = [
  {
    id: "1",
    type: "message",
    title: "Sarah Chen",
    message: "Sent you a message",
    timestamp: new Date(Date.now() - 1000 * 60 * 5),
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
    read: false,
  },
  {
    id: "2",
    type: "message",
    title: "Emily Park",
    message: "Are we still on for tomorrow?",
    timestamp: new Date(Date.now() - 1000 * 60 * 60),
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
    read: false,
  },
  {
    id: "3",
    type: "friend_request",
    title: "James Wilson",
    message: "Wants to connect with you",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3),
    avatar:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop",
    read: true,
  },
  {
    id: "4",
    type: "system",
    title: "Welcome to Rooms!",
    message: "Start creating meaningful connections",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
    read: true,
  },
];

export function NotificationsPage() {
  const navigate = useNavigate();

  const getIcon = (type: string) => {
    switch (type) {
      case "message":
        return MessageSquare;
      case "friend_request":
        return UserPlus;
      default:
        return Bell;
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      <AnimatedBackground />

      <div className="relative z-10 min-h-screen max-w-4xl mx-auto px-4 py-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <Button
            variant="ghost"
            onClick={() => navigate("/app/chats")}
            className="mb-4 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>

          <h1 className="text-3xl mb-2">Notifications</h1>
          <p className="text-muted-foreground">
            Stay updated with your conversations
          </p>
        </motion.div>

        {/* Notifications List */}
        <div className="space-y-3">
          {notifications.map((notification, index) => {
            const Icon = getIcon(notification.type);

            return (
              <motion.div
                key={notification.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05, duration: 0.4 }}
                className={`bg-card border border-border rounded-xl p-4 hover:border-primary/50 transition-colors ${
                  !notification.read ? "bg-primary/5" : ""
                }`}
              >
                <div className="flex items-start gap-4">
                  {notification.avatar ? (
                    <Avatar className="w-12 h-12 border-2 border-border">
                      <AvatarImage
                        src={notification.avatar}
                        alt={notification.title}
                      />
                      <AvatarFallback>{notification.title[0]}</AvatarFallback>
                    </Avatar>
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                  )}

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-1">
                      <h3 className="font-medium">{notification.title}</h3>
                      {!notification.read && (
                        <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0 mt-2" />
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mb-1">
                      {notification.message}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(notification.timestamp).toLocaleDateString()} at{" "}
                      {new Date(notification.timestamp).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
