import { Response } from "express";
import User from "../models/users";
import asyncHandler from "../helpers/asyncHandler";
import ApiError from "../helpers/ApiError";
import bcrypt from "bcrypt";
import validator from "validator";
import jwt from "jsonwebtoken";
import { AuthRequest, IUser, JWTPayload } from "../types";
import dotenv from "dotenv";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET as string;

const generateToken = (user: IUser): string => {
  return jwt.sign(
    { id: user._id.toString(), email: user.email } as JWTPayload,
    JWT_SECRET,
    {
      expiresIn: "30d",
    },
  );
};

//================================================================
// Register a new user
//================================================================

export const register = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { firstName, lastName, username, email, password } = req?.body || {};

    // Validation
    if (!firstName || !lastName || !username || !email || !password) {
      throw new ApiError(
        400,
        "All fields are required",
        "Missing required fields",
      );
    }

    if (!validator.isEmail(email)) {
      throw new ApiError(
        400,
        "Invalid email format",
        "Email validation failed",
      );
    }
    if (!validator.isStrongPassword(password)) {
      throw new ApiError(
        400,
        "Password must be at least 6 characters long and contain a mix of letters and numbers",
        "Password validation failed",
      );
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new ApiError(
        400,
        "User already exists",
        "Email is already registered",
      );
    }

    // check if username already exists
    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      throw new ApiError(
        400,
        "Username already taken",
        "Please choose a different username",
      );
    }

    // hash password before saving
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      firstName,
      lastName,
      username,
      email,
      password: hashedPassword,
    });

    const token = generateToken(newUser);

    res.status(201).json({
      message: "User registered successfully",
      user: newUser,
      token,
    });
  },
);

//================================================================
// Login user
//================================================================

export const login = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { email, password } = req?.body || {};

  // Validation
  if (!email || !password) {
    throw new ApiError(
      400,
      "All fields are required",
      "Email and password are required",
    );
  }

  if (!validator.isEmail(email)) {
    throw new ApiError(400, "Invalid email format", "Email validation failed");
  }

  const user = await User.findOne({ email });
  if (!user) {
    throw new ApiError(401, "Invalid credentials", "Invalid email or password");
  }

  // Compare password with hashed password
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid credentials", "Invalid email or password");
  }

  res.status(200).json({
    message: "Login successful",
    user,
    token: generateToken(user),
  });
});

//================================================================
// Forgot password
//================================================================

export const forgotPassword = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { email } = req?.body || {};

    if (!email) {
      throw new ApiError(400, "Email is required", "Missing email field");
    }

    if (!validator.isEmail(email)) {
      throw new ApiError(
        400,
        "Invalid email format",
        "Email validation failed",
      );
    }

    const user = await User.findOne({ email });
    if (!user) {
      throw new ApiError(
        404,
        "User not found",
        "No user with that email exists",
      );
    }

    // Here you would normally send a password reset email
    res.status(200).json({
      message: "Password reset link sent to email",
    });
  },
);

//================================================================
// Reset password
//================================================================

export const resetPassword = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { email, newPassword } = req?.body || {};

    if (!email || !newPassword) {
      throw new ApiError(
        400,
        "All fields are required",
        "Email and new password are required",
      );
    }

    if (!validator.isEmail(email)) {
      throw new ApiError(
        400,
        "Invalid email format",
        "Email validation failed",
      );
    }

    if (!validator.isStrongPassword(newPassword)) {
      throw new ApiError(
        400,
        "Password must be at least 6 characters long and contain a mix of letters and numbers",
        "Password validation failed",
      );
    }

    const user = await User.findOne({ email });
    if (!user) {
      throw new ApiError(
        404,
        "User not found",
        "No user with that email exists",
      );
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    user.password = hashedPassword;
    await user.save();

    res.status(200).json({
      message: "Password reset successful",
    });
  },
);

//================================================================
// Update user profile
//================================================================

export const updateProfile = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const userId = req.user?._id;

    if (!userId) {
      throw new ApiError(401, "Unauthorized", "User not authenticated");
    }

    const {
      firstName,
      lastName,
      username,
      avatar,
      notificationsEnabled,
      soundEnabled,
      theme,
      onboardingCompleted,
    } = req?.body || {};

    const user = await User.findById(userId);
    if (!user) {
      throw new ApiError(404, "User not found", "No user with that ID exists");
    }

    // Update fields if provided
    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (username) user.username = username;
    if (avatar) user.avatar = avatar;
    if (notificationsEnabled !== undefined)
      user.notificationsEnabled = notificationsEnabled;
    if (soundEnabled !== undefined) user.soundEnabled = soundEnabled;
    if (theme) user.theme = theme;
    if (onboardingCompleted !== undefined)
      user.onboardingCompleted = onboardingCompleted;

    await user.save();

    res.status(200).json({
      message: "Profile updated successfully",
      user,
    });
  },
);

//================================================================
// Get user profile
//================================================================

export const getAccount = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const userId = req.user?._id;

    if (!userId) {
      throw new ApiError(401, "Unauthorized", "User not authenticated");
    }

    const user = await User.findById(userId);
    if (!user) {
      throw new ApiError(404, "User not found", "No user with that ID exists");
    }

    res.status(200).json({
      user,
    });
  },
);

//================================================================
// change user password
//================================================================

export const changePassword = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const userId = req.user?._id;

    if (!userId) {
      throw new ApiError(401, "Unauthorized", "User not authenticated");
    }

    const { currentPassword, newPassword } = req?.body || {};

    if (!currentPassword || !newPassword) {
      throw new ApiError(
        400,
        "All fields are required",
        "Current and new password are required",
      );
    }

    const user = await User.findById(userId);
    if (!user) {
      throw new ApiError(404, "User not found", "No user with that ID exists");
    }

    // Verify current password
    const isPasswordValid = await bcrypt.compare(
      currentPassword,
      user.password,
    );
    if (!isPasswordValid) {
      throw new ApiError(401, "Invalid current password", "Password mismatch");
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    user.password = hashedPassword;
    await user.save();

    res.status(200).json({
      message: "Password changed successfully",
    });
  },
);
