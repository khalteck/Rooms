import { useState } from "react";
import { motion } from "motion/react";
import {
  ArrowLeft,
  User,
  Bell,
  Lock,
  Palette,
  HelpCircle,
  LogOut,
  Camera,
  Mail,
  AtSign,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { Switch } from "../../../components/ui/switch";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../../components/ui/avatar";
import { AnimatedBackground } from "../../../components/AnimatedBackground";
import { useAuthStore, useSettingsStore } from "../../../store";
import { toast } from "sonner";

export function SettingsPage() {
  const navigate = useNavigate();
  const currentUser = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const notificationsEnabled = useSettingsStore(
    (state) => state.notificationsEnabled
  );
  const setNotificationsEnabled = useSettingsStore(
    (state) => state.setNotificationsEnabled
  );
  const soundEnabled = useSettingsStore((state) => state.soundEnabled);
  const setSoundEnabled = useSettingsStore((state) => state.setSoundEnabled);

  const [name, setName] = useState(currentUser?.name || "");
  const [username, setUsername] = useState(currentUser?.username || "");
  const [email, setEmail] = useState("alex@example.com");

  if (!currentUser) {
    navigate("/login");
    return null;
  }

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    navigate("/");
  };

  const settingsSections = [
    {
      title: "Profile",
      icon: User,
      items: [
        {
          id: "name",
          label: "Name",
          type: "input",
          value: name,
          onChange: setName,
        },
        {
          id: "username",
          label: "Username",
          type: "input",
          value: username,
          onChange: setUsername,
        },
        {
          id: "email",
          label: "Email",
          type: "input",
          value: email,
          onChange: setEmail,
        },
      ],
    },
    {
      title: "Notifications",
      icon: Bell,
      items: [
        {
          id: "notifications",
          label: "Push Notifications",
          type: "switch",
          value: notificationsEnabled,
          onChange: setNotificationsEnabled,
        },
        {
          id: "sound",
          label: "Sound",
          type: "switch",
          value: soundEnabled,
          onChange: setSoundEnabled,
        },
      ],
    },
    {
      title: "Privacy & Security",
      icon: Lock,
      items: [
        { id: "password", label: "Change Password", type: "button" },
        {
          id: "two-factor",
          label: "Two-Factor Authentication",
          type: "button",
        },
      ],
    },
  ];

  return (
    <div className="relative min-h-screen overflow-hidden">
      <AnimatedBackground />

      <div className="relative z-10 min-h-screen max-w-4xl mx-auto px-4 py-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <Button
            variant="ghost"
            onClick={() => navigate("/app/chats")}
            className="mb-4 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>

          <h1 className="text-3xl mb-2">Settings</h1>
          <p className="text-muted-foreground">
            Manage your account and preferences
          </p>
        </motion.div>

        {/* Profile Picture Section */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.4 }}
          className="bg-card border border-border rounded-xl p-6 mb-6"
        >
          <div className="flex items-center gap-6">
            <div className="relative group">
              <Avatar className="w-24 h-24 border-4 border-primary/20">
                <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
                <AvatarFallback>{currentUser.name[0]}</AvatarFallback>
              </Avatar>
              <button className="absolute inset-0 rounded-full bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Camera className="w-8 h-8 text-white" />
              </button>
            </div>
            <div>
              <h2 className="text-xl mb-1">{currentUser.name}</h2>
              <p className="text-muted-foreground">{currentUser.username}</p>
              <Button
                variant="outline"
                size="sm"
                className="mt-3 border-border"
              >
                Change Photo
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Settings Sections */}
        {settingsSections.map((section, sectionIndex) => (
          <motion.div
            key={section.title}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + sectionIndex * 0.1, duration: 0.4 }}
            className="bg-card border border-border rounded-xl p-6 mb-6"
          >
            <div className="flex items-center gap-3 mb-6">
              <section.icon className="w-5 h-5 text-primary" />
              <h3 className="text-lg">{section.title}</h3>
            </div>

            <div className="space-y-4">
              {section.items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between py-2"
                >
                  <Label
                    htmlFor={item.id}
                    className="text-base font-normal cursor-pointer"
                  >
                    {item.label}
                  </Label>

                  {item.type === "switch" && "onChange" in item && (
                    <Switch
                      id={item.id}
                      checked={item.value as boolean}
                      onCheckedChange={
                        item.onChange as (checked: boolean) => void
                      }
                    />
                  )}

                  {item.type === "input" && "onChange" in item && (
                    <Input
                      id={item.id}
                      value={item.value as string}
                      onChange={(e) =>
                        (item.onChange as (value: string) => void)(
                          e.target.value
                        )
                      }
                      className="max-w-xs bg-background border-border"
                    />
                  )}

                  {item.type === "button" && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-border"
                    >
                      Configure
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        ))}

        {/* Other Options */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.4 }}
          className="bg-card border border-border rounded-xl p-6 mb-6"
        >
          <div className="space-y-4">
            <button className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-background/50 transition-colors text-left">
              <Palette className="w-5 h-5 text-muted-foreground" />
              <span>Appearance</span>
            </button>

            <button className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-background/50 transition-colors text-left">
              <HelpCircle className="w-5 h-5 text-muted-foreground" />
              <span>Help & Support</span>
            </button>
          </div>
        </motion.div>

        {/* Logout Button */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.4 }}
        >
          <Button
            onClick={handleLogout}
            variant="outline"
            className="w-full border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
          >
            <LogOut className="w-5 h-5 mr-2" />
            Sign Out
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
