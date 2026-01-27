import express, { Request, Response } from "express";
import morgan from "morgan";
import mongoose from "mongoose";
import cors from "cors";
import authRoutes from "./routes/authRoutes";
import { errorHandler, notFound } from "./middleware/errorHandler";
import dotenv from "dotenv";
import roomsRoutes from "./routes/roomsRoutes";
import messageRoutes from "./routes/messageRoutes";
import notificationRoutes from "./routes/notificationRoutes";
import { createServer } from "http";
import { Server } from "socket.io";
import { initializeSocketIO } from "./socket/socketHandler";

dotenv.config();

const app = express();

// ============================================================
// Create HTTP server and Socket.IO instance
// ============================================================
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL || "*",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// Initialize Socket.IO event handlers
initializeSocketIO(io);

// connect to mongoDB
const dbURI = process.env.DB_URI as string;
const PORT = process.env.PORT || 3000;

mongoose
  .connect(dbURI)
  .then(() => {
    console.log(`connected to db, listening on port ${PORT}`);
    // Use httpServer instead of app to listen, so Socket.IO works
    httpServer.listen(PORT);
  })
  .catch((err) => console.log(err));

// middleware & static files
app.use(cors());
app.use(express.static("public"));
app.use(express.json());
app.use(morgan("dev"));

// API v1 routes
const apiV1 = express.Router();

app.get("/", (_req: Request, res: Response) => {
  res.json({ message: "Welcome to Rooms API", version: "1.0.0" });
});

// auth routes
apiV1.use("/auth", authRoutes);

// rooms routes
apiV1.use("/rooms", roomsRoutes);

// message routes
apiV1.use("/rooms/chat", messageRoutes);

// notification routes
apiV1.use("/notifications", notificationRoutes);

app.use("/api/v1", apiV1);

// Error handling - must be last
app.use(notFound);
app.use(errorHandler);

// Export the app for testing purposes
export default app;
