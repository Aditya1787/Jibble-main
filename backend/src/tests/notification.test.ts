/**
 * @file notification.test.ts
 * @description Unit tests for notification module core flows.
 */

jest.mock('../modules/notification/notification.repository');

import { notificationService } from '../modules/notification/notification.service';
import { notificationRepository } from '../modules/notification/notification.repository';

const mockRepo = notificationRepository as jest.Mocked<typeof notificationRepository>;

const MOCK_NOTIFICATION_ROW = {
  id: 'notif-1',
  recipient_id: 'user-1',
  actor_id: 'actor-1',
  type: 'like',
  entity_type: 'post',
  entity_id: 'post-1',
  title: 'Liked your post',
  body: 'John Doe liked your post',
  deep_link: '/posts/post-1',
  is_read: false,
  created_at: new Date('2024-01-01T00:00:00Z'),
  actor_username: 'johndoe',
  actor_display_name: 'John Doe',
  actor_avatar: 'https://example.com/avatar.jpg',
};

beforeEach(() => {
  jest.clearAllMocks();
});

describe('notificationService', () => {
  it('getUserNotifications returns formatted NotificationDto array', async () => {
    mockRepo.getUserNotifications.mockResolvedValue([MOCK_NOTIFICATION_ROW as any]);

    const result = await notificationService.getUserNotifications('user-1', 20, 0);

    expect(mockRepo.getUserNotifications).toHaveBeenCalledWith('user-1', 20, 0);
    expect(result).toHaveLength(1);
    expect(result[0]).toEqual({
      id: 'notif-1',
      recipientId: 'user-1',
      actorId: 'actor-1',
      type: 'like',
      entityType: 'post',
      entityId: 'post-1',
      title: 'Liked your post',
      body: 'John Doe liked your post',
      deepLink: '/posts/post-1',
      isRead: false,
      createdAt: new Date('2024-01-01T00:00:00Z').toISOString(),
      actor: {
        username: 'johndoe',
        displayName: 'John Doe',
        avatarUrl: 'https://example.com/avatar.jpg',
      },
    });
  });

  it('markAsRead calls repository with correct parameters', async () => {
    mockRepo.markAsRead.mockResolvedValue(true);

    const result = await notificationService.markAsRead('notif-1', 'user-1');

    expect(mockRepo.markAsRead).toHaveBeenCalledWith('notif-1', 'user-1');
    expect(result).toBe(true);
  });

  it('markAllAsRead marks all and returns count', async () => {
    mockRepo.markAllAsRead.mockResolvedValue(5);

    const result = await notificationService.markAllAsRead('user-1');

    expect(mockRepo.markAllAsRead).toHaveBeenCalledWith('user-1');
    expect(result).toEqual({ markedCount: 5 });
  });

  it('getUnreadCount returns unread count object', async () => {
    mockRepo.getUnreadCount.mockResolvedValue(3);

    const result = await notificationService.getUnreadCount('user-1');

    expect(mockRepo.getUnreadCount).toHaveBeenCalledWith('user-1');
    expect(result).toEqual({ unreadCount: 3 });
  });
});
