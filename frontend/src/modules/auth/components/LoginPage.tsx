import { useState } from "react";
import { motion } from "motion/react";
import { ArrowLeft, Mail, Lock, Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { AnimatedBackground } from "../../../components/AnimatedBackground";
import { useAuthStore } from "../../../store";
import { toast } from "sonner";
import { useAppPost } from "../../../hooks/useAppRequest";
import { apiRoutes } from "../../../helpers/apiRoutes";

export function LoginPage() {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);

  const { mutateAsync: loginUser, isPending } = useAppPost(
    apiRoutes.auth.login,
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isPending) return;

    if (!formData.email || !formData.password) {
      toast.error("Please fill in all fields");
      return;
    }

    const res = await loginUser({
      email: formData.email,
      password: formData.password,
    });

    if (res.user && res.token) {
      toast.success(`Welcome, ${res.user.firstName}! 👋`);
      login(res.user, res.token);
      navigate("/app/chats");
    } else {
      toast.error("Login failed. Please check your credentials and try again.");
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      <AnimatedBackground />

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md"
        >
          {/* Back Button */}
          <Button
            onClick={() => navigate("/")}
            variant="outline"
            className="border-border hover:bg-card hover:text-white px-8 mb-5"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>

          {/* Login Card */}
          <div className="bg-card border border-border rounded-xl p-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl mb-2">Welcome Back</h2>
              <p className="text-muted-foreground">
                Sign in to continue to Rooms
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="pl-10 bg-input border-border"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    className="pl-10 pr-10 bg-input border-border"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                disabled={isPending}
              >
                {isPending ? "Logging in..." : "Log In"}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                Don't have an account?{" "}
                <button
                  onClick={() => navigate("/signup")}
                  className="text-primary hover:underline"
                >
                  Sign up
                </button>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
