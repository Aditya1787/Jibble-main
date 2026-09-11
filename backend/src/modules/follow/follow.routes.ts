/**
 * @file follow.routes.ts
 * @description Routes under /api/v1/follow
 */

import { Router } from 'express';
import { followController } from './follow.controller';
import { authMiddleware } from '../../middlewares/auth.middleware';
import { validate } from '../../middlewares/validate.middleware';
import { userIdParamSchema, paginationQuerySchema } from './follow.validation';

const router = Router();

router.use(authMiddleware);

// POST /api/v1/follow/:userId
router.post(
  '/:userId',
  validate(userIdParamSchema, 'params'),
  followController.follow
);

// DELETE /api/v1/follow/:userId
router.delete(
  '/:userId',
  validate(userIdParamSchema, 'params'),
  followController.unfollow
);

// GET /api/v1/follow/check/:userId
router.get(
  '/check/:userId',
  validate(userIdParamSchema, 'params'),
  followController.isFollowing
);

// GET /api/v1/follow/followers/:userId
router.get(
  '/followers/:userId',
  validate(userIdParamSchema, 'params'),
  validate(paginationQuerySchema, 'query'),
  followController.getFollowers
);

// GET /api/v1/follow/following/:userId
router.get(
  '/following/:userId',
  validate(userIdParamSchema, 'params'),
  validate(paginationQuerySchema, 'query'),
  followController.getFollowing
);

export { router as followRouter };
