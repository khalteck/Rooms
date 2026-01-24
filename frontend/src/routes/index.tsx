import { createBrowserRouter, Navigate } from "react-router-dom";
import {
  LandingPage,
  LoginPage,
  SignupPage,
  OnboardingPage,
} from "../modules/auth/pages";
import { ChatListPage, ConversationPage } from "../modules/chat/pages";
import { NotificationsPage } from "../modules/notifications/pages";
import { SettingsPage } from "../modules/settings/pages";
import { ProtectedRoute } from "./ProtectedRoute";
import { AuthLayout } from "./AuthLayout";
import { AppLayout } from "./AppLayout";
import { OnboardingGate } from "./OnboardingGate";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AuthLayout />,
    children: [
      {
        index: true,
        element: <LandingPage />,
      },
      {
        path: "login",
        element: <LoginPage />,
      },
      {
        path: "signup",
        element: <SignupPage />,
      },
    ],
  },
  {
    path: "/app",
    element: (
      <ProtectedRoute>
        <AppLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <OnboardingGate />,
      },
      {
        path: "onboarding",
        element: <OnboardingPage />,
      },
      {
        path: "chats",
        element: <ChatListPage />,
      },
      {
        path: "chats/:roomId",
        element: <ConversationPage />,
      },
      {
        path: "notifications",
        element: <NotificationsPage />,
      },
      {
        path: "settings",
        element: <SettingsPage />,
      },
    ],
  },
  {
    path: "*",
    element: <Navigate to="/" replace />,
  },
]);
