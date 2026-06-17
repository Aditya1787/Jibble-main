/**
 * @file profile.controller.ts
 * @description Express handlers for /api/v1/profiles
 */

import { Request, Response, NextFunction } from 'express';
import { profileService } from './profile.service';
import { sendSuccess, sendCreated } from '../../utils/response';
import type { CreateProfileInput, UpdateProfileInput } from './profile.validation';

export const profileController = {
  async createMyProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const dto = req.body as CreateProfileInput;
      const profile = await profileService.createProfile({
        ...dto,
        userId: req.user!.sub,
      });
      sendCreated(res, { profile });
    } catch (err) {
      next(err);
    }
  },

  async getMyProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const profile = await profileService.getMyProfile(req.user!.sub);
      sendSuccess(res, { profile });
    } catch (err) {
      next(err);
    }
  },

  async updateMyProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const dto = req.body as UpdateProfileInput;
      const profile = await profileService.updateProfile(req.user!.sub, dto);
      sendSuccess(res, { profile });
    } catch (err) {
      next(err);
    }
  },

  async getProfileByUsername(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const profile = await profileService.getProfileByUsername(req.params.username);
      sendSuccess(res, { profile });
    } catch (err) {
      next(err);
    }
  },

  async checkUsernameAvailable(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const username = req.params.username;
      const available = await profileService.checkUsernameAvailable(username);
      sendSuccess(res, { available });
    } catch (err) {
      next(err);
    }
  },
};
