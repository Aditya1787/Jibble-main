/**
 * @file api/v1/health.route.ts
 * @description Health check endpoint for admin_backend.
 */

import { Router, Request, Response } from 'express';

export const healthRouter = Router();

healthRouter.get('/', (_req: Request, res: Response) => {
  res.status(200).json({
    status: 'ok',
    service: 'admin_backend',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});
