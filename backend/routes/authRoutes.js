const express = require("express");
const router = express.Router();
const authController = require("../controllers/authControllers");
const requireAuth = require("../middleware/requireAuth");

router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/forgot-password", authController.forgotPassword);
router.post("/reset-password", authController.resetPassword);

router.use(requireAuth);

router.get("/me", authController.getAccount);
router.patch("/me", authController.updateProfile);
router.post("/me/change-password", authController.changePassword);

module.exports = router;
