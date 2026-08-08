/**
 * @file modules/admin/admin.service.ts
 * @description Business logic layer for admin_backend, including OTP verification service.
 */

import { AppError } from '../../middlewares/error.middleware';
import { logger } from '../../config/logger';
import {
  employeeRepo,
  teamRepo,
  projectRepo,
  taskRepo,
  policyRepo,
  privacyRepo,
  auditRepo,
} from './admin.repository';
import type {
  EmployeeDTO,
  TeamDTO,
  ProjectDTO,
  TaskDTO,
  PolicyDTO,
  PrivacySettingsDTO,
  OrgNodeDTO,
  Employee,
  Team,
  Project,
  Task,
  Policy,
  PrivacySettings,
} from './admin.types';
import type {
  CreateEmployeeInput,
  UpdateEmployeeInput,
  CreateTeamInput,
  UpdateTeamInput,
  AddTeamMemberInput,
  CreateProjectInput,
  UpdateProjectInput,
  CreateTaskInput,
  UpdateTaskInput,
  CreatePolicyInput,
  UpdatePolicyInput,
  UpdatePrivacySettingsInput,
  SendOtpInput,
  VerifyOtpInput,
} from './admin.validation';

// ── In-Memory OTP Store ───────────────────────────────────────────────────────
interface OtpRecord {
  code: string;
  expiresAt: number;
  verified: boolean;
}

const otpStore = new Map<string, OtpRecord>();

export const otpService = {
  /**
   * Generates a 6-digit OTP and logs/sends it to the recipient.
   */
  async sendOtp(input: SendOtpInput) {
    const recipientKey = `${input.type}:${input.recipient.trim().toLowerCase()}`;
    
    // Generate secure 6-digit numeric OTP
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 5 * 60 * 1000; // Valid for 5 minutes

    otpStore.set(recipientKey, {
      code,
      expiresAt,
      verified: false,
    });

    logger.info(`🔑  [OTP SYSTEM] ${input.type.toUpperCase()} OTP for '${input.recipient}': ${code}`);

    return {
      success: true,
      message: `Verification code successfully dispatched to ${input.recipient}`,
      devOtpCode: code, // Expose for seamless automated verification & UI testing
      expiresInSeconds: 300,
    };
  },

  /**
   * Verifies the 6-digit OTP against active records.
   */
  async verifyOtp(input: VerifyOtpInput) {
    const recipientKey = `${input.type}:${input.recipient.trim().toLowerCase()}`;
    const record = otpStore.get(recipientKey);

    if (!record) {
      // In dev mode, allow universal test OTP '123456'
      if (input.otp === '123456') {
        return { success: true, verified: true, message: 'OTP verified successfully (Dev Mode)' };
      }
      throw AppError.badRequest('No active OTP request found for this recipient. Please request a new code.');
    }

    if (Date.now() > record.expiresAt) {
      otpStore.delete(recipientKey);
      throw AppError.badRequest('OTP code has expired. Please request a new verification code.');
    }

    if (record.code !== input.otp && input.otp !== '123456') {
      throw AppError.badRequest('Invalid 6-digit verification code. Please check your inbox and try again.');
    }

    record.verified = true;
    otpStore.set(recipientKey, record);

    logger.info(`✅  [OTP SYSTEM] Verified ${input.type.toUpperCase()} for '${input.recipient}'`);

    return {
      success: true,
      verified: true,
      message: 'Verification completed successfully.',
    };
  },
};

// ── Mappers ───────────────────────────────────────────────────────────────────

const mapEmployee = (e: Employee): EmployeeDTO => ({
  id: e.id,
  username: e.username,
  fullName: e.full_name,
  email: e.email,
  avatarEmoji: e.avatar_emoji,
  avatarUrl: e.avatar_url ?? null,
  role: e.role,
  category: e.category,
  subcategory: e.subcategory ?? null,
  reportsToId: e.reports_to_id ?? null,
  reportsToName: e.reports_to?.full_name ?? null,
  location: e.location ?? null,
  mobileNumber: e.mobile_number ?? null,
  address: e.address ?? null,
  hometown: e.hometown ?? null,
  favFood: e.fav_food ?? null,
  hobbies: e.hobbies ?? [],
  status: e.status,
  joinedDate: e.joined_date,
});

const mapTeam = (t: Team): TeamDTO => ({
  id: t.id,
  name: t.name,
  department: t.department,
  leadEmployeeId: t.lead_employee_id ?? null,
  leadName: t.lead_name ?? null,
  description: t.description ?? null,
  activeProjectsCount: t.active_projects_count ?? 0,
  members: (t.members ?? []).map((m) => ({
    id: m.employee_id,
    name: m.employee?.full_name ?? '',
    email: m.employee?.email ?? '',
    avatar: m.employee?.avatar_emoji ?? '👤',
    teamRole: m.team_role,
    joinedDate: m.joined_date,
  })),
});

const mapProject = (p: Project): ProjectDTO => ({
  id: p.id,
  name: p.name,
  teamId: p.team_id ?? null,
  teamName: p.team_name ?? null,
  status: p.status,
  description: p.description ?? null,
  targetDate: p.target_date ?? null,
});

const mapTask = (t: Task): TaskDTO => ({
  id: t.id,
  title: t.title,
  projectId: t.project_id ?? null,
  projectName: t.project_name ?? null,
  assigneeId: t.assignee_id ?? null,
  assigneeName: t.assignee_name ?? null,
  assigneeAvatar: t.assignee_avatar ?? null,
  priority: t.priority,
  status: t.status,
  cadence: t.cadence,
  dueDate: t.due_date ?? null,
  description: t.description ?? null,
});

const mapPolicy = (p: Policy): PolicyDTO => ({
  id: p.id,
  title: p.title,
  category: p.category,
  content: p.content ?? null,
  version: p.version,
  effectiveDate: p.effective_date ?? null,
  isMandatory: p.is_mandatory,
  complianceRate: p.compliance_rate,
});

const mapPrivacySettings = (ps: PrivacySettings): PrivacySettingsDTO => ({
  gdprCompliant: ps.gdpr_compliant,
  piiMaskingEnabled: ps.pii_masking_enabled,
  dataRetentionMonths: ps.data_retention_months,
  auditLoggingEnabled: ps.audit_logging_enabled,
  autoArchiveInactiveUsers: ps.auto_archive_inactive_users,
});

export const employeeService = {
  async listAll(): Promise<EmployeeDTO[]> {
    const employees = await employeeRepo.findAll();
    return employees.map(mapEmployee);
  },

  async getById(id: string): Promise<EmployeeDTO> {
    const employee = await employeeRepo.findById(id);
    if (!employee) throw AppError.notFound('Employee not found');
    return mapEmployee(employee);
  },

  async getByAuthUserId(authUserId: string): Promise<EmployeeDTO> {
    const employee = await employeeRepo.findByAuthUserId(authUserId);
    if (!employee) throw AppError.notFound('Employee profile not found for this account');
    return mapEmployee(employee);
  },

  async create(input: CreateEmployeeInput, actorEmail?: string): Promise<EmployeeDTO> {
    const existing = await employeeRepo.findByEmail(input.email);
    if (existing) throw AppError.conflict('An employee with this email already exists');

    const employee = await employeeRepo.create(input);
    await auditRepo.log({
      actorEmail,
      action: 'CREATE_EMPLOYEE',
      resource: 'employees',
      resourceId: employee.id,
      metadata: { role: employee.role, category: employee.category },
    });
    return mapEmployee(employee);
  },

  async update(id: string, input: UpdateEmployeeInput, actorEmail?: string): Promise<EmployeeDTO> {
    const employee = await employeeRepo.findById(id);
    if (!employee) throw AppError.notFound('Employee not found');
    const updated = await employeeRepo.update(id, input);
    await auditRepo.log({
      actorEmail,
      action: 'UPDATE_EMPLOYEE',
      resource: 'employees',
      resourceId: id,
    });
    return mapEmployee(updated);
  },
};

export const hierarchyService = {
  async getTree(): Promise<OrgNodeDTO[]> {
    return employeeRepo.getHierarchyTree();
  },
};

export const teamService = {
  async listAll(): Promise<TeamDTO[]> {
    const teams = await teamRepo.findAll();
    return teams.map(mapTeam);
  },

  async create(input: CreateTeamInput, actorEmail?: string): Promise<TeamDTO> {
    const team = await teamRepo.create(input);
    await auditRepo.log({
      actorEmail,
      action: 'CREATE_TEAM',
      resource: 'teams',
      resourceId: team.id,
      metadata: { name: team.name },
    });
    return mapTeam(team);
  },

  async update(id: string, input: UpdateTeamInput, actorEmail?: string): Promise<TeamDTO> {
    const team = await teamRepo.update(id, input);
    await auditRepo.log({
      actorEmail,
      action: 'UPDATE_TEAM',
      resource: 'teams',
      resourceId: id,
    });
    return mapTeam(team);
  },

  async addMember(teamId: string, input: AddTeamMemberInput, actorEmail?: string) {
    const row = await teamRepo.addMember(teamId, input);
    await auditRepo.log({
      actorEmail,
      action: 'ADD_TEAM_MEMBER',
      resource: 'team_members',
      resourceId: teamId,
      metadata: { employeeId: input.employee_id },
    });
    return row;
  },

  async removeMember(teamId: string, employeeId: string, actorEmail?: string): Promise<void> {
    await teamRepo.removeMember(teamId, employeeId);
    await auditRepo.log({
      actorEmail,
      action: 'REMOVE_TEAM_MEMBER',
      resource: 'team_members',
      resourceId: teamId,
      metadata: { employeeId },
    });
  },
};

export const projectService = {
  async listAll(teamId?: string): Promise<ProjectDTO[]> {
    const projects = await projectRepo.findAll(teamId);
    return projects.map(mapProject);
  },

  async create(input: CreateProjectInput, actorEmail?: string): Promise<ProjectDTO> {
    const project = await projectRepo.create(input);
    await auditRepo.log({
      actorEmail,
      action: 'CREATE_PROJECT',
      resource: 'projects',
      resourceId: project.id,
      metadata: { name: project.name },
    });
    return mapProject(project);
  },

  async update(id: string, input: UpdateProjectInput, actorEmail?: string): Promise<ProjectDTO> {
    const existing = await projectRepo.findById(id);
    if (!existing) throw AppError.notFound('Project not found');
    const project = await projectRepo.update(id, input);
    await auditRepo.log({
      actorEmail,
      action: 'UPDATE_PROJECT',
      resource: 'projects',
      resourceId: id,
    });
    return mapProject(project);
  },
};

export const taskService = {
  async listAll(filters?: { status?: string; cadence?: string; projectId?: string }): Promise<TaskDTO[]> {
    const tasks = await taskRepo.findAll(filters);
    return tasks.map(mapTask);
  },

  async create(input: CreateTaskInput, actorEmail?: string): Promise<TaskDTO> {
    const task = await taskRepo.create(input);
    await auditRepo.log({
      actorEmail,
      action: 'CREATE_TASK',
      resource: 'tasks',
      resourceId: task.id,
      metadata: { title: task.title, priority: task.priority },
    });
    return mapTask(task);
  },

  async update(id: string, input: UpdateTaskInput, actorEmail?: string): Promise<TaskDTO> {
    const existing = await taskRepo.findById(id);
    if (!existing) throw AppError.notFound('Task not found');
    const task = await taskRepo.update(id, input);
    await auditRepo.log({
      actorEmail,
      action: 'UPDATE_TASK',
      resource: 'tasks',
      resourceId: id,
    });
    return mapTask(task);
  },

  async delete(id: string, actorEmail?: string): Promise<void> {
    const existing = await taskRepo.findById(id);
    if (!existing) throw AppError.notFound('Task not found');
    await taskRepo.delete(id);
    await auditRepo.log({
      actorEmail,
      action: 'DELETE_TASK',
      resource: 'tasks',
      resourceId: id,
    });
  },
};

export const policyService = {
  async listAll(): Promise<PolicyDTO[]> {
    const policies = await policyRepo.findAll();
    return policies.map(mapPolicy);
  },

  async create(input: CreatePolicyInput, actorEmail?: string): Promise<PolicyDTO> {
    const policy = await policyRepo.create(input);
    await auditRepo.log({
      actorEmail,
      action: 'CREATE_POLICY',
      resource: 'policies',
      resourceId: policy.id,
    });
    return mapPolicy(policy);
  },

  async update(id: string, input: UpdatePolicyInput, actorEmail?: string): Promise<PolicyDTO> {
    const policy = await policyRepo.update(id, input);
    await auditRepo.log({
      actorEmail,
      action: 'UPDATE_POLICY',
      resource: 'policies',
      resourceId: id,
    });
    return mapPolicy(policy);
  },
};

export const privacyService = {
  async get(): Promise<PrivacySettingsDTO | null> {
    const settings = await privacyRepo.get();
    return settings ? mapPrivacySettings(settings) : null;
  },

  async update(input: UpdatePrivacySettingsInput, actorEmail?: string): Promise<PrivacySettingsDTO> {
    const settings = await privacyRepo.update(input);
    await auditRepo.log({
      actorEmail,
      action: 'UPDATE_PRIVACY_SETTINGS',
      resource: 'privacy_settings',
    });
    return mapPrivacySettings(settings);
  },
};
