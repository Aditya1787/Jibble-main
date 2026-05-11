/**
 * @file types/express.d.ts
 * @description Augments Express's `Request` and `Response.locals` interfaces
 *              with application-specific fields set by middlewares.
 */

import 'express';

declare global {
  namespace Express {
    interface Request {
      /** Authenticated user ID (set by auth middleware after JWT verification) */
      userId?: string;
      /** Authenticated user role (set by auth middleware) */
      userRole?: string;
    }

    interface Locals {
      /** Correlation / request-trace ID */
      correlationId: string;
    }
  }
}
