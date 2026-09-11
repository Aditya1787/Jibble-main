/**
 * @file post.mapper.ts
 * @description Maps raw PostgreSQL PostRow objects to safe camelCase PostDto objects.
 */

import { PostRow, PostDto, PollOption, LinkPreview } from './post.types';

export const postMapper = {
  toDto(row: PostRow, requestingUserId?: string): PostDto {
    const isAnonymous = !!row.is_anonymous;
    const isAuthor = requestingUserId && row.user_id === requestingUserId;
    const hideMetrics = !!row.hide_likes_views && !isAuthor;

    let author = null;
    if (isAnonymous) {
      author = {
        username: row.anonymous_alias || 'anonymous',
        displayName: row.anonymous_alias || 'Anonymous Member',
        avatarUrl: null,
        isVerified: false,
      };
    } else if (row.username && row.display_name) {
      author = {
        username: row.username,
        displayName: row.display_name,
        avatarUrl: row.avatar_url ?? null,
        isVerified: row.is_verified ?? false,
      };
    }

    return {
      id: row.id,
      userId: isAnonymous ? 'anonymous' : row.user_id,
      collegeId: row.college_id,
      circleId: row.circle_id ?? null,
      type: row.type,
      visibility: row.visibility,
      caption: row.caption ?? null,
      mediaUrls: parseJsonArray(row.media_urls),
      thumbnailUrl: row.thumbnail_url ?? null,
      linkUrl: row.link_url ?? null,
      linkPreview: parseJsonObject(row.link_preview) as LinkPreview | null,
      pollOptions: parseJsonArray(row.poll_options) as PollOption[] | null,
      pollEndsAt: row.poll_ends_at ? new Date(row.poll_ends_at).toISOString() : null,
      location: row.location ?? null,
      hashtags: parseJsonArray(row.hashtags),
      mentions: parseJsonArray(row.mentions),
      isPinned: row.is_pinned ?? false,
      isArchived: row.is_archived ?? false,
      hideLikesViews: !!row.hide_likes_views,
      hideComments: !!row.hide_comments,
      isAnonymous,
      anonymousAlias: row.anonymous_alias ?? null,
      likesCount: hideMetrics ? -1 : Number(row.likes_count ?? 0),
      commentsCount: row.hide_comments && !isAuthor ? -1 : Number(row.comments_count ?? 0),
      sharesCount: Number(row.shares_count ?? 0),
      viewsCount: hideMetrics ? -1 : Number(row.views_count ?? 0),
      createdAt: new Date(row.created_at).toISOString(),
      updatedAt: new Date(row.updated_at).toISOString(),
      author,
      isLiked: !!row.is_liked,
    };
  },

  toDtoList(rows: PostRow[], requestingUserId?: string): PostDto[] {
    return rows.map((r) => this.toDto(r, requestingUserId));
  },
};

// ── Helpers ───────────────────────────────────────────────────────────────────

/**
 * Safely parse a value that may be a JSON string, a JS array, or null/undefined.
 */
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

/**
 * Safely parse a value that may be a JSON string, a JS object, or null/undefined.
 */
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
