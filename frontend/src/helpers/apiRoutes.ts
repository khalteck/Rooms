export const apiRoutes = {
  auth: {
    login: "/auth/login",
    signup: "/auth/register",
    forgotPassword: "/auth/forgot-password",
    resetPassword: "/auth/reset-password",
  },
  account: {
    getAccount: "/auth/me",
    updateAccount: "/auth/me",
    changePassword: "/auth/me/change-password",
  },
  rooms: {
    getRooms: "/rooms",
    getRoomById: (roomId: string) => `/rooms/${roomId}`,
    createRoom: "/rooms",
    leaveRoom: (roomId: string) => `/rooms/${roomId}/leave`,
  },
  messages: {
    getMessages: (roomId: string) => `/rooms/${roomId}/messages`,
    sendMessage: (roomId: string) => `/rooms/${roomId}/messages`,
    markAsRead: (roomId: string) => `/rooms/${roomId}/messages/mark-as-read`,
  },
};
