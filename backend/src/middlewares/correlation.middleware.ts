/**
 * @file correlation.middleware.ts
 * @description Assigns a unique UUID v4 correlationId to every incoming
 *              request and stores it in:
 *                1. The AsyncLocalStorage request context (for logger usage)
 *                2. The response header `X-Correlation-Id` (for tracing)
 *                3. `res.locals.correlationId` (for downstream middlewares)
 */

import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { runWithContext } from '../config/requestContext';

export const correlationMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  // Honour an upstream-provided ID (e.g. from an API gateway / load balancer)
  const correlationId =
    (req.headers['x-correlation-id'] as string | undefined) ??
    (req.headers['x-request-id'] as string | undefined) ??
    uuidv4();

  // Expose in response so clients / proxies can correlate logs
  res.setHeader('X-Correlation-Id', correlationId);
  res.locals['correlationId'] = correlationId;

  // Run the rest of the request pipeline inside the async context
  runWithContext(
    {
      correlationId,
      userId: null,           // populated later by auth middleware
      startedAt: new Date().toISOString(),
      method: req.method,
      path: req.path,
    },
    next,
  );
};
