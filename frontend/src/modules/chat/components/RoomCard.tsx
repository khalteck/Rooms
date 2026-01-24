import { motion } from "motion/react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../../components/ui/avatar";
import { Room } from "../../../types";

interface RoomCardProps {
  room: Room;
  currentUserId: string;
  onClick: () => void;
}

function formatTimeAgo(date: Date): string {
  const now = new Date();
  const diffInSeconds = Math.floor(
    (now.getTime() - new Date(date).getTime()) / 1000,
  );

  if (diffInSeconds < 60) return "just now";
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 604800)
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  return `${Math.floor(diffInSeconds / 604800)}w ago`;
}

export function RoomCard({ room, currentUserId, onClick }: RoomCardProps) {
  const otherUser = room.participants.find((p) => p._id !== currentUserId);

  if (!otherUser) return null;

  return (
    <motion.button
      onClick={onClick}
      className="w-full group relative"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2 }}
    >
      {/* Door Frame */}
      <div className="relative bg-card border border-border rounded-xl p-4 overflow-hidden transition-all duration-300 group-hover:border-primary/50 group-hover:shadow-lg group-hover:shadow-primary/5">
        {/* Door Panel Effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Doorknob */}
        <motion.div
          className="absolute right-6 top-1/2 -translate-y-1/2"
          whileHover={{ scale: 1.1 }}
          transition={{ duration: 0.2 }}
        >
          {/* Doorknob base plate */}
          <div className="relative">
            {/* Backplate */}
            <div className="absolute -left-3 -top-4 w-8 h-10 rounded-lg bg-gradient-to-br from-primary/20 to-primary/10 border border-primary/30" />

            {/* Doorknob sphere */}
            <div className="relative w-5 h-5 rounded-full bg-gradient-to-br from-primary/60 to-primary/30 border-2 border-primary/80 shadow-lg">
              {/* Highlight on knob */}
              <div className="absolute top-0.5 left-1 w-2 h-2 rounded-full bg-primary/40 blur-[1px]" />
              {/* Shadow effect */}
              <div className="absolute -inset-1 rounded-full bg-primary/10 blur-sm -z-10" />
            </div>

            {/* Glow effect on hover */}
            <motion.div
              className="absolute inset-0 rounded-full bg-primary/30"
              animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0, 0.3] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
            />
          </div>
        </motion.div>

        <div className="flex items-center gap-4 pr-8">
          {/* Avatar with status indicator */}
          <div className="relative">
            <Avatar className="w-14 h-14 border-2 border-border group-hover:border-primary/30 transition-colors">
              <AvatarImage
                src={otherUser.avatar}
                alt={`${otherUser.firstName} ${otherUser.lastName}`}
              />
              <AvatarFallback>
                {otherUser.firstName[0]}
                {otherUser.lastName[0]}
              </AvatarFallback>
            </Avatar>
            <div
              className={`absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 border-card ${
                otherUser.status === "online"
                  ? "bg-green-500"
                  : otherUser.status === "away"
                    ? "bg-yellow-500"
                    : "bg-gray-500"
              }`}
            />
          </div>

          {/* Room Info */}
          <div className="flex-1 text-left min-w-0">
            <div className="flex items-center justify-between mb-1">
              <h3 className="truncate pr-2 group-hover:text-primary transition-colors">
                {room.name}
              </h3>
              {room.lastMessage && (
                <span className="text-xs text-muted-foreground whitespace-nowrap">
                  {formatTimeAgo(room.lastMessage.timestamp)}
                </span>
              )}
            </div>

            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground truncate pr-2">
                {room.lastMessage?.content || "No messages yet"}
              </p>
              {room.unreadCount > 0 && (
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">
                  {room.unreadCount}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Door hinge decoration */}
        <div className="absolute left-0 top-4 w-1 h-8 bg-border rounded-r-sm opacity-50" />
        <div className="absolute left-0 bottom-4 w-1 h-8 bg-border rounded-r-sm opacity-50" />
      </div>
    </motion.button>
  );
}
