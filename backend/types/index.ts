import { Document } from "mongoose";
import { Request } from "express";

export interface IUser extends Document {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password: string;
  avatar?: string;
  status: "online" | "offline" | "away";
  notificationsEnabled: boolean;
  soundEnabled: boolean;
  theme: "light" | "dark";
  onboardingCompleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthRequest extends Request {
  user?: {
    _id: string;
  };
}

export interface JWTPayload {
  id: string | object;
  email: string;
}

export interface IParticipant {
  _id: string;
  firstName: string;
  lastName: string;
  username: string;
  avatar?: string;
}

export interface ILastMessage {
  id: string;
  content: string;
  timestamp: Date;
}

export interface IRoom extends Document {
  id: string;
  name: string;
  participants: IParticipant[];
  lastMessage?: ILastMessage;
  unreadCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface IMessage extends Document {
  id: string;
  roomId: string;
  senderId: string;
  content: string;
  timestamp: Date;
  read: boolean;
  type?: "system" | "user";
}
