/**
 * @file post.controller.ts
 * @description Controller handlers mapping incoming request parameters to postService.
 */

import { Request, Response, NextFunction } from 'express';
import { postService } from './post.service';

export const postController = {
  /**
   * Create a post.
   * POST /api/v1/posts
   */
  async createPost(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.sub;
      const post = await postService.createPost(userId, req.body);
      res.status(201).json({
        success: true,
        data: post,
        error: null,
      });
    } catch (err) {
      next(err);
    }
  },

  /**
   * Get post by ID.
   * GET /api/v1/posts/:id
   */
  async getPostById(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.sub;
      const { id } = req.params;
      const post = await postService.getPostById(id, userId);
      res.status(200).json({
        success: true,
        data: post,
        error: null,
      });
    } catch (err) {
      next(err);
    }
  },

  /**
   * Get home feed.
   * GET /api/v1/posts/feed
   */
  async getHomeFeed(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.sub;
      const { limit, offset } = req.query as any;
      const feed = await postService.getHomeFeed(userId, limit, offset);
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
   * Get target user posts.
   * GET /api/v1/posts/user/:username
   */
  async getUserPosts(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.sub;
      const { username } = req.params;
      const { limit, offset } = req.query as any;
      const posts = await postService.getUserPosts(userId, username, limit, offset);
      res.status(200).json({
        success: true,
        data: posts,
        error: null,
      });
    } catch (err) {
      next(err);
    }
  },

  /**
   * Delete a post.
   * DELETE /api/v1/posts/:id
   */
  async deletePost(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.sub;
      const { id } = req.params;
      const result = await postService.deletePost(id, userId);
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
   * Toggle like.
   * POST /api/v1/posts/:id/like
   */
  async toggleLike(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.sub;
      const { id } = req.params;
      const result = await postService.toggleLike(userId, id);
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
