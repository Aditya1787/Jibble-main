/**
 * @file profile.mapper.ts
 * @description Maps ProfileRow (raw DB row) to ProfileDto (safe public shape).
 *              Handles JSON parsing for skills, interests, and social_links
 *              which are stored as JSONB in PostgreSQL.
 */

import { ProfileRow, ProfileDto } from './profile.types';

export const profileMapper = {
  toDto(row: ProfileRow): ProfileDto {
    return {
      id: row.id,
      userId: row.user_id,
      username: row.username,
      displayName: row.display_name,
      bio: row.bio ?? null,
      avatarUrl: row.avatar_url ?? null,
      collegeId: row.college_id ?? null,
      year: row.year ?? null,
      branch: row.branch ?? null,
      // JSONB fields may come back as strings or arrays depending on pg driver config
      skills: parseJsonArray(row.skills),
      interests: parseJsonArray(row.interests),
      socialLinks: parseJsonObject(row.social_links),
      isPublic: row.is_public ?? true,
      followersCount: Number(row.followers_count ?? 0),
      followingCount: Number(row.following_count ?? 0),
      postsCount: Number(row.posts_count ?? 0),
      createdAt: row.created_at,
    };
  },

  toDtoList(rows: ProfileRow[]): ProfileDto[] {
    return rows.map((r) => profileMapper.toDto(r));
  },
};

// ── Helpers ───────────────────────────────────────────────────────────────────

/**
 * Safely parse a value that may be a JSON string, a JS array, or null/undefined.
 */
function parseJsonArray(val: unknown): string[] {
  if (!val) return [];
  if (Array.isArray(val)) return val as string[];
  if (typeof val === 'string') {
    try {
      const parsed = JSON.parse(val);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }
  return [];
}

/**
 * Safely parse a value that may be a JSON string, a JS object, or null/undefined.
 */
function parseJsonObject(val: unknown): Record<string, string> {
  if (!val) return {};
  if (typeof val === 'object' && !Array.isArray(val)) {
    return val as Record<string, string>;
  }
  if (typeof val === 'string') {
    try {
      const parsed = JSON.parse(val);
      return typeof parsed === 'object' && !Array.isArray(parsed) ? parsed : {};
    } catch {
      return {};
    }
  }
  return {};
}
