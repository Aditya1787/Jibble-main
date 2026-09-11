/**
 * @file notification.types.ts
 * @description Types for the Notification module.
 */

export interface NotificationRow {
  id: string;
  recipient_id: string;
  actor_id: string | null;
  type: string;
  entity_type: string | null;
  entity_id: string | null;
  title: string | null;
  body: string | null;
  deep_link: string | null;
  is_read: boolean;
  is_pushed: boolean;
  metadata: any | null;
  created_at: Date;

  // Joined from actor profile
  actor_username?: string;
  actor_display_name?: string;
  actor_avatar?: string | null;
}

export interface NotificationDto {
  id: string;
  recipientId: string;
  actorId: string | null;
  type: string;
  entityType: string | null;
  entityId: string | null;
  title: string;
  body: string;
  deepLink: string | null;
  isRead: boolean;
  createdAt: string;
  actor: {
    username: string;
    displayName: string;
    avatarUrl: string | null;
  } | null;
}
