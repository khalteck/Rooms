import { User, Room, Message } from "./types";

export const currentUser: User = {
  id: "user-1",
  firstName: "Alex",
  lastName: "Morgan",
  email: "alex.morgan@example.com",
  username: "alexmorgan",
  avatar:
    "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop",
  status: "online",
  notificationsEnabled: true,
  soundEnabled: true,
  theme: "light",
  createdAt: new Date("2024-01-15"),
  updatedAt: new Date("2026-01-20"),
};

export const users: User[] = [
  {
    id: "user-2",
    firstName: "Sarah",
    lastName: "Chen",
    email: "sarah.chen@example.com",
    username: "sarahchen",
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
    status: "online",
    createdAt: new Date("2024-02-10"),
    updatedAt: new Date("2026-01-23"),
  },
  {
    id: "user-3",
    firstName: "Marcus",
    lastName: "Rivera",
    email: "marcus.rivera@example.com",
    username: "marcusrivera",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop",
    status: "offline",
    createdAt: new Date("2024-03-05"),
    updatedAt: new Date("2026-01-22"),
  },
  {
    id: "user-4",
    firstName: "Emily",
    lastName: "Park",
    email: "emily.park@example.com",
    username: "emilypark",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
    status: "online",
    createdAt: new Date("2024-04-12"),
    updatedAt: new Date("2026-01-24"),
  },
  {
    id: "user-5",
    firstName: "David",
    lastName: "Kim",
    email: "david.kim@example.com",
    username: "davidkim",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
    status: "away",
    createdAt: new Date("2024-05-20"),
    updatedAt: new Date("2026-01-21"),
  },
  {
    id: "user-6",
    firstName: "Lisa",
    lastName: "Anderson",
    email: "lisa.anderson@example.com",
    username: "lisaanderson",
    avatar:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop",
    status: "online",
    createdAt: new Date("2024-06-18"),
    updatedAt: new Date("2026-01-24"),
  },
];

export const messages: Message[] = [
  {
    id: "msg-1",
    roomId: "room-1",
    senderId: "user-2",
    content: "Hey! Did you see the latest updates?",
    timestamp: new Date(Date.now() - 1000 * 60 * 5),
    read: true,
  },
  {
    id: "msg-2",
    roomId: "room-1",
    senderId: "user-1",
    content: "Yes! They look amazing. I love the new design.",
    timestamp: new Date(Date.now() - 1000 * 60 * 4),
    read: true,
  },
  {
    id: "msg-3",
    roomId: "room-1",
    senderId: "user-2",
    content: "Should we schedule a call to discuss the implementation?",
    timestamp: new Date(Date.now() - 1000 * 60 * 2),
    read: false,
  },
  {
    id: "msg-4",
    roomId: "room-2",
    senderId: "user-3",
    content: "Thanks for the help earlier!",
    timestamp: new Date(Date.now() - 1000 * 60 * 30),
    read: true,
  },
  {
    id: "msg-5",
    roomId: "room-3",
    senderId: "user-4",
    content: "Are we still on for tomorrow?",
    timestamp: new Date(Date.now() - 1000 * 60 * 60),
    read: false,
  },
  {
    id: "msg-6",
    roomId: "room-4",
    senderId: "user-1",
    content: "I sent you the files",
    timestamp: new Date(Date.now() - 1000 * 60 * 120),
    read: true,
  },
  {
    id: "msg-7",
    roomId: "room-5",
    senderId: "user-6",
    content: "Perfect! See you there 🎉",
    timestamp: new Date(Date.now() - 1000 * 60 * 180),
    read: true,
  },
];

export const rooms: Room[] = [
  {
    id: "room-1",
    name: `${users[0].firstName} ${users[0].lastName}`,
    participants: [currentUser, users[0]],
    lastMessage: messages[2],
    unreadCount: 1,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7),
  },
  {
    id: "room-2",
    name: `${users[1].firstName} ${users[1].lastName}`,
    participants: [currentUser, users[1]],
    lastMessage: messages[3],
    unreadCount: 0,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5),
  },
  {
    id: "room-3",
    name: `${users[2].firstName} ${users[2].lastName}`,
    participants: [currentUser, users[2]],
    lastMessage: messages[4],
    unreadCount: 1,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3),
  },
  {
    id: "room-4",
    name: `${users[3].firstName} ${users[3].lastName}`,
    participants: [currentUser, users[3]],
    lastMessage: messages[5],
    unreadCount: 0,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
  },
  {
    id: "room-5",
    name: `${users[4].firstName} ${users[4].lastName}`,
    participants: [currentUser, users[4]],
    lastMessage: messages[6],
    unreadCount: 0,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
  },
];
