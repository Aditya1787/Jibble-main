/**
 * @file health.route.ts
 * @description Health-check endpoint: GET /api/v1/health
 *              Returns service liveness status and basic diagnostics.
 *              Checks PostgreSQL (via Prisma) and Redis connectivity.
 */

import { Router, Request, Response } from 'express';
import { prisma } from '../../config/db';
import { redis } from '../../config/redis';
import { env } from '../../config/env';
import { logger } from '../../config/logger';

export const healthRouter = Router();

interface ServiceStatus {
  status: 'ok' | 'degraded' | 'down';
  latencyMs?: number;
  error?: string;
}

interface HealthPayload {
  status: 'ok' | 'degraded';
  version: string;
  environment: string;
  timestamp: string;
  uptime: number;
  services: {
    database: ServiceStatus;
    redis: ServiceStatus;
  };
}

const pingDatabase = async (): Promise<ServiceStatus> => {
  const start = Date.now();
  try {
    await prisma.$queryRaw`SELECT 1`;
    return { status: 'ok', latencyMs: Date.now() - start };
  } catch (err) {
    logger.warn('Health: DB ping failed', { error: err });
    return {
      status: 'down',
      latencyMs: Date.now() - start,
      error: (err as Error).message,
    };
  }
};

const pingRedis = async (): Promise<ServiceStatus> => {
  const start = Date.now();
  try {
    const pong = await redis.ping();
    if (pong !== 'PONG') throw new Error('Unexpected PING response');
    return { status: 'ok', latencyMs: Date.now() - start };
  } catch (err) {
    logger.warn('Health: Redis ping failed', { error: err });
    return {
      status: 'down',
      latencyMs: Date.now() - start,
      error: (err as Error).message,
    };
  }
};

/**
 * GET /api/v1/health
 * Returns 200 when all services are healthy, 503 when any service is down.
 */
healthRouter.get('/', async (_req: Request, res: Response): Promise<void> => {
  const [database, redisStatus] = await Promise.all([
    pingDatabase(),
    pingRedis(),
  ]);

  const allHealthy =
    database.status === 'ok' && redisStatus.status === 'ok';

  const payload: HealthPayload = {
    status: allHealthy ? 'ok' : 'degraded',
    version: process.env['npm_package_version'] ?? '1.0.0',
    environment: env.NODE_ENV,
    timestamp: new Date().toISOString(),
    uptime: Math.floor(process.uptime()),
    services: {
      database,
      redis: redisStatus,
    },
  };

  res.status(allHealthy ? 200 : 503).json(payload);
});
