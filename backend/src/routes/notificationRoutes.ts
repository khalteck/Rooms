import express from "express";
import requireAuth from "../middleware/requireAuth";
import * as notificationController from "../controllers/notificationController";

const router = express.Router();

router.use(requireAuth);

// GET all notifications (REST endpoint - for initial load)
router.get("/", notificationController.getNotifications);

// Mark single notification as read
router.patch("/:id/read", notificationController.markNotificationAsRead);

// Mark all notifications as read
router.patch("/read-all", notificationController.markAllNotificationsAsRead);

// Delete single notification
router.delete("/:id", notificationController.deleteNotification);

// Delete all notifications
router.delete("/", notificationController.deleteAllNotifications);

export default router;
