export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  avatar?: string;
  status?: "online" | "offline" | "away";
  notificationsEnabled?: boolean;
  soundEnabled?: boolean;
  theme?: "light" | "dark";
  onboardingCompleted?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Message {
  id: string;
  roomId: string;
  senderId: string;
  content: string;
  timestamp: Date;
  read: boolean;
}

export interface Room {
  id: string;
  name: string;
  participants: User[];
  lastMessage?: Message;
  unreadCount: number;
  createdAt: Date;
}

export type Page =
  | "landing"
  | "login"
  | "signup"
  | "onboarding"
  | "chatlist"
  | "conversation"
  | "notifications"
  | "settings";
