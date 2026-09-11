/**
 * @file circle.controller.ts
 * @description Controller handlers mapping incoming HTTP requests to circleService.
 */

import { Request, Response, NextFunction } from 'express';
import { circleService } from './circle.service';

export const circleController = {
  /**
   * Request creation of a new circle/community.
   * POST /api/v1/circles
   */
  async requestCircle(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.sub;
      const circle = await circleService.requestCircle(userId, req.body);
      res.status(201).json({
        success: true,
        data: circle,
        error: null,
      });
    } catch (err) {
      next(err);
    }
  },

  /**
   * Get active circle configuration for authenticated user (enabled tabs/features & user role).
   * GET /api/v1/circles/user/config
   */
  async getUserCircleConfig(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.sub;
      const { circleId } = req.query as { circleId?: string };
      const config = await circleService.getUserCircleConfig(userId, circleId);
      res.status(200).json({
        success: true,
        data: config,
        error: null,
      });
    } catch (err) {
      next(err);
    }
  },

  /**
   * List all pending circles for admin review.
   * GET /api/v1/circles/admin/pending
   */
  async getPendingCircles(req: Request, res: Response, next: NextFunction) {
    try {
      const circles = await circleService.getPendingCircles();
      res.status(200).json({
        success: true,
        data: circles,
        error: null,
      });
    } catch (err) {
      next(err);
    }
  },

  /**
   * Approve a pending circle (Admin).
   * POST /api/v1/circles/:id/approve
   */
  async approveCircle(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const circle = await circleService.approveCircle(id);
      res.status(200).json({
        success: true,
        data: circle,
        error: null,
      });
    } catch (err) {
      next(err);
    }
  },

  /**
   * Reject a pending circle (Admin).
   * POST /api/v1/circles/:id/reject
   */
  async rejectCircle(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { reason } = req.body;
      const circle = await circleService.rejectCircle(id, reason);
      res.status(200).json({
        success: true,
        data: circle,
        error: null,
      });
    } catch (err) {
      next(err);
    }
  },

  /**
   * Get circle by ID.
   * GET /api/v1/circles/:id
   */
  async getCircleById(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.sub;
      const { id } = req.params;
      const circle = await circleService.getCircleById(id, userId);
      res.status(200).json({
        success: true,
        data: circle,
        error: null,
      });
    } catch (err) {
      next(err);
    }
  },

  /**
   * Join a circle.
   * POST /api/v1/circles/:id/join
   */
  async joinCircle(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.sub;
      const { id } = req.params;
      const result = await circleService.joinCircle(id, userId);
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
   * Leave a circle.
   * DELETE /api/v1/circles/:id/leave
   */
  async leaveCircle(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.sub;
      const { id } = req.params;
      const result = await circleService.leaveCircle(id, userId);
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
   * Get component toggles for a circle.
   * GET /api/v1/circles/:id/components
   */
  async getCircleComponents(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const components = await circleService.getCircleComponents(id);
      res.status(200).json({
        success: true,
        data: components,
        error: null,
      });
    } catch (err) {
      next(err);
    }
  },

  /**
   * Toggle or configure a component for a circle (Owner/Admin).
   * PATCH /api/v1/circles/:id/components/:key
   */
  async toggleComponent(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.sub;
      const { id, key } = req.params;
      const updatedComponent = await circleService.toggleComponent(id, userId, key, req.body);
      res.status(200).json({
        success: true,
        data: updatedComponent,
        error: null,
      });
    } catch (err) {
      next(err);
    }
  },

  /**
   * Get list of all 10 component templates available.
   * GET /api/v1/circles/templates/all
   */
  async getComponentTemplates(_req: Request, res: Response, next: NextFunction) {
    try {
      const templates = await circleService.getComponentTemplates();
      res.status(200).json({
        success: true,
        data: templates,
        error: null,
      });
    } catch (err) {
      next(err);
    }
  },

  /**
   * Aggregated Circle Home endpoint.
   * GET /api/v1/circles/:id/home
   */
  async getCircleHome(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const userId = req.user!.sub;
      const { circleHubService } = await import('./circle.hub.service');
      const data = await circleHubService.getCircleHome(id, userId);
      res.status(200).json({
        success: true,
        data,
        error: null,
      });
    } catch (err) {
      next(err);
    }
  },

  /**
   * Create an event with redirect join link.
   * POST /api/v1/circles/:id/events
   */
  async createCircleEvent(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const userId = req.user!.sub;
      const { circleHubService } = await import('./circle.hub.service');
      const event = await circleHubService.createEvent(id, userId, req.body);
      res.status(201).json({
        success: true,
        data: event,
        error: null,
      });
    } catch (err) {
      next(err);
    }
  },

  /**
   * Create an anonymous post in circle feed.
   * POST /api/v1/circles/:id/anonymous
   */
  async createAnonymousPost(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const userId = req.user!.sub;
      const { circleHubService } = await import('./circle.hub.service');
      const post = await circleHubService.createAnonymousPost(id, userId, req.body);
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
   * Create a sub-group within circle.
   * POST /api/v1/circles/:id/groups
   */
  async createCircleGroup(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const userId = req.user!.sub;
      const { circleHubService } = await import('./circle.hub.service');
      const group = await circleHubService.createGroup(id, userId, req.body);
      res.status(201).json({
        success: true,
        data: group,
        error: null,
      });
    } catch (err) {
      next(err);
    }
  },

  /**
   * Get messages inside a circle group.
   * GET /api/v1/circles/:id/groups/:groupId/messages
   */
  async getGroupMessages(req: Request, res: Response, next: NextFunction) {
    try {
      const { groupId } = req.params;
      const { circleHubService } = await import('./circle.hub.service');
      const messages = await circleHubService.getGroupMessages(groupId);
      res.status(200).json({
        success: true,
        data: messages,
        error: null,
      });
    } catch (err) {
      next(err);
    }
  },

  /**
   * Send a message to a circle group chat.
   * POST /api/v1/circles/:id/groups/:groupId/messages
   */
  async sendGroupMessage(req: Request, res: Response, next: NextFunction) {
    try {
      const { groupId } = req.params;
      const userId = req.user!.sub;
      const { circleHubService } = await import('./circle.hub.service');
      const message = await circleHubService.sendGroupMessage(groupId, userId, req.body);
      res.status(201).json({
        success: true,
        data: message,
        error: null,
      });
    } catch (err) {
      next(err);
    }
  },
};
