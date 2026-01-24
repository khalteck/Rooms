/**
 * Custom API Error class
 */
class ApiError extends Error {
  statusCode: number;
  details: any;
  isOperational: boolean;

  constructor(statusCode: number, message: string, details: any = null) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

export default ApiError;
