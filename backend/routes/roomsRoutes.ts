import express from "express";
import requireAuth from "../middleware/requireAuth";
import * as roomsController from "../controllers/roomsController";

const router = express.Router();

router.use(requireAuth);

router.get("/", roomsController.getRooms);
router.post("/", roomsController.createRoom);
router.get("/:id", roomsController.getRoomById);
router.post("/:id/leave", roomsController.leaveRoom);
export default router;
