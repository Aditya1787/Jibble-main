/**
 * @file profile.repository.ts
 * @description Database operations for the profiles table.
 */

import { query } from '../../db/index';
import { ProfileRow, CreateProfileDto, UpdateProfileDto } from './profile.types';

export const profileRepository = {
  async create(dto: CreateProfileDto): Promise<ProfileRow> {
    const { rows } = await query(
      `INSERT INTO profiles (user_id, username, display_name, bio, college_id, year, branch, skills, interests)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING *`,
      [
        dto.userId,
        dto.username.toLowerCase(),
        dto.displayName,
        dto.bio ?? null,
        dto.collegeId ?? null,
        dto.year ?? null,
        dto.branch ?? null,
        JSON.stringify(dto.skills ?? []),
        JSON.stringify(dto.interests ?? []),
      ],
    );
    return rows[0];
  },

  async findByUserId(userId: string): Promise<ProfileRow | null> {
    const { rows } = await query(
      'SELECT * FROM profiles WHERE user_id = $1 LIMIT 1',
      [userId],
    );
    return rows[0] ?? null;
  },

  async findByUsername(username: string): Promise<ProfileRow | null> {
    const { rows } = await query(
      'SELECT * FROM profiles WHERE LOWER(username) = LOWER($1) LIMIT 1',
      [username],
    );
    return rows[0] ?? null;
  },

  async usernameExists(username: string, excludeUserId?: string): Promise<boolean> {
    const { rows } = await query(
      excludeUserId
        ? 'SELECT 1 FROM profiles WHERE LOWER(username) = LOWER($1) AND user_id != $2 LIMIT 1'
        : 'SELECT 1 FROM profiles WHERE LOWER(username) = LOWER($1) LIMIT 1',
      excludeUserId ? [username, excludeUserId] : [username],
    );
    return rows.length > 0;
  },

  async update(userId: string, dto: UpdateProfileDto): Promise<ProfileRow | null> {
    const sets: string[] = [];
    const values: unknown[] = [];
    let idx = 1;

    const fieldMap: [keyof UpdateProfileDto, string][] = [
      ['username', 'username'],
      ['displayName', 'display_name'],
      ['bio', 'bio'],
      ['avatarUrl', 'avatar_url'],
      ['collegeId', 'college_id'],
      ['year', 'year'],
      ['branch', 'branch'],
      ['skills', 'skills'],
      ['interests', 'interests'],
      ['socialLinks', 'social_links'],
      ['isPublic', 'is_public'],
    ];

    for (const [dtoKey, dbCol] of fieldMap) {
      if (dto[dtoKey] !== undefined) {
        const val = dto[dtoKey];
        if (Array.isArray(val) || (typeof val === 'object' && val !== null)) {
          sets.push(`${dbCol} = $${idx++}`);
          values.push(JSON.stringify(val));
        } else {
          sets.push(`${dbCol} = $${idx++}`);
          values.push(val);
        }
      }
    }

    if (sets.length === 0) return this.findByUserId(userId);

    sets.push(`updated_at = NOW()`);
    values.push(userId);

    const { rows } = await query(
      `UPDATE profiles SET ${sets.join(', ')} WHERE user_id = $${idx} RETURNING *`,
      values,
    );
    return rows[0] ?? null;
  },
};
