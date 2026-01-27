import { useState, useEffect } from "react";
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
import { EmptyNotificationsState } from "./EmptyNotificationsState";
import { NotificationDetailModal } from "./NotificationDetailModal";
import { Notification as NotificationType } from "../../../types";
import { socketService } from "../../../services/socketService";
import { useAuthStore } from "../../../store";

export function NotificationsPage() {
  const navigate = useNavigate();
  const currentUser = useAuthStore((state) => state.user);
  const token = useAuthStore((state) => state.token);

  const [selectedNotification, setSelectedNotification] =
    useState<NotificationType | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [notifications, setNotifications] = useState<NotificationType[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // ============================================================
  // Initialize Socket Connection and Request Notifications
  // ============================================================
  useEffect(() => {
    if (!token || !currentUser) {
      navigate("/login");
      return;
    }

    // Connect to socket if not already connected
    if (!socketService.isConnected()) {
      socketService.connect(token);
    }

    // Request initial notifications list
    socketService.getNotifications();

    // ============================================================
    // Listen for notifications list from server
    // ============================================================
    const handleNotificationsList = (data: {
      notifications: NotificationType[];
      unreadCount: number;
    }) => {
      setNotifications(data.notifications);
      setUnreadCount(data.unreadCount);
      setIsLoading(false);
    };

    // ============================================================
    // Listen for new notifications in real-time
    // Updates UI instantly when a new notification arrives
    // ============================================================
    const handleNewNotification = (data: {
      notification: NotificationType;
    }) => {
      setNotifications((prevNotifications) => [
        data.notification,
        ...prevNotifications,
      ]);
      setUnreadCount((prev) => prev + 1);
    };

    // Register event listeners
    socketService.onNotificationsList(handleNotificationsList);
    socketService.onNewNotification(handleNewNotification);

    // Cleanup on unmount
    return () => {
      socketService.off("notificationsList", handleNotificationsList);
      socketService.off("newNotification", handleNewNotification);
    };
  }, [currentUser, navigate]);

  const handleNotificationClick = (notification: NotificationType) => {
    setSelectedNotification(notification);
    setShowDetailModal(true);

    // If notification is unread, mark it as read
    // (You can add a REST API call here to mark as read)
    if (!notification.read) {
      setUnreadCount((prev) => Math.max(0, prev - 1));
      setNotifications((prevNotifications) =>
        prevNotifications.map((n) =>
          n._id === notification._id ? { ...n, read: true } : n,
        ),
      );
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "message":
        return MessageSquare;
      case "room_invite":
        return UserPlus;
      default:
        return Bell;
    }
  };

  if (isLoading) {
    return (
      <div className="relative min-h-screen overflow-hidden">
        <AnimatedBackground />
        <div className="relative z-10 min-h-screen max-w-4xl mx-auto px-4 py-6 flex items-center justify-center">
          <div className="text-center">
            <p className="text-muted-foreground text-lg mb-2">
              Loading notifications...
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
      </div>
    );
  }

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
            {unreadCount > 0 && ` • ${unreadCount} unread`}
          </p>
        </motion.div>

        {/* Notifications List or Empty State */}
        {notifications.length === 0 ? (
          <EmptyNotificationsState />
        ) : (
          <div className="space-y-3">
            {notifications.map((notification, index) => {
              const Icon = getIcon(notification.type);

              return (
                <motion.div
                  key={notification.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05, duration: 0.4 }}
                  onClick={() => handleNotificationClick(notification)}
                  className={`bg-card border border-border rounded-xl p-4 hover:border-primary/50 transition-colors cursor-pointer ${
                    !notification.read ? "bg-primary/5" : ""
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>

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
                        {new Date(notification.createdAt).toLocaleDateString()}{" "}
                        at{" "}
                        {new Date(notification.createdAt).toLocaleTimeString(
                          [],
                          {
                            hour: "2-digit",
                            minute: "2-digit",
                          },
                        )}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* Notification Detail Modal */}
      <NotificationDetailModal
        notification={selectedNotification as any}
        open={showDetailModal}
        onOpenChange={setShowDetailModal}
      />
    </div>
  );
}
