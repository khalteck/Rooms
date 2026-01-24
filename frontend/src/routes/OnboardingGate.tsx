import { Navigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../store";

export function OnboardingGate() {
  const user = useAuthStore((state) => state.user);
  const location = useLocation();

  // If user hasn't completed onboarding and trying to access other pages
  if (
    user &&
    !user.onboardingCompleted &&
    location.pathname !== "/app/onboarding"
  ) {
    return <Navigate to="/app/onboarding" replace />;
  }

  // If user has completed onboarding and on onboarding page, redirect to chats
  if (
    user &&
    user.onboardingCompleted &&
    location.pathname === "/app/onboarding"
  ) {
    return <Navigate to="/app/chats" replace />;
  }

  // Otherwise, redirect to chats (for index route)
  return <Navigate to="/app/chats" replace />;
}
