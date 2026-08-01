/**
 * @file story.mapper.ts
 * @description Maps raw PostgreSQL StoryRow objects to clean camelCase StoryDto objects.
 */

import { StoryRow, StoryDto, TextStyle, MusicTrack } from './story.types';

export const storyMapper = {
  toDto(row: StoryRow): StoryDto {
    return {
      id: row.id,
      userId: row.user_id,
      type: row.type,
      mediaUrl: row.media_url ?? null,
      thumbnailUrl: row.thumbnail_url ?? null,
      textContent: row.text_content ?? null,
      textStyle: parseJsonObject(row.text_style) as TextStyle | null,
      stickers: parseJsonArray(row.stickers),
      music: parseJsonObject(row.music) as MusicTrack | null,
      duration: row.duration ?? 5,
      viewsCount: Number(row.views_count ?? 0),
      isHighlight: row.is_highlight ?? false,
      highlightId: row.highlight_id ?? null,
      expiresAt: new Date(row.expires_at).toISOString(),
      createdAt: new Date(row.created_at).toISOString(),
      author: {
        username: row.username ?? 'user',
        displayName: row.display_name ?? 'User',
        avatarUrl: row.avatar_url ?? null,
        isVerified: row.is_verified ?? false,
      },
      hasViewed: !!row.has_viewed,
    };
  },

  toDtoList(rows: StoryRow[]): StoryDto[] {
    return rows.map((r) => this.toDto(r));
  },
};

function parseJsonArray(val: unknown): any[] {
  if (!val) return [];
  if (Array.isArray(val)) return val;
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

function parseJsonObject(val: unknown): Record<string, any> | null {
  if (!val) return null;
  if (typeof val === 'object' && !Array.isArray(val)) {
    return val as Record<string, any>;
  }
  if (typeof val === 'string') {
    try {
      const parsed = JSON.parse(val);
      return typeof parsed === 'object' && !Array.isArray(parsed) ? parsed : null;
    } catch {
      return null;
    }
  }
  return null;
}
