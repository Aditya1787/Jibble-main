/**
 * @file notification.service.ts
 * @description Notification service logic.
 */

import { notificationRepository } from './notification.repository';
import { NotificationDto } from './notification.types';

export const notificationService = {
  async getUserNotifications(userId: string, limit = 30, offset = 0): Promise<NotificationDto[]> {
    const rows = await notificationRepository.getUserNotifications(userId, limit, offset);
    return rows.map((r) => ({
      id: r.id,
      recipientId: r.recipient_id,
      actorId: r.actor_id,
      type: r.type,
      entityType: r.entity_type,
      entityId: r.entity_id,
      title: r.title ?? 'New Notification',
      body: r.body ?? '',
      deepLink: r.deep_link,
      isRead: Boolean(r.is_read),
      createdAt: new Date(r.created_at).toISOString(),
      actor: r.actor_username
        ? {
            username: r.actor_username,
            displayName: r.actor_display_name ?? r.actor_username,
            avatarUrl: r.actor_avatar ?? null,
          }
        : null,
    }));
  },

  async markAsRead(id: string, userId: string) {
    return notificationRepository.markAsRead(id, userId);
  },

  async markAllAsRead(userId: string) {
    const count = await notificationRepository.markAllAsRead(userId);
    return { markedCount: count };
  },

  async getUnreadCount(userId: string) {
    const count = await notificationRepository.getUnreadCount(userId);
    return { unreadCount: count };
  },
};
