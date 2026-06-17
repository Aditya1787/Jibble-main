/**
 * @file post.repository.ts
 * @description Database queries and transaction logic for Jibble posts and likes.
 */

import { pool, query } from '../../db/index';
import { PostRow, CreatePostDto } from './post.types';

export const postRepository = {
  /**
   * Create a post inside a database transaction.
   * Increments the user's profiles.posts_count.
   */
  async create(userId: string, dto: CreatePostDto, collegeId: string | null): Promise<PostRow> {
    const client = await pool.connect();

    try {
      await client.query('BEGIN');

      // 1. Prepare JSON columns
      const mediaUrls = dto.mediaUrls ? dto.mediaUrls : [];
      const linkPreview = dto.linkPreview ? JSON.stringify(dto.linkPreview) : null;
      
      let pollOptionsJson = null;
      if (dto.pollOptions && dto.pollOptions.length > 0) {
        const pollOptions = dto.pollOptions.map((text, idx) => ({
          id: (idx + 1).toString(),
          text,
          votes: 0,
        }));
        pollOptionsJson = JSON.stringify(pollOptions);
      }

      const pollEndsAt = dto.pollEndsAt ? new Date(dto.pollEndsAt) : null;

      // 2. Insert post row
      const insertPostText = `
        INSERT INTO posts (
          user_id, college_id, type, visibility, caption, media_urls,
          thumbnail_url, link_url, link_preview, poll_options, poll_ends_at,
          location, hashtags, mentions
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
        RETURNING *
      `;

      const postParams = [
        userId,
        collegeId,
        dto.type,
        dto.visibility,
        dto.caption ?? null,
        mediaUrls,
        dto.thumbnailUrl ?? null,
        dto.linkUrl ?? null,
        linkPreview,
        pollOptionsJson,
        pollEndsAt,
        dto.location ?? null,
        dto.hashtags ?? [],
        dto.mentions ?? [],
      ];

      const postRes = await client.query<PostRow>(insertPostText, postParams);
      const newPost = postRes.rows[0];

      // 3. Increment posts_count in user's profile
      await client.query(
        'UPDATE profiles SET posts_count = posts_count + 1 WHERE user_id = $1',
        [userId]
      );

      await client.query('COMMIT');
      return newPost;
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  },

  /**
   * Find a single post by ID, joining the profile info and checking if user has liked it.
   */
  async findById(id: string, userId: string): Promise<PostRow | null> {
    const text = `
      SELECT posts.*,
             p.username, p.display_name, p.avatar_url, p.is_verified,
             EXISTS(
               SELECT 1 FROM likes
               WHERE user_id = $2 AND likeable_type = 'post' AND likeable_id = posts.id
             ) AS is_liked
      FROM posts
      LEFT JOIN profiles p ON posts.user_id = p.user_id
      WHERE posts.id = $1 AND posts.is_archived = FALSE
      LIMIT 1
    `;
    const { rows } = await query(text, [id, userId]);
    return rows[0] ?? null;
  },

  /**
   * Get paginated home feed for a user:
   * - Shows own posts
   * - Shows public posts in the same college
   * - Shows college-only posts in the same college
   * - Shows follower-only posts from users they follow
   */
  async getHomeFeed(
    userId: string,
    collegeId: string | null,
    limit: number,
    offset: number
  ): Promise<PostRow[]> {
    const text = `
      SELECT posts.*,
             p.username, p.display_name, p.avatar_url, p.is_verified,
             EXISTS(
               SELECT 1 FROM likes
               WHERE user_id = $1 AND likeable_type = 'post' AND likeable_id = posts.id
             ) AS is_liked
      FROM posts
      LEFT JOIN profiles p ON posts.user_id = p.user_id
      WHERE posts.is_archived = FALSE
        AND (
          posts.user_id = $1
          OR (posts.visibility = 'public' AND ($2::UUID IS NULL OR posts.college_id = $2::UUID))
          OR (posts.visibility = 'college_only' AND posts.college_id = $2::UUID)
          OR (posts.visibility = 'followers' AND EXISTS(
            SELECT 1 FROM follows
            WHERE follower_id = $1 AND following_id = posts.user_id AND is_accepted = TRUE
          ))
        )
      ORDER BY posts.is_pinned DESC, posts.created_at DESC
      LIMIT $3 OFFSET $4
    `;
    const { rows } = await query(text, [userId, collegeId, limit, offset]);
    return rows;
  },

  /**
   * Get posts of a specific target user, respecting visibility logic:
   * - Shows all if isOwnProfile = true
   * - Else shows public posts, college_only posts (if requesting user has same college), or follower posts (if following)
   */
  async getUserPosts(
    userId: string,
    targetUserId: string,
    limit: number,
    offset: number,
    isOwnProfile: boolean
  ): Promise<PostRow[]> {
    const text = `
      SELECT posts.*,
             p.username, p.display_name, p.avatar_url, p.is_verified,
             EXISTS(
               SELECT 1 FROM likes
               WHERE user_id = $1 AND likeable_type = 'post' AND likeable_id = posts.id
             ) AS is_liked
      FROM posts
      LEFT JOIN profiles p ON posts.user_id = p.user_id
      WHERE posts.user_id = $2 AND posts.is_archived = FALSE
        AND (
          $3 = TRUE
          OR posts.visibility = 'public'
          OR (posts.visibility = 'college_only' AND EXISTS(
            SELECT 1 FROM profiles r WHERE r.user_id = $1 AND r.college_id = posts.college_id
          ))
          OR (posts.visibility = 'followers' AND EXISTS(
            SELECT 1 FROM follows
            WHERE follower_id = $1 AND following_id = $2 AND is_accepted = TRUE
          ))
        )
      ORDER BY posts.is_pinned DESC, posts.created_at DESC
      LIMIT $4 OFFSET $5
    `;
    const { rows } = await query(text, [userId, targetUserId, isOwnProfile, limit, offset]);
    return rows;
  },

  /**
   * Delete a post by ID inside a database transaction.
   * Decrements user's profiles.posts_count.
   */
  async delete(id: string, userId: string): Promise<boolean> {
    const client = await pool.connect();

    try {
      await client.query('BEGIN');

      // 1. Delete post
      const deleteRes = await client.query(
        'DELETE FROM posts WHERE id = $1 AND user_id = $2 RETURNING 1',
        [id, userId]
      );

      if (deleteRes.rowCount === 0) {
        await client.query('ROLLBACK');
        return false;
      }

      // 2. Decrement posts_count in user's profile
      await client.query(
        'UPDATE profiles SET posts_count = GREATEST(posts_count - 1, 0) WHERE user_id = $1',
        [userId]
      );

      await client.query('COMMIT');
      return true;
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  },

  /**
   * Toggle like on a post inside a database transaction.
   * Inserts/deletes from the likes table, and increments/decrements posts.likes_count.
   * Returns { isLiked: boolean, likesCount: number }
   */
  async toggleLike(userId: string, postId: string): Promise<{ isLiked: boolean; likesCount: number }> {
    const client = await pool.connect();

    try {
      await client.query('BEGIN');

      // 1. Check if like exists
      const checkRes = await client.query(
        "SELECT 1 FROM likes WHERE user_id = $1 AND likeable_type = 'post' AND likeable_id = $2",
        [userId, postId]
      );

      let isLiked = false;

      if (checkRes.rowCount && checkRes.rowCount > 0) {
        // Already liked -> remove it
        await client.query(
          "DELETE FROM likes WHERE user_id = $1 AND likeable_type = 'post' AND likeable_id = $2",
          [userId, postId]
        );
        await client.query(
          'UPDATE posts SET likes_count = GREATEST(likes_count - 1, 0) WHERE id = $1',
          [postId]
        );
        isLiked = false;
      } else {
        // Not liked yet -> add it
        await client.query(
          "INSERT INTO likes (user_id, likeable_type, likeable_id, reaction) VALUES ($1, 'post', $2, 'like')",
          [userId, postId]
        );
        await client.query(
          'UPDATE posts SET likes_count = likes_count + 1 WHERE id = $1',
          [postId]
        );
        isLiked = true;
      }

      // 2. Fetch new likes count
      const countRes = await client.query<{ likes_count: number }>(
        'SELECT likes_count FROM posts WHERE id = $1',
        [postId]
      );

      if (countRes.rowCount === 0) {
        throw new Error('Post not found during like toggle');
      }

      const likesCount = countRes.rows[0].likes_count;

      await client.query('COMMIT');
      return { isLiked, likesCount };
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  },
};
