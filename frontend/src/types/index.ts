export interface User {
  _id: string;
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
  _id: string;
  id: string;
  roomId: string;
  senderId: string;
  content: string;
  timestamp: Date;
  read: boolean;
  type?: "system" | "user";
}

export interface LastMessage {
  id: string;
  content: string;
  timestamp: Date;
}

export interface Room {
  _id: string;
  name: string;
  participants: User[];
  lastMessage?: LastMessage;
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
