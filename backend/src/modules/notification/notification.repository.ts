/**
 * @file notification.repository.ts
 * @description Notification queries and updates.
 */

import { query } from '../../db/index';
import { NotificationRow } from './notification.types';

export const notificationRepository = {
  async getUserNotifications(userId: string, limit = 30, offset = 0): Promise<NotificationRow[]> {
    const res = await query(
      `SELECT n.*,
              p.username AS actor_username,
              p.display_name AS actor_display_name,
              p.avatar_url AS actor_avatar
       FROM notifications n
       LEFT JOIN profiles p ON p.user_id = n.actor_id
       WHERE n.recipient_id = $1
       ORDER BY n.created_at DESC
       LIMIT $2 OFFSET $3`,
      [userId, limit, offset]
    );
    return res.rows as NotificationRow[];
  },

  async markAsRead(id: string, userId: string): Promise<boolean> {
    const res = await query(
      `UPDATE notifications SET is_read = TRUE WHERE id = $1 AND recipient_id = $2 RETURNING id`,
      [id, userId]
    );
    return (res.rowCount ?? 0) > 0;
  },

  async markAllAsRead(userId: string): Promise<number> {
    const res = await query(
      `UPDATE notifications SET is_read = TRUE WHERE recipient_id = $1 AND is_read = FALSE`,
      [userId]
    );
    return res.rowCount ?? 0;
  },

  async getUnreadCount(userId: string): Promise<number> {
    const res = await query(
      `SELECT COUNT(*)::text AS count FROM notifications WHERE recipient_id = $1 AND is_read = FALSE`,
      [userId]
    );
    return Number((res.rows[0] as { count?: string })?.count ?? 0);
  },
};
