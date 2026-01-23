const ApiError = require("../helpers/ApiError");

/**
 * Error handling middleware
 * Catches all errors and sends appropriate response
 */
const errorHandler = (err, req, res, next) => {
  // Log error for debugging (always log in development)
  console.error("Error:", err);

  // Handle operational errors (thrown by us using ApiError)
  if (err.isOperational) {
    return res.status(err.statusCode).json({
      error: err.message,
      ...(err.details && { details: err.details }),
    });
  }

  // Handle Mongoose validation errors
  if (err.name === "ValidationError") {
    return res.status(400).json({
      error: "Validation Error",
      details: Object.values(err.errors).map((e) => e.message),
    });
  }

  // Handle Mongoose CastError (invalid ObjectId)
  if (err.name === "CastError") {
    return res.status(400).json({
      error: "Invalid ID format",
      details: "The provided ID is not valid",
    });
  }

  // Handle duplicate key errors
  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern)[0];
    return res.status(409).json({
      error: "Duplicate field value",
      details: `${field} already exists`,
    });
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
const notFound = (req, res, next) => {
  const error = new ApiError(
    404,
    "Not Found",
    `The requested resource ${req.originalUrl} was not found`,
  );
  next(error);
};

module.exports = { errorHandler, notFound };
