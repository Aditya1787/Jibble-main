/**
 * @file post.validation.ts
 * @description Zod validation schemas for post request data.
 */

import { z } from 'zod';

export const createPostSchema = z.object({
  type: z.enum(['text', 'image', 'video', 'carousel', 'link', 'poll'], {
    required_error: 'Post type is required',
  }),
  visibility: z.enum(['public', 'followers', 'college_only', 'private'], {
    required_error: 'Visibility is required',
  }),
  caption: z.string().max(2000, 'Caption cannot exceed 2000 characters').nullable().optional(),
  mediaUrls: z.array(z.string().url('Invalid media URL')).max(10, 'Cannot exceed 10 media items').nullable().optional(),
  thumbnailUrl: z.string().url('Invalid thumbnail URL').max(500).nullable().optional(),
  linkUrl: z.string().url('Invalid link URL').max(500).nullable().optional(),
  linkPreview: z
    .object({
      title: z.string().max(200).optional(),
      description: z.string().max(500).optional(),
      imageUrl: z.string().url().max(500).optional(),
    })
    .nullable()
    .optional(),
  pollOptions: z
    .array(z.string().min(1, 'Option cannot be empty').max(100, 'Option cannot exceed 100 characters'))
    .min(2, 'A poll must have at least 2 options')
    .max(10, 'A poll cannot exceed 10 options')
    .nullable()
    .optional(),
  pollEndsAt: z
    .string()
    .datetime({ message: 'Invalid datetime for poll end' })
    .or(z.date())
    .nullable()
    .optional(),
  location: z.string().max(255).nullable().optional(),
  hashtags: z.array(z.string().max(50)).max(20).nullable().optional(),
  mentions: z.array(z.string().uuid('Invalid mention user ID')).max(50).nullable().optional(),
});

export const getFeedSchema = z.object({
  limit: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : 10))
    .pipe(z.number().int().min(1).max(50)),
  offset: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : 0))
    .pipe(z.number().int().min(0)),
});

export const postIdParamSchema = z.object({
  id: z.string().uuid('Invalid post ID'),
});

export const usernameParamSchema = z.object({
  username: z.string().min(3).max(30),
});

export type CreatePostInput = z.infer<typeof createPostSchema>;
