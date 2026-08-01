/**
 * @file story.test.ts
 * @description Unit tests for Jibble story module services.
 */

jest.mock('../modules/story/story.repository');
jest.mock('../modules/profile/profile.repository');
jest.mock('../modules/story/story.mapper');

import { storyService } from '../modules/story/story.service';
import { storyRepository } from '../modules/story/story.repository';
import { profileRepository } from '../modules/profile/profile.repository';
import { storyMapper } from '../modules/story/story.mapper';

const mockStoryRepo = storyRepository as jest.Mocked<typeof storyRepository>;
const mockProfileRepo = profileRepository as jest.Mocked<typeof profileRepository>;
const mockStoryMapper = storyMapper as jest.Mocked<typeof storyMapper>;

const MOCK_PROFILE = {
  id: 'profile-uuid-1',
  user_id: 'user-uuid-1',
  username: 'alex_campus',
  display_name: 'Alex Campus',
  bio: 'Student',
  avatar_url: 'http://avatar.com/alex.jpg',
  cover_url: null,
  gender: null,
  date_of_birth: null,
  graduation_year: null,
  degree: null,
  department: null,
  website_url: null,
  instagram_url: null,
  linkedin_url: null,
  is_private: false,
  is_verified: true,
  followers_count: 5,
  following_count: 5,
  posts_count: 1,
  college_id: 'college-uuid-1',
  created_at: new Date(),
  updated_at: new Date(),
};

const MOCK_STORY_ROW = {
  id: 'story-uuid-1',
  user_id: 'user-uuid-1',
  type: 'image' as const,
  media_url: 'http://media.com/story.jpg',
  thumbnail_url: null,
  text_content: 'Campus vibe!',
  text_style: null,
  stickers: null,
  music: null,
  duration: 5,
  views_count: 0,
  is_highlight: false,
  highlight_id: null,
  expires_at: new Date(Date.now() + 86400000),
  created_at: new Date(),
  updated_at: new Date(),
  username: 'alex_campus',
  display_name: 'Alex Campus',
  avatar_url: 'http://avatar.com/alex.jpg',
  is_verified: true,
  has_viewed: false,
};

const MOCK_STORY_DTO = {
  id: 'story-uuid-1',
  userId: 'user-uuid-1',
  type: 'image' as const,
  mediaUrl: 'http://media.com/story.jpg',
  thumbnailUrl: null,
  textContent: 'Campus vibe!',
  textStyle: null,
  stickers: [],
  music: null,
  duration: 5,
  viewsCount: 0,
  isHighlight: false,
  highlightId: null,
  expiresAt: new Date(Date.now() + 86400000).toISOString(),
  createdAt: new Date().toISOString(),
  author: {
    username: 'alex_campus',
    displayName: 'Alex Campus',
    avatarUrl: 'http://avatar.com/alex.jpg',
    isVerified: true,
  },
  hasViewed: false,
};

beforeEach(() => {
  jest.clearAllMocks();
  mockStoryMapper.toDto.mockReturnValue(MOCK_STORY_DTO);
  mockStoryMapper.toDtoList.mockReturnValue([MOCK_STORY_DTO]);
});

describe('storyService.createStory', () => {
  it('creates story when user profile exists', async () => {
    mockProfileRepo.findByUserId.mockResolvedValue(MOCK_PROFILE as any);
    mockStoryRepo.create.mockResolvedValue(MOCK_STORY_ROW as any);
    mockStoryRepo.findById.mockResolvedValue(MOCK_STORY_ROW as any);

    const result = await storyService.createStory('user-uuid-1', {
      type: 'image',
      mediaUrl: 'http://media.com/story.jpg',
      textContent: 'Campus vibe!',
    });

    expect(mockProfileRepo.findByUserId).toHaveBeenCalledWith('user-uuid-1');
    expect(mockStoryRepo.create).toHaveBeenCalled();
    expect(result).toEqual(MOCK_STORY_DTO);
  });

  it('throws error if profile does not exist', async () => {
    mockProfileRepo.findByUserId.mockResolvedValue(null);

    await expect(
      storyService.createStory('user-uuid-1', {
        type: 'image',
        mediaUrl: 'http://media.com/story.jpg',
      })
    ).rejects.toMatchObject({
      code: 'PROFILE_REQUIRED',
      statusCode: 400,
    });
  });
});

describe('storyService.getFeedStories', () => {
  it('returns feed stories grouped by user with requester story first', async () => {
    mockStoryRepo.findActiveFeedStories.mockResolvedValue([MOCK_STORY_ROW as any]);

    const feed = await storyService.getFeedStories('user-uuid-1');

    expect(mockStoryRepo.findActiveFeedStories).toHaveBeenCalledWith('user-uuid-1');
    expect(feed.length).toBe(1);
    expect(feed[0].userId).toBe('user-uuid-1');
    expect(feed[0].stories[0]).toEqual(MOCK_STORY_DTO);
  });
});

describe('storyService.deleteStory', () => {
  it('deletes story if user is author', async () => {
    mockStoryRepo.findById.mockResolvedValue(MOCK_STORY_ROW as any);
    mockStoryRepo.delete.mockResolvedValue(true);

    const result = await storyService.deleteStory('story-uuid-1', 'user-uuid-1');

    expect(result).toEqual({ success: true });
  });

  it('throws forbidden error if user is not author', async () => {
    mockStoryRepo.findById.mockResolvedValue(MOCK_STORY_ROW as any);

    await expect(
      storyService.deleteStory('story-uuid-1', 'other-user')
    ).rejects.toMatchObject({
      code: 'FORBIDDEN',
      statusCode: 403,
    });
  });
});
