import { MessageSquare, UserPlus, Bell } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../../../components/ui/dialog";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../../components/ui/avatar";
import { Button } from "../../../components/ui/button";

interface Notification {
  id: string;
  type: "message" | "friend_request" | "system";
  title: string;
  message: string;
  timestamp: Date;
  avatar?: string;
  read: boolean;
}

interface NotificationDetailModalProps {
  notification: Notification | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function NotificationDetailModal({
  notification,
  open,
  onOpenChange,
}: NotificationDetailModalProps) {
  if (!notification) return null;

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

  const Icon = getIcon(notification.type);

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "message":
        return "New Message";
      case "friend_request":
        return "Connection Request";
      default:
        return "System Notification";
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card border-border sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Notification Details</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            {getTypeLabel(notification.type)}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Avatar/Icon Section */}
          <div className="flex items-center gap-4">
            {notification.avatar ? (
              <Avatar className="w-16 h-16 border-2 border-border">
                <AvatarImage
                  src={notification.avatar}
                  alt={notification.title}
                />
                <AvatarFallback>{notification.title[0]}</AvatarFallback>
              </Avatar>
            ) : (
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                <Icon className="w-8 h-8 text-primary" />
              </div>
            )}

            <div className="flex-1">
              <h3 className="text-lg font-semibold">{notification.title}</h3>
              <p className="text-sm text-muted-foreground">
                {new Date(notification.timestamp).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}{" "}
                at{" "}
                {new Date(notification.timestamp).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          </div>

          {/* Message Section */}
          <div className="bg-background rounded-lg p-4 border border-border">
            <p className="text-sm leading-relaxed">{notification.message}</p>
          </div>

          {/* Status Badge */}
          <div className="flex items-center gap-2">
            <div
              className={`px-3 py-1 rounded-full text-xs font-medium ${
                notification.read
                  ? "bg-muted text-muted-foreground"
                  : "bg-primary/10 text-primary"
              }`}
            >
              {notification.read ? "Read" : "Unread"}
            </div>
          </div>

          {/* Action Buttons */}
          {notification.type === "message" && (
            <div className="flex gap-3">
              <Button
                className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
                onClick={() => {
                  // TODO: Navigate to conversation
                  onOpenChange(false);
                }}
              >
                View Message
              </Button>
            </div>
          )}

          {notification.type === "friend_request" && !notification.read && (
            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1 border-border"
                onClick={() => {
                  // TODO: Handle decline
                  onOpenChange(false);
                }}
              >
                Decline
              </Button>
              <Button
                className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
                onClick={() => {
                  // TODO: Handle accept
                  onOpenChange(false);
                }}
              >
                Accept
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
