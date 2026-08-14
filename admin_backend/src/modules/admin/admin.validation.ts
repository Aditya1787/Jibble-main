/**
 * @file modules/admin/admin.validation.ts
 * @description Zod validation schemas for all admin API inputs in admin_backend.
 */

import { z } from 'zod';

// ── OTP Schemas ───────────────────────────────────────────────────────────────

// Helper to convert incoming camelCase payloads to snake_case
const normalizeKeys = (obj: any) => {
  if (!obj || typeof obj !== 'object' || Array.isArray(obj)) return obj;
  const map: Record<string, string> = {
    fullName: 'full_name',
    avatarEmoji: 'avatar_emoji',
    avatarUrl: 'avatar_url',
    reportsToId: 'reports_to_id',
    mobileNumber: 'mobile_number',
    favFood: 'fav_food',
    joinedDate: 'joined_date',
    authUserId: 'auth_user_id',
    leadEmployeeId: 'lead_employee_id',
    leadName: 'lead_name',
    employeeId: 'employee_id',
    teamRole: 'team_role',
    teamId: 'team_id',
    teamName: 'team_name',
    targetDate: 'target_date',
    projectId: 'project_id',
    projectName: 'project_name',
    assigneeId: 'assignee_id',
    assigneeName: 'assignee_name',
    assigneeAvatar: 'assignee_avatar',
    dueDate: 'due_date',
    effectiveDate: 'effective_date',
    isMandatory: 'is_mandatory',
    complianceRate: 'compliance_rate',
    gdprCompliant: 'gdpr_compliant',
    piiMaskingEnabled: 'pii_masking_enabled',
    dataRetentionMonths: 'data_retention_months',
    auditLoggingEnabled: 'audit_logging_enabled',
    autoArchiveInactiveUsers: 'auto_archive_inactive_users',
  };
  const out: any = { ...obj };
  for (const [camel, snake] of Object.entries(map)) {
    if (obj[camel] !== undefined && obj[snake] === undefined) {
      out[snake] = obj[camel];
    }
  }
  return out;
};

// ── OTP & Auth Schemas ────────────────────────────────────────────────────────

export const sendOtpSchema = z.object({
  type: z.enum(['email', 'mobile']),
  recipient: z.string().min(3, 'Recipient is required'),
});

export const verifyOtpSchema = z.object({
  type: z.enum(['email', 'mobile']),
  recipient: z.string().min(3, 'Recipient is required'),
  otp: z.string().length(6, 'OTP code must be exactly 6 digits'),
});

export const checkUsernameSchema = z.preprocess(
  normalizeKeys,
  z.object({
    username: z.string().min(1, 'Username is required'),
    exclude_id: z.string().optional().nullable(),
  })
);

export const forgotPasswordSchema = z.preprocess(
  normalizeKeys,
  z.object({
    email: z.string().email('Valid email address is required'),
  })
);

export const resetPasswordSchema = z.preprocess(
  normalizeKeys,
  z.object({
    email: z.string().email(),
    otp: z.string().length(6, 'OTP code must be 6 digits'),
    new_password: z.string().min(6, 'Password must be at least 6 characters'),
  })
);

export type SendOtpInput = z.infer<typeof sendOtpSchema>;
export type VerifyOtpInput = z.infer<typeof verifyOtpSchema>;
export type CheckUsernameInput = z.infer<typeof checkUsernameSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;

// ── Employee Schemas ──────────────────────────────────────────────────────────

export const createEmployeeSchema = z.preprocess(
  normalizeKeys,
  z.object({
    auth_user_id: z.string().uuid().optional().nullable(),
    username: z.string().min(2).max(50),
    full_name: z.string().min(2).max(120),
    email: z.string().email(),
    avatar_emoji: z.string().default('👤'),
    avatar_url: z.string().url().optional().nullable(),
    role: z.string().min(2),
    category: z.string().min(2),
    subcategory: z.string().optional().nullable(),
    reports_to_id: z.string().uuid().optional().nullable(),
    location: z.string().optional().nullable(),
    mobile_number: z.string().optional().nullable(),
    hometown: z.string().optional().nullable(),
    fav_food: z.string().optional().nullable(),
    hobbies: z.array(z.string()).optional().default([]),
    joined_date: z.string().optional(),
  })
);

export const updateEmployeeSchema = z.preprocess(
  normalizeKeys,
  createEmployeeSchema.innerType().partial()
);

export type CreateEmployeeInput = z.infer<typeof createEmployeeSchema>;
export type UpdateEmployeeInput = z.infer<typeof updateEmployeeSchema>;

// ── Team Schemas ──────────────────────────────────────────────────────────────

export const createTeamSchema = z.preprocess(
  normalizeKeys,
  z.object({
    name: z.string().min(2).max(100),
    department: z.string().min(2),
    lead_employee_id: z.string().optional().nullable(),
    lead_name: z.string().optional().nullable(),
    description: z.string().optional().nullable(),
  })
);

export const updateTeamSchema = z.preprocess(
  normalizeKeys,
  createTeamSchema.innerType().partial()
);

export const addTeamMemberSchema = z.preprocess(
  normalizeKeys,
  z.object({
    employee_id: z.string(),
    team_role: z.string().min(1).default('Member'),
    joined_date: z.string().optional(),
  })
);

export type CreateTeamInput = z.infer<typeof createTeamSchema>;
export type UpdateTeamInput = z.infer<typeof updateTeamSchema>;
export type AddTeamMemberInput = z.infer<typeof addTeamMemberSchema>;

// ── Project Schemas ───────────────────────────────────────────────────────────

export const createProjectSchema = z.preprocess(
  normalizeKeys,
  z.object({
    name: z.string().min(2).max(200),
    team_id: z.string().optional().nullable(),
    team_name: z.string().optional().nullable(),
    status: z.enum(['planning', 'in_progress', 'completed', 'on_hold']).default('planning'),
    description: z.string().optional().nullable(),
    target_date: z.string().optional().nullable(),
  })
);

export const updateProjectSchema = z.preprocess(
  normalizeKeys,
  createProjectSchema.innerType().partial()
);

export type CreateProjectInput = z.infer<typeof createProjectSchema>;
export type UpdateProjectInput = z.infer<typeof updateProjectSchema>;

// ── Task Schemas ──────────────────────────────────────────────────────────────

export const createTaskSchema = z.preprocess(
  normalizeKeys,
  z.object({
    title: z.string().min(2).max(300),
    project_id: z.string().optional().nullable(),
    project_name: z.string().optional().nullable(),
    assignee_id: z.string().optional().nullable(),
    assignee_name: z.string().optional().nullable(),
    assignee_avatar: z.string().optional().nullable(),
    priority: z.enum(['low', 'medium', 'high', 'urgent']).default('medium'),
    status: z.enum(['todo', 'in_progress', 'in_review', 'completed']).default('todo'),
    cadence: z.enum(['day', 'week', 'month', 'year']).default('week'),
    due_date: z.string().optional().nullable(),
    description: z.string().optional().nullable(),
  })
);

export const updateTaskSchema = z.preprocess(
  normalizeKeys,
  createTaskSchema.innerType().partial()
);

export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;

// ── Policy Schemas ────────────────────────────────────────────────────────────

export const createPolicySchema = z.preprocess(
  normalizeKeys,
  z.object({
    title: z.string().min(2).max(200),
    category: z.enum(['Data Privacy', 'Security', 'Code of Conduct', 'Remote Work', 'Access Control']),
    content: z.string().optional().nullable(),
    version: z.string().default('v1.0'),
    effective_date: z.string().optional().nullable(),
    is_mandatory: z.boolean().default(true),
    compliance_rate: z.number().int().min(0).max(100).default(0),
  })
);

export const updatePolicySchema = z.preprocess(
  normalizeKeys,
  createPolicySchema.innerType().partial()
);

export type CreatePolicyInput = z.infer<typeof createPolicySchema>;
export type UpdatePolicyInput = z.infer<typeof updatePolicySchema>;

// ── Privacy Settings Schemas ──────────────────────────────────────────────────

export const updatePrivacySettingsSchema = z.preprocess(
  normalizeKeys,
  z.object({
    gdpr_compliant: z.boolean().optional(),
    pii_masking_enabled: z.boolean().optional(),
    data_retention_months: z.number().int().positive().optional(),
    audit_logging_enabled: z.boolean().optional(),
    auto_archive_inactive_users: z.boolean().optional(),
  })
);

export type UpdatePrivacySettingsInput = z.infer<typeof updatePrivacySettingsSchema>;

