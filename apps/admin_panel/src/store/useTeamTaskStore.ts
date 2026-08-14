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

// ── Seed data (starts clean and empty) ─────────────────────────────
const seedTeams: Team[] = []
const seedProjects: Project[] = []
const seedTasks: Task[] = []
const seedPolicies: Policy[] = []

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
  addMemberToTeam: (teamId: string, member: TeamMember & { dbEmployeeId?: string }) => Promise<void>
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
        await adminApi.teams.create({
          name: team.name,
          department: team.department,
          leadEmployeeId: team.leadEmployeeId ?? null,
          leadName: team.leadName ?? null,
          description: team.description ?? null,
        })
        await get().fetchTeams()
        await get().fetchProjects()
        return
      } catch (e) {
        console.warn('addTeam API failed, using local:', e)
      }
    }

    const createdTeam: Team = {
      ...team,
      id: `team-${Date.now()}`,
      members: [],
      activeProjectsCount: 0,
    }
    const defaultProject: Project = {
      id: `proj-${Date.now()}`,
      name: `${team.name} Deliverables`,
      teamId: createdTeam.id,
      teamName: createdTeam.name,
      status: 'in_progress',
      description: `Default workspace deliverables project for ${team.name}.`,
      targetDate: 'Ongoing',
    }
    set((state) => ({
      teams: [...state.teams, createdTeam],
      projects: [defaultProject, ...state.projects],
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

  addMemberToTeam: async (teamId, member) => {
    const employeeIdToUse = (member as TeamMember & { dbEmployeeId?: string }).dbEmployeeId || member.id
    const teamRole = 'Team Member'
    if (API_CONFIGURED && employeeIdToUse) {
      try {
        await adminApi.teams.addMember(teamId, employeeIdToUse, teamRole)
        await get().fetchTeams()
        return
      } catch (e) {
        console.warn('addMemberToTeam API failed, using local:', e)
      }
    }
    set((state) => ({
      teams: state.teams.map((t) => {
        if (t.id !== teamId) return t
        if (
          t.members.some(
            (m) =>
              m.name.toLowerCase() === member.name.toLowerCase() ||
              m.email.toLowerCase() === member.email.toLowerCase()
          )
        ) {
          return t
        }
        return { ...t, members: [...t.members, { ...member, teamRole }] }
      }),
    }))
  },

  removeMemberFromTeam: async (teamId, memberId) => {
    if (API_CONFIGURED) {
      try {
        await adminApi.teams.removeMember(teamId, memberId)
      } catch (e) {
        console.warn('removeMemberFromTeam API failed, using local:', e)
      }
    }
    set((state) => ({
      teams: state.teams.map((t) =>
        t.id === teamId ? { ...t, members: t.members.filter((m) => m.id !== memberId) } : t
      ),
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
    // Resolve assigneeName → assigneeId if not already provided
    const resolvedTask = { ...task }
    if (!resolvedTask.assigneeId) {
      const cleanName = (resolvedTask.assigneeName ?? '').replace(/^@/, '').split(' ')[0].trim().toLowerCase()
      const { useAuthStore } = await import('./useAuthStore') as any
      const allUsers: any[] = useAuthStore.getState().registeredUsers
      const match = allUsers.find((u: any) =>
        (u.profile.username ?? '').toLowerCase() === cleanName ||
        u.profile.email.toLowerCase().split('@')[0] === cleanName
      )
      if (match?.profile?.dbEmployeeId) {
        resolvedTask.assigneeId = match.profile.dbEmployeeId
        resolvedTask.assigneeAvatar = match.profile.avatar || '👤'
      }
    }

    if (API_CONFIGURED) {
      try {
        const created = await adminApi.tasks.create(resolvedTask)
        set((state) => ({ tasks: [created, ...state.tasks.filter((t) => t.id !== created.id)] }))
        await get().fetchTasks()
        return
      } catch (e) {
        console.warn('addTask API failed, using local:', e)
      }
    }
    const newTaskObj = { ...resolvedTask, id: `task-${Date.now()}` }
    set((state) => ({
      tasks: [newTaskObj, ...state.tasks],
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
    const cleanName = (str: string = '') => str.replace(/^@/, '').split(' ')[0].trim().toLowerCase()
    const targetClean = cleanName(memberName)
    const userTasks = get().tasks.filter((t) => {
      const taskAssigneeClean = cleanName(t.assigneeName ?? '')
      return (
        taskAssigneeClean.includes(targetClean) ||
        targetClean.includes(taskAssigneeClean) ||
        (t.assigneeName ?? '').toLowerCase().includes(memberName.toLowerCase())
      )
    })
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
