/**
 * @file circle.hub.test.ts
 * @description Unit tests for Circle Hub (5-tab navigation, events, anonymous identity security, groups).
 */

jest.mock('../db/index');

import { circleHubService } from '../modules/circle/circle.hub.service';
import { query } from '../db/index';
import { AppError } from '../middlewares/error.middleware';

const mockQuery = query as jest.MockedFunction<typeof query>;

beforeEach(() => {
  jest.clearAllMocks();
});

describe('circleHubService', () => {
  describe('createAnonymousPost', () => {
    it('creates an anonymous post with a sanitized alias and anonymous flag', async () => {
      mockQuery.mockResolvedValueOnce({
        rows: [
          {
            id: 'post-anon-1',
            circle_id: 'circle-1',
            user_id: 'author-real-uuid',
            caption: 'My anonymous confession',
            media_urls: [],
            type: 'text',
            is_anonymous: true,
            anonymous_alias: 'Shadow Falcon',
            created_at: new Date('2024-01-01T00:00:00Z'),
          },
        ],
        rowCount: 1,
      } as any);

      const result = await circleHubService.createAnonymousPost('circle-1', 'author-real-uuid', {
        content: 'My anonymous confession',
      });

      expect(mockQuery).toHaveBeenCalled();
      const insertSql = mockQuery.mock.calls[0][0] as string;
      expect(insertSql).toContain('INSERT INTO posts');
      expect(insertSql).toContain('is_anonymous');
      expect(result.id).toBe('post-anon-1');
      expect(result.isAnonymous).toBe(true);
      expect(result.authorName).toBe('Anonymous Member');
      expect(result.anonymousAlias).toBe('Shadow Falcon');
      // Verify real author userId is not exposed in public author metadata
      expect((result as any).user_id).toBeUndefined();
    });
  });

  describe('createEvent', () => {
    it('creates an event with external join redirect link', async () => {
      mockQuery.mockResolvedValueOnce({
        rows: [
          {
            id: 'event-1',
            circle_id: 'circle-1',
            creator_id: 'leader-1',
            title: 'Design Workshop',
            description: 'Learn UI/UX design',
            cover_url: 'https://example.com/cover.jpg',
            location_name: 'Zoom / Virtual',
            starts_at: new Date('2024-02-01T10:00:00Z'),
            ends_at: new Date('2024-02-01T12:00:00Z'),
            join_link: 'https://meet.google.com/abc-def-ghi',
            is_online: true,
            status: 'published',
          },
        ],
        rowCount: 1,
      } as any);

      const result = await circleHubService.createEvent('circle-1', 'leader-1', {
        title: 'Design Workshop',
        description: 'Learn UI/UX design',
        startsAt: '2024-02-01T10:00:00Z',
        endsAt: '2024-02-01T12:00:00Z',
        joinLink: 'https://meet.google.com/abc-def-ghi',
        isOnline: true,
      });

      expect(mockQuery).toHaveBeenCalled();
      expect(result.id).toBe('event-1');
      expect(result.join_link).toBe('https://meet.google.com/abc-def-ghi');
      expect(result.is_online).toBe(true);
    });
  });

  describe('createGroup', () => {
    it('creates a sub-group within the circle', async () => {
      mockQuery.mockResolvedValueOnce({
        rows: [
          {
            id: 'group-1',
            circle_id: 'circle-1',
            created_by: 'user-1',
            name: 'React Developers',
            description: 'Discuss React & Next.js',
            icon_name: 'code',
            is_private: false,
          },
        ],
        rowCount: 1,
      } as any);

      const result = await circleHubService.createGroup('circle-1', 'user-1', {
        name: 'React Developers',
        description: 'Discuss React & Next.js',
        iconName: 'code',
        isPrivate: false,
      });

      expect(mockQuery).toHaveBeenCalled();
      expect(result.name).toBe('React Developers');
      expect(result.is_private).toBe(false);
    });
  });

  describe('getCircleHome', () => {
    it('throws notFound if circle does not exist', async () => {
      mockQuery.mockResolvedValueOnce({ rows: [], rowCount: 0 } as any);

      await expect(
        circleHubService.getCircleHome('non-existent', 'user-1'),
      ).rejects.toThrow(AppError);
    });
  });
});
