/**
 * @file user.validation.ts
 * @description Zod schemas for user endpoints.
 */

import { z } from 'zod';

export const updateUserSchema = z.object({
  status: z.enum(['active', 'inactive']).optional(),
}).strict();

export const userIdParamSchema = z.object({
  id: z.string().uuid('Invalid user ID format'),
});

export type UpdateUserInput = z.infer<typeof updateUserSchema>;
export type UserIdParam = z.infer<typeof userIdParamSchema>;
