/**
 * @file chat.controller.ts
 * @description Direct messaging controller endpoints.
 */

import { Request, Response, NextFunction } from 'express';
import { chatService } from './chat.service';

export const chatController = {
  async getConversations(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.sub;
      const conversations = await chatService.getConversations(userId);
      res.status(200).json({ success: true, data: conversations });
    } catch (err) {
      next(err);
    }
  },

  async getMessages(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.sub;
      const { recipientId } = req.params;
      const limit = Number(req.query.limit) || 50;
      const offset = Number(req.query.offset) || 0;
      const messages = await chatService.getMessages(userId, recipientId, limit, offset);
      res.status(200).json({ success: true, data: messages });
    } catch (err) {
      next(err);
    }
  },

  async sendMessage(req: Request, res: Response, next: NextFunction) {
    try {
      const senderId = req.user!.sub;
      const message = await chatService.sendMessage(senderId, req.body);
      res.status(201).json({ success: true, data: message });
    } catch (err) {
      next(err);
    }
  },
};
