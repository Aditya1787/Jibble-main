/**
 * @file server.ts
 * @description Creates the HTTP server and attaches Socket.io.
 *              Exports `httpServer` so the entrypoint can call `.listen()`.
 */

import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import { createApp } from './app';
import { env } from './config/env';
import { logger } from './config/logger';

// ---------------------------------------------------------------------------
// HTTP server
// ---------------------------------------------------------------------------
const app = createApp();
export const httpServer = http.createServer(app);

// ---------------------------------------------------------------------------
// Socket.io
// ---------------------------------------------------------------------------
export const io = new SocketIOServer(httpServer, {
  cors: {
    origin: env.CLIENT_BASE_URL,
    methods: ['GET', 'POST'],
    credentials: true,
  },
  transports: ['websocket', 'polling'],
  pingInterval: 25_000,
  pingTimeout: 20_000,
});

io.on('connection', (socket) => {
  logger.debug('Socket connected', { socketId: socket.id });

  socket.on('disconnect', (reason) => {
    logger.debug('Socket disconnected', { socketId: socket.id, reason });
  });
});

// ---------------------------------------------------------------------------
// Graceful shutdown handler
// ---------------------------------------------------------------------------
export const gracefulShutdown = async (
  signal: string,
  onShutdown: () => Promise<void>,
): Promise<void> => {
  logger.info(`Received ${signal} — starting graceful shutdown`);

  await new Promise<void>((resolve, reject) => {
    httpServer.close((err) => {
      if (err) reject(err);
      else resolve();
    });
  });

  logger.info('HTTP server closed');
  await onShutdown();
  logger.info('Graceful shutdown complete');
  process.exit(0);
};
