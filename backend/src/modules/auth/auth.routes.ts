/**
 * @file auth.routes.ts
 * @description Routes under /api/v1/auth
 */

import { Router } from 'express';
import { authController } from './auth.controller';
import { validate } from '../../middlewares/validate.middleware';
import { authMiddleware } from '../../middlewares/auth.middleware';
import { authRateLimiter, signupRateLimiter } from '../../middlewares/rateLimiter.auth';
import {
  signupSchema,
  loginSchema,
  refreshTokenSchema,
} from './auth.validation';

const router = Router();

// POST /api/v1/auth/signup
router.post(
  '/signup',
  signupRateLimiter,
  validate(signupSchema),
  authController.signup,
);

// POST /api/v1/auth/login
router.post(
  '/login',
  authRateLimiter,
  validate(loginSchema),
  authController.login,
);

// POST /api/v1/auth/refresh
router.post(
  '/refresh',
  validate(refreshTokenSchema),
  authController.refresh,
);

// POST /api/v1/auth/logout  (requires valid access token)
router.post(
  '/logout',
  authMiddleware,
  authController.logout,
);

// GET /api/v1/auth/me
router.get(
  '/me',
  authMiddleware,
  authController.me,
);

export { router as authRouter };
