/**
 * @file src/api/adminApi.ts
 * @description Typed fetch-based API client for all Jibble Admin Panel backend endpoints.
 *              Every request automatically attaches the Supabase access token.
 */

import { getAccessToken } from './supabaseClient'

const BASE_URL = (import.meta.env.VITE_API_BASE_URL as string) ?? 'http://localhost:8080'
const API = `${BASE_URL}/api/v1/admin`

// ── Types (mirroring backend DTOs) ───────────────────────────────────────────

export interface EmployeeDTO {
  id: string
  username: string
  fullName: string
  email: string
  avatarEmoji: string
  avatarUrl: string | null
  role: string
  category: string
  subcategory: string | null
  reportsToId: string | null
  reportsToName: string | null
  location: string | null
  mobileNumber: string | null
  address: string | null
  hometown: string | null
  favFood: string | null
  hobbies: string[]
  status: string
  joinedDate: string
}

export interface OrgNodeDTO {
  id: string
  username: string
  fullName: string
  email: string
  avatarEmoji: string
  role: string
  category: string
  subcategory: string | null
  reportsToId: string | null
  children?: OrgNodeDTO[]
}

export interface TeamMemberDTO {
  id: string
  name: string
  email: string
  avatar: string
  teamRole: string
  joinedDate: string
}

export interface TeamDTO {
  id: string
  name: string
  department: string
  leadEmployeeId: string | null
  leadName: string | null
  description: string | null
  activeProjectsCount: number
  members: TeamMemberDTO[]
}

export type ProjectStatus = 'planning' | 'in_progress' | 'completed' | 'on_hold'

export interface ProjectDTO {
  id: string
  name: string
  teamId: string | null
  teamName: string | null
  status: ProjectStatus
  description: string | null
  targetDate: string | null
}

export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent'
export type TaskStatus = 'todo' | 'in_progress' | 'in_review' | 'completed'
export type TaskCadence = 'day' | 'week' | 'month' | 'year'

export interface TaskDTO {
  id: string
  title: string
  projectId: string | null
  projectName: string | null
  assigneeId: string | null
  assigneeName: string | null
  assigneeAvatar: string | null
  priority: TaskPriority
  status: TaskStatus
  cadence: TaskCadence
  dueDate: string | null
  description: string | null
}

export type PolicyCategory = 'Data Privacy' | 'Security' | 'Code of Conduct' | 'Remote Work' | 'Access Control'

export interface PolicyDTO {
  id: string
  title: string
  category: PolicyCategory
  content: string | null
  version: string
  effectiveDate: string | null
  isMandatory: boolean
  complianceRate: number
}

export interface PrivacySettingsDTO {
  gdprCompliant: boolean
  piiMaskingEnabled: boolean
  dataRetentionMonths: number
  auditLoggingEnabled: boolean
  autoArchiveInactiveUsers: boolean
}

export interface OtpResponseDTO {
  success: boolean
  message: string
  devOtpCode?: string
  expiresInSeconds?: number
  verified?: boolean
}

// ── Core Fetch Wrapper ────────────────────────────────────────────────────────

async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = await getAccessToken()

  const response = await fetch(`${API}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers ?? {}),
    },
  })

  if (!response.ok) {
    let message = `API error ${response.status}`
    try {
      const body = await response.json()
      message = body?.error?.message ?? message
    } catch { /* ignore parse errors */ }
    throw new Error(message)
  }

  const json = await response.json()
  return json.data as T
}

// ── Admin API ─────────────────────────────────────────────────────────────────

export const adminApi = {

  // ── OTP Authentication ────────────────────────────────────────────────────
  auth: {
    sendOtp: (type: 'email' | 'mobile', recipient: string) =>
      apiFetch<OtpResponseDTO>('/auth/send-otp', {
        method: 'POST',
        body: JSON.stringify({ type, recipient }),
      }),
    verifyOtp: (type: 'email' | 'mobile', recipient: string, otp: string) =>
      apiFetch<OtpResponseDTO>('/auth/verify-otp', {
        method: 'POST',
        body: JSON.stringify({ type, recipient, otp }),
      }),
  },

  // ── Profile ───────────────────────────────────────────────────────────────
  profile: {
    getMe: () => apiFetch<EmployeeDTO>('/profile'),
  },

  // ── Employees ─────────────────────────────────────────────────────────────
  employees: {
    list: () => apiFetch<EmployeeDTO[]>('/employees'),
    get: (id: string) => apiFetch<EmployeeDTO>(`/employees/${id}`),
    create: (data: Partial<EmployeeDTO>) =>
      apiFetch<EmployeeDTO>('/employees', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    update: (id: string, data: Partial<EmployeeDTO>) =>
      apiFetch<EmployeeDTO>(`/employees/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
      }),
  },

  // ── Hierarchy ─────────────────────────────────────────────────────────────
  hierarchy: {
    getTree: () => apiFetch<OrgNodeDTO[]>('/hierarchy'),
  },

  // ── Teams ─────────────────────────────────────────────────────────────────
  teams: {
    list: () => apiFetch<TeamDTO[]>('/teams'),
    create: (data: Omit<TeamDTO, 'id' | 'members' | 'activeProjectsCount'>) =>
      apiFetch<TeamDTO>('/teams', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string, data: Partial<TeamDTO>) =>
      apiFetch<TeamDTO>(`/teams/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
    addMember: (teamId: string, employeeId: string, teamRole?: string) =>
      apiFetch<{ id: string }>(`/teams/${teamId}/members`, {
        method: 'POST',
        body: JSON.stringify({ employee_id: employeeId, team_role: teamRole ?? 'Member' }),
      }),
    removeMember: (teamId: string, employeeId: string) =>
      fetch(`${API}/teams/${teamId}/members/${employeeId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${localStorage.getItem('sb_token') ?? ''}` },
      }),
  },

  // ── Projects ──────────────────────────────────────────────────────────────
  projects: {
    list: (teamId?: string) =>
      apiFetch<ProjectDTO[]>(`/projects${teamId ? `?teamId=${teamId}` : ''}`),
    create: (data: Omit<ProjectDTO, 'id'>) =>
      apiFetch<ProjectDTO>('/projects', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string, data: Partial<ProjectDTO>) =>
      apiFetch<ProjectDTO>(`/projects/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  },

  // ── Tasks ─────────────────────────────────────────────────────────────────
  tasks: {
    list: (filters?: { status?: string; cadence?: string; projectId?: string }) => {
      const params = new URLSearchParams()
      if (filters?.status) params.set('status', filters.status)
      if (filters?.cadence) params.set('cadence', filters.cadence)
      if (filters?.projectId) params.set('projectId', filters.projectId)
      const qs = params.toString()
      return apiFetch<TaskDTO[]>(`/tasks${qs ? `?${qs}` : ''}`)
    },
    create: (data: Omit<TaskDTO, 'id'>) =>
      apiFetch<TaskDTO>('/tasks', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string, data: Partial<TaskDTO>) =>
      apiFetch<TaskDTO>(`/tasks/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
    delete: (id: string) =>
      apiFetch<void>(`/tasks/${id}`, { method: 'DELETE' }),
  },

  // ── Policies ──────────────────────────────────────────────────────────────
  policies: {
    list: () => apiFetch<PolicyDTO[]>('/policies'),
    create: (data: Omit<PolicyDTO, 'id'>) =>
      apiFetch<PolicyDTO>('/policies', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string, data: Partial<PolicyDTO>) =>
      apiFetch<PolicyDTO>(`/policies/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  },

  // ── Privacy Settings ──────────────────────────────────────────────────────
  privacy: {
    get: () => apiFetch<PrivacySettingsDTO>('/privacy-settings'),
    update: (data: Partial<PrivacySettingsDTO>) =>
      apiFetch<PrivacySettingsDTO>('/privacy-settings', {
        method: 'PATCH',
        body: JSON.stringify(data),
      }),
  },
}
