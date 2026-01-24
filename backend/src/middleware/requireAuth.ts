import { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User from "../models/users";
import { AuthRequest, JWTPayload } from "../types";

const requireAuth = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ message: "Authorization token required" });
    return;
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string,
    ) as JWTPayload;
    const user = await User.findById(decoded.id).select("_id");

    if (!user) {
      res.status(401).json({ message: "User not found" });
      return;
    }

    req.user = { _id: user._id.toString() };
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid or expired token" });
  }
};

export default requireAuth;
