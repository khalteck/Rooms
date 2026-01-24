import { useState, useEffect } from "react";
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
  Sun,
  Moon,
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
import { AppModal } from "../../../components/AppModal";
import { ChangePasswordModal } from "./ChangePasswordModal";
import { AnimatedBackground } from "../../../components/AnimatedBackground";
import { useAuthStore } from "../../../store";
import { toast } from "sonner";
import { useAppPatch } from "../../../hooks/useAppRequest";
import { apiRoutes } from "../../../helpers/apiRoutes";

export function SettingsPage() {
  const navigate = useNavigate();
  const currentUser = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const updateUser = useAuthStore((state) => state.updateUser);

  const [formData, setFormData] = useState({
    firstName: currentUser?.firstName || "",
    lastName: currentUser?.lastName || "",
    username: currentUser?.username || "",
    email: currentUser?.email || "",
  });
  const [hasChanges, setHasChanges] = useState(false);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);

  const { mutateAsync: updateProfile, isPending } = useAppPatch(
    apiRoutes.account.updateAccount,
  );

  // Check if form data has changed
  useEffect(() => {
    if (!currentUser) return;
    const changed =
      formData.firstName !== currentUser.firstName ||
      formData.lastName !== currentUser.lastName ||
      formData.username !== currentUser.username;
    setHasChanges(changed);
  }, [formData, currentUser]);

  if (!currentUser) {
    navigate("/login");
    return null;
  }

  const handleSaveProfile = async () => {
    if (!hasChanges || isPending) return;

    try {
      const response = await updateProfile({
        firstName: formData.firstName,
        lastName: formData.lastName,
        username: formData.username,
      });

      updateUser(response.user);
      toast.success("Profile updated successfully");
      setHasChanges(false);
    } catch (error) {
      // Error is handled by the request interceptor
    }
  };

  const handleNotificationToggle = async (enabled: boolean) => {
    try {
      const response = await updateProfile({
        notificationsEnabled: enabled,
      });
      updateUser(response.user);
      toast.success(`Notifications ${enabled ? "enabled" : "disabled"}`);
    } catch (error) {
      // Error is handled by the request interceptor
    }
  };

  const handleSoundToggle = async (enabled: boolean) => {
    try {
      const response = await updateProfile({
        soundEnabled: enabled,
      });
      updateUser(response.user);
      toast.success(`Sound ${enabled ? "enabled" : "disabled"}`);
    } catch (error) {
      // Error is handled by the request interceptor
    }
  };

  const handleThemeToggle = async (theme: "light" | "dark") => {
    try {
      const response = await updateProfile({
        theme: theme,
      });
      updateUser(response.user);
      toast.success(`Theme changed to ${theme}`);
    } catch (error) {
      // Error is handled by the request interceptor
    }
  };

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
          id: "firstName",
          label: "First Name",
          type: "input",
          value: formData.firstName,
          onChange: (value: string) =>
            setFormData({ ...formData, firstName: value }),
        },
        {
          id: "lastName",
          label: "Last Name",
          type: "input",
          value: formData.lastName,
          onChange: (value: string) =>
            setFormData({ ...formData, lastName: value }),
        },
        {
          id: "username",
          label: "Username",
          type: "input",
          value: formData.username,
          onChange: (value: string) =>
            setFormData({ ...formData, username: value }),
        },
        {
          id: "email",
          label: "Email",
          type: "input",
          value: formData.email,
          disabled: true,
          onChange: (value: string) =>
            setFormData({ ...formData, email: value }),
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
          value: currentUser?.notificationsEnabled ?? true,
          onChange: handleNotificationToggle,
        },
        {
          id: "sound",
          label: "Sound",
          type: "switch",
          value: currentUser?.soundEnabled ?? true,
          onChange: handleSoundToggle,
        },
      ],
    },
    {
      title: "Privacy & Security",
      icon: Lock,
      items: [
        {
          id: "password",
          label: "Change Password",
          type: "button",
          onClick: () => setShowChangePasswordModal(true),
        },
        {
          id: "two-factor",
          label: "Two-Factor Authentication",
          type: "button",
          disabled: true,
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
                <AvatarImage
                  src={currentUser.avatar}
                  alt={`${currentUser.firstName} ${currentUser.lastName}`}
                />
                <AvatarFallback>
                  {currentUser.firstName?.[0]}
                  {currentUser.lastName?.[0]}
                </AvatarFallback>
              </Avatar>
              <button className="absolute inset-0 rounded-full bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Camera className="w-8 h-8 text-white" />
              </button>
            </div>
            <div>
              <h2 className="text-xl mb-1">
                {currentUser.firstName} {currentUser.lastName}
              </h2>
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
                  className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 py-2"
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
                      className="border border-border/50"
                    />
                  )}

                  {item.type === "input" && "onChange" in item && (
                    <Input
                      id={item.id}
                      value={item.value as string}
                      onChange={(e) =>
                        (item.onChange as (value: string) => void)(
                          e.target.value,
                        )
                      }
                      disabled={"disabled" in item && item.disabled}
                      className="w-full sm:max-w-xs bg-background border-border disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                  )}

                  {item.type === "button" && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-border w-fit self-start sm:self-auto"
                      onClick={
                        "onClick" in item
                          ? (item.onClick as () => void)
                          : undefined
                      }
                      disabled={"disabled" in item && item.disabled}
                    >
                      Configure
                    </Button>
                  )}
                </div>
              ))}
            </div>

            {/* Save Button for Profile Section */}
            {section.title === "Profile" && hasChanges && (
              <div className="mt-6 pt-4 border-t border-border w-full flex justify-end">
                <Button
                  onClick={handleSaveProfile}
                  disabled={isPending}
                  className="w-fit bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  {isPending ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            )}
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
            <div className="flex items-center justify-between p-3 rounded-lg hover:bg-background/50 transition-colors">
              <div className="flex items-center gap-3">
                <Palette className="w-5 h-5 text-muted-foreground" />
                <span>Appearance</span>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant={
                    currentUser?.theme === "light" ? "default" : "outline"
                  }
                  size="sm"
                  onClick={() => handleThemeToggle("light")}
                  className="gap-2"
                >
                  <Sun className="w-4 h-4" />
                  Light
                </Button>
                <Button
                  variant={
                    currentUser?.theme === "dark" ? "default" : "outline"
                  }
                  size="sm"
                  onClick={() => handleThemeToggle("dark")}
                  className="gap-2"
                >
                  <Moon className="w-4 h-4" />
                  Dark
                </Button>
              </div>
            </div>

            <a
              href="mailto:khalidoyeneye@gmail.com"
              className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-background/50 transition-colors text-left"
            >
              <HelpCircle className="w-5 h-5 text-muted-foreground" />
              <span>Help & Support</span>
            </a>
          </div>
        </motion.div>

        {/* Logout Button */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.4 }}
        >
          <Button
            onClick={() => setShowLogoutDialog(true)}
            variant="outline"
            className="w-full border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
          >
            <LogOut className="w-5 h-5 mr-2" />
            Sign Out
          </Button>
        </motion.div>
      </div>

      {/* Logout Confirmation Dialog */}
      <AppModal
        open={showLogoutDialog}
        onOpenChange={setShowLogoutDialog}
        title="Are you sure you want to sign out?"
        description="You will need to sign in again to access your account."
        confirmText="Sign Out"
        onConfirm={handleLogout}
        variant="destructive"
      />

      {/* Change Password Modal */}
      <ChangePasswordModal
        open={showChangePasswordModal}
        onOpenChange={setShowChangePasswordModal}
      />
    </div>
  );
}
