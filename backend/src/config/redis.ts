/**
 * @file redis.ts
 * @description ioredis client singleton used for caching, sessions, and
 *              rate-limit state. A second client is exported for BullMQ
 *              worker/scheduler connections (ioredis requires separate
 *              connections for subscribers / blocking commands).
 */

import Redis from 'ioredis';
import { env } from './env';
import { logger } from './logger';

// ---------------------------------------------------------------------------
// Factory
// ---------------------------------------------------------------------------
const createRedisClient = (name: string, url: string): Redis => {
  const client = new Redis(url, {
    maxRetriesPerRequest: null,          // required by BullMQ
    enableReadyCheck: false,             // allows immediate use
    lazyConnect: true,
    connectionName: name,
  });

  client.on('connect', () =>
    logger.info(`✅  Redis [${name}] connected`),
  );
  client.on('ready', () =>
    logger.debug(`Redis [${name}] ready`),
  );
  client.on('error', (err: Error) =>
    logger.error(`❌  Redis [${name}] error`, { error: err.message }),
  );
  client.on('close', () =>
    logger.warn(`⚠️   Redis [${name}] connection closed`),
  );
  client.on('reconnecting', (delay: number) =>
    logger.debug(`Redis [${name}] reconnecting in ${delay}ms`),
  );

  return client;
};

// ---------------------------------------------------------------------------
// Singleton instances
// ---------------------------------------------------------------------------

/** General-purpose Redis client (cache, sessions, rate-limiting). */
export const redis = createRedisClient('cache', env.REDIS_URL);

/**
 * Dedicated Redis connection for BullMQ.
 * Falls back to REDIS_URL when BULLMQ_REDIS_URL is not set.
 */
export const bullRedis = createRedisClient(
  'bullmq',
  env.BULLMQ_REDIS_URL ?? env.REDIS_URL,
);

// ---------------------------------------------------------------------------
// Lifecycle helpers
// ---------------------------------------------------------------------------

/** Connect both Redis clients (call once at startup). */
export const connectRedis = async (): Promise<void> => {
  await Promise.all([redis.connect(), bullRedis.connect()]);
};

/** Gracefully disconnect all Redis clients. */
export const disconnectRedis = async (): Promise<void> => {
  await Promise.all([redis.quit(), bullRedis.quit()]);
  logger.info('🔌  Redis clients disconnected');
};
