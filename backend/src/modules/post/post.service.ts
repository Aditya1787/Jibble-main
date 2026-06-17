/**
 * @file post.service.ts
 * @description Business logic for the Jibble post module.
 */

import { AppError } from '../../middlewares/error.middleware';
import { postRepository } from './post.repository';
import { postMapper } from './post.mapper';
import { profileRepository } from '../profile/profile.repository';
import { CreatePostDto } from './post.types';

export const postService = {
  /**
   * Create a new post.
   */
  async createPost(userId: string, dto: CreatePostDto) {
    // 1. Get requesting user's profile to extract college association
    const profile = await profileRepository.findByUserId(userId);
    if (!profile) {
      throw AppError.badRequest('User profile must be created before posting', 'PROFILE_REQUIRED');
    }

    const collegeId = profile.college_id;

    // 2. Business validation based on post type
    if (dto.type === 'carousel' && (!dto.mediaUrls || dto.mediaUrls.length === 0)) {
      throw AppError.badRequest('Carousel posts must include at least one media URL');
    }
    if (dto.type === 'image' && (!dto.mediaUrls || dto.mediaUrls.length === 0)) {
      throw AppError.badRequest('Image posts must include a media URL');
    }
    if (dto.type === 'video' && (!dto.mediaUrls || dto.mediaUrls.length === 0)) {
      throw AppError.badRequest('Video posts must include a media URL');
    }
    if (dto.type === 'link' && !dto.linkUrl) {
      throw AppError.badRequest('Link posts must include a link URL');
    }
    if (dto.type === 'poll' && (!dto.pollOptions || dto.pollOptions.length < 2)) {
      throw AppError.badRequest('Poll posts must have at least 2 options');
    }

    // 3. Create the post in DB
    const newRow = await postRepository.create(userId, dto, collegeId);

    // 4. Return complete post details (including author info)
    const postWithAuthor = await postRepository.findById(newRow.id, userId);
    if (!postWithAuthor) {
      throw AppError.internal('Failed to retrieve newly created post');
    }

    return postMapper.toDto(postWithAuthor);
  },

  /**
   * Get a single post by ID.
   */
  async getPostById(id: string, userId: string) {
    const row = await postRepository.findById(id, userId);
    if (!row) {
      throw AppError.notFound('Post not found', 'POST_NOT_FOUND');
    }
    return postMapper.toDto(row);
  },

  /**
   * Fetch home feed (paginated) for the authenticated user.
   */
  async getHomeFeed(userId: string, limit: number, offset: number) {
    const profile = await profileRepository.findByUserId(userId);
    const collegeId = profile ? profile.college_id : null;

    const rows = await postRepository.getHomeFeed(userId, collegeId, limit, offset);
    return postMapper.toDtoList(rows);
  },

  /**
   * Fetch posts for a specific user profile (paginated).
   */
  async getUserPosts(userId: string, targetUsername: string, limit: number, offset: number) {
    // 1. Resolve target username to target user ID
    const targetProfile = await profileRepository.findByUsername(targetUsername);
    if (!targetProfile) {
      throw AppError.notFound('User profile not found', 'USER_NOT_FOUND');
    }

    const isOwnProfile = userId === targetProfile.user_id;

    // 2. Query posts respecting visibility permissions
    const rows = await postRepository.getUserPosts(
      userId,
      targetProfile.user_id,
      limit,
      offset,
      isOwnProfile
    );
    return postMapper.toDtoList(rows);
  },

  /**
   * Delete a post. Ensures the post belongs to the requester.
   */
  async deletePost(id: string, userId: string) {
    const post = await postRepository.findById(id, userId);
    if (!post) {
      throw AppError.notFound('Post not found', 'POST_NOT_FOUND');
    }

    if (post.user_id !== userId) {
      throw AppError.forbidden('You do not have permission to delete this post', 'FORBIDDEN');
    }

    const deleted = await postRepository.delete(id, userId);
    if (!deleted) {
      throw AppError.internal('Failed to delete post');
    }
    return { success: true };
  },

  /**
   * Toggle like status on a post.
   */
  async toggleLike(userId: string, postId: string) {
    const post = await postRepository.findById(postId, userId);
    if (!post) {
      throw AppError.notFound('Post not found', 'POST_NOT_FOUND');
    }

    const result = await postRepository.toggleLike(userId, postId);
    return result;
  },
};
