import { motion } from "motion/react";
import { BellOff } from "lucide-react";

export function EmptyNotificationsState() {
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
          <div className="w-32 h-32 rounded-full bg-muted/30 animate-pulse" />
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-24 h-24 rounded-full bg-muted/50" />
        </div>

        {/* Main icon */}
        <div className="relative z-10 bg-card border-2 border-muted rounded-full p-8">
          <BellOff className="w-16 h-16 text-muted-foreground" />
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="text-center space-y-3"
      >
        <h2 className="text-2xl font-semibold">No Notifications</h2>
        <p className="text-muted-foreground max-w-md">
          You're all caught up! When you receive new messages or updates,
          they'll appear here.
        </p>
      </motion.div>
    </motion.div>
  );
}
