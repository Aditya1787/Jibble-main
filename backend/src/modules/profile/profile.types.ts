/**
 * @file profile.types.ts
 * @description Profile module DTOs.
 *              PRD fields: name, username, profile photo, bio, college, year/branch, skills/interests, social links.
 */

export interface ProfileRow {
  id: string;
  user_id: string;
  username: string;
  display_name: string;
  bio: string | null;
  avatar_url: string | null;
  college_id: string | null;
  year: string | null;
  branch: string | null;
  skills: string[];
  interests: string[];
  social_links: Record<string, string>;
  is_public: boolean;
  followers_count: number;
  following_count: number;
  posts_count: number;
  created_at: string;
  updated_at: string;
}

export interface ProfileDto {
  id: string;
  userId: string;
  username: string;
  displayName: string;
  bio: string | null;
  avatarUrl: string | null;
  collegeId: string | null;
  year: string | null;
  branch: string | null;
  skills: string[];
  interests: string[];
  socialLinks: Record<string, string>;
  isPublic: boolean;
  followersCount: number;
  followingCount: number;
  postsCount: number;
  createdAt: string;
}

export interface CreateProfileDto {
  userId: string;
  username: string;
  displayName: string;
  bio?: string;
  collegeId?: string;
  year?: string;
  branch?: string;
  skills?: string[];
  interests?: string[];
}

export interface UpdateProfileDto {
  username?: string;
  displayName?: string;
  bio?: string | null;
  avatarUrl?: string | null;
  collegeId?: string | null;
  year?: string | null;
  branch?: string | null;
  skills?: string[];
  interests?: string[];
  socialLinks?: Record<string, string>;
  isPublic?: boolean;
}
