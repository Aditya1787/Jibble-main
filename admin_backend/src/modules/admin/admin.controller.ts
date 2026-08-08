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
} from './admin.validation';
import { AppError } from '../../middlewares/error.middleware';

const ok = (res: Response, data: unknown, status = 200) =>
  res.status(status).json({ success: true, data });

// ── OTP Controllers (Public) ──────────────────────────────────────────────────

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
    const data = await employeeService.getByAuthUserId(req.user.id);
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

export const listTeams = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await teamService.listAll();
    ok(res, data);
  } catch (err) {
    next(err);
  }
};

export const createTeam = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const input = createTeamSchema.parse(req.body);
    const data = await teamService.create(input, req.user?.email);
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
    const { status, cadence, projectId } = req.query as Record<string, string | undefined>;
    const data = await taskService.listAll({ status, cadence, projectId });
    ok(res, data);
  } catch (err) {
    next(err);
  }
};

export const createTask = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const input = createTaskSchema.parse(req.body);
    const data = await taskService.create(input, req.user?.email);
    ok(res, data, 201);
  } catch (err) {
    next(err);
  }
};

export const updateTask = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const input = updateTaskSchema.parse(req.body);
    const data = await taskService.update(req.params.id, input, req.user?.email);
    ok(res, data);
  } catch (err) {
    next(err);
  }
};

export const deleteTask = async (req: Request, res: Response, next: NextFunction) => {
  try {
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
