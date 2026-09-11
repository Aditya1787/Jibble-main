/**
 * @file notification.controller.ts
 * @description Notification endpoints.
 */

import { Request, Response, NextFunction } from 'express';
import { notificationService } from './notification.service';

export const notificationController = {
  async getNotifications(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.sub;
      const limit = Number(req.query.limit) || 30;
      const offset = Number(req.query.offset) || 0;
      const notifications = await notificationService.getUserNotifications(userId, limit, offset);
      res.status(200).json({ success: true, data: notifications });
    } catch (err) {
      next(err);
    }
  },

  async markAsRead(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.sub;
      const { id } = req.params;
      const updated = await notificationService.markAsRead(id, userId);
      res.status(200).json({ success: true, data: { updated } });
    } catch (err) {
      next(err);
    }
  },

  async markAllAsRead(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.sub;
      const result = await notificationService.markAllAsRead(userId);
      res.status(200).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  },

  async getUnreadCount(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.sub;
      const result = await notificationService.getUnreadCount(userId);
      res.status(200).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  },
};
