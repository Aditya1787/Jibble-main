/**
 * @file story.repository.ts
 * @description Database access layer for Stories.
 */

import { query } from '../../db/index';
import { StoryRow, CreateStoryDto } from './story.types';

export const storyRepository = {
  /**
   * Insert a new 24-hour ephemeral story.
   */
  async create(userId: string, dto: CreateStoryDto): Promise<StoryRow> {
    const textStyleJson = dto.textStyle ? JSON.stringify(dto.textStyle) : null;
    const stickersJson = dto.stickers ? JSON.stringify(dto.stickers) : null;
    const musicJson = dto.music ? JSON.stringify(dto.music) : null;

    const text = `
      INSERT INTO stories (
        user_id, type, media_url, thumbnail_url, text_content,
        text_style, stickers, music, duration, expires_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW() + INTERVAL '24 hours')
      RETURNING *
    `;

    const params = [
      userId,
      dto.type ?? 'image',
      dto.mediaUrl ?? null,
      dto.thumbnailUrl ?? null,
      dto.textContent ?? null,
      textStyleJson,
      stickersJson,
      musicJson,
      dto.duration ?? 5,
    ];

    const { rows } = await query(text, params);
    return rows[0] as StoryRow;
  },

  /**
   * Fetch active, non-expired stories for user and followed friends.
   */
  async findActiveFeedStories(userId: string): Promise<StoryRow[]> {
    const text = `
      SELECT s.*,
             p.username, p.display_name, p.avatar_url, p.is_verified
      FROM stories s
      LEFT JOIN profiles p ON s.user_id = p.user_id
      WHERE s.expires_at > NOW()
        AND (
          s.user_id = $1
          OR EXISTS (
            SELECT 1 FROM follows f
            WHERE f.follower_id = $1 AND f.following_id = s.user_id AND f.is_accepted = TRUE
          )
        )
      ORDER BY s.user_id, s.created_at ASC
    `;

    const { rows } = await query(text, [userId]);
    return rows as StoryRow[];
  },

  /**
   * Fetch active stories for a specific user ID.
   */
  async findActiveUserStories(targetUserId: string): Promise<StoryRow[]> {
    const text = `
      SELECT s.*,
             p.username, p.display_name, p.avatar_url, p.is_verified
      FROM stories s
      LEFT JOIN profiles p ON s.user_id = p.user_id
      WHERE s.user_id = $1 AND s.expires_at > NOW()
      ORDER BY s.created_at ASC
    `;

    const { rows } = await query(text, [targetUserId]);
    return rows as StoryRow[];
  },

  /**
   * Find a single story by ID.
   */
  async findById(id: string): Promise<StoryRow | null> {
    const text = `
      SELECT s.*,
             p.username, p.display_name, p.avatar_url, p.is_verified
      FROM stories s
      LEFT JOIN profiles p ON s.user_id = p.user_id
      WHERE s.id = $1
      LIMIT 1
    `;

    const { rows } = await query(text, [id]);
    return (rows[0] as StoryRow) ?? null;
  },

  /**
   * Increment view count for a story.
   */
  async incrementViews(id: string): Promise<boolean> {
    const text = `
      UPDATE stories
      SET views_count = views_count + 1
      WHERE id = $1
      RETURNING id
    `;

    const { rowCount } = await query(text, [id]);
    return (rowCount ?? 0) > 0;
  },

  /**
   * Delete a story by ID if owned by user.
   */
  async delete(id: string, userId: string): Promise<boolean> {
    const text = `
      DELETE FROM stories
      WHERE id = $1 AND user_id = $2
      RETURNING 1
    `;

    const { rowCount } = await query(text, [id, userId]);
    return (rowCount ?? 0) > 0;
  },
};
