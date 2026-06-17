/**
 * @file auth.controller.ts
 * @description Express route handlers for /api/v1/auth
 */

import { Request, Response, NextFunction } from 'express';
import { authService } from './auth.service';
import { sendSuccess, sendCreated, sendNoContent } from '../../utils/response';
import { REFRESH_COOKIE, REFRESH_COOKIE_OPTIONS } from './auth.constants';
import type { SignupInput, LoginInput } from './auth.validation';

export const authController = {
  /**
   * POST /api/v1/auth/signup
   */
  async signup(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const dto = req.body as SignupInput;
      const result = await authService.signup(dto);

      // Set refresh token as httpOnly cookie
      res.cookie(REFRESH_COOKIE, result.tokens.refreshToken, REFRESH_COOKIE_OPTIONS);

      sendCreated(res, {
        user: result.user,
        accessToken: result.tokens.accessToken,
        expiresIn: result.tokens.expiresIn,
      });
    } catch (err) {
      next(err);
    }
  },

  /**
   * POST /api/v1/auth/login
   */
  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const dto = req.body as LoginInput;
      const result = await authService.login(dto);

      res.cookie(REFRESH_COOKIE, result.tokens.refreshToken, REFRESH_COOKIE_OPTIONS);

      sendSuccess(res, {
        user: result.user,
        accessToken: result.tokens.accessToken,
        expiresIn: result.tokens.expiresIn,
      });
    } catch (err) {
      next(err);
    }
  },

  /**
   * POST /api/v1/auth/refresh
   * Reads refresh token from cookie or request body.
   */
  async refresh(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const rawToken: string | undefined =
        req.cookies?.[REFRESH_COOKIE] ?? req.body?.refreshToken;

      if (!rawToken) {
        res.status(401).json({
          success: false,
          error: { code: 'MISSING_REFRESH_TOKEN', message: 'No refresh token provided' },
        });
        return;
      }

      const tokens = await authService.refreshTokens(rawToken);

      res.cookie(REFRESH_COOKIE, tokens.refreshToken, REFRESH_COOKIE_OPTIONS);

      sendSuccess(res, {
        accessToken: tokens.accessToken,
        expiresIn: tokens.expiresIn,
      });
    } catch (err) {
      next(err);
    }
  },

  /**
   * POST /api/v1/auth/logout
   */
  async logout(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (req.user?.sub) {
        await authService.logout(req.user.sub);
      }

      res.clearCookie(REFRESH_COOKIE, { path: '/api/v1/auth' });
      sendNoContent(res);
    } catch (err) {
      next(err);
    }
  },

  /**
   * GET /api/v1/auth/me
   */
  async me(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = await authService.getMe(req.user!.sub);
      sendSuccess(res, { user });
    } catch (err) {
      next(err);
    }
  },
};
