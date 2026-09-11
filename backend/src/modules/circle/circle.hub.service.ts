/**
 * @file circle.hub.service.ts
 * @description Business logic for Circle 5-Nav features:
 *              - Circle Home aggregated data (online members, feed, events, groups, stats)
 *              - Events with external redirect join links
 *              - Anonymous confessions with secure identity masking
 *              - Circle sub-groups & group chats
 */

import { query } from '../../db/index';
import { AppError } from '../../middlewares/error.middleware';

const ANONYMOUS_ALIASES = [
  'Anonymous Lynx',
  'Curious Owl',
  'Shadow Falcon',
  'Mystic Panther',
  'Silent Wolf',
  'Silver Fox',
  'Night Raven',
  'Golden Tiger',
  'Zen Panda',
  'Quantum Otter',
];

export const circleHubService = {
  /**
   * Aggregated Circle Home data endpoint.
   * Consolidates:
   * 1. Circle information & user membership role
   * 2. Online / recently active members (for signature corner ellipse)
   * 3. Circle activity feed (circle-only posts & anonymous posts)
   * 4. Upcoming events (with redirect join links)
   * 5. Active sub-groups
   * 6. Community statistics
   */
  async getCircleHome(circleId: string, userId: string) {
    // 1. Circle Info
    const circleRes = await query(
      `SELECT c.*, 
              cm.role AS current_user_role,
              (SELECT COUNT(*)::INT FROM circle_members WHERE circle_id = c.id) AS members_count
       FROM circles c
       LEFT JOIN circle_members cm ON cm.circle_id = c.id AND cm.user_id = $2
       WHERE c.id = $1 LIMIT 1`,
      [circleId, userId],
    );

    if (circleRes.rows.length === 0) {
      throw AppError.notFound('Circle not found', 'CIRCLE_NOT_FOUND');
    }
    const circle = circleRes.rows[0];

    // 2. Online & Recently Active Members (for Corner Ellipse Arc)
    const membersRes = await query(
      `SELECT u.id, p.username, p.display_name, p.avatar_url, cm.role,
              (u.last_login_at > NOW() - INTERVAL '30 minutes') AS is_online
       FROM circle_members cm
       JOIN users u ON u.id = cm.user_id
       LEFT JOIN profiles p ON p.user_id = u.id
       WHERE cm.circle_id = $1
       ORDER BY is_online DESC, u.last_login_at DESC NULLS LAST
       LIMIT 25`,
      [circleId],
    );

    // 3. Circle Feed (Circle Posts + Anonymous Posts)
    const feedRes = await query(
      `SELECT p.id, p.user_id, p.caption, p.media_urls, p.type, p.is_anonymous,
              p.anonymous_alias, p.likes_count, p.comments_count, p.created_at,
              CASE WHEN p.is_anonymous THEN 'Anonymous Member' ELSE pr.display_name END AS author_name,
              CASE WHEN p.is_anonymous THEN p.anonymous_alias ELSE pr.username END AS author_username,
              CASE WHEN p.is_anonymous THEN NULL ELSE pr.avatar_url END AS author_avatar,
              EXISTS(SELECT 1 FROM likes l WHERE l.user_id = $2 AND l.likeable_id = p.id) AS is_liked
       FROM posts p
       LEFT JOIN profiles pr ON pr.user_id = p.user_id
       WHERE p.circle_id = $1 AND p.is_archived = FALSE
       ORDER BY p.created_at DESC
       LIMIT 30`,
      [circleId, userId],
    );

    // Sanitize author IDs on anonymous items for public response
    const sanitizedFeed = feedRes.rows.map((row) => ({
      ...row,
      user_id: row.is_anonymous ? undefined : row.user_id,
    }));

    // 4. Upcoming Events
    const eventsRes = await query(
      `SELECT e.id, e.title, e.description, e.cover_url, e.location_name,
              e.starts_at, e.ends_at, e.join_link, e.is_online, e.attendees_count,
              EXISTS(SELECT 1 FROM event_rsvps r WHERE r.event_id = e.id AND r.user_id = $2) AS is_attending
       FROM events e
       WHERE e.circle_id = $1 AND e.ends_at >= NOW()
       ORDER BY e.starts_at ASC
       LIMIT 10`,
      [circleId, userId],
    );

    // 5. Active Sub-Groups
    const groupsRes = await query(
      `SELECT g.*, 
              EXISTS(SELECT 1 FROM circle_group_members gm WHERE gm.group_id = g.id AND gm.user_id = $2) AS is_member
       FROM circle_groups g
       WHERE g.circle_id = $1
       ORDER BY g.members_count DESC, g.created_at DESC
       LIMIT 15`,
      [circleId, userId],
    );

    // 6. Community Statistics
    const statsRes = await query(
      `SELECT 
        (SELECT COUNT(*)::INT FROM circle_members WHERE circle_id = $1) AS total_members,
        (SELECT COUNT(*)::INT FROM posts WHERE circle_id = $1) AS total_posts,
        (SELECT COUNT(*)::INT FROM posts WHERE circle_id = $1 AND is_anonymous = TRUE) AS total_anonymous_posts,
        (SELECT COUNT(*)::INT FROM events WHERE circle_id = $1) AS total_events,
        (SELECT COUNT(*)::INT FROM circle_groups WHERE circle_id = $1) AS total_groups`,
      [circleId],
    );

    return {
      circle: {
        id: circle.id,
        name: circle.name,
        slug: circle.slug,
        description: circle.description,
        avatarUrl: circle.avatar_url,
        bannerUrl: circle.banner_url,
        type: circle.type,
        membersCount: circle.members_count,
        currentUserRole: circle.current_user_role,
      },
      onlineMembers: membersRes.rows.map((m) => ({
        id: m.id,
        username: m.username,
        displayName: m.display_name,
        avatarUrl: m.avatar_url,
        role: m.role,
        isOnline: Boolean(m.is_online),
      })),
      feed: sanitizedFeed,
      upcomingEvents: eventsRes.rows,
      groups: groupsRes.rows,
      stats: statsRes.rows[0] ?? {},
    };
  },

  /**
   * Create a new event with redirect join link (Circle leaders/admins only).
   */
  async createEvent(
    circleId: string,
    userId: string,
    dto: {
      title: string;
      description?: string;
      coverUrl?: string;
      locationName?: string;
      startsAt: string;
      endsAt: string;
      joinLink?: string;
      isOnline?: boolean;
    },
  ) {
    const { rows } = await query(
      `INSERT INTO events (
        circle_id, creator_id, title, description, cover_url,
        location_name, starts_at, ends_at, join_link, is_online, status
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, 'published')
      RETURNING *`,
      [
        circleId,
        userId,
        dto.title,
        dto.description ?? null,
        dto.coverUrl ?? null,
        dto.locationName ?? null,
        new Date(dto.startsAt),
        new Date(dto.endsAt),
        dto.joinLink ?? null,
        Boolean(dto.isOnline || dto.joinLink),
      ],
    );
    return rows[0];
  },

  /**
   * Create an anonymous post in the circle.
   * Stores real author ID internally for abuse moderation, but assigns an alias for public display.
   */
  async createAnonymousPost(
    circleId: string,
    userId: string,
    dto: { content: string; mediaUrls?: string[] },
  ) {
    const randomAlias = ANONYMOUS_ALIASES[Math.floor(Math.random() * ANONYMOUS_ALIASES.length)];

    const { rows } = await query(
      `INSERT INTO posts (
        circle_id, user_id, caption, media_urls, type,
        target_destination, is_anonymous, anonymous_alias, visibility
      ) VALUES ($1, $2, $3, $4, $5, 'circle_only', TRUE, $6, 'public')
      RETURNING *`,
      [
        circleId,
        userId,
        dto.content,
        dto.mediaUrls ?? [],
        dto.mediaUrls && dto.mediaUrls.length > 0 ? 'image' : 'text',
        randomAlias,
      ],
    );

    const post = rows[0];
    return {
      id: post.id,
      circleId: post.circle_id,
      caption: post.caption,
      mediaUrls: post.media_urls,
      type: post.type,
      isAnonymous: true,
      anonymousAlias: post.anonymous_alias,
      authorName: 'Anonymous Member',
      createdAt: post.created_at,
    };
  },

  /**
   * Create a sub-group within the circle.
   */
  async createGroup(
    circleId: string,
    userId: string,
    dto: { name: string; description?: string; iconName?: string; isPrivate?: boolean },
  ) {
    const { rows } = await query(
      `INSERT INTO circle_groups (circle_id, created_by, name, description, icon_name, is_private)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [
        circleId,
        userId,
        dto.name,
        dto.description ?? null,
        dto.iconName ?? 'group',
        Boolean(dto.isPrivate),
      ],
    );

    const group = rows[0];
    // Automatically add creator as group admin
    await query(
      `INSERT INTO circle_group_members (group_id, user_id, role)
       VALUES ($1, $2, 'admin')
       ON CONFLICT (group_id, user_id) DO NOTHING`,
      [group.id, userId],
    );

    return group;
  },

  /**
   * Get messages inside a circle group.
   */
  async getGroupMessages(groupId: string, limit = 50) {
    const { rows } = await query(
      `SELECT m.*, p.username, p.display_name, p.avatar_url
       FROM circle_group_messages m
       LEFT JOIN profiles p ON p.user_id = m.sender_id
       WHERE m.group_id = $1
       ORDER BY m.created_at ASC
       LIMIT $2`,
      [groupId, limit],
    );
    return rows;
  },

  /**
   * Send a message to a circle group chat.
   */
  async sendGroupMessage(
    groupId: string,
    senderId: string,
    dto: { content: string; mediaUrl?: string },
  ) {
    const { rows } = await query(
      `INSERT INTO circle_group_messages (group_id, sender_id, content, media_url)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [groupId, senderId, dto.content, dto.mediaUrl ?? null],
    );
    return rows[0];
  },
};
