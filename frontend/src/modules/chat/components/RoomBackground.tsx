import { motion } from "motion/react";
import { User } from "../../../types";

interface RoomBackgroundProps {
  currentUser: User;
  otherUser: User;
}

export function RoomBackground({
  currentUser,
  otherUser,
}: RoomBackgroundProps) {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {/* Room container with bird's eye view */}
      <div className="absolute inset-0 flex">
        {/* Left half - Other user's side */}
        <div className="w-1/2 relative border-r border-border/30">
          {/* Room corner decorations */}
          <div className="absolute top-0 left-0 w-20 h-20 border-l-2 border-t-2 border-border/20 rounded-tl-3xl" />
          <div className="absolute bottom-0 left-0 w-20 h-20 border-l-2 border-b-2 border-border/20 rounded-bl-3xl" />

          {/* Ambient glow */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent"
            animate={{
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />

          {/* User avatar representation */}
          <motion.div
            className="absolute bottom-10 left-3 md:left-1/2 md:-translate-x-1/2"
            animate={{
              y: [0, -10, 0],
              scale: [1, 1.05, 1],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1.5,
            }}
          >
            <div className="relative">
              <div className="w-24 h-24 rounded-full border-4 border-primary/30 overflow-hidden bg-card">
                <img
                  src={otherUser.avatar}
                  alt={otherUser.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <motion.div
                className="absolute -inset-4 rounded-full border border-primary/20"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.5, 0, 0.5],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeOut",
                  delay: 1,
                }}
              />
            </div>
          </motion.div>

          {/* Floating particles */}
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={`left-${i}`}
              className="absolute w-2 h-2 rounded-full bg-primary/20"
              style={{
                left: `${20 + i * 15}%`,
                top: `${30 + i * 10}%`,
              }}
              animate={{
                y: [0, -30, 0],
                opacity: [0.2, 0.6, 0.2],
              }}
              transition={{
                duration: 6 + i * 0.5,
                repeat: Infinity,
                delay: i * 0.3 + 1,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>

        {/* Right half - Current user's side */}
        <div className="w-1/2 relative">
          {/* Room corner decorations */}
          <div className="absolute top-0 right-0 w-20 h-20 border-r-2 border-t-2 border-border/20 rounded-tr-3xl" />
          <div className="absolute bottom-0 right-0 w-20 h-20 border-r-2 border-b-2 border-border/20 rounded-br-3xl" />

          {/* Ambient glow */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-bl from-primary/5 to-transparent"
            animate={{
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2,
            }}
          />

          {/* User avatar representation */}
          <motion.div
            className="absolute bottom-10 left-1/2 -translate-x-1/2"
            animate={{
              y: [0, -10, 0],
              scale: [1, 1.05, 1],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <div className="relative">
              <div className="w-24 h-24 rounded-full border-4 border-primary/30 overflow-hidden bg-card">
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <motion.div
                className="absolute -inset-4 rounded-full border border-primary/20"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.5, 0, 0.5],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeOut",
                }}
              />
            </div>
          </motion.div>

          {/* Floating particles */}
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={`right-${i}`}
              className="absolute w-2 h-2 rounded-full bg-primary/20"
              style={{
                right: `${20 + i * 15}%`,
                top: `${30 + i * 10}%`,
              }}
              animate={{
                y: [0, -30, 0],
                opacity: [0.2, 0.6, 0.2],
              }}
              transition={{
                duration: 6 + i * 0.5,
                repeat: Infinity,
                delay: i * 0.3,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>
      </div>

      {/* Top room decorations - plan view elements */}
      <div className="absolute top-0 left-0 right-0 h-32 pointer-events-none">
        {/* Door frame at top (where they entered) */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 w-32 h-3 bg-border/30 rounded-sm">
          <div className="absolute left-2 top-0 w-1 h-full bg-border/50" />
          <div className="absolute right-2 top-0 w-1 h-full bg-border/50" />
        </div>

        {/* Wall decorations - subtle room elements from above */}
        <motion.div
          className="absolute top-8 left-12 w-16 h-1 bg-border/20 rounded-full"
          animate={{ opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 5, repeat: Infinity }}
        />
        <motion.div
          className="absolute top-8 right-12 w-16 h-1 bg-border/20 rounded-full"
          animate={{ opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 5, repeat: Infinity, delay: 2.5 }}
        />

        {/* Corner furniture shadows (plan view) */}
        <div className="absolute top-12 left-8 w-12 h-12 rounded-lg bg-card/30 border border-border/10" />
        <div className="absolute top-12 right-8 w-12 h-12 rounded-lg bg-card/30 border border-border/10" />
      </div>

      {/* Center line - connection between users */}
      <motion.div
        className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-primary/30 to-transparent"
        animate={{
          opacity: [0.3, 0.7, 0.3],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Energy flow effect */}
      <motion.div
        className="absolute left-1/2 -translate-x-1/2 w-1 h-8 rounded-full bg-primary/50"
        animate={{
          top: ["20%", "80%"],
          opacity: [0, 1, 0],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "linear",
        }}
      />
    </div>
  );
}
