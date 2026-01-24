import express from "express";
import * as authController from "../controllers/authControllers";
import requireAuth from "../middleware/requireAuth";

const router = express.Router();

router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/forgot-password", authController.forgotPassword);
router.post("/reset-password", authController.resetPassword);

router.use(requireAuth);

router.get("/me", authController.getAccount);
router.patch("/me", authController.updateProfile);
router.post("/me/change-password", authController.changePassword);

export default router;
