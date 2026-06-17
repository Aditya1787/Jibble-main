/**
 * @file college.controller.ts
 * @description Express handlers for /api/v1/colleges
 */

import { Request, Response, NextFunction } from 'express';
import { collegeService } from './college.service';
import { sendSuccess } from '../../utils/response';
import type { SearchCollegesInput } from './college.validation';

export const collegeController = {
  async search(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await collegeService.search(req.query as unknown as SearchCollegesInput);
      sendSuccess(res, result.colleges, 200, result.meta);
    } catch (err) {
      next(err);
    }
  },

  async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const college = await collegeService.getById(req.params.id);
      sendSuccess(res, { college });
    } catch (err) {
      next(err);
    }
  },
};
