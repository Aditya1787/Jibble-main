/**
 * @file story.routes.ts
 * @description Express routes for story endpoints.
 */

import { Router } from 'express';
import { storyController } from './story.controller';
import { authMiddleware } from '../../middlewares/auth.middleware';
import { validate } from '../../middlewares/validate.middleware';
import {
  createStorySchema,
  storyIdParamSchema,
  userIdParamSchema,
} from './story.validation';

const router = Router();

// All story routes require authentication
router.use(authMiddleware);

// POST /api/v1/stories
router.post(
  '/',
  validate(createStorySchema),
  storyController.createStory
);

// GET /api/v1/stories/feed
router.get(
  '/feed',
  storyController.getFeedStories
);

// GET /api/v1/stories/user/:userId
router.get(
  '/user/:userId',
  validate(userIdParamSchema, 'params'),
  storyController.getUserStories
);

// POST /api/v1/stories/:id/view
router.post(
  '/:id/view',
  validate(storyIdParamSchema, 'params'),
  storyController.viewStory
);

// DELETE /api/v1/stories/:id
router.delete(
  '/:id',
  validate(storyIdParamSchema, 'params'),
  storyController.deleteStory
);

export { router as storyRouter };
