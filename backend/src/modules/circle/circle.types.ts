/**
 * @file circle.types.ts
 * @description Type definitions for the Circle (Community) module.
 */

export type CircleType =
  | 'college'
  | 'school'
  | 'interest'
  | 'creator'
  | 'organization'
  | 'general';

export type CircleStatus = 'pending' | 'approved' | 'rejected';

export type MemberRole = 'owner' | 'admin' | 'moderator' | 'member';

export interface CircleRow {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  avatar_url: string | null;
  banner_url: string | null;
  type: CircleType;
  status: CircleStatus;
  college_id: string | null;
  created_by: string | null;
  is_private: boolean;
  members_count: number;
  rejection_reason: string | null;
  created_at: Date;
  updated_at: Date;

  // Joined college name if any
  college_name?: string;
  user_role?: MemberRole;
}

export interface CircleMemberRow {
  id: string;
  circle_id: string;
  user_id: string;
  role: MemberRole;
  joined_at: Date;

  // Joined profile info
  username?: string;
  display_name?: string;
  avatar_url?: string | null;
}

export interface ComponentTemplateRow {
  key: string;
  name: string;
  description: string | null;
  icon: string | null;
  is_default: boolean;
  display_order: number;
  created_at: Date;
}

export interface CommunityComponentRow {
  id: string;
  circle_id: string;
  component_key: string;
  is_enabled: boolean;
  custom_name: string | null;
  settings: any | null;
  display_order: number;
  created_at: Date;
  updated_at: Date;

  // Joined template info
  template_name?: string;
  template_description?: string;
  template_icon?: string;
}

export interface ComponentToggleDto {
  key: string;
  name: string;
  customName: string | null;
  displayName: string;
  description: string | null;
  icon: string | null;
  isEnabled: boolean;
  displayOrder: number;
  settings: Record<string, any> | null;
}

export interface CircleDto {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  avatarUrl: string | null;
  bannerUrl: string | null;
  type: CircleType;
  status: CircleStatus;
  collegeId: string | null;
  collegeName: string | null;
  createdBy: string | null;
  isPrivate: boolean;
  membersCount: number;
  rejectionReason: string | null;
  createdAt: string;
  updatedAt: string;
  userRole: MemberRole | null;
}

export interface CircleConfigDto {
  circle: CircleDto;
  userRole: MemberRole;
  enabledComponents: ComponentToggleDto[];
}

export interface CreateCircleDto {
  name: string;
  description?: string | null;
  type?: CircleType;
  collegeId?: string | null;
  isPrivate?: boolean;
  avatarUrl?: string | null;
  bannerUrl?: string | null;
}

export interface ApproveCircleDto {
  status: 'approved';
}

export interface RejectCircleDto {
  reason?: string;
}

export interface UpdateComponentDto {
  isEnabled?: boolean;
  customName?: string | null;
  settings?: Record<string, any> | null;
  displayOrder?: number;
}
