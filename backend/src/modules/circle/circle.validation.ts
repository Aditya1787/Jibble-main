/**
 * @file circle.validation.ts
 * @description Zod validation schemas for Circle endpoints.
 */

import { z } from 'zod';

export const createCircleSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100, 'Name cannot exceed 100 characters'),
  description: z.string().max(1000).nullable().optional(),
  type: z.enum(['college', 'school', 'interest', 'creator', 'organization', 'general']).default('general'),
  collegeId: z.string().uuid('Invalid college ID').nullable().optional(),
  isPrivate: z.boolean().default(false),
  avatarUrl: z.string().url().max(500).nullable().optional(),
  bannerUrl: z.string().url().max(500).nullable().optional(),
});

export const circleIdParamSchema = z.object({
  id: z.string().uuid('Invalid circle ID'),
});

export const componentKeyParamSchema = z.object({
  id: z.string().uuid('Invalid circle ID'),
  key: z.string().min(1, 'Component key is required'),
});

export const updateComponentSchema = z.object({
  isEnabled: z.boolean().optional(),
  customName: z.string().max(100).nullable().optional(),
  settings: z.record(z.any()).nullable().optional(),
  displayOrder: z.number().int().min(0).optional(),
});

export const rejectCircleSchema = z.object({
  reason: z.string().max(500, 'Reason cannot exceed 500 characters').optional(),
});

export type CreateCircleInput = z.infer<typeof createCircleSchema>;
export type UpdateComponentInput = z.infer<typeof updateComponentSchema>;
