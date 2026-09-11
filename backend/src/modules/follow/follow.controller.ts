/**
 * @file follow.controller.ts
 * @description Controller actions for social graph operations.
 */

import { Request, Response, NextFunction } from 'express';
import { followService } from './follow.service';

export const followController = {
  async follow(req: Request, res: Response, next: NextFunction) {
    try {
      const followerId = req.user!.sub;
      const { userId } = req.params;
      const result = await followService.follow(followerId, userId);
      res.status(200).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  },

  async unfollow(req: Request, res: Response, next: NextFunction) {
    try {
      const followerId = req.user!.sub;
      const { userId } = req.params;
      const result = await followService.unfollow(followerId, userId);
      res.status(200).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  },

  async isFollowing(req: Request, res: Response, next: NextFunction) {
    try {
      const followerId = req.user!.sub;
      const { userId } = req.params;
      const result = await followService.isFollowing(followerId, userId);
      res.status(200).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  },

  async getFollowers(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId } = req.params;
      const limit = Number(req.query.limit) || 20;
      const offset = Number(req.query.offset) || 0;
      const followers = await followService.getFollowers(userId, limit, offset);
      res.status(200).json({ success: true, data: followers });
    } catch (err) {
      next(err);
    }
  },

  async getFollowing(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId } = req.params;
      const limit = Number(req.query.limit) || 20;
      const offset = Number(req.query.offset) || 0;
      const following = await followService.getFollowing(userId, limit, offset);
      res.status(200).json({ success: true, data: following });
    } catch (err) {
      next(err);
    }
  },
};
