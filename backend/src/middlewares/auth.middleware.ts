/**
 * @file auth.middleware.ts
 * @description Extracts and verifies the Bearer JWT from Authorization header.
 *              Attaches decoded payload to req.user.
 *              Throws 401 if missing or invalid.
 */

import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '../utils/crypto';
import { AppError } from './error.middleware';

export const authMiddleware = (
  req: Request,
  _res: Response,
  next: NextFunction,
): void => {
  const header = req.headers.authorization;

  if (!header?.startsWith('Bearer ')) {
    return next(AppError.unauthorized('Missing or malformed Authorization header'));
  }

  const token = header.slice(7);

  try {
    const payload = verifyAccessToken(token);

    if (payload.type !== 'access') {
      return next(AppError.unauthorized('Invalid token type'));
    }

    req.user = payload;
    next();
  } catch {
    next(AppError.unauthorized('Invalid or expired access token'));
  }
};

/** Optional auth — attaches user if token present, does NOT throw if missing */
export const optionalAuth = (
  req: Request,
  _res: Response,
  next: NextFunction,
): void => {
  const header = req.headers.authorization;

  if (header?.startsWith('Bearer ')) {
    try {
      const payload = verifyAccessToken(header.slice(7));
      if (payload.type === 'access') req.user = payload;
    } catch {
      // silently ignore
    }
  }

  next();
};
