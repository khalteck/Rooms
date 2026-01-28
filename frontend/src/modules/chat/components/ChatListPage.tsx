import { useState, useEffect } from "react";
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
import { RoomListSkeleton } from "../../../components/AppSkeleton.tsx";
import { RoomCard } from "./RoomCard";
import { EmptyRoomsState } from "./EmptyRoomsState";
import { CreateRoomModal } from "./CreateRoomModal";
import { useAuthStore } from "../../../store";
import { useAppQuery, useDebouncedValue } from "../../../hooks";
import { Room } from "../../../types";
import { socketService } from "../../../services/socketService";
import { apiRoutes } from "../../../helpers/apiRoutes.ts";

interface GetRoomsResponse {
  rooms: Room[];
}

export function ChatListPage() {
  const navigate = useNavigate();
  const currentUser = useAuthStore((state) => state.user);
  const token = useAuthStore((state) => state.token);
  const [searchQuery, setSearchQuery] = useState("");
  const [showCreateRoomModal, setShowCreateRoomModal] = useState(false);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const debouncedSearch = useDebouncedValue(searchQuery, 500);

  const { refetch } = useAppQuery<GetRoomsResponse>(
    ["getRooms"],
    apiRoutes.rooms.getRooms,
    {},
    {
      enabled: false,
      showError: false,
    },
  );

  // ============================================================
  // Initialize Socket Connection
  // Connect to socket when component mounts and user is authenticated
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

    // Request initial rooms list
    socketService.getRooms();

    // ============================================================
    // Listen for rooms list from server
    // This is triggered after getRooms() request
    // ============================================================
    const handleRoomsList = (data: { rooms: Room[] }) => {
      setRooms(data.rooms);
      setIsLoading(false);
    };

    // ============================================================
    // Listen for real-time room updates
    // Triggered when last message changes, new message arrives, etc.
    // ============================================================
    const handleRoomUpdated = (data: { room: Room }) => {
      setRooms((prevRooms) => {
        const existingRoomIndex = prevRooms.findIndex(
          (r) => r._id === data.room._id,
        );

        if (existingRoomIndex !== -1) {
          // Update existing room
          const updatedRooms = [...prevRooms];
          updatedRooms[existingRoomIndex] = data.room;
          // Sort by last message timestamp (most recent first)
          return updatedRooms.sort((a, b) => {
            const aTime = a.lastMessage?.timestamp
              ? new Date(a.lastMessage.timestamp).getTime()
              : 0;
            const bTime = b.lastMessage?.timestamp
              ? new Date(b.lastMessage.timestamp).getTime()
              : 0;
            return bTime - aTime;
          });
        } else {
          // Add new room to the list
          return [data.room, ...prevRooms];
        }
      });
    };

    // Register event listeners
    socketService.onRoomsList(handleRoomsList);
    socketService.onRoomUpdated(handleRoomUpdated);

    // Cleanup on unmount
    return () => {
      socketService.off("roomsList", handleRoomsList);
      socketService.off("roomUpdated", handleRoomUpdated);
    };
  }, [currentUser, token]);

  // ============================================================
  // Handle Search
  // Re-fetch rooms when search query changes
  // ============================================================
  useEffect(() => {
    if (socketService.isConnected()) {
      setIsLoading(true);
      socketService.getRooms(debouncedSearch);
    }
  }, [debouncedSearch]);

  // ============================================================
  // Refresh rooms list after creating a new room
  // ============================================================
  const handleRoomCreated = async () => {
    socketService.getRooms();
    const roomsData = await refetch();
    setRooms(roomsData?.data?.rooms ?? []);
  };

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
              <AvatarImage
                src={currentUser?.avatar}
                alt={`${currentUser?.firstName} ${currentUser?.lastName}`}
              />
              <AvatarFallback>
                {currentUser?.firstName?.[0]}
                {currentUser?.lastName?.[0]}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-2xl">Rooms</h1>
              <p className="text-sm text-muted-foreground">
                {currentUser.firstName} {currentUser.lastName}
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
        {!isLoading && rooms.length > 0 && (
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
        )}

        {/* Room List or Empty State */}
        {isLoading ? (
          <RoomListSkeleton count={6} />
        ) : rooms.length === 0 && !searchQuery ? (
          <EmptyRoomsState onCreateRoom={() => setShowCreateRoomModal(true)} />
        ) : rooms.length === 0 && searchQuery ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <p className="text-muted-foreground">No rooms match your search</p>
          </motion.div>
        ) : (
          <div className="space-y-3">
            {searchQuery && (
              <p className="text-muted-foreground">Search results</p>
            )}

            {rooms.map((room, index) => (
              <motion.div
                key={room._id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + index * 0.05, duration: 0.5 }}
              >
                <RoomCard
                  room={room}
                  currentUserId={currentUser._id}
                  onClick={() => navigate(`/app/chats/${room._id}`)}
                />
              </motion.div>
            ))}
          </div>
        )}

        {/* New Room Button - Only show when rooms exist */}
        {rooms.length > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6, duration: 0.4 }}
            className="fixed bottom-8 right-8"
          >
            <Button
              size="lg"
              onClick={() => setShowCreateRoomModal(true)}
              className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full w-14 h-14 shadow-lg shadow-primary/20"
            >
              <Plus className="w-6 h-6" />
            </Button>
          </motion.div>
        )}
      </div>

      {/* Create Room Modal */}
      <CreateRoomModal
        open={showCreateRoomModal}
        onOpenChange={setShowCreateRoomModal}
        onRoomCreated={handleRoomCreated}
      />
    </div>
  );
}
