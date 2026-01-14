export interface User {
  id: string;
  name: string;
  username: string;
  avatar: string;
  status: 'online' | 'offline' | 'away';
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

export type Page = 'landing' | 'login' | 'signup' | 'onboarding' | 'chatlist' | 'conversation' | 'notifications' | 'settings';
