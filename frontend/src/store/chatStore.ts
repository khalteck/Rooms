import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Room, Message } from "../types";

interface ChatState {
  rooms: Room[];
  messages: Record<string, Message[]>;
  selectedRoomId: string | null;
  setRooms: (rooms: Room[]) => void;
  setMessages: (roomId: string, messages: Message[]) => void;
  addMessage: (roomId: string, message: Message) => void;
  setSelectedRoomId: (roomId: string | null) => void;
  getMessagesForRoom: (roomId: string) => Message[];
}

export const useChatStore = create<ChatState>()(
  persist(
    (set, get) => ({
      rooms: [],
      messages: {},
      selectedRoomId: null,
      setRooms: (rooms) => set({ rooms }),
      setMessages: (roomId, messages) =>
        set((state) => ({
          messages: { ...state.messages, [roomId]: messages },
        })),
      addMessage: (roomId, message) =>
        set((state) => ({
          messages: {
            ...state.messages,
            [roomId]: [...(state.messages[roomId] || []), message],
          },
        })),
      setSelectedRoomId: (roomId) => set({ selectedRoomId: roomId }),
      getMessagesForRoom: (roomId) => get().messages[roomId] || [],
    }),
    {
      name: "chat-storage",
    }
  )
);
