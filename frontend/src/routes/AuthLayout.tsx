import { Outlet, Navigate } from "react-router-dom";
import { useAuthStore } from "../store";

export function AuthLayout() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  // If user is authenticated, redirect to app
  if (isAuthenticated) {
    return <Navigate to="/app" replace />;
  }

  return <Outlet />;
}
