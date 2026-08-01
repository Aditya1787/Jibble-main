/**
 * @file story.types.ts
 * @description Type definitions for the Story module.
 */

export type StoryType = 'image' | 'video' | 'text' | 'boomerang';

export interface TextStyle {
  font?: string;
  color?: string;
  bgColor?: string;
  position?: { x: number; y: number };
}

export interface MusicTrack {
  trackId?: string;
  title?: string;
  artist?: string;
  startTime?: number;
}

export interface StoryRow {
  id: string;
  user_id: string;
  type: StoryType;
  media_url: string | null;
  thumbnail_url: string | null;
  text_content: string | null;
  text_style: any | null;
  stickers: any | null;
  music: any | null;
  duration: number;
  views_count: number;
  is_highlight: boolean;
  highlight_id: string | null;
  expires_at: Date;
  created_at: Date;
  updated_at: Date;

  // Joined profile fields
  username?: string;
  display_name?: string;
  avatar_url?: string | null;
  is_verified?: boolean;

  // Computed
  has_viewed?: boolean;
}

export interface StoryDto {
  id: string;
  userId: string;
  type: StoryType;
  mediaUrl: string | null;
  thumbnailUrl: string | null;
  textContent: string | null;
  textStyle: TextStyle | null;
  stickers: any[] | null;
  music: MusicTrack | null;
  duration: number;
  viewsCount: number;
  isHighlight: boolean;
  highlightId: string | null;
  expiresAt: string;
  createdAt: string;
  author: {
    username: string;
    displayName: string;
    avatarUrl: string | null;
    isVerified: boolean;
  };
  hasViewed: boolean;
}

export interface UserStoryGroupDto {
  userId: string;
  username: string;
  displayName: string;
  avatarUrl: string | null;
  isVerified: boolean;
  hasUnread: boolean;
  stories: StoryDto[];
}

export interface CreateStoryDto {
  type?: StoryType;
  mediaUrl?: string | null;
  thumbnailUrl?: string | null;
  textContent?: string | null;
  textStyle?: TextStyle | null;
  stickers?: any[] | null;
  music?: MusicTrack | null;
  duration?: number;
}
