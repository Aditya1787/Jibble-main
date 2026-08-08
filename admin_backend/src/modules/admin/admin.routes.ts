/**
 * @file modules/admin/admin.routes.ts
 * @description Admin Panel API route definitions in admin_backend.
 * Mounted at: /api/v1/admin
 */

import { Router } from 'express';
import { requireSupabaseAuth } from '../../middlewares/supabase.middleware';
import {
  sendOtp,
  verifyOtp,
  listEmployees,
  getEmployee,
  getMyProfile,
  createEmployee,
  updateEmployee,
  getHierarchy,
  listTeams,
  createTeam,
  updateTeam,
  addTeamMember,
  removeTeamMember,
  listProjects,
  createProject,
  updateProject,
  listTasks,
  createTask,
  updateTask,
  deleteTask,
  listPolicies,
  createPolicy,
  updatePolicy,
  getPrivacySettings,
  updatePrivacySettings,
} from './admin.controller';

export const adminRouter = Router();

// ── Public OTP Authentication Routes ──────────────────────────────────────────
adminRouter.post('/auth/send-otp', sendOtp);
adminRouter.post('/auth/verify-otp', verifyOtp);

// ── All remaining admin routes require Supabase Auth ──────────────────────────
adminRouter.use(requireSupabaseAuth);

// Profile
adminRouter.get('/profile', getMyProfile);

// Employees
adminRouter.get('/employees', listEmployees);
adminRouter.get('/employees/:id', getEmployee);
adminRouter.post('/employees', createEmployee);
adminRouter.patch('/employees/:id', updateEmployee);

// Org Hierarchy
adminRouter.get('/hierarchy', getHierarchy);

// Teams
adminRouter.get('/teams', listTeams);
adminRouter.post('/teams', createTeam);
adminRouter.patch('/teams/:id', updateTeam);
adminRouter.post('/teams/:id/members', addTeamMember);
adminRouter.delete('/teams/:id/members/:employeeId', removeTeamMember);

// Projects
adminRouter.get('/projects', listProjects);
adminRouter.post('/projects', createProject);
adminRouter.patch('/projects/:id', updateProject);

// Tasks
adminRouter.get('/tasks', listTasks);
adminRouter.post('/tasks', createTask);
adminRouter.patch('/tasks/:id', updateTask);
adminRouter.delete('/tasks/:id', deleteTask);

// Policies
adminRouter.get('/policies', listPolicies);
adminRouter.post('/policies', createPolicy);
adminRouter.patch('/policies/:id', updatePolicy);

// Privacy Settings
adminRouter.get('/privacy-settings', getPrivacySettings);
adminRouter.patch('/privacy-settings', updatePrivacySettings);
