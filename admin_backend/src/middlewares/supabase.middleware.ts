/**
 * @file middlewares/supabase.middleware.ts
 * @description Verifies Supabase Auth Bearer JWT token from incoming headers.
 */

import { Request, Response, NextFunction } from 'express';
import { getSupabaseAdmin } from '../config/supabase';
import { AppError } from './error.middleware';

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        sub: string;
        email: string;
        role?: string;
      };
    }
  }
}

export const requireSupabaseAuth = async (
  req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw AppError.unauthorized('No authorization token provided', 'NO_TOKEN');
    }

    const token = authHeader.slice(7);
    const supabase = getSupabaseAdmin();

    const { data, error } = await supabase.auth.getUser(token);

    if (error || !data.user) {
      throw AppError.unauthorized('Invalid or expired token', 'TOKEN_INVALID');
    }

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
