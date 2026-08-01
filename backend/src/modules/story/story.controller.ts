/**
 * @file story.controller.ts
 * @description Controller for story API endpoints.
 */

import { Request, Response, NextFunction } from 'express';
import { storyService } from './story.service';

export const storyController = {
  /**
   * Create a story.
   * POST /api/v1/stories
   */
  async createStory(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.sub;
      const story = await storyService.createStory(userId, req.body);
      res.status(201).json({
        success: true,
        data: story,
        error: null,
      });
    } catch (err) {
      next(err);
    }
  },

  /**
   * Get active stories feed.
   * GET /api/v1/stories/feed
   */
  async getFeedStories(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.sub;
      const feed = await storyService.getFeedStories(userId);
      res.status(200).json({
        success: true,
        data: feed,
        error: null,
      });
    } catch (err) {
      next(err);
    }
  },

  /**
   * Get active stories for target user.
   * GET /api/v1/stories/user/:userId
   */
  async getUserStories(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId } = req.params;
      const stories = await storyService.getUserStories(userId);
      res.status(200).json({
        success: true,
        data: stories,
        error: null,
      });
    } catch (err) {
      next(err);
    }
  },

  /**
   * Mark story as viewed.
   * POST /api/v1/stories/:id/view
   */
  async viewStory(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const result = await storyService.viewStory(id);
      res.status(200).json({
        success: true,
        data: result,
        error: null,
      });
    } catch (err) {
      next(err);
    }
  },

  /**
   * Delete story.
   * DELETE /api/v1/stories/:id
   */
  async deleteStory(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.sub;
      const { id } = req.params;
      const result = await storyService.deleteStory(id, userId);
      res.status(200).json({
        success: true,
        data: result,
        error: null,
      });
    } catch (err) {
      next(err);
    }
  },
};
