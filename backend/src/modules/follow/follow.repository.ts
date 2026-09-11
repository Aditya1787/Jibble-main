/**
 * @file follow.repository.ts
 * @description Repository queries and transactions for Follow / Social Graph.
 */

import { pool, query } from '../../db/index';
import { FollowRow } from './follow.types';

export const followRepository = {
  /**
   * Follow a user with transaction to update follower/following counts.
   */
  async follow(followerId: string, followingId: string): Promise<boolean> {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      const insertRes = await client.query(
        `INSERT INTO follows (follower_id, following_id, is_accepted)
         VALUES ($1, $2, TRUE)
         ON CONFLICT (follower_id, following_id) DO NOTHING
         RETURNING id`,
        [followerId, followingId]
      );

      if ((insertRes.rowCount ?? 0) > 0) {
        await client.query(
          `UPDATE profiles SET following_count = following_count + 1 WHERE user_id = $1`,
          [followerId]
        );
        await client.query(
          `UPDATE profiles SET followers_count = followers_count + 1 WHERE user_id = $1`,
          [followingId]
        );
      }

      await client.query('COMMIT');
      return (insertRes.rowCount ?? 0) > 0;
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  },

  /**
   * Unfollow a user with transaction to decrement follower/following counts.
   */
  async unfollow(followerId: string, followingId: string): Promise<boolean> {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      const delRes = await client.query(
        `DELETE FROM follows WHERE follower_id = $1 AND following_id = $2 RETURNING id`,
        [followerId, followingId]
      );

      if ((delRes.rowCount ?? 0) > 0) {
        await client.query(
          `UPDATE profiles SET following_count = GREATEST(following_count - 1, 0) WHERE user_id = $1`,
          [followerId]
        );
        await client.query(
          `UPDATE profiles SET followers_count = GREATEST(followers_count - 1, 0) WHERE user_id = $1`,
          [followingId]
        );
      }

      await client.query('COMMIT');
      return (delRes.rowCount ?? 0) > 0;
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  },

  /**
   * Check if followerId is following followingId.
   */
  async isFollowing(followerId: string, followingId: string): Promise<boolean> {
    const res = await query(
      `SELECT 1 FROM follows WHERE follower_id = $1 AND following_id = $2 AND is_accepted = TRUE LIMIT 1`,
      [followerId, followingId]
    );
    return (res.rowCount ?? 0) > 0;
  },

  /**
   * Get paginated list of followers of a user.
   */
  async getFollowers(userId: string, limit: number, offset: number): Promise<FollowRow[]> {
    const res = await query(
      `SELECT f.id, f.follower_id, f.following_id, f.is_accepted, f.created_at,
              p.username, p.display_name, p.avatar_url, p.is_verified
       FROM follows f
       JOIN profiles p ON p.user_id = f.follower_id
       WHERE f.following_id = $1 AND f.is_accepted = TRUE
       ORDER BY f.created_at DESC
       LIMIT $2 OFFSET $3`,
      [userId, limit, offset]
    );
    return res.rows as FollowRow[];
  },

  /**
   * Get paginated list of users that userId is following.
   */
  async getFollowing(userId: string, limit: number, offset: number): Promise<FollowRow[]> {
    const res = await query(
      `SELECT f.id, f.follower_id, f.following_id, f.is_accepted, f.created_at,
              p.username, p.display_name, p.avatar_url, p.is_verified
       FROM follows f
       JOIN profiles p ON p.user_id = f.following_id
       WHERE f.follower_id = $1 AND f.is_accepted = TRUE
       ORDER BY f.created_at DESC
       LIMIT $2 OFFSET $3`,
      [userId, limit, offset]
    );
    return res.rows as FollowRow[];
  },
};
