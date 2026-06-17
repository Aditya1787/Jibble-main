/**
 * @file profile.validation.ts
 * @description Zod schemas for profile endpoints.
 */

import { z } from 'zod';

export const createProfileSchema = z.object({
  username: z
    .string()
    .min(3, 'Username must be at least 3 characters')
    .max(30)
    .regex(/^[a-z0-9_]+$/, 'Username can only contain lowercase letters, numbers and underscores')
    .toLowerCase(),
  displayName: z.string().min(2, 'Display name must be at least 2 characters').max(100),
  bio: z.string().max(300, 'Bio cannot exceed 300 characters').optional(),
  collegeId: z.string().uuid('Invalid college ID').optional(),
  year: z.string().max(20).optional(),
  branch: z.string().max(100).optional(),
  skills: z.array(z.string().max(50)).max(20).default([]),
  interests: z.array(z.string().max(50)).max(20).default([]),
});

export const updateProfileSchema = z.object({
  username: z
    .string()
    .min(3)
    .max(30)
    .regex(/^[a-z0-9_]+$/)
    .toLowerCase()
    .optional(),
  displayName: z.string().min(2).max(100).optional(),
  bio: z.string().max(300).nullable().optional(),
  collegeId: z.string().uuid().nullable().optional(),
  year: z.string().max(20).nullable().optional(),
  branch: z.string().max(100).nullable().optional(),
  skills: z.array(z.string().max(50)).max(20).optional(),
  interests: z.array(z.string().max(50)).max(20).optional(),
  socialLinks: z.record(z.string(), z.string().url()).optional(),
  isPublic: z.boolean().optional(),
}).strict();

export const usernameParamSchema = z.object({
  username: z.string().min(3).max(30),
});

export type CreateProfileInput = z.infer<typeof createProfileSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
