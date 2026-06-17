/**
 * @file auth.repository.ts
 * @description Database operations for authentication:
 *              - store/verify/revoke refresh tokens
 *              - find user by email for login checks
 */

import { query } from '../../db/index';
import { hashToken, compareToken } from '../../utils/crypto';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface UserAuthRow {
  id: string;
  email: string | null;
  phone: string | null;
  password_hash: string | null;
  provider: string;
  status: string;
  email_verified: boolean;
  refresh_token: string | null;
  created_at: string;
  updated_at: string;
}

// ─── Repository ───────────────────────────────────────────────────────────────

export const authRepository = {
  /**
   * Find a user by email (for login).
   */
  async findByEmail(email: string): Promise<UserAuthRow | null> {
    const { rows } = await query(
      'SELECT id, email, phone, password_hash, provider, status, email_verified, refresh_token, created_at, updated_at FROM users WHERE email = $1 LIMIT 1',
      [email.toLowerCase()],
    );
    return rows[0] ?? null;
  },

  /**
   * Store a hashed refresh token on the user record.
   * Per PRD: "Refresh token with short-lived access token mechanism".
   */
  async storeRefreshToken(userId: string, rawToken: string): Promise<void> {
    const hashed = await hashToken(rawToken);
    await query(
      'UPDATE users SET refresh_token = $1, updated_at = NOW() WHERE id = $2',
      [hashed, userId],
    );
  },

  /**
   * Verify that a raw refresh token matches what's stored.
   */
  async verifyRefreshToken(userId: string, rawToken: string): Promise<boolean> {
    const { rows } = await query(
      'SELECT refresh_token FROM users WHERE id = $1 LIMIT 1',
      [userId],
    );
    const stored = rows[0]?.refresh_token;
    if (!stored) return false;
    return compareToken(rawToken, stored);
  },

  /**
   * Revoke all refresh tokens for a user (logout all devices).
   */
  async revokeRefreshToken(userId: string): Promise<void> {
    await query(
      'UPDATE users SET refresh_token = NULL, updated_at = NOW() WHERE id = $1',
      [userId],
    );
  },

  /**
   * Update last_login_at timestamp.
   */
  async updateLastLogin(userId: string): Promise<void> {
    await query(
      'UPDATE users SET last_login_at = NOW(), updated_at = NOW() WHERE id = $1',
      [userId],
    );
  },

  /**
   * Mark email as verified.
   */
  async markEmailVerified(userId: string): Promise<void> {
    await query(
      "UPDATE users SET email_verified = TRUE, status = 'active', updated_at = NOW() WHERE id = $1",
      [userId],
    );
  },
};
