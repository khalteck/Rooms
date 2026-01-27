import asyncHandler from "../helpers/asyncHandler";
import ApiError from "../helpers/ApiError";
import { AuthRequest } from "../types";
import { Response } from "express";
import Notification from "../models/notifications";

//================================================================
// GET Notifications - Return list of notifications for user (via REST)
// Note: Real-time updates are handled via Socket.IO
//================================================================
export const getNotifications = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const userId = req.user?._id;
    const { limit = "20", skip = "0" } = req.query;

    if (!userId) {
      throw new ApiError(401, "Unauthorized", "User not authenticated");
    }

    const notifications = await Notification.find({ userId })
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .skip(Number(skip));

    const unreadCount = await Notification.countDocuments({
      userId,
      read: false,
    });

    res.status(200).json({
      notifications,
      unreadCount,
    });
  },
);

//================================================================
// Mark Notification as Read
//================================================================
export const markNotificationAsRead = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const userId = req.user?._id;
    const notificationId = req.params.id;

    if (!userId) {
      throw new ApiError(401, "Unauthorized", "User not authenticated");
    }

    const notification = await Notification.findOne({
      _id: notificationId,
      userId,
    });

    if (!notification) {
      throw new ApiError(404, "Not Found", "Notification not found");
    }

    notification.read = true;
    await notification.save();

    res.status(200).json({
      message: "Notification marked as read",
      notification,
    });
  },
);

//================================================================
// Mark All Notifications as Read
//================================================================
export const markAllNotificationsAsRead = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const userId = req.user?._id;

    if (!userId) {
      throw new ApiError(401, "Unauthorized", "User not authenticated");
    }

    await Notification.updateMany({ userId, read: false }, { read: true });

    res.status(200).json({
      message: "All notifications marked as read",
    });
  },
);

//================================================================
// Delete Notification
//================================================================
export const deleteNotification = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const userId = req.user?._id;
    const notificationId = req.params.id;

    if (!userId) {
      throw new ApiError(401, "Unauthorized", "User not authenticated");
    }

    const notification = await Notification.findOneAndDelete({
      _id: notificationId,
      userId,
    });

    if (!notification) {
      throw new ApiError(404, "Not Found", "Notification not found");
    }

    res.status(200).json({
      message: "Notification deleted successfully",
    });
  },
);

//================================================================
// Delete All Notifications
//================================================================
export const deleteAllNotifications = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const userId = req.user?._id;

    if (!userId) {
      throw new ApiError(401, "Unauthorized", "User not authenticated");
    }

    await Notification.deleteMany({ userId });

    res.status(200).json({
      message: "All notifications deleted successfully",
    });
  },
);
