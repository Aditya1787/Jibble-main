/**
 * @file modules/admin/admin.validation.ts
 * @description Zod validation schemas for all admin API inputs in admin_backend.
 */

import { z } from 'zod';

// ── OTP Schemas ───────────────────────────────────────────────────────────────

export const sendOtpSchema = z.object({
  type: z.enum(['email', 'mobile']),
  recipient: z.string().min(3, 'Recipient is required'),
});

export const verifyOtpSchema = z.object({
  type: z.enum(['email', 'mobile']),
  recipient: z.string().min(3, 'Recipient is required'),
  otp: z.string().length(6, 'OTP code must be exactly 6 digits'),
});

export type SendOtpInput = z.infer<typeof sendOtpSchema>;
export type VerifyOtpInput = z.infer<typeof verifyOtpSchema>;

// ── Employee Schemas ──────────────────────────────────────────────────────────

export const createEmployeeSchema = z.object({
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
});

export const updateEmployeeSchema = createEmployeeSchema.partial();

export type CreateEmployeeInput = z.infer<typeof createEmployeeSchema>;
export type UpdateEmployeeInput = z.infer<typeof updateEmployeeSchema>;

// ── Team Schemas ──────────────────────────────────────────────────────────────

export const createTeamSchema = z.object({
  name: z.string().min(2).max(100),
  department: z.string().min(2),
  lead_employee_id: z.string().uuid().optional().nullable(),
  lead_name: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
});

export const updateTeamSchema = createTeamSchema.partial();

export const addTeamMemberSchema = z.object({
  employee_id: z.string().uuid(),
  team_role: z.string().min(1).default('Member'),
  joined_date: z.string().optional(),
});

export type CreateTeamInput = z.infer<typeof createTeamSchema>;
export type UpdateTeamInput = z.infer<typeof updateTeamSchema>;
export type AddTeamMemberInput = z.infer<typeof addTeamMemberSchema>;

// ── Project Schemas ───────────────────────────────────────────────────────────

export const createProjectSchema = z.object({
  name: z.string().min(2).max(200),
  team_id: z.string().uuid().optional().nullable(),
  team_name: z.string().optional().nullable(),
  status: z.enum(['planning', 'in_progress', 'completed', 'on_hold']).default('planning'),
  description: z.string().optional().nullable(),
  target_date: z.string().optional().nullable(),
});

export const updateProjectSchema = createProjectSchema.partial();

export type CreateProjectInput = z.infer<typeof createProjectSchema>;
export type UpdateProjectInput = z.infer<typeof updateProjectSchema>;

// ── Task Schemas ──────────────────────────────────────────────────────────────

export const createTaskSchema = z.object({
  title: z.string().min(2).max(300),
  project_id: z.string().uuid().optional().nullable(),
  project_name: z.string().optional().nullable(),
  assignee_id: z.string().uuid().optional().nullable(),
  assignee_name: z.string().optional().nullable(),
  assignee_avatar: z.string().optional().nullable(),
  priority: z.enum(['low', 'medium', 'high', 'urgent']).default('medium'),
  status: z.enum(['todo', 'in_progress', 'in_review', 'completed']).default('todo'),
  cadence: z.enum(['day', 'week', 'month', 'year']).default('week'),
  due_date: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
});

export const updateTaskSchema = createTaskSchema.partial();

export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;

// ── Policy Schemas ────────────────────────────────────────────────────────────

export const createPolicySchema = z.object({
  title: z.string().min(2).max(200),
  category: z.enum(['Data Privacy', 'Security', 'Code of Conduct', 'Remote Work', 'Access Control']),
  content: z.string().optional().nullable(),
  version: z.string().default('v1.0'),
  effective_date: z.string().optional().nullable(),
  is_mandatory: z.boolean().default(true),
  compliance_rate: z.number().int().min(0).max(100).default(0),
});

export const updatePolicySchema = createPolicySchema.partial();

export type CreatePolicyInput = z.infer<typeof createPolicySchema>;
export type UpdatePolicyInput = z.infer<typeof updatePolicySchema>;

// ── Privacy Settings Schemas ──────────────────────────────────────────────────

export const updatePrivacySettingsSchema = z.object({
  gdpr_compliant: z.boolean().optional(),
  pii_masking_enabled: z.boolean().optional(),
  data_retention_months: z.number().int().positive().optional(),
  audit_logging_enabled: z.boolean().optional(),
  auto_archive_inactive_users: z.boolean().optional(),
});

export type UpdatePrivacySettingsInput = z.infer<typeof updatePrivacySettingsSchema>;
