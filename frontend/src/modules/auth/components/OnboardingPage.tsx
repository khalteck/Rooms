import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { MessageSquare, Users, Sparkles, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../../components/ui/button";
import { AnimatedBackground } from "../../../components/AnimatedBackground";
import { useAuthStore } from "../../../store";
import { useAppPatch } from "../../../hooks/useAppRequest";
import { apiRoutes } from "../../../helpers/apiRoutes";
import { toast } from "sonner";

const steps = [
  {
    icon: MessageSquare,
    title: "Welcome to Rooms",
    description:
      "Each conversation lives in its own beautifully designed space. Think of them as private rooms where you connect with others.",
  },
  {
    icon: Users,
    title: "Enter the Room",
    description:
      "Click on any chat to enter the room. Watch as the door opens and you step into your conversation space.",
  },
  {
    icon: Sparkles,
    title: "Experience the Magic",
    description:
      "With a bird's eye view design, you and your contact occupy halves of the room, making every chat feel intimate and special.",
  },
];

export function OnboardingPage() {
  const navigate = useNavigate();
  const updateUser = useAuthStore((state) => state.updateUser);
  const [currentStep, setCurrentStep] = useState(0);

  const { mutateAsync: updateProfile } = useAppPatch(
    apiRoutes.account.updateAccount,
  );

  const completeOnboarding = async () => {
    try {
      const response = await updateProfile({
        onboardingCompleted: true,
      });
      updateUser(response.user);
      navigate("/app/chats");
    } catch (error) {
      toast.error("Failed to complete onboarding");
      // Navigate anyway to not block the user
      navigate("/app/chats");
    }
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      completeOnboarding();
    }
  };

  const handleSkip = () => {
    completeOnboarding();
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      <AnimatedBackground />

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4">
        <div className="w-full max-w-2xl">
          {/* Progress Indicators */}
          <div className="flex justify-center gap-2 mb-12">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`h-1 rounded-full transition-all duration-300 ${
                  index === currentStep
                    ? "w-12 bg-primary"
                    : index < currentStep
                      ? "w-8 bg-primary/50"
                      : "w-8 bg-border"
                }`}
              />
            ))}
          </div>

          {/* Content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.4 }}
              className="text-center"
            >
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, duration: 0.4 }}
                className="bg-card border border-border rounded-2xl p-12 mb-8"
              >
                <div className="flex justify-center mb-8">
                  <div className="w-24 h-24 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
                    {(() => {
                      const Icon = steps[currentStep].icon;
                      return <Icon className="w-12 h-12 text-primary" />;
                    })()}
                  </div>
                </div>

                <h2 className="text-3xl mb-4">{steps[currentStep].title}</h2>
                <p className="text-lg text-muted-foreground max-w-lg mx-auto">
                  {steps[currentStep].description}
                </p>
              </motion.div>

              <div className="flex gap-4 justify-center">
                <Button
                  variant="outline"
                  onClick={handleSkip}
                  className="border-border"
                >
                  Skip
                </Button>
                <Button
                  onClick={handleNext}
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  {currentStep === steps.length - 1 ? "Get Started" : "Next"}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
