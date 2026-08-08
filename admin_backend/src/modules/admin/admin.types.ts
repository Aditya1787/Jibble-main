/**
 * @file modules/admin/admin.types.ts
 * @description TypeScript types for the Admin Panel module in admin_backend.
 */

export interface Employee {
  id: string;
  auth_user_id: string | null;
  username: string;
  full_name: string;
  email: string;
  avatar_emoji: string;
  avatar_url: string | null;
  role: string;
  category: string;
  subcategory: string | null;
  reports_to_id: string | null;
  location: string | null;
  mobile_number: string | null;
  address: string | null;
  hometown: string | null;
  fav_food: string | null;
  hobbies: string[];
  status: 'active' | 'inactive' | 'banned';
  joined_date: string;
  created_at: string;
  updated_at: string;
  reports_to?: Pick<Employee, 'id' | 'full_name' | 'role'> | null;
}

export interface EmployeeDTO {
  id: string;
  username: string;
  fullName: string;
  email: string;
  avatarEmoji: string;
  avatarUrl: string | null;
  role: string;
  category: string;
  subcategory: string | null;
  reportsToId: string | null;
  reportsToName: string | null;
  location: string | null;
  mobileNumber: string | null;
  address: string | null;
  hometown: string | null;
  favFood: string | null;
  hobbies: string[];
  status: string;
  joinedDate: string;
}

export interface OrgNodeDTO {
  id: string;
  username: string;
  fullName: string;
  email: string;
  avatarEmoji: string;
  role: string;
  category: string;
  subcategory: string | null;
  reportsToId: string | null;
  children?: OrgNodeDTO[];
}

export interface TeamMemberRow {
  id: string;
  team_id: string;
  employee_id: string;
  team_role: string;
  joined_date: string;
  employee?: Pick<Employee, 'id' | 'full_name' | 'email' | 'avatar_emoji' | 'role'>;
}

export interface Team {
  id: string;
  name: string;
  department: string;
  lead_employee_id: string | null;
  lead_name: string | null;
  description: string | null;
  active_projects_count: number;
  created_at: string;
  updated_at: string;
  members?: TeamMemberRow[];
}

export interface TeamDTO {
  id: string;
  name: string;
  department: string;
  leadEmployeeId: string | null;
  leadName: string | null;
  description: string | null;
  activeProjectsCount: number;
  members: Array<{
    id: string;
    name: string;
    email: string;
    avatar: string;
    teamRole: string;
    joinedDate: string;
  }>;
}

export type ProjectStatus = 'planning' | 'in_progress' | 'completed' | 'on_hold';

export interface Project {
  id: string;
  name: string;
  team_id: string | null;
  team_name: string | null;
  status: ProjectStatus;
  description: string | null;
  target_date: string | null;
  created_at: string;
  updated_at: string;
}

export interface ProjectDTO {
  id: string;
  name: string;
  teamId: string | null;
  teamName: string | null;
  status: ProjectStatus;
  description: string | null;
  targetDate: string | null;
}

export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';
export type TaskStatus = 'todo' | 'in_progress' | 'in_review' | 'completed';
export type TaskCadence = 'day' | 'week' | 'month' | 'year';

export interface Task {
  id: string;
  title: string;
  project_id: string | null;
  project_name: string | null;
  assignee_id: string | null;
  assignee_name: string | null;
  assignee_avatar: string | null;
  priority: TaskPriority;
  status: TaskStatus;
  cadence: TaskCadence;
  due_date: string | null;
  description: string | null;
  created_at: string;
  updated_at: string;
}

export interface TaskDTO {
  id: string;
  title: string;
  projectId: string | null;
  projectName: string | null;
  assigneeId: string | null;
  assigneeName: string | null;
  assigneeAvatar: string | null;
  priority: TaskPriority;
  status: TaskStatus;
  cadence: TaskCadence;
  dueDate: string | null;
  description: string | null;
}

export type PolicyCategory = 'Data Privacy' | 'Security' | 'Code of Conduct' | 'Remote Work' | 'Access Control';

export interface Policy {
  id: string;
  title: string;
  category: PolicyCategory;
  content: string | null;
  version: string;
  effective_date: string | null;
  is_mandatory: boolean;
  compliance_rate: number;
  created_at: string;
  updated_at: string;
}

export interface PolicyDTO {
  id: string;
  title: string;
  category: PolicyCategory;
  content: string | null;
  version: string;
  effectiveDate: string | null;
  isMandatory: boolean;
  complianceRate: number;
}

export interface PrivacySettings {
  id: string;
  gdpr_compliant: boolean;
  pii_masking_enabled: boolean;
  data_retention_months: number;
  audit_logging_enabled: boolean;
  auto_archive_inactive_users: boolean;
  updated_at: string;
}

export interface PrivacySettingsDTO {
  gdprCompliant: boolean;
  piiMaskingEnabled: boolean;
  dataRetentionMonths: number;
  auditLoggingEnabled: boolean;
  autoArchiveInactiveUsers: boolean;
}
