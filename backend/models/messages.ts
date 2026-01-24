import mongoose, { Schema } from "mongoose";
import { IMessage } from "../types";

const messageSchema = new Schema<IMessage>(
  {
    roomId: { type: String, required: true },
    senderId: { type: String, required: true },
    content: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
    read: { type: Boolean, default: false },
    type: { type: String, enum: ["system", "user"], default: "user" },
  },
  { timestamps: true },
);

const Message = mongoose.model<IMessage>("Message", messageSchema);
export default Message;
