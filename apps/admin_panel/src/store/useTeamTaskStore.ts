import { create } from 'zustand'

export interface TeamMember {
  id: string
  name: string
  email: string
  avatar: string
  teamRole: string
  joinedDate: string
}

export interface Team {
  id: string
  name: string
  department: string
  leadName: string
  description: string
  members: TeamMember[]
  activeProjectsCount: number
}

export interface Project {
  id: string
  name: string
  teamId: string
  teamName: string
  status: 'planning' | 'in_progress' | 'completed' | 'on_hold'
  description: string
  targetDate: string
}

export type TaskCadence = 'day' | 'week' | 'month' | 'year'

export interface Task {
  id: string
  title: string
  projectId: string
  projectName: string
  assigneeName: string
  assigneeAvatar?: string
  priority: 'low' | 'medium' | 'high' | 'urgent'
  status: 'todo' | 'in_progress' | 'in_review' | 'completed'
  cadence: TaskCadence
  dueDate: string
  description: string
}

export interface Policy {
  id: string
  title: string
  category: 'Data Privacy' | 'Security' | 'Code of Conduct' | 'Remote Work' | 'Access Control'
  content: string
  version: string
  effectiveDate: string
  isMandatory: boolean
  complianceRate: number // percentage 0 - 100
}

export interface PrivacySettings {
  gdprCompliant: boolean
  piiMaskingEnabled: boolean
  dataRetentionMonths: number
  auditLoggingEnabled: boolean
  autoArchiveInactiveUsers: boolean
}

interface TeamTaskState {
  teams: Team[]
  projects: Project[]
  tasks: Task[]
  policies: Policy[]
  privacySettings: PrivacySettings

  // Actions
  addTeam: (team: Omit<Team, 'id'>) => void
  updateTeam: (teamId: string, teamData: Partial<Team>) => void
  addMemberToTeam: (teamId: string, member: TeamMember) => void
  removeMemberFromTeam: (teamId: string, memberId: string) => void
  addProject: (project: Omit<Project, 'id'>) => void
  addTask: (task: Omit<Task, 'id'>) => void
  updateTask: (taskId: string, taskData: Partial<Task>) => void
  updateTaskStatus: (taskId: string, status: Task['status']) => void
  deleteTask: (taskId: string) => void
  addPolicy: (policy: Omit<Policy, 'id'>) => void
  togglePolicyMandatory: (policyId: string) => void
  updatePrivacySettings: (settings: Partial<PrivacySettings>) => void
  getEmployeePerformance: (memberName: string) => {
    totalAssigned: number
    completedOnTime: number
    overdueCount: number
    onTimeRate: number
    ratingBadge: string
  }
}

const initialTeams: Team[] = [
  {
    id: 'team-1',
    name: 'Frontend Core & Design System',
    department: 'Engineering',
    leadName: 'Alex Rivera',
    description: 'Responsible for main web admin apps, component design systems, and spatial UI styling.',
    activeProjectsCount: 3,
    members: [
      { id: 'm-1', name: 'Aditya Kumar', email: 'aditya@company.com', avatar: '💻', teamRole: 'Senior Frontend Lead', joinedDate: 'Jan 2025' },
      { id: 'm-2', name: 'Priya Sharma', email: 'priya@company.com', avatar: '🎨', teamRole: 'UI/UX Designer', joinedDate: 'Feb 2025' },
      { id: 'm-3', name: 'Rahul Verma', email: 'rahul@company.com', avatar: '🚀', teamRole: 'React Specialist', joinedDate: 'Mar 2025' },
    ]
  },
  {
    id: 'team-2',
    name: 'Backend Infrastructure & Cloud API',
    department: 'Software Engineering',
    leadName: 'Elena Rostova',
    description: 'Scalable cloud services, authentication microservices, database optimizations, and REST/GraphQL APIs.',
    activeProjectsCount: 4,
    members: [
      { id: 'm-4', name: 'Marcus Vance', email: 'marcus@company.com', avatar: '👨‍💼', teamRole: 'Lead Architect', joinedDate: 'Dec 2024' },
      { id: 'm-5', name: 'Neha Gupta', email: 'neha@company.com', avatar: '🔐', teamRole: 'Backend Security Dev', joinedDate: 'Jan 2025' },
      { id: 'm-6', name: 'Robert Taylor', email: 'robert@company.com', avatar: '☁️', teamRole: 'DevOps & SRE', joinedDate: 'Feb 2025' },
    ]
  },
  {
    id: 'team-3',
    name: 'People Operations & HR Excellence',
    department: 'Human Resources',
    leadName: 'Priya Sharma',
    description: 'Talent recruitment, employee onboarding flows, workspace compliance, and internal community growth.',
    activeProjectsCount: 2,
    members: [
      { id: 'm-7', name: 'Sarah Jenkins', email: 'sarah@company.com', avatar: '🏢', teamRole: 'HRBP Lead', joinedDate: 'Nov 2024' },
      { id: 'm-8', name: 'Anita Roy', email: 'anita@company.com', avatar: '🎒', teamRole: 'Talent Executive', joinedDate: 'Jan 2025' },
    ]
  }
]

const initialProjects: Project[] = [
  { id: 'proj-1', name: 'Jibble Admin Console v2.0', teamId: 'team-1', teamName: 'Frontend Core & Design System', status: 'in_progress', description: 'Redesigning Admin console with employee management and privacy tools.', targetDate: 'Aug 30, 2026' },
  { id: 'proj-2', name: 'Authentication Security Hardening', teamId: 'team-2', teamName: 'Backend Infrastructure & Cloud API', status: 'in_progress', description: 'Implementing OTP authentication, RBAC policy enforcement, and audit logs.', targetDate: 'Sep 15, 2026' },
  { id: 'proj-3', name: 'Employee Onboarding & Policy Compliance', teamId: 'team-3', teamName: 'People Operations & HR Excellence', status: 'in_progress', description: 'Automating policy sign-offs and employee task assignments.', targetDate: 'Oct 01, 2026' },
]

const initialTasks: Task[] = [
  // Day-wise Tasks (Daily)
  {
    id: 'task-1',
    title: 'Daily Frontend Code Review & Component Linting',
    projectId: 'proj-1',
    projectName: 'Jibble Admin Console v2.0',
    assigneeName: 'Aditya Kumar',
    assigneeAvatar: '💻',
    priority: 'high',
    status: 'completed',
    cadence: 'day',
    dueDate: 'Today, 5:00 PM',
    description: 'Perform daily PR reviews for spatial UI components and theme tokens.'
  },
  {
    id: 'task-2',
    title: 'Daily Backend API Health & Error Rate Monitoring',
    projectId: 'proj-2',
    projectName: 'Authentication Security Hardening',
    assigneeName: 'Robert Taylor',
    assigneeAvatar: '☁️',
    priority: 'urgent',
    status: 'in_progress',
    cadence: 'day',
    dueDate: 'Today, 6:00 PM',
    description: 'Verify API uptime, error rate metrics, and microservice latencies.'
  },

  // Week-wise Tasks (Weekly)
  {
    id: 'task-3',
    title: 'Weekly Sprint Release: Team & Task Management Module',
    projectId: 'proj-1',
    projectName: 'Jibble Admin Console v2.0',
    assigneeName: 'Rahul Verma',
    assigneeAvatar: '🚀',
    priority: 'high',
    status: 'in_progress',
    cadence: 'week',
    dueDate: 'End of Sprint (Friday)',
    description: 'Finalize team creation modal, role selectors, and task cadence filters.'
  },
  {
    id: 'task-4',
    title: 'Weekly HR Employee Onboarding Sync',
    projectId: 'proj-3',
    projectName: 'Employee Onboarding & Policy Compliance',
    assigneeName: 'Priya Sharma',
    assigneeAvatar: '🏢',
    priority: 'medium',
    status: 'todo',
    cadence: 'week',
    dueDate: 'This Friday, 3:00 PM',
    description: 'Review new employee registrations, HR contact assignments, and onboarding checklists.'
  },

  // Month-wise Tasks (Monthly)
  {
    id: 'task-5',
    title: 'Monthly Privacy & GDPR Compliance Audit',
    projectId: 'proj-3',
    projectName: 'Employee Onboarding & Policy Compliance',
    assigneeName: 'Sarah Jenkins',
    assigneeAvatar: '🏢',
    priority: 'high',
    status: 'in_progress',
    cadence: 'month',
    dueDate: 'End of Month',
    description: 'Audit employee policy acceptance rates and PII data handling toggles.'
  },
  {
    id: 'task-6',
    title: 'Monthly Database Indexing & Scalability Benchmark',
    projectId: 'proj-2',
    projectName: 'Authentication Security Hardening',
    assigneeName: 'Marcus Vance',
    assigneeAvatar: '👨‍💼',
    priority: 'medium',
    status: 'todo',
    cadence: 'month',
    dueDate: 'Aug 31, 2026',
    description: 'Run database query profiling, optimize high-traffic indexes, and prune telemetry logs.'
  },

  // Year-wise Tasks (Yearly)
  {
    id: 'task-7',
    title: 'Yearly Information Security Policy Revision & ISO Certification',
    projectId: 'proj-3',
    projectName: 'Employee Onboarding & Policy Compliance',
    assigneeName: 'Neha Gupta',
    assigneeAvatar: '🔐',
    priority: 'urgent',
    status: 'in_progress',
    cadence: 'year',
    dueDate: 'Q4 2026',
    description: 'Comprehensive annual update of cybersecurity policies, data privacy guidelines, and ISO compliance.'
  },
  {
    id: 'task-8',
    title: 'Annual Enterprise Architecture & Infrastructure Planning',
    projectId: 'proj-2',
    projectName: 'Authentication Security Hardening',
    assigneeName: 'Elena Rostova',
    assigneeAvatar: '☁️',
    priority: 'high',
    status: 'todo',
    cadence: 'year',
    dueDate: 'Dec 2026',
    description: 'Evaluate cloud provider contracts, disaster recovery budgets, and 2027 tech roadmap.'
  }
]

const initialPolicies: Policy[] = [
  {
    id: 'pol-1',
    title: 'Corporate Data Privacy & GDPR Guidelines',
    category: 'Data Privacy',
    version: 'v2.4',
    effectiveDate: 'Jan 01, 2026',
    isMandatory: true,
    complianceRate: 94,
    content: 'Outlines strict guidelines for handling user data, personally identifiable information (PII), consent tracking, and GDPR compliance standards.'
  },
  {
    id: 'pol-2',
    title: 'Information Security & Access Control Policy',
    category: 'Security',
    version: 'v3.1',
    effectiveDate: 'Feb 15, 2026',
    isMandatory: true,
    complianceRate: 98,
    content: 'Mandates multi-factor authentication (MFA), password complexity standards, key rotation schedules, and role-based authorization rules.'
  },
  {
    id: 'pol-3',
    title: 'Remote Work & Spatial Workplace Conduct',
    category: 'Remote Work',
    version: 'v1.8',
    effectiveDate: 'Mar 10, 2026',
    isMandatory: false,
    complianceRate: 88,
    content: 'Provides best practices for flexible remote working, virtual meeting decorum, workspace ergonomic allowances, and async communication.'
  },
  {
    id: 'pol-4',
    title: 'Employee Code of Ethics & Community Values',
    category: 'Code of Conduct',
    version: 'v2.0',
    effectiveDate: 'Jan 15, 2026',
    isMandatory: true,
    complianceRate: 96,
    content: 'Establishes standards of professional integrity, zero-tolerance anti-harassment rules, and inclusive community engagement guidelines.'
  }
]

const initialPrivacySettings: PrivacySettings = {
  gdprCompliant: true,
  piiMaskingEnabled: true,
  dataRetentionMonths: 12,
  auditLoggingEnabled: true,
  autoArchiveInactiveUsers: false
}

export const useTeamTaskStore = create<TeamTaskState>((set, get) => ({
  teams: initialTeams,
  projects: initialProjects,
  tasks: initialTasks,
  policies: initialPolicies,
  privacySettings: initialPrivacySettings,

  addTeam: (team) => set((state) => ({
    teams: [...state.teams, { ...team, id: `team-${Date.now()}` }]
  })),

  updateTeam: (teamId, teamData) => set((state) => ({
    teams: state.teams.map((t) => t.id === teamId ? { ...t, ...teamData } : t)
  })),

  addMemberToTeam: (teamId, member) => set((state) => ({
    teams: state.teams.map((t) => {
      if (t.id === teamId) {
        // Prevent duplicate member add
        if (t.members.some((m) => m.name.toLowerCase() === member.name.toLowerCase() || m.email.toLowerCase() === member.email.toLowerCase())) {
          return t
        }
        return { ...t, members: [...t.members, member] }
      }
      return t
    })
  })),

  removeMemberFromTeam: (teamId, memberId) => set((state) => ({
    teams: state.teams.map((t) => {
      if (t.id === teamId) {
        return { ...t, members: t.members.filter((m) => m.id !== memberId) }
      }
      return t
    })
  })),

  addProject: (project) => set((state) => ({
    projects: [...state.projects, { ...project, id: `proj-${Date.now()}` }]
  })),

  addTask: (task) => set((state) => ({
    tasks: [
      { ...task, id: `task-${Date.now()}` },
      ...state.tasks
    ]
  })),

  updateTask: (taskId, taskData) => set((state) => ({
    tasks: state.tasks.map((t) => t.id === taskId ? { ...t, ...taskData } : t)
  })),

  updateTaskStatus: (taskId, status) => set((state) => ({
    tasks: state.tasks.map((t) => t.id === taskId ? { ...t, status } : t)
  })),

  deleteTask: (taskId) => set((state) => ({
    tasks: state.tasks.filter((t) => t.id !== taskId)
  })),

  addPolicy: (policy) => set((state) => ({
    policies: [...state.policies, { ...policy, id: `pol-${Date.now()}` }]
  })),

  togglePolicyMandatory: (policyId) => set((state) => ({
    policies: state.policies.map((p) => p.id === policyId ? { ...p, isMandatory: !p.isMandatory } : p)
  })),

  updatePrivacySettings: (settings) => set((state) => ({
    privacySettings: { ...state.privacySettings, ...settings }
  })),

  getEmployeePerformance: (memberName) => {
    const userTasks = get().tasks.filter(
      (t) => t.assigneeName.toLowerCase().includes(memberName.toLowerCase())
    )
    const totalAssigned = Math.max(userTasks.length, 1)
    const completedTasks = userTasks.filter((t) => t.status === 'completed')
    const completedOnTime = completedTasks.length
    const overdueCount = userTasks.filter((t) => t.status !== 'completed' && t.priority === 'urgent').length
    const onTimeRate = Math.round((completedOnTime / totalAssigned) * 100)

    let ratingBadge = '🌟 Top Performer'
    if (onTimeRate < 60) {
      ratingBadge = '📈 Needs Improvement'
    } else if (onTimeRate < 85) {
      ratingBadge = '⚡ Reliable Contributor'
    }

    return {
      totalAssigned: userTasks.length,
      completedOnTime,
      overdueCount,
      onTimeRate,
      ratingBadge
    }
  }
}))
