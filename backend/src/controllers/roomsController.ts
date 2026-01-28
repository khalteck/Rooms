import asyncHandler from "../helpers/asyncHandler";
import ApiError from "../helpers/ApiError";
import { AuthRequest } from "../types";
import { Response } from "express";
import Room from "../models/rooms";
import User from "../models/users";
import Message from "../models/messages";

//================================================================
// GET Rooms - Return list of rooms for authenticated user
//================================================================
export const getRooms = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const userId = req.user?._id;
    const { search } = req.query;

    if (!userId) {
      throw new ApiError(401, "Unauthorized", "User not authenticated");
    }

    const query: any = {
      "participants._id": userId,
    };

    // Add search filter if search parameter is provided
    if (search && typeof search === "string") {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { "participants.firstName": { $regex: search, $options: "i" } },
        { "participants.lastName": { $regex: search, $options: "i" } },
        { "participants.username": { $regex: search, $options: "i" } },
      ];
    }

    // const rooms = await Room.find(query);
    const rooms = await Room.find(query).sort({
      "lastMessage.timestamp": -1,
    });

    res.status(200).json({
      rooms,
    });
  },
);

//================================================================
// CREATE Room - Create a new room
//================================================================
export const createRoom = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const userId = req.user?._id;
    const { participantEmail } = req.body;

    if (!userId) {
      throw new ApiError(401, "Unauthorized", "User not authenticated");
    }

    if (!participantEmail) {
      throw new ApiError(400, "Bad Request", "Participant email is required");
    }

    // Find the participant by email
    const participant = await User.findOne({ email: participantEmail });

    if (!participant) {
      throw new ApiError(
        404,
        "Not Found",
        "User with this email does not exist",
      );
    }

    // Find the current user
    const currentUser = await User.findById(userId);

    if (!currentUser) {
      throw new ApiError(401, "Unauthorized", "Current user not found");
    }

    const room = new Room({
      participants: [
        {
          _id: currentUser._id.toString(),
          firstName: currentUser.firstName,
          lastName: currentUser.lastName,
          username: currentUser.username,
          avatar: currentUser.avatar,
        },
        {
          _id: participant._id.toString(),
          firstName: participant.firstName,
          lastName: participant.lastName,
          username: participant.username,
          avatar: participant.avatar,
        },
      ],
    });

    await room.save();

    // create a system message indicating room creation
    const systemMessage = `${currentUser.firstName} ${currentUser.lastName} created the room with ${participant.firstName} ${participant.lastName}.`;

    // You can implement a Message model and save this system message if needed
    const message = new Message({
      roomId: room._id.toString(),
      senderId: currentUser._id.toString(),
      content: systemMessage,
      read: false,
      type: "system",
    });

    await message.save();

    room.lastMessage = {
      id: message._id.toString(),
      content: message.content,
      timestamp: message.timestamp,
    };

    await room.save();

    res.status(201).json({
      room,
    });
  },
);

//================================================================
// GET Room by ID - Return room details
//================================================================
export const getRoomById = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const userId = req.user?._id;
    const roomId = req.params.id;

    if (!userId) {
      throw new ApiError(401, "Unauthorized", "User not authenticated");
    }

    const room = await Room.findById(roomId);

    if (!room) {
      throw new ApiError(404, "Not Found", "Room not found");
    }

    // Check if the user is a participant in the room
    const isParticipant = room.participants.some(
      (participant) => participant._id.toString() === userId,
    );

    if (!isParticipant) {
      throw new ApiError(
        403,
        "Forbidden",
        "User is not a participant in this room",
      );
    }

    res.status(200).json({
      room,
    });
  },
);

//================================================================
// Leave room - Remove user from room participants
//================================================================
export const leaveRoom = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const userId = req.user?._id;
    const roomId = req.params.id;

    if (!userId) {
      throw new ApiError(401, "Unauthorized", "User not authenticated");
    }

    const room = await Room.findById(roomId);

    if (!room) {
      throw new ApiError(404, "Not Found", "Room not found");
    }

    // Remove the user from participants
    room.participants = room.participants.filter(
      (participant) => participant._id.toString() !== userId,
    );

    await room.save();

    res.status(200).json({
      message: "Left the room successfully",
    });
  },
);
