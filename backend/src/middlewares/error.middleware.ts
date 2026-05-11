/**
 * @file error.middleware.ts
 * @description Global Express error-handling middleware (must have 4 params).
 *              Handles:
 *                - Operational AppError instances (known, expected errors)
 *                - Zod validation errors
 *                - Prisma known/unknown request errors
 *                - JWT errors
 *                - Generic / unexpected errors
 *
 *              In production, internal error details are hidden from the
 *              response to avoid leaking sensitive information.
 */

import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';
import { logger } from '../config/logger';
import { getCorrelationId } from '../config/requestContext';
import { isProduction } from '../config/env';

// ---------------------------------------------------------------------------
// AppError — operational errors thrown intentionally throughout the app
// ---------------------------------------------------------------------------
export class AppError extends Error {
  public readonly statusCode: number;
  public readonly code: string;
  public readonly isOperational: boolean;

  constructor(
    message: string,
    statusCode = 500,
    code = 'INTERNAL_ERROR',
    isOperational = true,
  ) {
    super(message);
    this.name = 'AppError';
    this.statusCode = statusCode;
    this.code = code;
    this.isOperational = isOperational;
    Error.captureStackTrace(this, this.constructor);
  }

  // Convenience factory methods
  static badRequest(message: string, code = 'BAD_REQUEST'): AppError {
    return new AppError(message, 400, code);
  }
  static unauthorized(message = 'Unauthorized', code = 'UNAUTHORIZED'): AppError {
    return new AppError(message, 401, code);
  }
  static forbidden(message = 'Forbidden', code = 'FORBIDDEN'): AppError {
    return new AppError(message, 403, code);
  }
  static notFound(message = 'Not found', code = 'NOT_FOUND'): AppError {
    return new AppError(message, 404, code);
  }
  static conflict(message: string, code = 'CONFLICT'): AppError {
    return new AppError(message, 409, code);
  }
  static tooManyRequests(message = 'Too many requests', code = 'RATE_LIMITED'): AppError {
    return new AppError(message, 429, code);
  }
  static internal(message = 'Internal server error', code = 'INTERNAL_ERROR'): AppError {
    return new AppError(message, 500, code, false);
  }
}

// ---------------------------------------------------------------------------
// Standard error response shape
// ---------------------------------------------------------------------------
interface ErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: unknown;
    correlationId: string;
    timestamp: string;
  };
  stack?: string;
}

// ---------------------------------------------------------------------------
// Error normaliser — maps any thrown value to a deterministic shape
// ---------------------------------------------------------------------------
const normalise = (
  err: unknown,
): { statusCode: number; code: string; message: string; details?: unknown } => {
  // ── AppError ──────────────────────────────────────────────────────────────
  if (err instanceof AppError) {
    return {
      statusCode: err.statusCode,
      code: err.code,
      message: err.message,
    };
  }

  // ── Zod validation error ─────────────────────────────────────────────────
  if (err instanceof ZodError) {
    return {
      statusCode: 422,
      code: 'VALIDATION_ERROR',
      message: 'Validation failed',
      details: err.errors.map((e) => ({
        path: e.path.join('.'),
        message: e.message,
      })),
    };
  }

  // ── Prisma known request error (constraint violations etc.) ───────────────
  if (err instanceof PrismaClientKnownRequestError) {
    if (err.code === 'P2002') {
      return {
        statusCode: 409,
        code: 'DUPLICATE_ENTRY',
        message: 'A record with that value already exists',
        details: isProduction ? undefined : (err as PrismaClientKnownRequestError).meta,
      };
    }
    if (err.code === 'P2025') {
      return {
        statusCode: 404,
        code: 'NOT_FOUND',
        message: 'Record not found',
      };
    }
    return {
      statusCode: 400,
      code: `PRISMA_${err.code}`,
      message: isProduction ? 'Database error' : (err as Error).message,
    };
  }

  // ── JWT errors ────────────────────────────────────────────────────────────
  if (err instanceof TokenExpiredError) {
    return { statusCode: 401, code: 'TOKEN_EXPIRED', message: 'Token has expired' };
  }
  if (err instanceof JsonWebTokenError) {
    return { statusCode: 401, code: 'TOKEN_INVALID', message: 'Invalid token' };
  }

  // ── Generic Error ─────────────────────────────────────────────────────────
  if (err instanceof Error) {
    return {
      statusCode: 500,
      code: 'INTERNAL_ERROR',
      message: isProduction ? 'Internal server error' : err.message,
    };
  }

  // ── Unknown (string thrown, etc.) ─────────────────────────────────────────
  return {
    statusCode: 500,
    code: 'INTERNAL_ERROR',
    message: 'An unexpected error occurred',
  };
};

// ---------------------------------------------------------------------------
// Global error handler — MUST be registered last with 4 parameters
// ---------------------------------------------------------------------------
export const errorMiddleware = (
  err: unknown,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction,
): void => {
  const { statusCode, code, message, details } = normalise(err);

  const isOperational = err instanceof AppError && err.isOperational;
  const correlationId = getCorrelationId();

  // Log — warn for operational, error for unexpected
  if (statusCode >= 500) {
    logger.error('Unhandled error', {
      correlationId,
      statusCode,
      code,
      message,
      stack: err instanceof Error ? err.stack : undefined,
      url: req.originalUrl,
      method: req.method,
    });
  } else if (!isOperational || statusCode >= 400) {
    logger.warn('Request error', {
      correlationId,
      statusCode,
      code,
      message,
      url: req.originalUrl,
      method: req.method,
    });
  }

  const body: ErrorResponse = {
    success: false,
    error: {
      code,
      message,
      details,
      correlationId,
      timestamp: new Date().toISOString(),
    },
    ...(!isProduction && err instanceof Error
      ? { stack: err.stack }
      : {}),
  };

  res.status(statusCode).json(body);
};
