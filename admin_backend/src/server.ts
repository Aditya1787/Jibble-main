/**
 * @file server.ts
 * @description HTTP server lifecycle for admin_backend.
 */

import http from 'http';
import { Application } from 'express';
import { env } from './config/env';
import { logger } from './config/logger';

export const startServer = (app: Application): http.Server => {
  const server = http.createServer(app);

  server.listen(env.PORT, () => {
    logger.info(`🚀  Jibble Admin Backend running on port ${env.PORT} [${env.NODE_ENV}]`);
    logger.info(`🔗  Health endpoint: http://localhost:${env.PORT}/api/v1/health`);
    logger.info(`🛡️  Admin API endpoint: http://localhost:${env.PORT}/api/v1/admin`);
  });

  const shutdown = (signal: string) => {
    logger.info(`Received ${signal}. Shutting down admin_backend gracefully...`);
    server.close(() => {
      logger.info('HTTP server closed.');
      process.exit(0);
    });
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));

  return server;
};
