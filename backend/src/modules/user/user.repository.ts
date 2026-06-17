/**
 * @file user.repository.ts
 * @description Database operations for users table.
 *              Used by: auth.service, profile module, etc.
 */

import { query } from '../../db/index';
import { UserRow, CreateUserDto, UpdateUserDto } from './user.types';

export const userRepository = {
  /**
   * Create a new user record.
   */
  async create(dto: CreateUserDto): Promise<UserRow> {
    const { rows } = await query(
      `INSERT INTO users (email, phone, password_hash, provider, provider_id, status)
       VALUES ($1, $2, $3, $4, $5, 'pending_verification')
       RETURNING *`,
      [
        dto.email?.toLowerCase() ?? null,
        dto.phone ?? null,
        dto.passwordHash ?? null,
        dto.provider ?? 'local',
        dto.providerId ?? null,
      ],
    );
    return rows[0];
  },

  /**
   * Find user by primary key (UUID).
   */
  async findById(id: string): Promise<UserRow | null> {
    const { rows } = await query(
      'SELECT * FROM users WHERE id = $1 LIMIT 1',
      [id],
    );
    return rows[0] ?? null;
  },

  /**
   * Find user by email address (case-insensitive).
   */
  async findByEmail(email: string): Promise<UserRow | null> {
    const { rows } = await query(
      'SELECT * FROM users WHERE LOWER(email) = LOWER($1) LIMIT 1',
      [email],
    );
    return rows[0] ?? null;
  },

  /**
   * Find user by phone number.
   */
  async findByPhone(phone: string): Promise<UserRow | null> {
    const { rows } = await query(
      'SELECT * FROM users WHERE phone = $1 LIMIT 1',
      [phone],
    );
    return rows[0] ?? null;
  },

  /**
   * Update mutable user fields.
   */
  async update(id: string, dto: UpdateUserDto): Promise<UserRow | null> {
    const sets: string[] = [];
    const values: unknown[] = [];
    let idx = 1;

    if (dto.status !== undefined) {
      sets.push(`status = $${idx++}`);
      values.push(dto.status);
    }
    if (dto.emailVerified !== undefined) {
      sets.push(`email_verified = $${idx++}`);
      values.push(dto.emailVerified);
    }
    if (dto.phoneVerified !== undefined) {
      sets.push(`phone_verified = $${idx++}`);
      values.push(dto.phoneVerified);
    }

    if (sets.length === 0) return this.findById(id);

    sets.push(`updated_at = NOW()`);
    values.push(id);

    const { rows } = await query(
      `UPDATE users SET ${sets.join(', ')} WHERE id = $${idx} RETURNING *`,
      values,
    );
    return rows[0] ?? null;
  },

  /**
   * Check whether an email is already registered.
   */
  async emailExists(email: string): Promise<boolean> {
    const { rows } = await query(
      'SELECT 1 FROM users WHERE LOWER(email) = LOWER($1) LIMIT 1',
      [email],
    );
    return rows.length > 0;
  },

  /**
   * Soft-delete / anonymize a user (account deletion flow from PRD).
   */
  async anonymize(id: string): Promise<void> {
    await query(
      `UPDATE users
       SET email = NULL, phone = NULL, password_hash = NULL,
           status = 'inactive', refresh_token = NULL, updated_at = NOW()
       WHERE id = $1`,
      [id],
    );
  },
};
