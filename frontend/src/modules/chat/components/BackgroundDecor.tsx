import { motion } from "motion/react";
import {
  Lamp,
  Sofa,
  ArmchairIcon as Chair,
  Coffee,
  MessageCircle,
  Heart,
  Smile,
  Music,
  Image as ImageIcon,
  Sparkles,
  Star,
} from "lucide-react";

export function BackgroundDecor() {
  return (
    <div className="absolute inset-0 z-[5] overflow-hidden pointer-events-none">
      {/* Top Left */}
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{
          y: { duration: 4, repeat: Infinity, ease: "easeInOut" },
        }}
        className="absolute top-20 left-8 text-border"
      >
        <Lamp className="w-16 h-16" strokeWidth={1} />
      </motion.div>

      <motion.div
        animate={{ rotate: [0, 5, 0] }}
        transition={{
          rotate: {
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
          },
        }}
        className="absolute top-32 right-16 text-border"
      >
        <MessageCircle className="w-12 h-12" strokeWidth={1} />
      </motion.div>

      {/* Top Right */}
      <motion.div
        animate={{ scale: [1, 1.1, 1] }}
        transition={{
          scale: { duration: 6, repeat: Infinity, ease: "easeInOut" },
        }}
        className="absolute top-40 right-32 text-border"
      >
        <Heart className="w-10 h-10" strokeWidth={1} />
      </motion.div>

      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{
          y: { duration: 5, repeat: Infinity, ease: "easeInOut" },
        }}
        className="absolute top-24 right-64 text-border"
      >
        <Coffee className="w-14 h-14" strokeWidth={1} />
      </motion.div>

      {/* Middle Left */}
      <motion.div
        animate={{ rotate: [0, -8, 0] }}
        transition={{
          rotate: {
            duration: 7,
            repeat: Infinity,
            ease: "easeInOut",
          },
        }}
        className="absolute top-1/3 left-20 text-border"
      >
        <Sofa className="w-20 h-20" strokeWidth={1} />
      </motion.div>

      <motion.div
        animate={{ y: [0, -12, 0], x: [0, 5, 0] }}
        transition={{
          y: { duration: 6, repeat: Infinity, ease: "easeInOut" },
          x: { duration: 5, repeat: Infinity, ease: "easeInOut" },
        }}
        className="absolute top-1/2 left-12 text-border"
      >
        <Music className="w-11 h-11" strokeWidth={1} />
      </motion.div>

      {/* Middle Right */}
      <motion.div
        animate={{ scale: [1, 1.05, 1] }}
        transition={{
          scale: {
            duration: 5.5,
            repeat: Infinity,
            ease: "easeInOut",
          },
        }}
        className="absolute top-1/2 right-24 text-border"
      >
        <Chair className="w-16 h-16" strokeWidth={1} />
      </motion.div>

      <motion.div
        animate={{ rotate: [0, 10, 0] }}
        transition={{
          rotate: {
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          },
        }}
        className="absolute top-2/3 right-40 text-border"
      >
        <Sparkles className="w-13 h-13" strokeWidth={1} />
      </motion.div>

      {/* Bottom Left */}
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{
          y: { duration: 5, repeat: Infinity, ease: "easeInOut" },
        }}
        className="absolute bottom-32 left-24 text-border"
      >
        <Smile className="w-12 h-12" strokeWidth={1} />
      </motion.div>

      <motion.div
        animate={{ rotate: [0, -5, 0], scale: [1, 1.08, 1] }}
        transition={{
          rotate: {
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
          },
          scale: {
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
          },
        }}
        className="absolute bottom-48 left-40 text-border"
      >
        <ImageIcon className="w-15 h-15" strokeWidth={1} />
      </motion.div>

      {/* Bottom Right */}
      <motion.div
        animate={{ y: [0, -8, 0], x: [0, -5, 0] }}
        transition={{
          y: { duration: 7, repeat: Infinity, ease: "easeInOut" },
          x: { duration: 6, repeat: Infinity, ease: "easeInOut" },
        }}
        className="absolute bottom-40 right-28 text-border"
      >
        <Star className="w-11 h-11" strokeWidth={1} />
      </motion.div>

      {/* Additional scattered elements */}
      <motion.div
        animate={{ rotate: [0, 15, 0] }}
        transition={{
          rotate: {
            duration: 9,
            repeat: Infinity,
            ease: "easeInOut",
          },
        }}
        className="absolute top-1/4 left-1/3 text-border"
      >
        <MessageCircle className="w-9 h-9" strokeWidth={1} />
      </motion.div>

      <motion.div
        animate={{ scale: [1, 1.12, 1] }}
        transition={{
          scale: {
            duration: 6.5,
            repeat: Infinity,
            ease: "easeInOut",
          },
        }}
        className="absolute top-3/4 right-1/3 text-border"
      >
        <Heart className="w-8 h-8" strokeWidth={1} />
      </motion.div>

      <motion.div
        animate={{ y: [0, 12, 0] }}
        transition={{
          y: { duration: 5.5, repeat: Infinity, ease: "easeInOut" },
        }}
        className="absolute bottom-1/4 left-1/2 text-border"
      >
        <Coffee className="w-10 h-10" strokeWidth={1} />
      </motion.div>
    </div>
  );
}
