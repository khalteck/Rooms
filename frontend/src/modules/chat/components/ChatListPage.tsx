import { useState } from "react";
import { motion } from "motion/react";
import { Bell, Settings, Search, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../../components/ui/avatar";
import { AnimatedBackground } from "../../../components/AnimatedBackground";
import { RoomCard } from "./RoomCard";
import { rooms } from "../../../mockData";
import { useAuthStore } from "../../../store";

export function ChatListPage() {
  const navigate = useNavigate();
  const currentUser = useAuthStore((state) => state.user);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredRooms = rooms.filter((room) =>
    room.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!currentUser) {
    navigate("/login");
    return null;
  }

  return (
    <div className="relative min-h-screen overflow-hidden">
      <AnimatedBackground />

      <div className="relative z-10 min-h-screen max-w-5xl mx-auto px-4 py-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-center justify-between mb-8"
        >
          <div className="flex items-center gap-4">
            <Avatar className="w-12 h-12 border-2 border-primary/20">
              <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
              <AvatarFallback>{currentUser.name[0]}</AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-2xl">Rooms</h1>
              <p className="text-sm text-muted-foreground">
                {currentUser.username}
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/app/notifications")}
              className="hover:bg-card relative"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/app/settings")}
              className="hover:bg-card"
            >
              <Settings className="w-5 h-5" />
            </Button>
          </div>
        </motion.div>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="mb-8"
        >
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search rooms..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 bg-card border-border h-12 rounded-xl"
            />
          </div>
        </motion.div>

        {/* Room List */}
        <div className="space-y-3">
          {filteredRooms.map((room, index) => (
            <motion.div
              key={room.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + index * 0.05, duration: 0.5 }}
            >
              <RoomCard
                room={room}
                onClick={() => navigate(`/app/chats/${room.id}`)}
              />
            </motion.div>
          ))}
        </div>

        {/* New Room Button */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6, duration: 0.4 }}
          className="fixed bottom-8 right-8"
        >
          <Button
            size="lg"
            className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full w-14 h-14 shadow-lg shadow-primary/20"
          >
            <Plus className="w-6 h-6" />
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
