/**
 * @file crypto.ts
 * @description Hashing (bcrypt) and JWT sign/verify utilities.
 *              All crypto logic lives here so modules don't import jwt/bcrypt directly.
 */

import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';

// ── Constants ─────────────────────────────────────────────────────────────────
const SALT_ROUNDS = 12;

// ─── Password ────────────────────────────────────────────────────────────────

export const hashPassword = (plain: string): Promise<string> =>
  bcrypt.hash(plain, SALT_ROUNDS);

export const comparePassword = (plain: string, hash: string): Promise<boolean> =>
  bcrypt.compare(plain, hash);

// ─── JWT ─────────────────────────────────────────────────────────────────────

export interface JwtPayload {
  sub: string;       // user UUID
  email?: string;
  role?: string;
  type: 'access' | 'refresh';
  iat?: number;
  exp?: number;
}

export const signAccessToken = (payload: Omit<JwtPayload, 'type' | 'iat' | 'exp'>): string =>
  jwt.sign(
    { ...payload, type: 'access' },
    env.JWT_ACCESS_SECRET,
    { expiresIn: env.JWT_ACCESS_EXPIRES_IN } as jwt.SignOptions,
  );

export const signRefreshToken = (payload: Omit<JwtPayload, 'type' | 'iat' | 'exp'>): string =>
  jwt.sign(
    { ...payload, type: 'refresh' },
    env.JWT_REFRESH_SECRET,
    { expiresIn: env.JWT_REFRESH_EXPIRES_IN } as jwt.SignOptions,
  );

export const verifyAccessToken = (token: string): JwtPayload =>
  jwt.verify(token, env.JWT_ACCESS_SECRET) as JwtPayload;

export const verifyRefreshToken = (token: string): JwtPayload =>
  jwt.verify(token, env.JWT_REFRESH_SECRET) as JwtPayload;

// ─── Refresh token hashing (stored hashed in DB) ─────────────────────────────

export const hashToken = (token: string): Promise<string> =>
  bcrypt.hash(token, 10);

export const compareToken = (token: string, hash: string): Promise<boolean> =>
  bcrypt.compare(token, hash);
