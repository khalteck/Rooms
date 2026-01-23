import { motion } from "motion/react";
import { MessageSquare, Zap, Shield, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../../components/ui/button";
import { AnimatedBackground } from "../../../components/AnimatedBackground";

export function LandingPage() {
  const navigate = useNavigate();
  const features = [
    {
      icon: MessageSquare,
      title: "Immersive Rooms",
      description: "Step into beautifully designed conversation spaces",
    },
    {
      icon: Zap,
      title: "Instant Messaging",
      description: "Real-time communication that feels natural",
    },
    {
      icon: Shield,
      title: "Private & Secure",
      description: "Your conversations stay between you and your contacts",
    },
    {
      icon: Users,
      title: "Connect Freely",
      description: "Build meaningful connections in your own rooms",
    },
  ];

  return (
    <div className="relative min-h-screen overflow-hidden">
      <AnimatedBackground />

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen pt-[100px] pb-14 px-4">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-4xl mx-auto mb-12"
        >
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
            className="mb-6"
          >
            <h1 className="text-6xl mb-4 tracking-tight">
              Welcome to <span className="text-primary">Rooms</span>
            </h1>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto"
          >
            Experience messaging reimagined. Each conversation is a unique space
            where connections come alive.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="flex gap-4 justify-center flex-wrap"
          >
            <Button
              onClick={() => navigate("/signup")}
              size="lg"
              className="bg-primary text-primary-foreground hover:bg-primary/90 px-8"
            >
              Get Started
            </Button>
            <Button
              onClick={() => navigate("/login")}
              size="lg"
              variant="outline"
              className="border-border hover:bg-card hover:text-white px-8"
            >
              Sign In
            </Button>
          </motion.div>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto"
        >
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 + index * 0.1, duration: 0.5 }}
              className="bg-card border border-border rounded-lg p-6 hover:border-primary/50 transition-colors"
            >
              <feature.icon className="w-10 h-10 text-primary mb-4" />
              <h3 className="mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>

      <div className="text-xs text-muted-foreground pb-5 text-center">
        © {new Date().getFullYear()} Khalteck
      </div>
    </div>
  );
}
