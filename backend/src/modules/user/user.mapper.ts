/**
 * @file user.mapper.ts
 * @description Map database rows to safe, public-facing DTOs (strip password_hash, refresh_token).
 */

import { UserRow, UserDto } from './user.types';

export const userMapper = {
  toDto(row: UserRow): UserDto {
    return {
      id: row.id,
      email: row.email,
      phone: row.phone,
      provider: row.provider,
      status: row.status,
      emailVerified: row.email_verified,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  },

  toDtoList(rows: UserRow[]): UserDto[] {
    return rows.map(this.toDto);
  },
};
