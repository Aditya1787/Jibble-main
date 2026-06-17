/**
 * @file college.validation.ts
 * @description Zod schemas for college endpoints.
 */

import { z } from 'zod';

export const searchCollegesSchema = z.object({
  q: z.string().min(1).max(100).optional(),
  country: z.string().max(100).optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(50).default(20),
});

export const collegeIdParamSchema = z.object({
  id: z.string().uuid('Invalid college ID'),
});

export type SearchCollegesInput = z.infer<typeof searchCollegesSchema>;
