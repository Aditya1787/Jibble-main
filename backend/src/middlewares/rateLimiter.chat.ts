/**
 * @file rateLimiter.chat.ts
 * @description Rate limiter for chat/messaging endpoints.
 */

import rateLimit from 'express-rate-limit';
import { env } from '../config/env';

export const chatRateLimiter = rateLimit({
  windowMs: env.RATE_LIMIT_WINDOW_MS,
  max: env.RATE_LIMIT_CHAT_MAX,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: { code: 'RATE_LIMITED', message: 'Too many messages. Please slow down.' },
  },
  skip: () => env.NODE_ENV === 'test',
});
