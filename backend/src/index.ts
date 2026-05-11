/**
 * @file index.ts
 * @description Application entrypoint.
 *              1. Validates environment (env.ts runs on import)
 *              2. Connects PostgreSQL and Redis
 *              3. Starts the HTTP server
 *              4. Registers SIGTERM / SIGINT graceful shutdown handlers
 */

import { env } from './config/env';
import { logger } from './config/logger';
import { connectDB, disconnectDB } from './config/db';
import { connectRedis, disconnectRedis } from './config/redis';
import { httpServer, gracefulShutdown } from './server';

const PORT = env.PORT;

const start = async (): Promise<void> => {
  // ── 1. Connect infrastructure ──────────────────────────────────────────
  await connectDB();
  await connectRedis();

  // ── 2. Start listening ────────────────────────────────────────────────
  httpServer.listen(PORT, () => {
    logger.info(`🚀  Jibble API listening`, {
      port: PORT,
      env: env.NODE_ENV,
      pid: process.pid,
    });
  });
};

// ---------------------------------------------------------------------------
// Shutdown handler factory
// ---------------------------------------------------------------------------
const makeShutdownHandler = (signal: string) => async (): Promise<void> => {
  await gracefulShutdown(signal, async () => {
    await disconnectDB();
    await disconnectRedis();
  });
};

process.on('SIGTERM', makeShutdownHandler('SIGTERM'));
process.on('SIGINT',  makeShutdownHandler('SIGINT'));

// Catch unhandled promise rejections (Winston also handles these, belt + braces)
process.on('unhandledRejection', (reason: unknown) => {
  logger.error('Unhandled promise rejection', { reason });
  // Let the process exit — a process manager (PM2, Docker) will restart it
  process.exit(1);
});

process.on('uncaughtException', (err: Error) => {
  logger.error('Uncaught exception', { error: err.message, stack: err.stack });
  process.exit(1);
});

// ── Boot ──────────────────────────────────────────────────────────────────
start().catch((err: unknown) => {
  logger.error('Failed to start server', { error: err });
  process.exit(1);
});
