import { create } from "zustand";
import { persist } from "zustand/middleware";

interface SettingsState {
  notificationsEnabled: boolean;
  soundEnabled: boolean;
  theme: "light" | "dark" | "system";
  setNotificationsEnabled: (enabled: boolean) => void;
  setSoundEnabled: (enabled: boolean) => void;
  setTheme: (theme: "light" | "dark" | "system") => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      notificationsEnabled: true,
      soundEnabled: true,
      theme: "system",
      setNotificationsEnabled: (enabled) =>
        set({ notificationsEnabled: enabled }),
      setSoundEnabled: (enabled) => set({ soundEnabled: enabled }),
      setTheme: (theme) => set({ theme }),
    }),
    {
      name: "settings-storage",
    }
  )
);
