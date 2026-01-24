import asyncHandler from "../helpers/asyncHandler";
import ApiError from "../helpers/ApiError";
import { AuthRequest } from "../types";
import { Response } from "express";
import Room from "../models/rooms";
import Message from "../models/messages";

//================================================================
// GET messages - Return list of messages for a room
//================================================================

export const getMessages = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const userId = req.user?._id;
    const roomId = req.params.id;
    const { limit = "20", cursor } = req.query;

    if (!userId) {
      throw new ApiError(401, "Unauthorized", "User not authenticated");
    }

    const room = await Room.findById(roomId);

    if (
      !room ||
      !room.participants.some((p) => p._id.toString() === userId.toString())
    ) {
      throw new ApiError(
        404,
        "Room not found",
        "User is not a participant of the room",
      );
    }

    const query: Record<string, any> = { roomId };

    if (cursor) {
      query._id = { $lt: cursor };
    }

    const messages = await Message.find(query)
      .sort({ _id: -1 }) // newest → oldest
      .limit(Number(limit));

    const hasMore = messages.length === Number(limit);
    const nextCursor = messages.length
      ? messages[messages.length - 1]._id
      : null;

    res.status(200).json({
      messages: messages.reverse(), // oldest → newest for UI
      pagination: {
        hasMore,
        nextCursor,
      },
    });
  },
);

//================================================================
// POST message - Send a new message in a room
//================================================================

export const postMessage = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const userId = req.user?._id;
    const roomId = req.params.id;
    const { content } = req.body;

    if (!userId) {
      throw new ApiError(401, "Unauthorized", "User not authenticated");
    }

    if (!content || typeof content !== "string" || !content.trim()) {
      throw new ApiError(400, "Bad Request", "Message content is required");
    }

    const room = await Room.findById(roomId);

    if (
      !room ||
      !room.participants.some((p) => p._id.toString() === userId.toString())
    ) {
      throw new ApiError(
        404,
        "Room not found",
        "User is not a participant of the room",
      );
    }

    const message = new Message({
      roomId,
      senderId: userId,
      content: content.trim(),
      read: false,
    });

    await message.save();

    room.lastMessage = {
      id: message._id.toString(),
      content: message.content,
      timestamp: message.timestamp,
    };
    await room.save();

    res.status(201).json({
      message,
    });
  },
);

//================================================================
// Mark messages as read - Update read status for messages in a room
//================================================================

export const markMessagesAsRead = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const userId = req.user?._id;
    const roomId = req.params.id;

    if (!userId) {
      throw new ApiError(401, "Unauthorized", "User not authenticated");
    }

    const room = await Room.findById(roomId);

    if (
      !room ||
      !room.participants.some((p) => p._id.toString() === userId.toString())
    ) {
      throw new ApiError(
        404,
        "Room not found",
        "User is not a participant of the room",
      );
    }

    await Message.updateMany(
      { roomId, senderId: { $ne: userId }, read: false },
      { $set: { read: true } },
    );

    res.status(200).json({ message: "Messages marked as read" });
  },
);
