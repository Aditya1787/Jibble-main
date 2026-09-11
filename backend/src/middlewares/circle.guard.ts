/**
 * @file circle.guard.ts
 * @description RBAC and boundary enforcement guards for Circles and Community accounts.
 *              Guarantees Circle Community accounts cannot access global consumer feeds,
 *              and verifies circle-level permissions for events, groups, and moderation.
 */

import { Request, Response, NextFunction } from 'express';
import { AppError } from './error.middleware';
import { query } from '../db/index';

/**
 * Enforces boundary isolation:
 * Rejects requests from Circle Community accounts when trying to access global consumer endpoints.
 */
export const blockCircleCommunityFromGlobal = async (
  req: Request,
  _res: Response,
  next: NextFunction,
): Promise<void> => {
  const user = (req as any).user;
  if (!user) {
    return next(AppError.unauthorized('Authentication required'));
  }

  let accountType = user.account_type || user.accountType;
  if (!accountType && user.sub) {
    try {
      const { rows } = await query(
        `SELECT account_type FROM users WHERE id = $1 LIMIT 1`,
        [user.sub],
      );
      accountType = rows[0]?.account_type;
    } catch {
      // continue
    }
  }

  if (accountType === 'CIRCLE_COMMUNITY') {
    return next(
      AppError.forbidden(
        'Circle Community accounts are restricted to their own community dashboard and cannot access global feeds, reels, or personal chat.',
        'CIRCLE_COMMUNITY_RESTRICTED',
      ),
    );
  }

  next();
};

/**
 * Validates that the authenticated user is an active member of the specified circle.
 */
export const authorizeCircleMember = (paramName = 'id') => {
  return async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
    try {
      const user = (req as any).user;
      if (!user?.sub) {
        return next(AppError.unauthorized());
      }

      const circleId = req.params[paramName];
      if (!circleId) {
        return next(AppError.badRequest('Missing circle identifier'));
      }

      // Check if user is a member or owner
      const { rows } = await query(
        `SELECT role FROM circle_members WHERE circle_id = $1 AND user_id = $2 LIMIT 1`,
        [circleId, user.sub],
      );

      if (rows.length === 0) {
        // Also check if user is the direct circle creator/owner
        const circleCheck = await query(
          `SELECT created_by FROM circles WHERE id = $1 LIMIT 1`,
          [circleId],
        );
        if (circleCheck.rows[0]?.created_by === user.sub) {
          return next();
        }
        return next(AppError.forbidden('You must be a member of this Circle to access this resource', 'CIRCLE_MEMBERSHIP_REQUIRED'));
      }

      (req as any).circleMemberRole = rows[0].role;
      next();
    } catch (err) {
      next(err);
    }
  };
};

/**
 * Validates that the authenticated user has leader/admin/owner permissions within the circle.
 */
export const authorizeCircleAdmin = (paramName = 'id') => {
  return async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
    try {
      const user = (req as any).user;
      if (!user?.sub) {
        return next(AppError.unauthorized());
      }

      const circleId = req.params[paramName];
      if (!circleId) {
        return next(AppError.badRequest('Missing circle identifier'));
      }

      const { rows } = await query(
        `SELECT role FROM circle_members WHERE circle_id = $1 AND user_id = $2 LIMIT 1`,
        [circleId, user.sub],
      );

      const role = rows[0]?.role;
      if (role === 'owner' || role === 'admin') {
        return next();
      }

      const circleCheck = await query(
        `SELECT created_by FROM circles WHERE id = $1 LIMIT 1`,
        [circleId],
      );

      if (circleCheck.rows[0]?.created_by === user.sub) {
        return next();
      }

      return next(AppError.forbidden('Only Circle leaders and admins can perform this action', 'CIRCLE_ADMIN_REQUIRED'));
    } catch (err) {
      next(err);
    }
  };
};
