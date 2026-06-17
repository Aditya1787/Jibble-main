/**
 * @file auth.constants.ts
 * @description Auth module constants.
 */

/** Access token lifetime in seconds (matches JWT_ACCESS_EXPIRES_IN = 15m) */
export const ACCESS_TOKEN_TTL = 15 * 60;

/** Refresh token lifetime in ms */
export const REFRESH_TOKEN_TTL_MS = 7 * 24 * 60 * 60 * 1000;

/** Min password length per PRD security rules */
export const MIN_PASSWORD_LENGTH = 8;

/** Cookie name for refresh token */
export const REFRESH_COOKIE = 'jibble_refresh';

/** Cookie options */
export const REFRESH_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict' as const,
  maxAge: REFRESH_TOKEN_TTL_MS,
  path: '/api/v1/auth',
};
