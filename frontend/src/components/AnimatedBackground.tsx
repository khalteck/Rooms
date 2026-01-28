import { motion } from "motion/react";

export function AnimatedBackground() {
  const shapes = [
    { id: 1, size: 40, x: "10%", y: "20%", delay: 0 },
    { id: 2, size: 60, x: "80%", y: "30%", delay: 0.5 },
    { id: 3, size: 30, x: "15%", y: "70%", delay: 1 },
    { id: 4, size: 50, x: "85%", y: "65%", delay: 1.5 },
    { id: 5, size: 35, x: "50%", y: "15%", delay: 2 },
    { id: 6, size: 45, x: "30%", y: "85%", delay: 2.5 },
  ];

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {shapes.map((shape) => (
        <motion.div
          key={shape.id}
          className="absolute rounded-full"
          style={{
            width: shape.size,
            height: shape.size,
            left: shape.x,
            top: shape.y,
            background: `radial-gradient(circle, rgba(176, 161, 253, 0.15), rgba(176, 161, 253, 0.02))`,
          }}
          animate={{
            y: [0, -20, 0],
            opacity: [0.3, 0.6, 0.3],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            delay: shape.delay,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Subtle grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(176, 161, 253, 0.3) 1px, transparent 1px),
            linear-gradient(90deg, rgba(176, 161, 253, 0.3) 1px, transparent 1px)
          `,
          backgroundSize: "50px 50px",
        }}
      />
    </div>
  );
}
