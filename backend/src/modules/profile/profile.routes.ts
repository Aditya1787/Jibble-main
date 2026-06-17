/**
 * @file profile.routes.ts
 * @description Routes under /api/v1/profiles
 */

import { Router } from 'express';
import { profileController } from './profile.controller';
import { authMiddleware } from '../../middlewares/auth.middleware';
import { validate } from '../../middlewares/validate.middleware';
import {
  createProfileSchema,
  updateProfileSchema,
  usernameParamSchema,
} from './profile.validation';

const router = Router();

// GET /api/v1/profiles/check-username/:username
router.get(
  '/check-username/:username',
  validate(usernameParamSchema, 'params'),
  profileController.checkUsernameAvailable,
);

// GET /api/v1/profiles/:username
router.get(
  '/:username',
  validate(usernameParamSchema, 'params'),
  profileController.getProfileByUsername,
);

// All routes below require auth
router.use(authMiddleware);

// GET /api/v1/profiles/me
router.get('/me', profileController.getMyProfile);

// POST /api/v1/profiles
router.post(
  '/',
  validate(createProfileSchema),
  profileController.createMyProfile,
);

// PATCH /api/v1/profiles/me
router.patch(
  '/me',
  validate(updateProfileSchema),
  profileController.updateMyProfile,
);

export { router as profileRouter };
