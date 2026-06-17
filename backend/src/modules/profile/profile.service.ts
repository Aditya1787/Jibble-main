/**
 * @file profile.service.ts
 * @description Profile module business logic.
 */

import { AppError } from '../../middlewares/error.middleware';
import { profileRepository } from './profile.repository';
import { userRepository } from '../user/user.repository';
import { collegeRepository } from '../college/college.repository';
import type { ProfileDto, ProfileRow, CreateProfileDto, UpdateProfileDto } from './profile.types';

const toDto = (row: ProfileRow): ProfileDto => ({
  id: row.id,
  userId: row.user_id,
  username: row.username,
  displayName: row.display_name,
  bio: row.bio,
  avatarUrl: row.avatar_url,
  collegeId: row.college_id,
  year: row.year,
  branch: row.branch,
  skills: row.skills,
  interests: row.interests,
  socialLinks: row.social_links,
  isPublic: row.is_public,
  followersCount: row.followers_count,
  followingCount: row.following_count,
  postsCount: row.posts_count,
  createdAt: row.created_at,
});

export const profileService = {
  async createProfile(dto: CreateProfileDto) {
    // 1. Check if user already has a profile
    const existing = await profileRepository.findByUserId(dto.userId);
    if (existing) {
      throw AppError.conflict('Profile already exists for this user', 'PROFILE_EXISTS');
    }

    // 2. Check if username is taken
    const usernameTaken = await profileRepository.usernameExists(dto.username);
    if (usernameTaken) {
      throw AppError.conflict('Username is already taken', 'USERNAME_TAKEN');
    }

    // 3. Verify college exists if provided
    if (dto.collegeId) {
      const college = await collegeRepository.findById(dto.collegeId);
      if (!college) throw AppError.badRequest('Invalid college ID');
    }

    const row = await profileRepository.create(dto);
    return toDto(row);
  },

  async getMyProfile(userId: string) {
    const row = await profileRepository.findByUserId(userId);
    if (!row) throw AppError.notFound('Profile not found', 'PROFILE_NOT_FOUND');
    return toDto(row);
  },

  async getProfileByUsername(username: string) {
    const row = await profileRepository.findByUsername(username);
    if (!row) throw AppError.notFound('Profile not found', 'PROFILE_NOT_FOUND');
    
    // In a real app we'd filter restricted fields if not public/following, 
    // but returning full for now as per MVP.
    return toDto(row);
  },

  async updateProfile(userId: string, dto: UpdateProfileDto) {
    // 1. Check if profile exists
    const profile = await profileRepository.findByUserId(userId);
    if (!profile) throw AppError.notFound('Profile not found');

    // 2. Check username availability if changing
    if (dto.username && dto.username.toLowerCase() !== profile.username.toLowerCase()) {
      const taken = await profileRepository.usernameExists(dto.username, userId);
      if (taken) throw AppError.conflict('Username is already taken', 'USERNAME_TAKEN');
    }

    // 3. Verify college if changing
    if (dto.collegeId && dto.collegeId !== profile.college_id) {
      const college = await collegeRepository.findById(dto.collegeId);
      if (!college) throw AppError.badRequest('Invalid college ID');
    }

    const updated = await profileRepository.update(userId, dto);
    if (!updated) throw AppError.internal('Failed to update profile');
    
    return toDto(updated);
  },

  async checkUsernameAvailable(username: string) {
    const taken = await profileRepository.usernameExists(username);
    return !taken;
  }
};
