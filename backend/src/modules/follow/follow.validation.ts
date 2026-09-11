/**
 * @file follow.validation.ts
 * @description Zod validation schemas for follow requests.
 */

import { z } from 'zod';

export const userIdParamSchema = z.object({
  userId: z.string().uuid('Invalid user ID'),
});

export const paginationQuerySchema = z.object({
  limit: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : 20))
    .pipe(z.number().int().min(1).max(100)),
  offset: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : 0))
    .pipe(z.number().int().min(0)),
});
