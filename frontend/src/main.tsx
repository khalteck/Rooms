import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "./components/ui/sonner";
import App from "./App.tsx";
import "./styles/globals.css";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
      <Toaster
        position="top-center"
        richColors
        toastOptions={{
          style: {
            background: "hsl(var(--card))",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            color: "hsl(var(--card-foreground))",
            boxShadow:
              "0 4px 12px rgba(0, 0, 0, 0.1), 0 0 0 1px hsl(var(--border) / 0.1)",
            borderRadius: "0.75rem",
          },
          className: "font-sans",
        }}
      />
    </QueryClientProvider>
  </StrictMode>,
);
