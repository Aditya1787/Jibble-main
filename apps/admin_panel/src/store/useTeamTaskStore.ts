/**
 * useTeamTaskStore.ts
 *
 * Teams, Projects, Tasks, Policies, and Privacy Settings store.
 *
 * Behaviour:
 * - When VITE_API_BASE_URL is configured → all data is loaded from / saved to the backend.
 * - When not configured (pure local dev) → uses hardcoded seed data as before.
 *
 * Actions that mutate data (addTask, addProject, etc.) attempt the backend call
 * first and then update local state on success, keeping UI snappy.
 */

import { create } from 'zustand'
import { adminApi } from '../api/adminApi'
import type {
  TeamDTO,
  ProjectDTO,
  TaskDTO,
  PolicyDTO,
  PrivacySettingsDTO,
  TaskStatus,
  TaskCadence,
  TaskPriority,
  ProjectStatus,
  PolicyCategory,
} from '../api/adminApi'

// Re-export types so existing pages don't need to change imports
export type { TaskCadence, TaskStatus, TaskPriority, ProjectStatus }

export interface TeamMember {
  id: string
  name: string
  email: string
  avatar: string
  teamRole: string
  joinedDate: string
}

export interface Team extends Omit<TeamDTO, 'members'> {
  members: TeamMember[]
}

export interface Project extends ProjectDTO {}

export interface Task extends TaskDTO {}

export interface Policy extends PolicyDTO {}

export interface PrivacySettings extends PrivacySettingsDTO {}

const API_CONFIGURED = Boolean(import.meta.env.VITE_API_BASE_URL)

// ── Seed data (fallback when backend not running) ─────────────────────────────
const seedTeams: Team[] = [
  {
    id: 'team-1',
    name: 'Frontend Core & Design System',
    department: 'Engineering',
    leadEmployeeId: null,
    leadName: 'Alex Rivera',
    description: 'Responsible for main web admin apps, component design systems, and spatial UI styling.',
    activeProjectsCount: 3,
    members: [
      { id: 'm-1', name: 'Aditya Kumar', email: 'aditya@company.com', avatar: '💻', teamRole: 'Senior Frontend Lead', joinedDate: 'Jan 2025' },
      { id: 'm-2', name: 'Priya Sharma', email: 'priya@company.com', avatar: '🎨', teamRole: 'UI/UX Designer', joinedDate: 'Feb 2025' },
    ],
  },
  {
    id: 'team-2',
    name: 'Backend Infrastructure & Cloud API',
    department: 'Software Engineering',
    leadEmployeeId: null,
    leadName: 'Elena Rostova',
    description: 'Scalable cloud services, authentication microservices, database optimizations, and REST/GraphQL APIs.',
    activeProjectsCount: 4,
    members: [
      { id: 'm-4', name: 'Marcus Vance', email: 'marcus@company.com', avatar: '👨‍💼', teamRole: 'Lead Architect', joinedDate: 'Dec 2024' },
      { id: 'm-5', name: 'Neha Gupta', email: 'neha@company.com', avatar: '🔐', teamRole: 'Backend Security Dev', joinedDate: 'Jan 2025' },
    ],
  },
  {
    id: 'team-3',
    name: 'People Operations & HR Excellence',
    department: 'Human Resources',
    leadEmployeeId: null,
    leadName: 'Priya Sharma',
    description: 'Talent recruitment, employee onboarding flows, workspace compliance, and internal community growth.',
    activeProjectsCount: 2,
    members: [
      { id: 'm-7', name: 'Sarah Jenkins', email: 'sarah@company.com', avatar: '🏢', teamRole: 'HRBP Lead', joinedDate: 'Nov 2024' },
    ],
  },
]

const seedProjects: Project[] = [
  { id: 'proj-1', name: 'Jibble Admin Console v2.0', teamId: 'team-1', teamName: 'Frontend Core & Design System', status: 'in_progress', description: 'Redesigning Admin console with employee management and privacy tools.', targetDate: 'Aug 30, 2026' },
  { id: 'proj-2', name: 'Authentication Security Hardening', teamId: 'team-2', teamName: 'Backend Infrastructure & Cloud API', status: 'in_progress', description: 'Implementing OTP authentication, RBAC policy enforcement, and audit logs.', targetDate: 'Sep 15, 2026' },
  { id: 'proj-3', name: 'Employee Onboarding & Policy Compliance', teamId: 'team-3', teamName: 'People Operations & HR Excellence', status: 'in_progress', description: 'Automating policy sign-offs and employee task assignments.', targetDate: 'Oct 01, 2026' },
]

const seedTasks: Task[] = [
  { id: 'task-1', title: 'Daily Frontend Code Review & Component Linting', projectId: 'proj-1', projectName: 'Jibble Admin Console v2.0', assigneeId: null, assigneeName: 'Aditya Kumar', assigneeAvatar: '💻', priority: 'high', status: 'completed', cadence: 'day', dueDate: 'Today, 5:00 PM', description: 'Perform daily PR reviews for spatial UI components and theme tokens.' },
  { id: 'task-2', title: 'Daily Backend API Health & Error Rate Monitoring', projectId: 'proj-2', projectName: 'Authentication Security Hardening', assigneeId: null, assigneeName: 'Robert Taylor', assigneeAvatar: '☁️', priority: 'urgent', status: 'in_progress', cadence: 'day', dueDate: 'Today, 6:00 PM', description: 'Verify API uptime, error rate metrics, and microservice latencies.' },
  { id: 'task-3', title: 'Weekly Sprint Release: Team & Task Management Module', projectId: 'proj-1', projectName: 'Jibble Admin Console v2.0', assigneeId: null, assigneeName: 'Rahul Verma', assigneeAvatar: '🚀', priority: 'high', status: 'in_progress', cadence: 'week', dueDate: 'End of Sprint (Friday)', description: 'Finalize team creation modal, role selectors, and task cadence filters.' },
  { id: 'task-4', title: 'Weekly HR Employee Onboarding Sync', projectId: 'proj-3', projectName: 'Employee Onboarding & Policy Compliance', assigneeId: null, assigneeName: 'Priya Sharma', assigneeAvatar: '🏢', priority: 'medium', status: 'todo', cadence: 'week', dueDate: 'This Friday, 3:00 PM', description: 'Review new employee registrations, HR contact assignments, and onboarding checklists.' },
  { id: 'task-5', title: 'Monthly Privacy & GDPR Compliance Audit', projectId: 'proj-3', projectName: 'Employee Onboarding & Policy Compliance', assigneeId: null, assigneeName: 'Sarah Jenkins', assigneeAvatar: '🏢', priority: 'high', status: 'in_progress', cadence: 'month', dueDate: 'End of Month', description: 'Audit employee policy acceptance rates and PII data handling toggles.' },
  { id: 'task-6', title: 'Monthly Database Indexing & Scalability Benchmark', projectId: 'proj-2', projectName: 'Authentication Security Hardening', assigneeId: null, assigneeName: 'Marcus Vance', assigneeAvatar: '👨‍💼', priority: 'medium', status: 'todo', cadence: 'month', dueDate: 'Aug 31, 2026', description: 'Run database query profiling, optimize high-traffic indexes, and prune telemetry logs.' },
  { id: 'task-7', title: 'Yearly Information Security Policy Revision & ISO Certification', projectId: 'proj-3', projectName: 'Employee Onboarding & Policy Compliance', assigneeId: null, assigneeName: 'Neha Gupta', assigneeAvatar: '🔐', priority: 'urgent', status: 'in_progress', cadence: 'year', dueDate: 'Q4 2026', description: 'Comprehensive annual update of cybersecurity policies, data privacy guidelines, and ISO compliance.' },
  { id: 'task-8', title: 'Annual Enterprise Architecture & Infrastructure Planning', projectId: 'proj-2', projectName: 'Authentication Security Hardening', assigneeId: null, assigneeName: 'Elena Rostova', assigneeAvatar: '☁️', priority: 'high', status: 'todo', cadence: 'year', dueDate: 'Dec 2026', description: 'Evaluate cloud provider contracts, disaster recovery budgets, and 2027 tech roadmap.' },
]

const seedPolicies: Policy[] = [
  { id: 'pol-1', title: 'Corporate Data Privacy & GDPR Guidelines', category: 'Data Privacy', version: 'v2.4', effectiveDate: 'Jan 01, 2026', isMandatory: true, complianceRate: 94, content: 'Outlines strict guidelines for handling user data, PII, consent tracking, and GDPR compliance.' },
  { id: 'pol-2', title: 'Information Security & Access Control Policy', category: 'Security', version: 'v3.1', effectiveDate: 'Feb 15, 2026', isMandatory: true, complianceRate: 98, content: 'Mandates MFA, password complexity standards, key rotation, and RBAC rules.' },
  { id: 'pol-3', title: 'Remote Work & Spatial Workplace Conduct', category: 'Remote Work', version: 'v1.8', effectiveDate: 'Mar 10, 2026', isMandatory: false, complianceRate: 88, content: 'Best practices for remote working, virtual meeting decorum, and async communication.' },
  { id: 'pol-4', title: 'Employee Code of Ethics & Community Values', category: 'Code of Conduct', version: 'v2.0', effectiveDate: 'Jan 15, 2026', isMandatory: true, complianceRate: 96, content: 'Standards of professional integrity, anti-harassment rules, and inclusive community guidelines.' },
]

const seedPrivacySettings: PrivacySettings = {
  gdprCompliant: true,
  piiMaskingEnabled: true,
  dataRetentionMonths: 12,
  auditLoggingEnabled: true,
  autoArchiveInactiveUsers: false,
}

// ── Store Interface ───────────────────────────────────────────────────────────

interface TeamTaskState {
  teams: Team[]
  projects: Project[]
  tasks: Task[]
  policies: Policy[]
  privacySettings: PrivacySettings
  isLoadingData: boolean

  // Fetch actions (from backend or use seed)
  fetchAll: () => Promise<void>
  fetchTeams: () => Promise<void>
  fetchProjects: () => Promise<void>
  fetchTasks: (filters?: { status?: string; cadence?: string }) => Promise<void>
  fetchPolicies: () => Promise<void>
  fetchPrivacySettings: () => Promise<void>

  // Mutation actions
  addTeam: (team: Omit<Team, 'id' | 'members'>) => Promise<void>
  updateTeam: (teamId: string, teamData: Partial<Team>) => Promise<void>
  addMemberToTeam: (teamId: string, member: TeamMember) => void
  removeMemberFromTeam: (teamId: string, memberId: string) => Promise<void>
  addProject: (project: Omit<Project, 'id'>) => Promise<void>
  addTask: (task: Omit<Task, 'id'>) => Promise<void>
  updateTask: (taskId: string, taskData: Partial<Task>) => Promise<void>
  updateTaskStatus: (taskId: string, status: Task['status']) => Promise<void>
  deleteTask: (taskId: string) => Promise<void>
  addPolicy: (policy: Omit<Policy, 'id'>) => Promise<void>
  togglePolicyMandatory: (policyId: string) => void
  updatePrivacySettings: (settings: Partial<PrivacySettings>) => Promise<void>
  getEmployeePerformance: (memberName: string) => {
    totalAssigned: number
    completedOnTime: number
    overdueCount: number
    onTimeRate: number
    ratingBadge: string
  }
}

export const useTeamTaskStore = create<TeamTaskState>((set, get) => ({
  teams: seedTeams,
  projects: seedProjects,
  tasks: seedTasks,
  policies: seedPolicies,
  privacySettings: seedPrivacySettings,
  isLoadingData: false,

  // ── Fetch actions ─────────────────────────────────────────────────────────

  fetchAll: async () => {
    const store = get()
    await Promise.allSettled([
      store.fetchTeams(),
      store.fetchProjects(),
      store.fetchTasks(),
      store.fetchPolicies(),
      store.fetchPrivacySettings(),
    ])
  },

  fetchTeams: async () => {
    if (!API_CONFIGURED) return
    try {
      const data = await adminApi.teams.list()
      set({
        teams: data.map((t) => ({
          ...t,
          members: t.members.map((m) => ({
            id: m.id,
            name: m.name,
            email: m.email,
            avatar: m.avatar,
            teamRole: m.teamRole,
            joinedDate: m.joinedDate,
          })),
        })),
      })
    } catch (e) {
      console.warn('fetchTeams failed — using seed data:', e)
    }
  },

  fetchProjects: async () => {
    if (!API_CONFIGURED) return
    try {
      const data = await adminApi.projects.list()
      set({ projects: data })
    } catch (e) {
      console.warn('fetchProjects failed — using seed data:', e)
    }
  },

  fetchTasks: async (filters) => {
    if (!API_CONFIGURED) return
    try {
      const data = await adminApi.tasks.list(filters)
      set({ tasks: data })
    } catch (e) {
      console.warn('fetchTasks failed — using seed data:', e)
    }
  },

  fetchPolicies: async () => {
    if (!API_CONFIGURED) return
    try {
      const data = await adminApi.policies.list()
      set({ policies: data })
    } catch (e) {
      console.warn('fetchPolicies failed — using seed data:', e)
    }
  },

  fetchPrivacySettings: async () => {
    if (!API_CONFIGURED) return
    try {
      const data = await adminApi.privacy.get()
      if (data) set({ privacySettings: data })
    } catch (e) {
      console.warn('fetchPrivacySettings failed — using seed data:', e)
    }
  },

  // ── Mutation actions ──────────────────────────────────────────────────────

  addTeam: async (team: Omit<Team, 'id' | 'members'>) => {
    if (API_CONFIGURED) {
      try {
        const created = await adminApi.teams.create({
          name: team.name,
          department: team.department,
          leadEmployeeId: team.leadEmployeeId ?? null,
          leadName: team.leadName ?? null,
          description: team.description ?? null,
        })
        set((state) => ({ teams: [...state.teams, { ...created, members: [] }] }))
        return
      } catch (e) {
        console.warn('addTeam API failed, using local:', e)
      }
    }
    set((state) => ({
      teams: [
        ...state.teams,
        { ...team, id: `team-${Date.now()}`, members: [], activeProjectsCount: 0 },
      ],
    }))
  },

  updateTeam: async (teamId, teamData) => {
    if (API_CONFIGURED) {
      try {
        await adminApi.teams.update(teamId, teamData)
      } catch (e) {
        console.warn('updateTeam API failed, using local:', e)
      }
    }
    set((state) => ({
      teams: state.teams.map((t) => (t.id === teamId ? { ...t, ...teamData } : t)),
    }))
  },

  addMemberToTeam: (teamId, member) =>
    set((state) => ({
      teams: state.teams.map((t) => {
        if (t.id === teamId) {
          if (
            t.members.some(
              (m) =>
                m.name.toLowerCase() === member.name.toLowerCase() ||
                m.email.toLowerCase() === member.email.toLowerCase()
            )
          ) {
            return t
          }
          return { ...t, members: [...t.members, member] }
        }
        return t
      }),
    })),

  removeMemberFromTeam: async (teamId, memberId) => {
    if (API_CONFIGURED) {
      try {
        await adminApi.teams.removeMember(teamId, memberId)
      } catch (e) {
        console.warn('removeMember API failed, using local:', e)
      }
    }
    set((state) => ({
      teams: state.teams.map((t) => {
        if (t.id === teamId) {
          return { ...t, members: t.members.filter((m) => m.id !== memberId) }
        }
        return t
      }),
    }))
  },

  addProject: async (project) => {
    if (API_CONFIGURED) {
      try {
        const created = await adminApi.projects.create(project)
        set((state) => ({ projects: [created, ...state.projects] }))
        return
      } catch (e) {
        console.warn('addProject API failed, using local:', e)
      }
    }
    set((state) => ({
      projects: [{ ...project, id: `proj-${Date.now()}` }, ...state.projects],
    }))
  },

  addTask: async (task) => {
    if (API_CONFIGURED) {
      try {
        const created = await adminApi.tasks.create(task)
        set((state) => ({ tasks: [created, ...state.tasks] }))
        return
      } catch (e) {
        console.warn('addTask API failed, using local:', e)
      }
    }
    set((state) => ({
      tasks: [{ ...task, id: `task-${Date.now()}` }, ...state.tasks],
    }))
  },

  updateTask: async (taskId, taskData) => {
    if (API_CONFIGURED) {
      try {
        await adminApi.tasks.update(taskId, taskData)
      } catch (e) {
        console.warn('updateTask API failed, using local:', e)
      }
    }
    set((state) => ({
      tasks: state.tasks.map((t) => (t.id === taskId ? { ...t, ...taskData } : t)),
    }))
  },

  updateTaskStatus: async (taskId, status) => {
    if (API_CONFIGURED) {
      try {
        await adminApi.tasks.update(taskId, { status })
      } catch (e) {
        console.warn('updateTaskStatus API failed, using local:', e)
      }
    }
    set((state) => ({
      tasks: state.tasks.map((t) => (t.id === taskId ? { ...t, status } : t)),
    }))
  },

  deleteTask: async (taskId) => {
    if (API_CONFIGURED) {
      try {
        await adminApi.tasks.delete(taskId)
      } catch (e) {
        console.warn('deleteTask API failed, using local:', e)
      }
    }
    set((state) => ({ tasks: state.tasks.filter((t) => t.id !== taskId) }))
  },

  addPolicy: async (policy) => {
    if (API_CONFIGURED) {
      try {
        const created = await adminApi.policies.create(policy)
        set((state) => ({ policies: [...state.policies, created] }))
        return
      } catch (e) {
        console.warn('addPolicy API failed, using local:', e)
      }
    }
    set((state) => ({
      policies: [...state.policies, { ...policy, id: `pol-${Date.now()}` }],
    }))
  },

  togglePolicyMandatory: (policyId) =>
    set((state) => ({
      policies: state.policies.map((p) =>
        p.id === policyId ? { ...p, isMandatory: !p.isMandatory } : p
      ),
    })),

  updatePrivacySettings: async (settings) => {
    if (API_CONFIGURED) {
      try {
        const updated = await adminApi.privacy.update(settings)
        set({ privacySettings: updated })
        return
      } catch (e) {
        console.warn('updatePrivacySettings API failed, using local:', e)
      }
    }
    set((state) => ({
      privacySettings: { ...state.privacySettings, ...settings },
    }))
  },

  getEmployeePerformance: (memberName) => {
    const userTasks = get().tasks.filter((t) =>
      t.assigneeName?.toLowerCase().includes(memberName.toLowerCase())
    )
    const totalAssigned = Math.max(userTasks.length, 1)
    const completedOnTime = userTasks.filter((t) => t.status === 'completed').length
    const overdueCount = userTasks.filter(
      (t) => t.status !== 'completed' && t.priority === 'urgent'
    ).length
    const onTimeRate = Math.round((completedOnTime / totalAssigned) * 100)

    let ratingBadge = '🌟 Top Performer'
    if (onTimeRate < 60) ratingBadge = '📈 Needs Improvement'
    else if (onTimeRate < 85) ratingBadge = '⚡ Reliable Contributor'

    return { totalAssigned: userTasks.length, completedOnTime, overdueCount, onTimeRate, ratingBadge }
  },
}))
