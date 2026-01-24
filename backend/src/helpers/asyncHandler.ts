import { Request, Response, NextFunction, RequestHandler } from "express";

/**
 * Async Handler - Wraps async route handlers to catch errors automatically
 * @param {Function} fn - Async controller function
 * @returns {Function} Express middleware function
 */
const asyncHandler = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<any>,
): RequestHandler => {
  return async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      await fn(req, res, next);
    } catch (error) {
      next(error);
    }
  };
};

export default asyncHandler;
