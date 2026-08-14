/**
 * Frontend RBAC helpers — mirrors admin_backend/src/utils/permissions.ts
 */

import type { Team, Task, Project } from '../store/useTeamTaskStore'
import type { AdminUser } from '../store/useAuthStore'

const FOUNDER_KEYWORDS = [
  'founder',
  'co-founder',
  'co founder',
  'ceo',
  'founder & ceo',
  'founder and ceo',
]

const HR_KEYWORDS = [
  'hr',
  'hr manager',
  'hr head',
  'hr director',
  'chief hr officer',
  'human resources',
  'head of hr',
  'people operations',
]

const TEAM_LEAD_ROLE_KEYWORDS = ['team lead', 'tech lead']

export function isFounderOrHR(user: AdminUser | null): boolean {
  if (!user) return false
  const r = user.role.trim().toLowerCase()
  const c = (user.category ?? '').trim().toLowerCase()
  if (FOUNDER_KEYWORDS.some((kw) => r === kw || r.includes(kw))) return true
  if (HR_KEYWORDS.some((kw) => r.includes(kw) || c.includes(kw))) return true
  return false
}

export function isTeamLeadJobTitle(user: AdminUser | null): boolean {
  if (!user) return false
  const r = user.role.trim().toLowerCase()
  return TEAM_LEAD_ROLE_KEYWORDS.some((kw) => r.includes(kw))
}

export function isLeadOfAnyTeam(user: AdminUser | null, teams: Team[]): boolean {
  if (!user?.dbEmployeeId) return false
  return teams.some((t) => t.leadEmployeeId === user.dbEmployeeId)
}

export function canCreateTeam(user: AdminUser | null): boolean {
  return isFounderOrHR(user)
}

export function canAddTeamMember(user: AdminUser | null): boolean {
  return isFounderOrHR(user)
}

export function canAssignOrDeleteTask(user: AdminUser | null, teams: Team[] = []): boolean {
  if (!user) return false
  if (isFounderOrHR(user)) return true
  if (isLeadOfAnyTeam(user, teams)) return true
  if (isTeamLeadJobTitle(user)) return true
  return false
}

export function canViewAllTasks(user: AdminUser | null, teams: Team[] = []): boolean {
  return canAssignOrDeleteTask(user, teams)
}

export function filterVisibleTeams(user: AdminUser | null, teams: Team[]): Team[] {
  if (!user) return []
  return teams
}

export function normalizeUsername(value: string | null | undefined): string {
  return (value ?? '').replace(/^@/, '').trim().toLowerCase()
}

export function filterVisibleTasks(user: AdminUser | null, tasks: Task[], teams: Team[] = []): Task[] {
  if (!user) return []
  if (canViewAllTasks(user, teams)) return tasks

  const uname = normalizeUsername(user.username)
  return tasks.filter((task) => {
    if (user.dbEmployeeId && task.assigneeId === user.dbEmployeeId) return true
    const assignee = normalizeUsername(task.assigneeName)
    return assignee === uname || (uname && assignee.startsWith(uname))
  })
}

export function filterTasksForTeam(tasks: Task[], team: Team, projects: Project[]): Task[] {
  const memberIds = new Set(team.members.map((m) => m.id))
  const memberNames = new Set(team.members.map((m) => normalizeUsername(m.name)))

  const teamProjectIds = new Set(
    projects.filter((p) => p.teamId === team.id).map((p) => p.id)
  )

  return tasks.filter((task) => {
    if (task.projectId && teamProjectIds.has(task.projectId)) return true
    if (task.assigneeId && memberIds.has(task.assigneeId)) return true
    return memberNames.has(normalizeUsername(task.assigneeName))
  })
}

export function parseLeadFromOption(value: string): { username: string; employeeId?: string } | null {
  const match = value.match(/@([a-zA-Z0-9_.-]+)/)
  if (!match) return null
  return { username: match[1].toLowerCase() }
}

/** @deprecated Use canAssignOrDeleteTask instead */
export function isLeadOrHead(user: AdminUser | null): boolean {
  return canAssignOrDeleteTask(user, [])
}
