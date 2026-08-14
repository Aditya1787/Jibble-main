/**
 * @file modules/admin/admin.controller.ts
 * @description Express request handlers for all Admin Panel API endpoints in admin_backend.
 */

import { Request, Response, NextFunction } from 'express';
import {
  employeeService,
  hierarchyService,
  teamService,
  projectService,
  taskService,
  policyService,
  privacyService,
  otpService,
} from './admin.service';
import {
  createEmployeeSchema,
  updateEmployeeSchema,
  createTeamSchema,
  updateTeamSchema,
  addTeamMemberSchema,
  createProjectSchema,
  updateProjectSchema,
  createTaskSchema,
  updateTaskSchema,
  createPolicySchema,
  updatePolicySchema,
  updatePrivacySettingsSchema,
  sendOtpSchema,
  verifyOtpSchema,
  checkUsernameSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from './admin.validation';
import { AppError } from '../../middlewares/error.middleware';
import { employeeRepo } from './admin.repository';
import type { Employee, Team } from './admin.types';
import {
  canCreateTeam,
  canAddTeamMember,
  canAssignOrDeleteTask,
  filterVisibleTeams,
  filterVisibleTasks,
} from '../../utils/permissions';

const ok = (res: Response, data: unknown, status = 200) =>
  res.status(status).json({ success: true, data });

async function getCallerEmployee(authUserId?: string, userEmail?: string): Promise<Employee | null> {
  if (!authUserId) return null;
  try {
    let emp = await employeeRepo.findByAuthUserId(authUserId);
    if (!emp && userEmail) emp = await employeeRepo.findByEmail(userEmail);
    return emp;
  } catch {
    return null;
  }
}

// ── Auth & OTP Controllers (Public) ──────────────────────────────────────────

export const sendOtp = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const input = sendOtpSchema.parse(req.body);
    const data = await otpService.sendOtp(input);
    ok(res, data);
  } catch (err) {
    next(err);
  }
};

export const verifyOtp = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const input = verifyOtpSchema.parse(req.body);
    const data = await otpService.verifyOtp(input);
    ok(res, data);
  } catch (err) {
    next(err);
  }
};

export const checkUsername = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const rawUsername = (req.body?.username || req.query?.username) as string;
    const excludeId = (req.body?.exclude_id || req.query?.exclude_id) as string | undefined;
    const input = checkUsernameSchema.parse({ username: rawUsername, exclude_id: excludeId });
    const data = await employeeService.checkUsername(input.username, input.exclude_id);
    ok(res, data);
  } catch (err) {
    next(err);
  }
};

export const forgotPassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const input = forgotPasswordSchema.parse(req.body);
    const data = await otpService.forgotPassword(input.email);
    ok(res, data);
  } catch (err) {
    next(err);
  }
};

export const resetPassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const input = resetPasswordSchema.parse(req.body);
    const data = await otpService.resetPassword(input);
    ok(res, data);
  } catch (err) {
    next(err);
  }
};

// ── Employee Controllers ───────────────────────────────────────────────────────

export const listEmployees = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await employeeService.listAll();
    ok(res, data);
  } catch (err) {
    next(err);
  }
};

export const getEmployee = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await employeeService.getById(req.params.id);
    ok(res, data);
  } catch (err) {
    next(err);
  }
};

export const getMyProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user?.id) throw AppError.unauthorized('Not authenticated');
    const data = await employeeService.getByAuthUserId(req.user.id, req.user.email);
    ok(res, data);
  } catch (err) {
    next(err);
  }
};

export const createEmployee = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const input = createEmployeeSchema.parse(req.body);
    const data = await employeeService.create(input, req.user?.email);
    ok(res, data, 201);
  } catch (err) {
    next(err);
  }
};

export const registerEmployee = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const input = createEmployeeSchema.parse(req.body);
    const data = await employeeService.create(input, input.email);
    ok(res, data, 201);
  } catch (err) {
    next(err);
  }
};

export const updateEmployee = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const input = updateEmployeeSchema.parse(req.body);
    const data = await employeeService.update(req.params.id, input, req.user?.email);
    ok(res, data);
  } catch (err) {
    next(err);
  }
};

export const getHierarchy = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await hierarchyService.getTree();
    ok(res, data);
  } catch (err) {
    next(err);
  }
};

export const listTeams = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const caller = await getCallerEmployee(req.user?.id, req.user?.email);
    const allTeams = await teamService.listAll();
    const visible = filterVisibleTeams(
      allTeams,
      caller?.id,
      caller?.role ?? '',
      caller?.category
    );
    ok(res, visible.map((t) => ({
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
    })));
  } catch (err) {
    next(err);
  }
};

export const createTeam = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const caller = await getCallerEmployee(req.user?.id, req.user?.email);
    if (!caller || !canCreateTeam(caller.role, caller.category)) {
      throw AppError.forbidden(
        `Team creation is restricted to Founder and HR roles. Your role: "${caller?.role ?? 'Unknown'}"`
      );
    }
    const input = createTeamSchema.parse(req.body);
    const data = await teamService.create(input, req.user?.email, caller.id);
    ok(res, data, 201);
  } catch (err) {
    next(err);
  }
};

export const updateTeam = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const input = updateTeamSchema.parse(req.body);
    const data = await teamService.update(req.params.id, input, req.user?.email);
    ok(res, data);
  } catch (err) {
    next(err);
  }
};

export const addTeamMember = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const caller = await getCallerEmployee(req.user?.id, req.user?.email);
    if (!caller || !canAddTeamMember(caller.role, caller.category)) {
      throw AppError.forbidden(
        `Adding team members is restricted to Founder and HR roles. Your role: "${caller?.role ?? 'Unknown'}"`
      );
    }
    const input = addTeamMemberSchema.parse(req.body);
    const data = await teamService.addMember(req.params.id, input, req.user?.email);
    ok(res, data, 201);
  } catch (err) {
    next(err);
  }
};

export const removeTeamMember = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await teamService.removeMember(req.params.id, req.params.employeeId, req.user?.email);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};

export const listProjects = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const teamId = req.query.teamId as string | undefined;
    const data = await projectService.listAll(teamId);
    ok(res, data);
  } catch (err) {
    next(err);
  }
};

export const createProject = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const input = createProjectSchema.parse(req.body);
    const data = await projectService.create(input, req.user?.email);
    ok(res, data, 201);
  } catch (err) {
    next(err);
  }
};

export const updateProject = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const input = updateProjectSchema.parse(req.body);
    const data = await projectService.update(req.params.id, input, req.user?.email);
    ok(res, data);
  } catch (err) {
    next(err);
  }
};

export const listTasks = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const caller = await getCallerEmployee(req.user?.id, req.user?.email);
    const { status, cadence, projectId } = req.query as Record<string, string | undefined>;
    const allTeams = await teamService.listAll();
    const allTasks = await taskService.listAllRaw({ status, cadence, projectId });
    const visible = filterVisibleTasks(
      allTasks,
      caller?.id,
      caller?.username,
      caller?.role ?? '',
      caller?.category,
      { employeeId: caller?.id, teams: allTeams as Team[] }
    );
    ok(res, visible.map((t) => ({
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
    })));
  } catch (err) {
    next(err);
  }
};

export const createTask = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const caller = await getCallerEmployee(req.user?.id, req.user?.email);
    const allTeams = await teamService.listAll();
    if (
      !caller ||
      !canAssignOrDeleteTask(caller.role, caller.category, {
        employeeId: caller.id,
        teams: allTeams as Team[],
      })
    ) {
      throw AppError.forbidden(
        `Task assignment is restricted to Founder, HR, and Team Lead roles. Your role: "${caller?.role ?? 'Unknown'}"`
      );
    }
    const input = createTaskSchema.parse(req.body);
    const data = await taskService.create(input, req.user?.email);
    ok(res, data, 201);
  } catch (err) {
    next(err);
  }
};

export const updateTask = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const caller = await getCallerEmployee(req.user?.id, req.user?.email);
    const allTeams = await teamService.listAll();
    const input = updateTaskSchema.parse(req.body);
    const existing = await taskService.getByIdRaw(req.params.id);

    const canManage = caller
      ? canAssignOrDeleteTask(caller.role, caller.category, {
          employeeId: caller.id,
          teams: allTeams as Team[],
        })
      : false;

    const isOwnTask =
      caller &&
      (existing.assignee_id === caller.id ||
        (existing.assignee_name ?? '').replace(/^@/, '').toLowerCase() === caller.username.toLowerCase());

    if (!canManage) {
      if (!isOwnTask) {
        throw AppError.forbidden('You can only update tasks assigned to you.');
      }
      const allowedKeys = ['status'];
      const disallowed = Object.keys(input).filter((k) => !allowedKeys.includes(k));
      if (disallowed.length > 0) {
        throw AppError.forbidden('Members may only update the status of their own tasks.');
      }
    }

    const data = await taskService.update(req.params.id, input, req.user?.email);
    ok(res, data);
  } catch (err) {
    next(err);
  }
};

export const deleteTask = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const caller = await getCallerEmployee(req.user?.id, req.user?.email);
    const allTeams = await teamService.listAll();
    if (
      !caller ||
      !canAssignOrDeleteTask(caller.role, caller.category, {
        employeeId: caller.id,
        teams: allTeams as Team[],
      })
    ) {
      throw AppError.forbidden(
        `Deleting tasks is restricted to Founder, HR, and Team Lead roles. Your role: "${caller?.role ?? 'Unknown'}"`
      );
    }
    await taskService.delete(req.params.id, req.user?.email);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};

export const listPolicies = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await policyService.listAll();
    ok(res, data);
  } catch (err) {
    next(err);
  }
};

export const createPolicy = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const input = createPolicySchema.parse(req.body);
    const data = await policyService.create(input, req.user?.email);
    ok(res, data, 201);
  } catch (err) {
    next(err);
  }
};

export const updatePolicy = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const input = updatePolicySchema.parse(req.body);
    const data = await policyService.update(req.params.id, input, req.user?.email);
    ok(res, data);
  } catch (err) {
    next(err);
  }
};

export const getPrivacySettings = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await privacyService.get();
    ok(res, data);
  } catch (err) {
    next(err);
  }
};

export const updatePrivacySettings = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const input = updatePrivacySettingsSchema.parse(req.body);
    const data = await privacyService.update(input, req.user?.email);
    ok(res, data);
  } catch (err) {
    next(err);
  }
};
