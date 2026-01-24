import { motion } from "motion/react";
import { cn } from "./ui/utils";

interface AppSkeletonProps {
  className?: string;
  variant?: "rect" | "circle" | "text" | "rounded";
  width?: string | number;
  height?: string | number;
  animate?: boolean;
}

export function AppSkeleton({
  className,
  variant = "rect",
  width,
  height,
  animate = true,
}: AppSkeletonProps) {
  const baseClasses = "bg-gradient-to-r from-muted via-muted/50 to-muted";

  const variantClasses = {
    rect: "rounded-none",
    circle: "rounded-full",
    text: "rounded-sm h-4",
    rounded: "rounded-xl",
  };

  const style = {
    width: width,
    height: height,
  };

  const animationProps = animate
    ? {
        animate: {
          opacity: [0.5, 1, 0.5],
        },
        transition: {
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut" as const,
        },
      }
    : {};

  return (
    <motion.div
      className={cn(baseClasses, variantClasses[variant], className)}
      style={style}
      {...animationProps}
    />
  );
}

interface RoomCardSkeletonProps {
  className?: string;
}

export function RoomCardSkeleton({ className }: RoomCardSkeletonProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className={cn(
        "w-full bg-card border border-border rounded-xl p-4",
        className,
      )}
    >
      <div className="flex items-center gap-4">
        {/* Avatar skeleton */}
        <AppSkeleton variant="circle" width={56} height={56} />

        {/* Content skeleton */}
        <div className="flex-1 space-y-3">
          {/* Name skeleton */}
          <AppSkeleton variant="rounded" height={20} className="w-2/5" />

          {/* Message skeleton */}
          <AppSkeleton variant="rounded" height={16} className="w-3/4" />
        </div>

        {/* Timestamp skeleton */}
        <AppSkeleton variant="rounded" height={14} width={60} />
      </div>
    </motion.div>
  );
}

interface RoomListSkeletonProps {
  count?: number;
}

export function RoomListSkeleton({ count = 5 }: RoomListSkeletonProps) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, index) => (
        <RoomCardSkeleton
          key={index}
          className={cn(
            "animate-in fade-in-0 slide-in-from-left-5",
            `delay-${index * 100}`,
          )}
        />
      ))}
    </div>
  );
}
