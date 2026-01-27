import mongoose, { Schema } from "mongoose";
import { INotification } from "../types";

const notificationSchema = new Schema<INotification>(
  {
    userId: { type: String, required: true },
    type: {
      type: String,
      enum: ["message", "room_invite", "system"],
      required: true,
    },
    title: { type: String, required: true },
    message: { type: String, required: true },
    roomId: { type: String },
    read: { type: Boolean, default: false },
    metadata: { type: Schema.Types.Mixed },
  },
  { timestamps: true },
);

// Index for faster queries by userId and read status
notificationSchema.index({ userId: 1, read: 1, createdAt: -1 });

const Notification = mongoose.model<INotification>(
  "Notification",
  notificationSchema,
);
export default Notification;
