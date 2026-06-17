/**
 * @file post.test.ts
 * @description Unit tests for Jibble post module services.
 *              Mocks repositories and checks business rules.
 */

jest.mock('../modules/post/post.repository');
jest.mock('../modules/profile/profile.repository');
jest.mock('../modules/post/post.mapper');

import { postService } from '../modules/post/post.service';
import { postRepository } from '../modules/post/post.repository';
import { profileRepository } from '../modules/profile/profile.repository';
import { postMapper } from '../modules/post/post.mapper';

const mockPostRepo = postRepository as jest.Mocked<typeof postRepository>;
const mockProfileRepo = profileRepository as jest.Mocked<typeof profileRepository>;
const mockPostMapper = postMapper as jest.Mocked<typeof postMapper>;

// Fixtures
const MOCK_PROFILE = {
  id: 'profile-uuid',
  user_id: 'user-uuid-1',
  username: 'john_doe',
  display_name: 'John Doe',
  bio: 'Hello world',
  avatar_url: 'http://avatar.com',
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
  is_verified: false,
  followers_count: 0,
  following_count: 0,
  posts_count: 0,
  college_id: 'college-uuid-1',
  created_at: new Date(),
  updated_at: new Date(),
};

const MOCK_POST_ROW = {
  id: 'post-uuid',
  user_id: 'user-uuid-1',
  college_id: 'college-uuid-1',
  type: 'text' as const,
  visibility: 'public' as const,
  caption: 'My first post',
  media_urls: [],
  thumbnail_url: null,
  link_url: null,
  link_preview: null,
  poll_options: null,
  poll_ends_at: null,
  location: null,
  hashtags: [],
  mentions: [],
  is_pinned: false,
  is_archived: false,
  likes_count: 0,
  comments_count: 0,
  shares_count: 0,
  views_count: 0,
  created_at: new Date(),
  updated_at: new Date(),
  username: 'john_doe',
  display_name: 'John Doe',
  avatar_url: 'http://avatar.com',
  is_verified: false,
  is_liked: false,
};

const MOCK_POST_DTO = {
  id: 'post-uuid',
  userId: 'user-uuid-1',
  collegeId: 'college-uuid-1',
  type: 'text' as const,
  visibility: 'public' as const,
  caption: 'My first post',
  mediaUrls: [],
  thumbnailUrl: null,
  linkUrl: null,
  linkPreview: null,
  pollOptions: null,
  pollEndsAt: null,
  location: null,
  hashtags: [],
  mentions: [],
  isPinned: false,
  isArchived: false,
  likesCount: 0,
  commentsCount: 0,
  sharesCount: 0,
  viewsCount: 0,
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z',
  author: {
    username: 'john_doe',
    displayName: 'John Doe',
    avatarUrl: 'http://avatar.com',
    isVerified: false,
  },
  isLiked: false,
};

beforeEach(() => {
  jest.clearAllMocks();
  mockPostMapper.toDto.mockReturnValue(MOCK_POST_DTO);
  mockPostMapper.toDtoList.mockReturnValue([MOCK_POST_DTO]);
});

describe('postService.createPost', () => {
  it('successfully creates a text post when profile exists', async () => {
    mockProfileRepo.findByUserId.mockResolvedValue(MOCK_PROFILE as any);
    mockPostRepo.create.mockResolvedValue(MOCK_POST_ROW as any);
    mockPostRepo.findById.mockResolvedValue(MOCK_POST_ROW as any);

    const result = await postService.createPost('user-uuid-1', {
      type: 'text',
      visibility: 'public',
      caption: 'My first post',
    });

    expect(mockProfileRepo.findByUserId).toHaveBeenCalledWith('user-uuid-1');
    expect(mockPostRepo.create).toHaveBeenCalledWith(
      'user-uuid-1',
      { type: 'text', visibility: 'public', caption: 'My first post' },
      'college-uuid-1'
    );
    expect(result).toEqual(MOCK_POST_DTO);
  });

  it('throws error if profile does not exist', async () => {
    mockProfileRepo.findByUserId.mockResolvedValue(null);

    await expect(
      postService.createPost('user-uuid-1', {
        type: 'text',
        visibility: 'public',
        caption: 'My first post',
      })
    ).rejects.toMatchObject({
      code: 'PROFILE_REQUIRED',
      statusCode: 400,
    });
  });

  it('throws validation error for image post without mediaUrls', async () => {
    mockProfileRepo.findByUserId.mockResolvedValue(MOCK_PROFILE as any);

    await expect(
      postService.createPost('user-uuid-1', {
        type: 'image',
        visibility: 'public',
        caption: 'My first post',
      })
    ).rejects.toMatchObject({
      statusCode: 400,
    });
  });
});

describe('postService.getPostById', () => {
  it('returns post details when it exists', async () => {
    mockPostRepo.findById.mockResolvedValue(MOCK_POST_ROW as any);

    const result = await postService.getPostById('post-uuid', 'user-uuid-1');

    expect(mockPostRepo.findById).toHaveBeenCalledWith('post-uuid', 'user-uuid-1');
    expect(result).toEqual(MOCK_POST_DTO);
  });

  it('throws 404 when post does not exist', async () => {
    mockPostRepo.findById.mockResolvedValue(null);

    await expect(
      postService.getPostById('nonexistent-uuid', 'user-uuid-1')
    ).rejects.toMatchObject({
      code: 'POST_NOT_FOUND',
      statusCode: 404,
    });
  });
});

describe('postService.deletePost', () => {
  it('successfully deletes a post if requester is owner', async () => {
    mockPostRepo.findById.mockResolvedValue(MOCK_POST_ROW as any);
    mockPostRepo.delete.mockResolvedValue(true);

    const result = await postService.deletePost('post-uuid', 'user-uuid-1');

    expect(mockPostRepo.findById).toHaveBeenCalledWith('post-uuid', 'user-uuid-1');
    expect(mockPostRepo.delete).toHaveBeenCalledWith('post-uuid', 'user-uuid-1');
    expect(result).toEqual({ success: true });
  });

  it('throws 403 forbidden if user is not author of post', async () => {
    mockPostRepo.findById.mockResolvedValue(MOCK_POST_ROW as any);

    await expect(
      postService.deletePost('post-uuid', 'user-uuid-other')
    ).rejects.toMatchObject({
      code: 'FORBIDDEN',
      statusCode: 403,
    });
  });
});
