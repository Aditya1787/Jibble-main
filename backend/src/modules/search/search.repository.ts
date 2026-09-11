/**
 * @file search.repository.ts
 * @description Search queries across users, circles, events, and groups.
 */

import { query } from '../../db/index';
import {
  UserSearchResult,
  CircleSearchResult,
  EventSearchResult,
  GroupSearchResult,
} from './search.types';

export const searchRepository = {
  async searchUsers(term: string, limit = 15): Promise<UserSearchResult[]> {
    const pattern = `%${term}%`;
    const res = await query(
      `SELECT p.user_id AS id, p.username, p.display_name, p.avatar_url, p.bio, p.is_verified
       FROM profiles p
       JOIN users u ON u.id = p.user_id
       WHERE (p.username ILIKE $1 OR p.display_name ILIKE $1)
         AND u.status = 'active'
       ORDER BY p.followers_count DESC, p.created_at DESC
       LIMIT $2`,
      [pattern, limit]
    );

    return res.rows.map((r) => ({
      id: r.id,
      username: r.username,
      displayName: r.display_name,
      avatarUrl: r.avatar_url,
      bio: r.bio,
      isVerified: Boolean(r.is_verified),
    }));
  },

  async searchCircles(term: string, limit = 15): Promise<CircleSearchResult[]> {
    const pattern = `%${term}%`;
    const res = await query(
      `SELECT c.id, c.name, c.slug, c.description, c.avatar_url, c.type, c.members_count
       FROM circles c
       WHERE c.is_archived = FALSE
         AND (c.name ILIKE $1 OR c.description ILIKE $1)
       ORDER BY c.members_count DESC
       LIMIT $2`,
      [pattern, limit]
    );

    return res.rows.map((r) => ({
      id: r.id,
      name: r.name,
      slug: r.slug,
      description: r.description,
      avatarUrl: r.avatar_url,
      type: r.type,
      membersCount: Number(r.members_count ?? 0),
    }));
  },

  async searchEvents(term: string, limit = 15): Promise<EventSearchResult[]> {
    const pattern = `%${term}%`;
    const res = await query(
      `SELECT e.id, e.circle_id, e.title, e.description, e.cover_url, e.location_name, e.starts_at, e.join_link
       FROM events e
       WHERE (e.title ILIKE $1 OR e.description ILIKE $1)
         AND e.ends_at >= NOW()
       ORDER BY e.starts_at ASC
       LIMIT $2`,
      [pattern, limit]
    );

    return res.rows.map((r) => ({
      id: r.id,
      circleId: r.circle_id,
      title: r.title,
      description: r.description,
      coverUrl: r.cover_url,
      locationName: r.location_name,
      startsAt: new Date(r.starts_at).toISOString(),
      joinLink: r.join_link,
    }));
  },

  async searchGroups(term: string, limit = 15): Promise<GroupSearchResult[]> {
    const pattern = `%${term}%`;
    const res = await query(
      `SELECT g.id, g.circle_id, g.name, g.description, g.icon_name, g.members_count
       FROM circle_groups g
       WHERE (g.name ILIKE $1 OR g.description ILIKE $1)
       ORDER BY g.members_count DESC
       LIMIT $2`,
      [pattern, limit]
    );

    return res.rows.map((r) => ({
      id: r.id,
      circleId: r.circle_id,
      name: r.name,
      description: r.description,
      iconName: r.icon_name ?? 'group',
      membersCount: Number(r.members_count ?? 0),
    }));
  },
};
