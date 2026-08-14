/**
 * @file utils/permissions.ts
 * @description Role-based access control for teams and tasks.
 *
 * Permission matrix:
 * | Action            | Member | Team Lead | HR | Founder |
 * | View Teams        |   ✓    |     ✓     | ✓  |    ✓    |
 * | Create Team       |   ✗    |     ✗     | ✓  |    ✓    |
 * | Add Team Member   |   ✗    |     ✗     | ✓  |    ✓    |
 * | View Own Tasks    |   ✓    |     ✓     | ✓  |    ✓    |
 * | View All Tasks    |   ✗    |     ✓     | ✓  |    ✓    |
 * | Update Task Status|   ✓    |     ✓     | ✓  |    ✓    |
 * | Assign/Create Task|   ✗    |     ✓     | ✓  |    ✓    |
 * | Delete Task       |   ✗    |     ✓     | ✓  |    ✓    |
 */

import type { Team, Task, Project } from '../modules/admin/admin.types';

const FOUNDER_KEYWORDS = [
  'founder',
  'co-founder',
  'co founder',
  'ceo',
  'founder & ceo',
  'founder and ceo',
];

const HR_KEYWORDS = [
  'hr',
  'hr manager',
  'hr head',
  'hr director',
  'chief hr officer',
  'human resources',
  'head of hr',
  'people operations',
];

const TEAM_LEAD_ROLE_KEYWORDS = ['team lead', 'tech lead'];

export interface PermissionContext {
  employeeId?: string;
  teams?: Team[];
}

export function normalizeRole(role: string): string {
  return role.trim().toLowerCase();
}

export function isFounderOrHR(role: string, category?: string): boolean {
  const r = normalizeRole(role);
  const c = (category ?? '').trim().toLowerCase();

  if (FOUNDER_KEYWORDS.some((kw) => r === kw || r.includes(kw))) return true;
  if (HR_KEYWORDS.some((kw) => r.includes(kw) || c.includes(kw))) return true;
  return false;
}

/** Org job title indicates a team-lead role (not generic "lead engineer"). */
export function isTeamLeadJobTitle(role: string): boolean {
  const r = normalizeRole(role);
  return TEAM_LEAD_ROLE_KEYWORDS.some((kw) => r.includes(kw));
}

export function isLeadOfAnyTeam(employeeId: string | undefined, teams: Team[] = []): boolean {
  if (!employeeId) return false;
  return teams.some((t) => t.lead_employee_id === employeeId);
}

export function canCreateTeam(role: string, category?: string): boolean {
  return isFounderOrHR(role, category);
}

export function canAddTeamMember(role: string, category?: string): boolean {
  return isFounderOrHR(role, category);
}

export function canAssignOrDeleteTask(
  role: string,
  category?: string,
  ctx: PermissionContext = {}
): boolean {
  if (isFounderOrHR(role, category)) return true;
  if (ctx.employeeId && isLeadOfAnyTeam(ctx.employeeId, ctx.teams)) return true;
  if (isTeamLeadJobTitle(role)) return true;
  return false;
}

export function canViewAllTasks(
  role: string,
  category?: string,
  ctx: PermissionContext = {}
): boolean {
  return canAssignOrDeleteTask(role, category, ctx);
}

/** Teams visible to the current employee (HR/Founder see all). */
export function filterVisibleTeams(
  teams: Team[],
  employeeId: string | undefined,
  role: string,
  category?: string
): Team[] {
  if (isFounderOrHR(role, category)) return teams;
  if (!employeeId) return [];

  return teams.filter((team) => {
    if (team.lead_employee_id === employeeId) return true;
    return (team.members ?? []).some(
      (m) => m.employee_id === employeeId || m.employee?.id === employeeId
    );
  });
}

export function normalizeUsername(value: string | null | undefined): string {
  return (value ?? '').replace(/^@/, '').trim().toLowerCase();
}

/** Tasks visible to the current employee. */
export function filterVisibleTasks(
  tasks: Task[],
  employeeId: string | undefined,
  username: string | undefined,
  role: string,
  category?: string,
  ctx: PermissionContext = {}
): Task[] {
  if (canViewAllTasks(role, category, ctx)) return tasks;

  const uname = normalizeUsername(username);
  return tasks.filter((task) => {
    if (employeeId && task.assignee_id === employeeId) return true;
    const assignee = normalizeUsername(task.assignee_name);
    return assignee === uname || (uname && assignee.startsWith(uname));
  });
}

/** Tasks that belong to a team (via members or linked projects). */
export function filterTasksForTeam(
  tasks: Task[],
  team: Team,
  projects: Project[]
): Task[] {
  const memberIds = new Set(
    (team.members ?? [])
      .map((m) => m.employee_id ?? m.employee?.id)
      .filter(Boolean) as string[]
  );
  const memberNames = new Set(
    (team.members ?? [])
      .map((m) => normalizeUsername(m.employee?.username ?? m.employee?.full_name))
      .filter(Boolean)
  );

  const teamProjectIds = new Set(
    projects.filter((p) => p.team_id === team.id).map((p) => p.id)
  );

  return tasks.filter((task) => {
    if (task.project_id && teamProjectIds.has(task.project_id)) return true;
    if (task.assignee_id && memberIds.has(task.assignee_id)) return true;
    const assignee = normalizeUsername(task.assignee_name);
    return memberNames.has(assignee);
  });
}

export function parseLeadUsername(leadName: string | null | undefined): string | null {
  if (!leadName) return null;
  const match = leadName.match(/@([a-zA-Z0-9_.-]+)/);
  if (match) return match[1].toLowerCase();
  const first = leadName.split('(')[0].trim().replace(/^@/, '');
  return first ? first.toLowerCase() : null;
}
