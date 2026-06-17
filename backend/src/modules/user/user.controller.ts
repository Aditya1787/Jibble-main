/**
 * @file user.controller.ts
 * @description Express handlers for /api/v1/users
 */

import { Request, Response, NextFunction } from 'express';
import { userService } from './user.service';
import { sendSuccess, sendNoContent } from '../../utils/response';

export const userController = {
  async getMe(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = await userService.getById(req.user!.sub);
      sendSuccess(res, { user });
    } catch (err) {
      next(err);
    }
  },

  async deleteAccount(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await userService.deleteAccount(req.user!.sub);
      sendNoContent(res);
    } catch (err) {
      next(err);
    }
  },
};
