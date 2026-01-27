import mongoose, { Schema } from "mongoose";
import { IRoom } from "../types";

const participantSchema = new Schema(
  {
    _id: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    username: { type: String, required: true },
    avatar: { type: String },
  },
  { _id: false },
);

const lastMessageSchema = new Schema(
  {
    id: { type: String, required: true },
    content: { type: String, required: true },
    timestamp: { type: Date, required: true },
  },
  { _id: false },
);

const roomSchema = new Schema<IRoom>(
  {
    participants: [participantSchema],
    lastMessage: { type: lastMessageSchema },
    unreadCount: { type: Number, default: 0 },
  },
  { timestamps: true },
);

const Room = mongoose.model<IRoom>("Room", roomSchema);
export default Room;
