/**
 * @file rateLimiter.auth.ts
 * @description Strict rate limiter for auth routes (login, signup, OTP, refresh).
 *              PRD requires "enforcement of strong rate limiting on login attempts".
 */

import rateLimit from 'express-rate-limit';
import { env } from '../config/env';

/** Login / OTP / password-reset: max 10 per 15 min window per IP */
export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,          // 15 minutes
  max: env.RATE_LIMIT_AUTH_MAX,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: {
      code: 'RATE_LIMITED',
      message: 'Too many auth attempts. Please try again in 15 minutes.',
    },
  },
  skip: () => env.NODE_ENV === 'test',
});

/** Signup specifically — even tighter (5 per hour) */
export const signupRateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: {
      code: 'RATE_LIMITED',
      message: 'Too many signup attempts. Please try again later.',
    },
  },
  skip: () => env.NODE_ENV === 'test',
});
