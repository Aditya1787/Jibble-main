/**
 * @file story.service.ts
 * @description Business logic for the Story module.
 */

import { AppError } from '../../middlewares/error.middleware';
import { storyRepository } from './story.repository';
import { storyMapper } from './story.mapper';
import { profileRepository } from '../profile/profile.repository';
import { CreateStoryDto, UserStoryGroupDto, StoryDto } from './story.types';

export const storyService = {
  /**
   * Create a new story.
   */
  async createStory(userId: string, dto: CreateStoryDto): Promise<StoryDto> {
    const profile = await profileRepository.findByUserId(userId);
    if (!profile) {
      throw AppError.badRequest('User profile must exist to create a story', 'PROFILE_REQUIRED');
    }

    if (dto.type === 'image' && !dto.mediaUrl && !dto.textContent) {
      throw AppError.badRequest('Image story requires mediaUrl or textContent');
    }

    const row = await storyRepository.create(userId, dto);
    const storyRow = await storyRepository.findById(row.id);
    if (!storyRow) {
      throw AppError.internal('Failed to retrieve newly created story');
    }

    return storyMapper.toDto(storyRow);
  },

  /**
   * Fetch active stories grouped by user for the home feed.
   * Ensures requesting user's story group appears first if present.
   */
  async getFeedStories(userId: string): Promise<UserStoryGroupDto[]> {
    const rows = await storyRepository.findActiveFeedStories(userId);

    // Group rows by user_id
    const groupsMap = new Map<string, UserStoryGroupDto>();

    for (const row of rows) {
      const dto = storyMapper.toDto(row);
      const uid = row.user_id;

      if (!groupsMap.has(uid)) {
        groupsMap.set(uid, {
          userId: uid,
          username: row.username ?? 'user',
          displayName: row.display_name ?? 'User',
          avatarUrl: row.avatar_url ?? null,
          isVerified: row.is_verified ?? false,
          hasUnread: !dto.hasViewed,
          stories: [],
        });
      }

      const group = groupsMap.get(uid)!;
      group.stories.push(dto);
      if (!dto.hasViewed) {
        group.hasUnread = true;
      }
    }

    const groupsList = Array.from(groupsMap.values());

    // Sort: user's own group first, then other users with unread stories, then read stories
    groupsList.sort((a, b) => {
      if (a.userId === userId) return -1;
      if (b.userId === userId) return 1;
      if (a.hasUnread && !b.hasUnread) return -1;
      if (!a.hasUnread && b.hasUnread) return 1;
      return 0;
    });

    return groupsList;
  },

  /**
   * Get active stories for a specific user.
   */
  async getUserStories(targetUserId: string): Promise<StoryDto[]> {
    const rows = await storyRepository.findActiveUserStories(targetUserId);
    return storyMapper.toDtoList(rows);
  },

  /**
   * Increment view counter on a story.
   */
  async viewStory(id: string): Promise<{ success: boolean }> {
    const story = await storyRepository.findById(id);
    if (!story) {
      throw AppError.notFound('Story not found', 'STORY_NOT_FOUND');
    }

    await storyRepository.incrementViews(id);
    return { success: true };
  },

  /**
   * Delete story.
   */
  async deleteStory(id: string, userId: string): Promise<{ success: boolean }> {
    const story = await storyRepository.findById(id);
    if (!story) {
      throw AppError.notFound('Story not found', 'STORY_NOT_FOUND');
    }

    if (story.user_id !== userId) {
      throw AppError.forbidden('You do not have permission to delete this story', 'FORBIDDEN');
    }

    const deleted = await storyRepository.delete(id, userId);
    if (!deleted) {
      throw AppError.internal('Failed to delete story');
    }

    return { success: true };
  },
};
