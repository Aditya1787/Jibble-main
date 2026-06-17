/**
 * @file user.service.ts
 * @description User module business logic.
 */

import { AppError } from '../../middlewares/error.middleware';
import { userRepository } from './user.repository';
import { userMapper } from './user.mapper';

export const userService = {
  async getById(id: string) {
    const user = await userRepository.findById(id);
    if (!user) throw AppError.notFound('User not found');
    return userMapper.toDto(user);
  },

  async deleteAccount(userId: string): Promise<void> {
    const user = await userRepository.findById(userId);
    if (!user) throw AppError.notFound('User not found');
    await userRepository.anonymize(userId);
  },
};
