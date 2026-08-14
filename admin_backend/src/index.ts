/**
 * @file index.ts
 * @description Entry point for Jibble Admin Backend.
 */

import { createApp } from './app';
import { startServer } from './server';
import { logger } from './config/logger';
import { autoSeedDatabase } from './modules/admin/admin.service';

async function bootstrap() {
  try {
    const app = createApp();
    startServer(app);
  } catch (err) {
    logger.error('Failed to start admin_backend:', err);
    process.exit(1);
  }
}

bootstrap();
