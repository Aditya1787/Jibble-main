/**
 * @file response.ts
 * @description Standard API response helpers — every endpoint uses these.
 *              Shape matches TRD spec: { success, data, error }
 */

import { Response } from 'express';

// ─── Types ───────────────────────────────────────────────────────────────────

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: null | { code: string; message: string; details?: unknown };
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    hasNext?: boolean;
  };
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

export const sendSuccess = <T>(
  res: Response,
  data: T,
  statusCode = 200,
  meta?: ApiResponse['meta'],
): Response =>
  res.status(statusCode).json({
    success: true,
    data,
    error: null,
    ...(meta ? { meta } : {}),
  });

export const sendCreated = <T>(res: Response, data: T): Response =>
  sendSuccess(res, data, 201);

export const sendNoContent = (res: Response): Response =>
  res.status(204).end();

export const sendError = (
  res: Response,
  statusCode: number,
  code: string,
  message: string,
  details?: unknown,
): Response =>
  res.status(statusCode).json({
    success: false,
    data: null,
    error: { code, message, ...(details ? { details } : {}) },
  });
