/**
 * @file circle.mapper.ts
 * @description Maps database rows to safe camelCase DTOs for Circles and Components.
 */

import {
  CircleRow,
  CircleDto,
  CommunityComponentRow,
  ComponentToggleDto,
  CircleConfigDto,
  MemberRole,
} from './circle.types';

export const circleMapper = {
  toCircleDto(row: CircleRow, userRole?: MemberRole | null): CircleDto {
    return {
      id: row.id,
      name: row.name,
      slug: row.slug,
      description: row.description ?? null,
      avatarUrl: row.avatar_url ?? null,
      bannerUrl: row.banner_url ?? null,
      type: row.type,
      status: row.status,
      collegeId: row.college_id ?? null,
      collegeName: row.college_name ?? null,
      createdBy: row.created_by ?? null,
      isPrivate: row.is_private ?? false,
      membersCount: Number(row.members_count ?? 1),
      rejectionReason: row.rejection_reason ?? null,
      createdAt: new Date(row.created_at).toISOString(),
      updatedAt: new Date(row.updated_at).toISOString(),
      userRole: userRole ?? row.user_role ?? null,
    };
  },

  toComponentToggleDto(row: CommunityComponentRow): ComponentToggleDto {
    const templateName = row.template_name ?? row.component_key;
    return {
      key: row.component_key,
      name: templateName,
      customName: row.custom_name ?? null,
      displayName: row.custom_name && row.custom_name.trim().length > 0
        ? row.custom_name
        : templateName,
      description: row.template_description ?? null,
      icon: row.template_icon ?? null,
      isEnabled: row.is_enabled ?? true,
      displayOrder: row.display_order ?? 0,
      settings: parseJsonObject(row.settings),
    };
  },

  toComponentToggleDtoList(rows: CommunityComponentRow[]): ComponentToggleDto[] {
    return rows.map((r) => this.toComponentToggleDto(r));
  },

  toCircleConfigDto(
    circleRow: CircleRow,
    userRole: MemberRole,
    componentRows: CommunityComponentRow[]
  ): CircleConfigDto {
    const enabledComponentRows = componentRows.filter((r) => r.is_enabled);
    return {
      circle: this.toCircleDto(circleRow, userRole),
      userRole,
      enabledComponents: this.toComponentToggleDtoList(enabledComponentRows),
    };
  },
};

function parseJsonObject(val: unknown): Record<string, any> | null {
  if (!val) return null;
  if (typeof val === 'object' && !Array.isArray(val)) {
    return val as Record<string, any>;
  }
  if (typeof val === 'string') {
    try {
      const parsed = JSON.parse(val);
      return typeof parsed === 'object' && !Array.isArray(parsed) ? parsed : null;
    } catch {
      return null;
    }
  }
  return null;
}
