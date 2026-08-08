/**
 * @file middlewares/supabase.middleware.ts
 * @description Verifies a Supabase-issued JWT from the Authorization header.
 *              Attaches the decoded user payload to req.user.
 *              Use this on all protected admin routes.
 */

import { Request, Response, NextFunction } from 'express';
import { getSupabaseAdmin } from '../config/supabase';
import { AppError } from './error.middleware';

/**
 * Middleware: verify Supabase JWT.
 * Expects:  Authorization: Bearer <supabase_access_token>
 */
export const requireSupabaseAuth = async (
  req: Request,
  _res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw AppError.unauthorized('No authorization token provided', 'NO_TOKEN');
    }

    const token = authHeader.slice(7);
    const supabase = getSupabaseAdmin();

    // Verify the token against Supabase Auth
    const { data, error } = await supabase.auth.getUser(token);

    if (error || !data.user) {
      throw AppError.unauthorized('Invalid or expired token', 'TOKEN_INVALID');
    }

    // Attach user to request
    req.user = {
      id: data.user.id,
      sub: data.user.id,
      email: data.user.email ?? '',
      role: (data.user.user_metadata?.role as string) ?? 'user',
    };

    next();
  } catch (err) {
    next(err);
  }
};

/**
 * Optional auth middleware — attaches user if token present, but doesn't block.
 */
export const optionalSupabaseAuth = async (
  req: Request,
  _res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next();
    }
    const token = authHeader.slice(7);
    const supabase = getSupabaseAdmin();
    const { data } = await supabase.auth.getUser(token);
    if (data?.user) {
      req.user = {
        id: data.user.id,
        sub: data.user.id,
        email: data.user.email ?? '',
        role: (data.user.user_metadata?.role as string) ?? 'user',
      };
    }
    next();
  } catch {
    next();
  }
};
