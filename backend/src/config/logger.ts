/**
 * @file logger.ts
 * @description Winston logger instance with structured JSON output for
 *              production and pretty-printed console output for development.
 *              Includes request-context-aware child-logger factory.
 */

import winston from 'winston';
import { env, isProduction } from './env';

const { combine, timestamp, errors, json, colorize, printf, splat } =
  winston.format;

// ---------------------------------------------------------------------------
// Custom dev format
// ---------------------------------------------------------------------------
const devFormat = printf(({ level, message, timestamp: ts, ...meta }) => {
  const metaStr = Object.keys(meta).length
    ? `\n${JSON.stringify(meta, null, 2)}`
    : '';
  return `${ts as string} [${level}] ${message as string}${metaStr}`;
});

// ---------------------------------------------------------------------------
// Transports
// ---------------------------------------------------------------------------
const transports: winston.transport[] = [
  new winston.transports.Console({
    format: isProduction
      ? combine(timestamp(), errors({ stack: true }), splat(), json())
      : combine(
          colorize({ all: true }),
          timestamp({ format: 'HH:mm:ss' }),
          errors({ stack: true }),
          splat(),
          devFormat,
        ),
  }),
];

// In production also persist to rotating files (optional — add
// winston-daily-rotate-file later if needed)
// if (isProduction) { ... }

// ---------------------------------------------------------------------------
// Root logger
// ---------------------------------------------------------------------------
export const logger = winston.createLogger({
  level: isProduction ? 'info' : 'debug',
  defaultMeta: { service: 'jibble-api', env: env.NODE_ENV },
  transports,
  exceptionHandlers: [
    new winston.transports.Console({ format: combine(timestamp(), json()) }),
  ],
  rejectionHandlers: [
    new winston.transports.Console({ format: combine(timestamp(), json()) }),
  ],
  exitOnError: false,
});

// ---------------------------------------------------------------------------
// Child-logger factory (attach per-request metadata)
// ---------------------------------------------------------------------------
export const createChildLogger = (
  meta: Record<string, unknown>,
): winston.Logger => logger.child(meta);
