/**
 * @file middlewares/error.middleware.ts
 * @description Standardised application error handling middleware.
 */

import { Request, Response, NextFunction } from 'express';
import { logger } from '../config/logger';

export class AppError extends Error {
  public statusCode: number;
  public code: string;

  constructor(message: string, statusCode = 500, code = 'INTERNAL_ERROR') {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    Object.setPrototypeOf(this, new.target.prototype);
  }

  static badRequest(msg: string, code = 'BAD_REQUEST') { return new AppError(msg, 400, code); }
  static unauthorized(msg: string, code = 'UNAUTHORIZED') { return new AppError(msg, 401, code); }
  static forbidden(msg: string, code = 'FORBIDDEN') { return new AppError(msg, 403, code); }
  static notFound(msg: string, code = 'NOT_FOUND') { return new AppError(msg, 404, code); }
  static conflict(msg: string, code = 'CONFLICT') { return new AppError(msg, 409, code); }
  static internal(msg: string, code = 'INTERNAL_ERROR') { return new AppError(msg, 500, code); }
}

export const errorMiddleware = (
  err: Error | AppError,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  const statusCode = err instanceof AppError ? err.statusCode : 500;
  const code = err instanceof AppError ? err.code : 'INTERNAL_ERROR';

  logger.error(`[Error] ${code}: ${err.message}`, { stack: err.stack });

  res.status(statusCode).json({
    success: false,
    error: {
      code,
      message: err.message || 'An unexpected error occurred',
      timestamp: new Date().toISOString(),
    },
  });
};
