/**
 * @file rbac.middleware.ts
 * @description Role-Based Access Control middleware.
 *              Usage: router.delete('/post/:id', authMiddleware, rbac('super_admin', 'college_ambassador'), handler)
 */

import { Request, Response, NextFunction } from 'express';
import { AppError } from './error.middleware';
import { UserRole } from '../utils/constants';

export const rbac =
  (...allowedRoles: UserRole[]) =>
  (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      return next(AppError.unauthorized());
    }

    const userRole = (req.user.role ?? UserRole.USER) as UserRole;

    // Super admin always passes
    if (userRole === UserRole.SUPER_ADMIN) {
      return next();
    }

    if (!allowedRoles.includes(userRole)) {
      return next(
        AppError.forbidden(
          `Access denied. Required role: ${allowedRoles.join(' or ')}`,
        ),
      );
    }

    next();
  };
