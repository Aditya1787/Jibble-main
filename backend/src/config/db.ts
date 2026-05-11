/**
 * @file db.ts
 * @description Prisma Client singleton.
 *              Reuses a single instance across hot-reloads in development
 *              (stored on the global object) to avoid "too many connections".
 */

import { PrismaClient } from '@prisma/client';
import { env, isProduction } from './env';
import { logger } from './logger';

// ---------------------------------------------------------------------------
// Prisma log levels by environment
// ---------------------------------------------------------------------------
type PrismaLog =
  | { emit: 'stdout'; level: 'query' }
  | { emit: 'stdout'; level: 'info' }
  | { emit: 'stdout'; level: 'warn' }
  | { emit: 'stdout'; level: 'error' };

const logLevels: PrismaLog[] = isProduction
  ? [
      { emit: 'stdout', level: 'warn' },
      { emit: 'stdout', level: 'error' },
    ]
  : [
      { emit: 'stdout', level: 'query' },
      { emit: 'stdout', level: 'info' },
      { emit: 'stdout', level: 'warn' },
      { emit: 'stdout', level: 'error' },
    ];

// ---------------------------------------------------------------------------
// Singleton helper (dev hot-reload safe)
// ---------------------------------------------------------------------------
declare global {
  // eslint-disable-next-line no-var
  var __prisma: PrismaClient | undefined;
}

const createPrismaClient = (): PrismaClient =>
  new PrismaClient({
    datasources: { db: { url: env.DATABASE_URL } },
    log: logLevels,
  });

export const prisma: PrismaClient =
  global.__prisma ?? createPrismaClient();

if (!isProduction) {
  global.__prisma = prisma;
}

// ---------------------------------------------------------------------------
// Graceful connect / disconnect helpers
// ---------------------------------------------------------------------------

/** Connect to the database (call once at startup). */
export const connectDB = async (): Promise<void> => {
  try {
    await prisma.$connect();
    logger.info('✅  PostgreSQL connected via Prisma');
  } catch (err) {
    logger.error('❌  PostgreSQL connection failed', { error: err });
    throw err;
  }
};

/** Disconnect from the database (call in shutdown handlers). */
export const disconnectDB = async (): Promise<void> => {
  await prisma.$disconnect();
  logger.info('🔌  PostgreSQL disconnected');
};
