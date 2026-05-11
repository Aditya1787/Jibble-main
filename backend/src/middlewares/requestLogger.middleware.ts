/**
 * @file requestLogger.middleware.ts
 * @description Structured HTTP request/response logger middleware.
 *              Logs incoming request + outgoing response details (status,
 *              duration, user-agent) using the Winston logger.
 *              In development a compact one-liner is emitted; in production
 *              a full JSON object is logged.
 */

import { Request, Response, NextFunction } from 'express';
import { logger } from '../config/logger';
import { getCorrelationId } from '../config/requestContext';

export const requestLoggerMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const startHrTime = process.hrtime.bigint();

  // Log the incoming request
  logger.debug('→ Incoming request', {
    correlationId: getCorrelationId(),
    method: req.method,
    url: req.originalUrl,
    ip: req.ip,
    userAgent: req.get('user-agent'),
  });

  // Hook into response finish to log the result
  res.on('finish', () => {
    const durationMs = Number(process.hrtime.bigint() - startHrTime) / 1e6;

    const logMeta = {
      correlationId: getCorrelationId(),
      method: req.method,
      url: req.originalUrl,
      statusCode: res.statusCode,
      durationMs: parseFloat(durationMs.toFixed(2)),
      contentLength: res.get('content-length') ?? 0,
      ip: req.ip,
      userAgent: req.get('user-agent'),
    };

    const logLevel =
      res.statusCode >= 500
        ? 'error'
        : res.statusCode >= 400
          ? 'warn'
          : 'info';

    logger[logLevel](
      `← ${req.method} ${req.originalUrl} ${res.statusCode} [${durationMs.toFixed(1)}ms]`,
      logMeta,
    );
  });

  next();
};
