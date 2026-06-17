/**
 * @file post.routes.ts
 * @description Defines HTTP routes under /api/v1/posts.
 */

import { Router } from 'express';
import { postController } from './post.controller';
import { authMiddleware } from '../../middlewares/auth.middleware';
import { validate } from '../../middlewares/validate.middleware';
import { postRateLimiter } from '../../middlewares/rateLimiter.post';
import {
  createPostSchema,
  getFeedSchema,
  postIdParamSchema,
  usernameParamSchema,
} from './post.validation';

const router = Router();

// All post routes require authentication
router.use(authMiddleware);

// POST /api/v1/posts
router.post(
  '/',
  postRateLimiter,
  validate(createPostSchema),
  postController.createPost,
);

// GET /api/v1/posts/feed
router.get(
  '/feed',
  validate(getFeedSchema, 'query'),
  postController.getHomeFeed,
);

// GET /api/v1/posts/user/:username
router.get(
  '/user/:username',
  validate(usernameParamSchema, 'params'),
  validate(getFeedSchema, 'query'),
  postController.getUserPosts,
);

// GET /api/v1/posts/:id
router.get(
  '/:id',
  validate(postIdParamSchema, 'params'),
  postController.getPostById,
);

// DELETE /api/v1/posts/:id
router.delete(
  '/:id',
  validate(postIdParamSchema, 'params'),
  postController.deletePost,
);

// POST /api/v1/posts/:id/like
router.post(
  '/:id/like',
  validate(postIdParamSchema, 'params'),
  postController.toggleLike,
);

export { router as postRouter };
