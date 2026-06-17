/**
 * @file user.routes.ts
 * @description Routes under /api/v1/users
 */

import { Router } from 'express';
import { userController } from './user.controller';
import { authMiddleware } from '../../middlewares/auth.middleware';

const router = Router();

// All user routes require auth
router.use(authMiddleware);

// GET /api/v1/users/me
router.get('/me', userController.getMe);

// DELETE /api/v1/users/me — account deletion per PRD
router.delete('/me', userController.deleteAccount);

export { router as userRouter };
