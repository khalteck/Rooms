import { motion } from "motion/react";
import { MessageSquarePlus, Users } from "lucide-react";
import { Button } from "../../../components/ui/button";

interface EmptyRoomsStateProps {
  onCreateRoom: () => void;
}

export function EmptyRoomsState({ onCreateRoom }: EmptyRoomsStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="flex flex-col items-center justify-center py-20 px-4"
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="relative mb-8"
      >
        {/* Decorative background circles */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-32 h-32 rounded-full bg-primary/10 animate-pulse" />
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-24 h-24 rounded-full bg-primary/20" />
        </div>

        {/* Main icon */}
        <div className="relative z-10 bg-card border-2 border-primary/30 rounded-full p-8">
          <Users className="w-16 h-16 text-primary" />
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="text-center space-y-3 mb-8"
      >
        <h2 className="text-2xl font-semibold">No Rooms Yet</h2>
        <p className="text-muted-foreground max-w-md">
          Start a conversation by creating your first room. Connect with friends
          and colleagues instantly.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.6, duration: 0.4 }}
      >
        <Button
          onClick={onCreateRoom}
          size="lg"
          className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2 shadow-lg shadow-primary/20"
        >
          <MessageSquarePlus className="w-5 h-5" />
          Create Your First Room
        </Button>
      </motion.div>
    </motion.div>
  );
}
