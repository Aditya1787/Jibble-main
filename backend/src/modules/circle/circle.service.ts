/**
 * @file circle.service.ts
 * @description Business logic for Circles, Community Membership, Admin Approvals, and Component Toggles.
 */

import { AppError } from '../../middlewares/error.middleware';
import { circleRepository } from './circle.repository';
import { circleMapper } from './circle.mapper';
import { profileRepository } from '../profile/profile.repository';
import {
  CreateCircleDto,
  CircleDto,
  CircleConfigDto,
  UpdateComponentDto,
  ComponentToggleDto,
  MemberRole,
} from './circle.types';

export const circleService = {
  /**
   * Request creation of a new circle/community (status = 'pending').
   */
  async requestCircle(userId: string, dto: CreateCircleDto): Promise<CircleDto> {
    const profile = await profileRepository.findByUserId(userId);
    if (!profile) {
      throw AppError.badRequest('User profile must be created before requesting a community', 'PROFILE_REQUIRED');
    }

    // Auto-approve official college circles
    const isOfficialCollege = (dto.type === 'college' || dto.type === 'school') && (dto.collegeId || profile.college_id);
    const initialStatus = isOfficialCollege ? 'approved' : 'pending';
    const collegeId = dto.collegeId ?? profile.college_id;

    const newCircleRow = await circleRepository.createCircle(
      userId,
      { ...dto, collegeId },
      initialStatus
    );

    return circleMapper.toCircleDto(newCircleRow, 'owner');
  },

  /**
   * Approve a pending circle (Admin).
   */
  async approveCircle(circleId: string): Promise<CircleDto> {
    const circle = await circleRepository.findById(circleId);
    if (!circle) {
      throw AppError.notFound('Circle not found', 'CIRCLE_NOT_FOUND');
    }

    const approvedRow = await circleRepository.approveCircle(circleId);
    if (!approvedRow) {
      throw AppError.internal('Failed to approve circle');
    }

    return circleMapper.toCircleDto(approvedRow);
  },

  /**
   * Reject a pending circle (Admin).
   */
  async rejectCircle(circleId: string, reason?: string): Promise<CircleDto> {
    const circle = await circleRepository.findById(circleId);
    if (!circle) {
      throw AppError.notFound('Circle not found', 'CIRCLE_NOT_FOUND');
    }

    const rejectedRow = await circleRepository.rejectCircle(circleId, reason);
    if (!rejectedRow) {
      throw AppError.internal('Failed to reject circle');
    }

    return circleMapper.toCircleDto(rejectedRow);
  },

  /**
   * List pending circle requests for admin panel.
   */
  async getPendingCircles(): Promise<CircleDto[]> {
    const rows = await circleRepository.findPendingCircles();
    return rows.map((r) => circleMapper.toCircleDto(r));
  },

  /**
   * Fetch active circle configuration for a user (enabled tabs/features, user role, circle info).
   */
  async getUserCircleConfig(userId: string, requestedCircleId?: string): Promise<CircleConfigDto> {
    let targetCircle: any = null;

    if (requestedCircleId) {
      targetCircle = await circleRepository.findById(requestedCircleId);
      if (!targetCircle || targetCircle.status !== 'approved') {
        throw AppError.notFound('Circle not found or not approved', 'CIRCLE_NOT_FOUND');
      }
    } else {
      // 1. Try finding primary circle user joined
      targetCircle = await circleRepository.getUserPrimaryCircle(userId);

      // 2. If no primary circle found, fallback to auto-creating official college circle if profile has college
      if (!targetCircle) {
        const profile = await profileRepository.findByUserId(userId);
        if (profile && profile.college_id) {
          const collegeName = profile.branch ? `${profile.branch} Community` : 'Campus Community';
          targetCircle = await circleRepository.autoCreateCollegeCircle(profile.college_id, collegeName);
          // Auto-join user to their official college circle
          await circleRepository.addMember(targetCircle.id, userId, 'member');
        }
      }

      // 3. Fallback: create default general circle if none exists
      if (!targetCircle) {
        const generalCircle = await circleRepository.createCircle(
          userId,
          { name: 'Jibble Main Community', type: 'general', description: 'Default community circle' },
          'approved'
        );
        targetCircle = generalCircle;
      }
    }

    // Determine user role in this circle
    const role: MemberRole = (await circleRepository.getMemberRole(targetCircle.id, userId)) ?? 'member';

    // Fetch component toggles
    const componentRows = await circleRepository.getCircleComponents(targetCircle.id);

    return circleMapper.toCircleConfigDto(targetCircle, role, componentRows);
  },

  /**
   * Get circle by ID.
   */
  async getCircleById(circleId: string, userId?: string): Promise<CircleDto> {
    const circle = await circleRepository.findById(circleId);
    if (!circle) {
      throw AppError.notFound('Circle not found', 'CIRCLE_NOT_FOUND');
    }

    let userRole: MemberRole | null = null;
    if (userId) {
      userRole = await circleRepository.getMemberRole(circleId, userId);
    }

    return circleMapper.toCircleDto(circle, userRole);
  },

  /**
   * Join a circle.
   */
  async joinCircle(circleId: string, userId: string): Promise<{ success: boolean; role: MemberRole }> {
    const circle = await circleRepository.findById(circleId);
    if (!circle) {
      throw AppError.notFound('Circle not found', 'CIRCLE_NOT_FOUND');
    }

    if (circle.status !== 'approved') {
      throw AppError.badRequest('Cannot join a circle that is not approved');
    }

    await circleRepository.addMember(circleId, userId, 'member');
    return { success: true, role: 'member' };
  },

  /**
   * Leave a circle.
   */
  async leaveCircle(circleId: string, userId: string): Promise<{ success: boolean }> {
    const circle = await circleRepository.findById(circleId);
    if (!circle) {
      throw AppError.notFound('Circle not found', 'CIRCLE_NOT_FOUND');
    }

    const role = await circleRepository.getMemberRole(circleId, userId);
    if (role === 'owner') {
      throw AppError.badRequest('Circle owner cannot leave circle. Transfer ownership or delete circle.');
    }

    await circleRepository.removeMember(circleId, userId);
    return { success: true };
  },

  /**
   * Get component toggles for a circle.
   */
  async getCircleComponents(circleId: string): Promise<ComponentToggleDto[]> {
    const circle = await circleRepository.findById(circleId);
    if (!circle) {
      throw AppError.notFound('Circle not found', 'CIRCLE_NOT_FOUND');
    }

    const rows = await circleRepository.getCircleComponents(circleId);
    return circleMapper.toComponentToggleDtoList(rows);
  },

  /**
   * Toggle or configure a component for a circle (Owner / Admin only).
   */
  async toggleComponent(
    circleId: string,
    userId: string,
    componentKey: string,
    dto: UpdateComponentDto
  ): Promise<ComponentToggleDto> {
    const role = await circleRepository.getMemberRole(circleId, userId);
    if (!role || (role !== 'owner' && role !== 'admin')) {
      throw AppError.forbidden('Only circle owners and admins can toggle feature components', 'FORBIDDEN');
    }

    const updatedRow = await circleRepository.updateComponent(circleId, componentKey, dto);
    if (!updatedRow) {
      throw AppError.internal('Failed to update component toggle');
    }

    return circleMapper.toComponentToggleDto(updatedRow);
  },

  /**
   * List all 10 component templates available in Jibble.
   */
  async getComponentTemplates() {
    const templates = await circleRepository.getComponentTemplates();
    return templates.map((t) => ({
      key: t.key,
      name: t.name,
      description: t.description,
      icon: t.icon,
      isDefault: t.is_default,
      displayOrder: t.display_order,
    }));
  },
};
