import express from "express";
import requireAuth from "../middleware/requireAuth";
import * as messageController from "../controllers/messageController";

const router = express.Router();

router.use(requireAuth);

router.get("/:id/messages", messageController.getMessages);
router.post("/:id/messages", messageController.postMessage);
router.post("/:id/messages/read", messageController.markMessagesAsRead);

export default router;
