/**
 * @file follow.types.ts
 * @description Types for the Follow / Social Graph module.
 */

export interface FollowRow {
  id: string;
  follower_id: string;
  following_id: string;
  is_accepted: boolean;
  created_at: Date;
  username?: string;
  display_name?: string;
  avatar_url?: string | null;
  is_verified?: boolean;
}

export interface FollowUserDto {
  userId: string;
  username: string;
  displayName: string;
  avatarUrl: string | null;
  isVerified: boolean;
  isAccepted: boolean;
  createdAt: string;
}
