/**
 * @file post.types.ts
 * @description Type definitions for the Post module.
 */

export type PostType = 'text' | 'image' | 'video' | 'carousel' | 'link' | 'poll';
export type VisibilityType = 'public' | 'followers' | 'college_only' | 'private';

export interface PollOption {
  id: string;
  text: string;
  votes: number;
}

export interface LinkPreview {
  title?: string;
  description?: string;
  imageUrl?: string;
}

export interface PostRow {
  id: string;
  user_id: string;
  college_id: string | null;
  type: PostType;
  visibility: VisibilityType;
  caption: string | null;
  media_urls: string[] | null;
  thumbnail_url: string | null;
  link_url: string | null;
  link_preview: any | null; // JSONB
  poll_options: any | null; // JSONB
  poll_ends_at: Date | null;
  location: string | null;
  hashtags: string[] | null;
  mentions: string[] | null;
  is_pinned: boolean;
  is_archived: boolean;
  likes_count: number;
  comments_count: number;
  shares_count: number;
  views_count: number;
  created_at: Date;
  updated_at: Date;

  // Joined fields from profiles
  username?: string;
  display_name?: string;
  avatar_url?: string | null;
  is_verified?: boolean;

  // Computed fields
  is_liked?: boolean;
}

export interface PostDto {
  id: string;
  userId: string;
  collegeId: string | null;
  type: PostType;
  visibility: VisibilityType;
  caption: string | null;
  mediaUrls: string[];
  thumbnailUrl: string | null;
  linkUrl: string | null;
  linkPreview: LinkPreview | null;
  pollOptions: PollOption[] | null;
  pollEndsAt: string | null;
  location: string | null;
  hashtags: string[];
  mentions: string[];
  isPinned: boolean;
  isArchived: boolean;
  likesCount: number;
  commentsCount: number;
  sharesCount: number;
  viewsCount: number;
  createdAt: string;
  updatedAt: string;

  // Author profile
  author: {
    username: string;
    displayName: string;
    avatarUrl: string | null;
    isVerified: boolean;
  } | null;

  // User context
  isLiked: boolean;
}

export interface CreatePostDto {
  type: PostType;
  visibility: VisibilityType;
  caption?: string | null;
  mediaUrls?: string[] | null;
  thumbnailUrl?: string | null;
  linkUrl?: string | null;
  linkPreview?: LinkPreview | null;
  pollOptions?: string[] | null; // Array of option texts to create options
  pollEndsAt?: Date | string | null;
  location?: string | null;
  hashtags?: string[] | null;
  mentions?: string[] | null;
}
