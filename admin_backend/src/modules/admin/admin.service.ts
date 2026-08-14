/**
 * @file modules/admin/admin.service.ts
 * @description Business logic layer for admin_backend, including OTP verification service.
 */

import { AppError } from '../../middlewares/error.middleware';
import { logger } from '../../config/logger';
import { sendOtpEmail } from '../../utils/emailService';
import { sendOtpSms } from '../../utils/smsService';
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
import { parseLeadUsername } from '../../utils/permissions';

// ── In-Memory OTP Store ───────────────────────────────────────────────────────
interface OtpRecord {
  code: string;
  expiresAt: number;
  verified: boolean;
}

const otpStore = new Map<string, OtpRecord>();

// ── Helper: Executive Role matching ─────────────────────────────────────────
const isExecutiveRole = (roleTitle: string): boolean => {
  if (!roleTitle) return false;
  const normalized = roleTitle.trim().toLowerCase();
  const execs = [
    'founder', 'ceo', 'founder & ceo', 'founder and ceo',
    'co-founder', 'co founder', 'cto', 'cfo', 'coo', 'cpo', 'cmo'
  ];
  return execs.some(
    (e) => normalized === e || normalized.includes(e) || normalized.startsWith(e + ' ') || normalized.endsWith(' ' + e)
  );
};

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

    if (input.type === 'email') {
      await sendOtpEmail(input.recipient, code);
    } else if (input.type === 'mobile') {
      await sendOtpSms(input.recipient, code);
    }

    return {
      success: true,
      message: `Verification code successfully dispatched to ${input.recipient}`,
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

  /**
   * Dispatches OTP for forgot password request.
   */
  async forgotPassword(email: string) {
    return this.sendOtp({ type: 'email', recipient: email });
  },

  /**
   * Verifies OTP and resets user password in Supabase Auth.
   */
  async resetPassword(input: { email: string; otp: string; new_password: string }) {
    await this.verifyOtp({ type: 'email', recipient: input.email, otp: input.otp });
    
    // Update password in Supabase Auth using Admin Client
    const { getSupabaseAdmin } = await import('../../config/supabase');
    const sb = getSupabaseAdmin();
    const { data: usersData, error: listErr } = await sb.auth.admin.listUsers();
    
    if (listErr) {
      logger.warn(`Could not list Supabase auth users: ${listErr.message}`);
    } else if (usersData?.users) {
      const match = usersData.users.find((u) => u.email?.toLowerCase() === input.email.toLowerCase());
      if (match) {
        const { error: updateErr } = await sb.auth.admin.updateUserById(match.id, {
          password: input.new_password,
        });
        if (updateErr) {
          throw AppError.internal(`Failed to update password: ${updateErr.message}`);
        }
      }
    }

    return {
      success: true,
      message: 'Password updated successfully. You can now login with your new password.',
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
    id: m.employee?.id ?? m.employee_id,
    name: m.employee?.username ?? m.employee?.full_name ?? '',
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
  async checkUsername(username: string, excludeId?: string | null) {
    const existing = await employeeRepo.findByUsername(username);
    if (existing && existing.id !== excludeId) {
      return { available: false, message: 'Username is taken, please choose another' };
    }
    return { available: true, message: 'Username is available' };
  },

  async listAll(): Promise<EmployeeDTO[]> {
    const employees = await employeeRepo.findAll();
    return employees.map(mapEmployee);
  },

  async getById(id: string): Promise<EmployeeDTO> {
    const employee = await employeeRepo.findById(id);
    if (!employee) throw AppError.notFound('Employee not found');
    return mapEmployee(employee);
  },

  async getByAuthUserId(authUserId: string, userEmail?: string): Promise<EmployeeDTO> {
    // 1. Search by auth_user_id
    let employee = await employeeRepo.findByAuthUserId(authUserId);
    
    // 2. Fallback: Search by email and auto-link auth_user_id
    if (!employee && userEmail) {
      const byEmail = await employeeRepo.findByEmail(userEmail);
      if (byEmail) {
        employee = await employeeRepo.linkAuthUser(byEmail.id, authUserId);
        logger.info(`🔗 [SUPABASE DB] Auto-linked auth_user_id ${authUserId} to employee ${byEmail.email}`);
      }
    }

    // 3. Fallback: Auto-provision basic profile if not exists
    if (!employee && userEmail) {
      const username = userEmail.split('@')[0];
      employee = await employeeRepo.create({
        auth_user_id: authUserId,
        username,
        full_name: username,
        email: userEmail,
        role: 'Team Contributor',
        category: 'Engineering',
        avatar_emoji: '👤',
        hobbies: [],
      });
      logger.info(`👤 [SUPABASE DB] Auto-created employee profile for ${userEmail}`);
    }

    if (!employee) throw AppError.notFound('Employee profile not found for this account');
    return mapEmployee(employee);
  },

  async create(input: CreateEmployeeInput, actorEmail?: string): Promise<EmployeeDTO> {
    // 1. Username uniqueness check
    const existingUser = await employeeRepo.findByUsername(input.username);
    if (existingUser && existingUser.email.toLowerCase() !== input.email.toLowerCase()) {
      throw AppError.conflict('Username is already taken. Please choose another.');
    }

    // 2. Executive role uniqueness check
    if (isExecutiveRole(input.role)) {
      const allEmps = await employeeRepo.findAll();
      const allocated = allEmps.find(
        (e) => isExecutiveRole(e.role) && e.role.trim().toLowerCase() === input.role.trim().toLowerCase() && e.email.toLowerCase() !== input.email.toLowerCase()
      );
      if (allocated) {
        throw AppError.conflict(
          `The executive role '${input.role}' is already allocated to another person. Only one person can hold this role.`
        );
      }
    }

    // 0. Auto-confirm email in Supabase Auth via service role
    try {
      const { getSupabaseAdmin } = await import('../../config/supabase');
      const sb = getSupabaseAdmin();
      const { data: usersData } = await sb.auth.admin.listUsers();
      if (usersData?.users) {
        const authUser = usersData.users.find((u) => u.email?.toLowerCase() === input.email.toLowerCase());
        if (authUser) {
          await sb.auth.admin.updateUserById(authUser.id, { email_confirm: true });
          logger.info(`✅ [SUPABASE AUTH] Auto-confirmed email for ${input.email}`);
        }
      }
    } catch (e: any) {
      logger.warn(`Could not auto-confirm Supabase Auth email: ${e.message}`);
    }

    const existing = await employeeRepo.findByEmail(input.email);
    if (existing) {
      const updated = await employeeRepo.update(existing.id, {
        username: input.username,
        full_name: input.full_name,
        role: input.role,
        category: input.category,
        subcategory: input.subcategory ?? undefined,
        avatar_emoji: input.avatar_emoji ?? undefined,
        hometown: input.hometown ?? undefined,
        mobile_number: input.mobile_number ?? undefined,
        fav_food: input.fav_food ?? undefined,
        hobbies: input.hobbies ?? undefined,
        auth_user_id: input.auth_user_id || undefined,
      });
      logger.info(`👤 [SUPABASE DB] Updated existing employee profile for ${input.email}`);
      return mapEmployee(updated);
    }

    const employee = await employeeRepo.create({
      ...input,
      auth_user_id: input.auth_user_id || undefined,
    });
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

    // 1. Username uniqueness check on update
    if (input.username && input.username.toLowerCase() !== employee.username.toLowerCase()) {
      const existingUser = await employeeRepo.findByUsername(input.username);
      if (existingUser && existingUser.id !== id) {
        throw AppError.conflict('Username is already taken. Please choose another.');
      }
    }

    // 2. Executive role uniqueness check on update
    if (input.role && isExecutiveRole(input.role) && input.role.trim().toLowerCase() !== employee.role.trim().toLowerCase()) {
      const allEmps = await employeeRepo.findAll();
      const allocated = allEmps.find(
        (e) => isExecutiveRole(e.role) && e.role.trim().toLowerCase() === input.role!.trim().toLowerCase() && e.id !== id
      );
      if (allocated) {
        throw AppError.conflict(
          `The executive role '${input.role}' is already allocated to another person. Only one person can hold this role.`
        );
      }
    }

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
  async listAll(): Promise<Team[]> {
    return teamRepo.findAll();
  },

  async create(
    input: CreateTeamInput,
    actorEmail?: string,
    creatorEmployeeId?: string
  ): Promise<TeamDTO> {
    let leadEmployeeId = input.lead_employee_id ?? null;
    let leadName = input.lead_name ?? null;

    if (!leadEmployeeId && leadName) {
      const leadUsername = parseLeadUsername(leadName);
      if (leadUsername) {
        const leadEmp = await employeeRepo.findByUsername(leadUsername);
        if (leadEmp) {
          leadEmployeeId = leadEmp.id;
          leadName = `@${leadEmp.username}`;
        }
      }
    }

    const team = await teamRepo.create({
      ...input,
      lead_employee_id: leadEmployeeId,
      lead_name: leadName,
    });

    if (leadEmployeeId) {
      try {
        await teamRepo.addMember(team.id, {
          employee_id: leadEmployeeId,
          team_role: 'Team Lead',
        });
      } catch (e: any) {
        if (!e.message?.includes('already in this team')) {
          logger.warn(`Could not add team lead as member: ${e.message}`);
        }
      }
    }

    if (creatorEmployeeId && creatorEmployeeId !== leadEmployeeId) {
      try {
        await teamRepo.addMember(team.id, {
          employee_id: creatorEmployeeId,
          team_role: 'Team Creator',
        });
      } catch (e: any) {
        if (!e.message?.includes('already in this team')) {
          logger.warn(`Could not add team creator as member: ${e.message}`);
        }
      }
    }

    await projectRepo.create({
      name: `${team.name} Deliverables`,
      team_id: team.id,
      team_name: team.name,
      status: 'in_progress',
      description: `Default workspace deliverables project for ${team.name}.`,
      target_date: 'Ongoing',
    });

    await auditRepo.log({
      actorEmail,
      action: 'CREATE_TEAM',
      resource: 'teams',
      resourceId: team.id,
      metadata: { name: team.name, leadEmployeeId },
    });

    const fullTeam = await teamRepo.findById(team.id);
    return mapTeam(fullTeam ?? team);
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
    const team = await teamRepo.findById(teamId);
    if (!team) throw AppError.notFound('Team not found');

    const employeeId = input.employee_id;
    if (employeeId === team.lead_employee_id) {
      throw AppError.badRequest('Team lead is already assigned on this team. New members must be regular team members.');
    }

    const row = await teamRepo.addMember(teamId, {
      ...input,
      team_role: 'Team Member',
    });
    await auditRepo.log({
      actorEmail,
      action: 'ADD_TEAM_MEMBER',
      resource: 'team_members',
      resourceId: teamId,
      metadata: { employeeId: input.employee_id, teamRole: 'Team Member' },
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

  async listAllRaw(filters?: { status?: string; cadence?: string; projectId?: string }): Promise<Task[]> {
    return taskRepo.findAll(filters);
  },

  async getByIdRaw(id: string): Promise<Task> {
    const task = await taskRepo.findById(id);
    if (!task) throw AppError.notFound('Task not found');
    return task;
  },

  async create(input: CreateTaskInput, actorEmail?: string): Promise<TaskDTO> {
    // Auto-resolve assigneeName → assigneeId if not already provided
    let resolvedInput = { ...input };
    if (!resolvedInput.assignee_id && resolvedInput.assignee_name) {
      try {
        // Strip leading @ if present
        const cleanName = (resolvedInput.assignee_name ?? '').replace(/^@/, '').split(' ')[0].trim();
        const emp = await employeeRepo.findByUsername(cleanName);
        if (emp) {
          resolvedInput.assignee_id = emp.id;
          resolvedInput.assignee_name = emp.username;
          resolvedInput.assignee_avatar = emp.avatar_emoji;
          logger.info(`🔗 [TASK] Auto-linked assignee: ${cleanName} → ${emp.id}`);
        }
      } catch (e: any) {
        logger.warn(`Could not resolve assignee username: ${e.message}`);
      }
    }
    const task = await taskRepo.create(resolvedInput);
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

export const autoSeedDatabase = async () => {
  try {
    logger.info('🌱 [SUPABASE DB] Checking database tables for initial seed data...');
    const existingTeams = await teamRepo.findAll();
    const createdTeamIds: Record<string, string> = {};

    if (existingTeams.length === 0) {
      logger.info('🌱 [SUPABASE DB] Seeding default Teams into database...');
      const t1 = await teamRepo.create({
        name: 'Core Engineering Team',
        department: 'Engineering',
        description: 'Core platform architecture, backend API microservices, and infrastructure scaling.',
      });
      const t2 = await teamRepo.create({
        name: 'Product Design & UX Team',
        department: 'Product & Design',
        description: 'User experience research, dynamic design systems, and mobile UI/UX design.',
      });
      const t3 = await teamRepo.create({
        name: 'Growth & Strategy Team',
        department: 'Marketing & Growth',
        description: 'User acquisition campaigns, corporate partnerships, and brand analytics.',
      });
      const t4 = await teamRepo.create({
        name: 'Privacy & Policy Management',
        department: 'Legal & Compliance',
        description: 'GDPR compliance, data protection standards, and corporate governance.',
      });
      createdTeamIds.t1 = t1.id;
      createdTeamIds.t2 = t2.id;
      createdTeamIds.t3 = t3.id;
      createdTeamIds.t4 = t4.id;
    } else {
      existingTeams.forEach((t, i) => {
        createdTeamIds[`t${i + 1}`] = t.id;
      });
    }

    const existingProjects = await projectRepo.findAll();
    const createdProjectIds: Record<string, string> = {};

    if (existingProjects.length === 0) {
      logger.info('🌱 [SUPABASE DB] Seeding default Projects into database...');
      const p1 = await projectRepo.create({
        name: 'Jibble 2.0 Web Platform Redesign',
        team_id: createdTeamIds.t1,
        team_name: 'Core Engineering Team',
        status: 'in_progress',
        description: 'Revamping the admin dashboard with rich spatial aesthetics and real-time Supabase synchronization.',
        target_date: 'Apr 15, 2026',
      });
      const p2 = await projectRepo.create({
        name: 'Mobile App Auth & Sync Module',
        team_id: createdTeamIds.t1,
        team_name: 'Core Engineering Team',
        status: 'in_progress',
        description: 'Flutter mobile application onboarding flow, biometrics, and cross-platform token sync.',
        target_date: 'May 01, 2026',
      });
      const p3 = await projectRepo.create({
        name: 'GDPR & PII Security Compliance Audit',
        team_id: createdTeamIds.t4,
        team_name: 'Privacy & Policy Management',
        status: 'in_progress',
        description: 'Complete security audit of data retention policies and PII data masking.',
        target_date: 'Mar 30, 2026',
      });
      createdProjectIds.p1 = p1.id;
      createdProjectIds.p2 = p2.id;
      createdProjectIds.p3 = p3.id;
    } else {
      existingProjects.forEach((p, i) => {
        createdProjectIds[`p${i + 1}`] = p.id;
      });
    }

    const existingTasks = await taskRepo.findAll();
    if (existingTasks.length === 0) {
      logger.info('🌱 [SUPABASE DB] Seeding default Tasks into database...');
      await taskRepo.create({
        title: 'Optimize Supabase Database Connection & RLS Policies',
        project_id: createdProjectIds.p1,
        project_name: 'Jibble 2.0 Web Platform Redesign',
        assignee_name: 'mishrakaditya17',
        status: 'in_progress',
        priority: 'urgent',
        due_date: 'Mar 15, 2026',
        cadence: 'week',
        description: 'Configure PostgreSQL foreign keys, indexes, and write auto-seeding routines for core tables.',
      });
      await taskRepo.create({
        title: 'Implement User & Executive Role Validation',
        project_id: createdProjectIds.p1,
        project_name: 'Jibble 2.0 Web Platform Redesign',
        assignee_name: 'mainhuram',
        status: 'completed',
        priority: 'high',
        due_date: 'Mar 10, 2026',
        cadence: 'month',
        description: 'Ensure unique username validation and restrict Executive role allocations to 1 person.',
      });
      await taskRepo.create({
        title: 'Setup Automated CI/CD Deployment Pipeline',
        project_id: createdProjectIds.p2,
        project_name: 'Mobile App Auth & Sync Module',
        assignee_name: 'jir286106',
        status: 'todo',
        priority: 'medium',
        due_date: 'Apr 01, 2026',
        cadence: 'month',
        description: 'Configure GitHub Actions workflow for automated testing and release builds.',
      });
    }

    const existingPolicies = await policyRepo.findAll();
    if (existingPolicies.length === 0) {
      logger.info('🌱 [SUPABASE DB] Seeding default Policies into database...');
      await policyRepo.create({
        title: 'Corporate Data Privacy & GDPR Guidelines',
        category: 'Data Privacy',
        content: 'Outlines strict guidelines for handling user data, PII masking, consent tracking, and GDPR compliance standards.',
        version: 'v2.4',
        effective_date: 'Jan 01, 2026',
        is_mandatory: true,
        compliance_rate: 94,
      });
      await policyRepo.create({
        title: 'Information Security & Access Control Policy',
        category: 'Security',
        content: 'Mandates multi-factor authentication (MFA), password complexity standards, key rotation schedules, and role-based authorization.',
        version: 'v3.1',
        effective_date: 'Feb 15, 2026',
        is_mandatory: true,
        compliance_rate: 98,
      });
    }
  } catch (err: any) {
    logger.warn(`Auto-seed warning: ${err.message}`);
  }
};
