import { Request, Response, NextFunction } from "express";
import ApiError from "../helpers/ApiError";

interface MongoError extends Error {
  code?: number;
  keyPattern?: Record<string, any>;
  errors?: Record<string, any>;
}

/**
 * Error handling middleware
 * Catches all errors and sends appropriate response
 */
const errorHandler = (
  err: MongoError | ApiError,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void => {
  // Log error for debugging (always log in development)
  console.error("Error:", err);

  // Handle operational errors (thrown by us using ApiError)
  if (err instanceof ApiError && err.isOperational) {
    res.status(err.statusCode).json({
      error: err.message,
      ...(err.details && { details: err.details }),
    });
    return;
  }

  // Handle Mongoose validation errors
  if (err.name === "ValidationError" && "errors" in err && err.errors) {
    res.status(400).json({
      error: "Validation Error",
      details: Object.values(err.errors).map((e: any) => e.message),
    });
    return;
  }

  // Handle Mongoose CastError (invalid ObjectId)
  if (err.name === "CastError") {
    res.status(400).json({
      error: "Invalid ID format",
      details: "The provided ID is not valid",
    });
    return;
  }

  // Handle duplicate key errors
  if (
    "code" in err &&
    err.code === 11000 &&
    "keyPattern" in err &&
    err.keyPattern
  ) {
    const field = Object.keys(err.keyPattern)[0];
    res.status(409).json({
      error: "Duplicate field value",
      details: `${field} already exists`,
    });
    return;
  }

  // Handle unexpected errors - don't expose internal details
  res.status(500).json({
    error: "Internal Server Error",
    message:
      process.env.NODE_ENV !== "production"
        ? err.message
        : "Something went wrong on the server",
    ...(process.env.NODE_ENV !== "production" && { stack: err.stack }),
  });
};

/**
 * 404 Not Found handler
 */
const notFound = (req: Request, _res: Response, next: NextFunction): void => {
  const error = new ApiError(
    404,
    "Not Found",
    `The requested resource ${req.originalUrl} was not found`,
  );
  next(error);
};

export { errorHandler, notFound };
