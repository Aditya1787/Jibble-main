/**
 * @file constants.ts
 * @description Shared enums and application-wide constants.
 */

export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  BANNED = 'banned',
  PENDING_VERIFICATION = 'pending_verification',
}

export enum AuthProvider {
  LOCAL = 'local',
  GOOGLE = 'google',
  APPLE = 'apple',
}

export enum UserRole {
  USER = 'user',
  CREATOR = 'creator',
  GROUP_ADMIN = 'group_admin',
  COLLEGE_AMBASSADOR = 'college_ambassador',
  SUPER_ADMIN = 'super_admin',
}

export enum PostVisibility {
  FOLLOWERS = 'followers',
  COLLEGE = 'college',
  CIRCLE = 'circle',
}

export enum NotificationType {
  FOLLOW = 'follow',
  LIKE = 'like',
  COMMENT = 'comment',
  MENTION = 'mention',
  EVENT_REMINDER = 'event_reminder',
  GROUP_INVITE = 'group_invite',
  CHAT_MESSAGE = 'chat_message',
  SKILL_MATCH = 'skill_match',
}

// Password rules
export const MIN_PASSWORD_LENGTH = 8;

// Token cookie names
export const REFRESH_TOKEN_COOKIE = 'jibble_refresh';

// Cache TTLs (seconds)
export const CACHE_TTL = {
  FEED: 60,
  PROFILE: 300,
  COLLEGES: 3600,
  SHORT: 30,
} as const;
