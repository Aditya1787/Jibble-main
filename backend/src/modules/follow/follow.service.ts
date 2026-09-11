/**
 * @file follow.service.ts
 * @description Business logic for following / unfollowing users.
 */

import { AppError } from '../../middlewares/error.middleware';
import { followRepository } from './follow.repository';
import { FollowUserDto } from './follow.types';

export const followService = {
  async follow(followerId: string, targetUserId: string): Promise<{ success: boolean; following: boolean }> {
    if (followerId === targetUserId) {
      throw AppError.badRequest('You cannot follow yourself');
    }
    const created = await followRepository.follow(followerId, targetUserId);
    return { success: true, following: true };
  },

  async unfollow(followerId: string, targetUserId: string): Promise<{ success: boolean; following: boolean }> {
    if (followerId === targetUserId) {
      throw AppError.badRequest('You cannot unfollow yourself');
    }
    await followRepository.unfollow(followerId, targetUserId);
    return { success: true, following: false };
  },

  async isFollowing(followerId: string, targetUserId: string): Promise<{ isFollowing: boolean }> {
    const isFollowing = await followRepository.isFollowing(followerId, targetUserId);
    return { isFollowing };
  },

  async getFollowers(userId: string, limit = 20, offset = 0): Promise<FollowUserDto[]> {
    const rows = await followRepository.getFollowers(userId, limit, offset);
    return rows.map((r) => ({
      userId: r.follower_id,
      username: r.username ?? 'user',
      displayName: r.display_name ?? 'User',
      avatarUrl: r.avatar_url ?? null,
      isVerified: r.is_verified ?? false,
      isAccepted: r.is_accepted,
      createdAt: new Date(r.created_at).toISOString(),
    }));
  },

  async getFollowing(userId: string, limit = 20, offset = 0): Promise<FollowUserDto[]> {
    const rows = await followRepository.getFollowing(userId, limit, offset);
    return rows.map((r) => ({
      userId: r.following_id,
      username: r.username ?? 'user',
      displayName: r.display_name ?? 'User',
      avatarUrl: r.avatar_url ?? null,
      isVerified: r.is_verified ?? false,
      isAccepted: r.is_accepted,
      createdAt: new Date(r.created_at).toISOString(),
    }));
  },
};
