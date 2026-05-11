/**
 * @file app.ts
 * @description Express application factory.
 *              Registers global middlewares and mounts all API routes.
 *              Does NOT start the HTTP server (that lives in server.ts).
 */

import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import cookieParser from 'cookie-parser';

import { env } from './config/env';
import { correlationMiddleware } from './middlewares/correlation.middleware';
import { requestLoggerMiddleware } from './middlewares/requestLogger.middleware';
import { errorMiddleware } from './middlewares/error.middleware';
import { v1Router } from './api/v1/index';

export const createApp = (): Application => {
  const app = express();

  // ── Trust proxy (required behind load balancers / Nginx) ─────────────────
  app.set('trust proxy', 1);

  // ── Security headers ──────────────────────────────────────────────────────
  app.use(helmet());

  // ── CORS ─────────────────────────────────────────────────────────────────
  app.use(
    cors({
      origin: env.CLIENT_BASE_URL,
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: [
        'Content-Type',
        'Authorization',
        'X-Correlation-Id',
        'X-Request-Id',
      ],
      exposedHeaders: ['X-Correlation-Id'],
    }),
  );

  // ── Correlation ID + async context (must be early) ────────────────────────
  app.use(correlationMiddleware);

  // ── Request logger ────────────────────────────────────────────────────────
  app.use(requestLoggerMiddleware);

  // ── Body parsers ──────────────────────────────────────────────────────────
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));
  app.use(cookieParser());

  // ── Compression ───────────────────────────────────────────────────────────
  app.use(compression());

  // ── API routes ────────────────────────────────────────────────────────────
  app.use('/api/v1', v1Router);

  // ── 404 catch-all ─────────────────────────────────────────────────────────
  app.use((_req: Request, res: Response) => {
    res.status(404).json({
      success: false,
      error: {
        code: 'NOT_FOUND',
        message: 'The requested route does not exist',
        timestamp: new Date().toISOString(),
      },
    });
  });

  // ── Global error handler (must be last, 4-arg signature) ──────────────────
  app.use(errorMiddleware);

  return app;
};
