/**
 * @file story.validation.ts
 * @description Zod validation schemas for story request data.
 */

import { z } from 'zod';

export const createStorySchema = z.object({
  type: z.enum(['image', 'video', 'text', 'boomerang']).default('image'),
  mediaUrl: z.string().max(500).nullable().optional(),
  thumbnailUrl: z.string().max(500).nullable().optional(),
  textContent: z.string().max(1000).nullable().optional(),
  textStyle: z
    .object({
      font: z.string().optional(),
      color: z.string().optional(),
      bgColor: z.string().optional(),
      position: z.object({ x: z.number(), y: z.number() }).optional(),
    })
    .nullable()
    .optional(),
  stickers: z.array(z.any()).nullable().optional(),
  music: z
    .object({
      trackId: z.string().optional(),
      title: z.string().optional(),
      artist: z.string().optional(),
      startTime: z.number().optional(),
    })
    .nullable()
    .optional(),
  duration: z.number().min(3).max(30).default(5),
});

export const storyIdParamSchema = z.object({
  id: z.string().uuid('Invalid story ID'),
});

export const userIdParamSchema = z.object({
  userId: z.string().uuid('Invalid user ID'),
});

export type CreateStoryInput = z.infer<typeof createStorySchema>;
