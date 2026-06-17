/**
 * @file rateLimiter.post.ts
 * @description Rate limiter for post creation endpoints.
 */

import rateLimit from 'express-rate-limit';
import { env } from '../config/env';

export const postRateLimiter = rateLimit({
  windowMs: env.RATE_LIMIT_WINDOW_MS,
  max: env.RATE_LIMIT_POST_MAX,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: { code: 'RATE_LIMITED', message: 'Posting too fast. Please slow down.' },
  },
  skip: () => env.NODE_ENV === 'test',
});
