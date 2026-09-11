/**
 * @file notification.routes.ts
 * @description Notification routes under /api/v1/notifications
 */

import { Router } from 'express';
import { notificationController } from './notification.controller';
import { authMiddleware } from '../../middlewares/auth.middleware';

const router = Router();

router.use(authMiddleware);

// GET /api/v1/notifications
router.get('/', notificationController.getNotifications);

// GET /api/v1/notifications/unread-count
router.get('/unread-count', notificationController.getUnreadCount);

// PATCH /api/v1/notifications/read-all
router.patch('/read-all', notificationController.markAllAsRead);

// PATCH /api/v1/notifications/:id/read
router.patch('/:id/read', notificationController.markAsRead);

export { router as notificationRouter };
