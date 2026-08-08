/**
 * @file modules/admin/admin.repository.ts
 * @description Database query layer utilizing Supabase service_role client for admin_backend.
 */

import { getSupabaseAdmin } from '../../config/supabase';
import { AppError } from '../../middlewares/error.middleware';
import type {
  Employee,
  Team,
  TeamMemberRow,
  Project,
  Task,
  Policy,
  PrivacySettings,
  OrgNodeDTO,
} from './admin.types';
import type {
  CreateEmployeeInput,
  UpdateEmployeeInput,
  CreateTeamInput,
  UpdateTeamInput,
  AddTeamMemberInput,
  CreateProjectInput,
  UpdateProjectInput,
  CreateTaskInput,
  UpdateTaskInput,
  CreatePolicyInput,
  UpdatePolicyInput,
  UpdatePrivacySettingsInput,
} from './admin.validation';

export const employeeRepo = {
  async findAll(): Promise<Employee[]> {
    const sb = getSupabaseAdmin();
    const { data, error } = await sb
      .from('employees')
      .select('*, reports_to:reports_to_id(id, full_name, role)')
      .order('full_name', { ascending: true });
    if (error) throw AppError.internal(error.message);
    return data as unknown as Employee[];
  },

  async findById(id: string): Promise<Employee | null> {
    const sb = getSupabaseAdmin();
    const { data, error } = await sb
      .from('employees')
      .select('*, reports_to:reports_to_id(id, full_name, role)')
      .eq('id', id)
      .single();
    if (error && error.code !== 'PGRST116') throw AppError.internal(error.message);
    return data as unknown as Employee | null;
  },

  async findByAuthUserId(authUserId: string): Promise<Employee | null> {
    const sb = getSupabaseAdmin();
    const { data, error } = await sb
      .from('employees')
      .select('*, reports_to:reports_to_id(id, full_name, role)')
      .eq('auth_user_id', authUserId)
      .single();
    if (error && error.code !== 'PGRST116') throw AppError.internal(error.message);
    return data as unknown as Employee | null;
  },

  async findByEmail(email: string): Promise<Employee | null> {
    const sb = getSupabaseAdmin();
    const { data, error } = await sb
      .from('employees')
      .select('*')
      .eq('email', email.toLowerCase())
      .single();
    if (error && error.code !== 'PGRST116') throw AppError.internal(error.message);
    return data as Employee | null;
  },

  async create(input: CreateEmployeeInput & { auth_user_id?: string }): Promise<Employee> {
    const sb = getSupabaseAdmin();
    const { data, error } = await sb
      .from('employees')
      .insert({
        ...input,
        email: input.email.toLowerCase(),
      })
      .select()
      .single();
    if (error) throw AppError.internal(error.message);
    return data as Employee;
  },

  async update(id: string, input: UpdateEmployeeInput): Promise<Employee> {
    const sb = getSupabaseAdmin();
    const { data, error } = await sb
      .from('employees')
      .update(input)
      .eq('id', id)
      .select()
      .single();
    if (error) throw AppError.internal(error.message);
    return data as Employee;
  },

  async getHierarchyTree(): Promise<OrgNodeDTO[]> {
    const employees = await this.findAll();

    const nodeMap: Record<string, OrgNodeDTO> = {};
    employees.forEach((emp) => {
      nodeMap[emp.id] = {
        id: emp.id,
        username: emp.username,
        fullName: emp.full_name,
        email: emp.email,
        avatarEmoji: emp.avatar_emoji,
        role: emp.role,
        category: emp.category,
        subcategory: emp.subcategory,
        reportsToId: emp.reports_to_id,
        children: [],
      };
    });

    const roots: OrgNodeDTO[] = [];
    employees.forEach((emp) => {
      if (!emp.reports_to_id || !nodeMap[emp.reports_to_id]) {
        roots.push(nodeMap[emp.id]);
      } else {
        const parent = nodeMap[emp.reports_to_id];
        if (parent) {
          parent.children = parent.children ?? [];
          parent.children.push(nodeMap[emp.id]);
        }
      }
    });

    return roots;
  },
};

export const teamRepo = {
  async findAll(): Promise<Team[]> {
    const sb = getSupabaseAdmin();
    const { data, error } = await sb
      .from('teams')
      .select(`
        *,
        members:team_members(
          id, team_role, joined_date,
          employee:employee_id(id, full_name, email, avatar_emoji, role)
        )
      `)
      .order('name', { ascending: true });
    if (error) throw AppError.internal(error.message);
    return data as unknown as Team[];
  },

  async findById(id: string): Promise<Team | null> {
    const sb = getSupabaseAdmin();
    const { data, error } = await sb
      .from('teams')
      .select(`
        *,
        members:team_members(
          id, team_role, joined_date,
          employee:employee_id(id, full_name, email, avatar_emoji, role)
        )
      `)
      .eq('id', id)
      .single();
    if (error && error.code !== 'PGRST116') throw AppError.internal(error.message);
    return data as unknown as Team | null;
  },

  async create(input: CreateTeamInput): Promise<Team> {
    const sb = getSupabaseAdmin();
    const { data, error } = await sb
      .from('teams')
      .insert(input)
      .select()
      .single();
    if (error) throw AppError.internal(error.message);
    return data as Team;
  },

  async update(id: string, input: UpdateTeamInput): Promise<Team> {
    const sb = getSupabaseAdmin();
    const { data, error } = await sb
      .from('teams')
      .update(input)
      .eq('id', id)
      .select()
      .single();
    if (error) throw AppError.internal(error.message);
    return data as Team;
  },

  async addMember(teamId: string, input: AddTeamMemberInput): Promise<TeamMemberRow> {
    const sb = getSupabaseAdmin();
    const { data, error } = await sb
      .from('team_members')
      .insert({ team_id: teamId, ...input })
      .select()
      .single();
    if (error) {
      if (error.code === '23505') throw AppError.conflict('Employee is already in this team');
      throw AppError.internal(error.message);
    }
    return data as TeamMemberRow;
  },

  async removeMember(teamId: string, employeeId: string): Promise<void> {
    const sb = getSupabaseAdmin();
    const { error } = await sb
      .from('team_members')
      .delete()
      .eq('team_id', teamId)
      .eq('employee_id', employeeId);
    if (error) throw AppError.internal(error.message);
  },
};

export const projectRepo = {
  async findAll(teamId?: string): Promise<Project[]> {
    const sb = getSupabaseAdmin();
    let query = sb.from('projects').select('*').order('created_at', { ascending: false });
    if (teamId) query = query.eq('team_id', teamId);
    const { data, error } = await query;
    if (error) throw AppError.internal(error.message);
    return data as Project[];
  },

  async findById(id: string): Promise<Project | null> {
    const sb = getSupabaseAdmin();
    const { data, error } = await sb
      .from('projects')
      .select('*')
      .eq('id', id)
      .single();
    if (error && error.code !== 'PGRST116') throw AppError.internal(error.message);
    return data as Project | null;
  },

  async create(input: CreateProjectInput): Promise<Project> {
    const sb = getSupabaseAdmin();
    const { data, error } = await sb
      .from('projects')
      .insert(input)
      .select()
      .single();
    if (error) throw AppError.internal(error.message);
    return data as Project;
  },

  async update(id: string, input: UpdateProjectInput): Promise<Project> {
    const sb = getSupabaseAdmin();
    const { data, error } = await sb
      .from('projects')
      .update(input)
      .eq('id', id)
      .select()
      .single();
    if (error) throw AppError.internal(error.message);
    return data as Project;
  },
};

export const taskRepo = {
  async findAll(filters?: { status?: string; cadence?: string; projectId?: string }): Promise<Task[]> {
    const sb = getSupabaseAdmin();
    let query = sb.from('tasks').select('*').order('created_at', { ascending: false });
    if (filters?.status) query = query.eq('status', filters.status);
    if (filters?.cadence) query = query.eq('cadence', filters.cadence);
    if (filters?.projectId) query = query.eq('project_id', filters.projectId);
    const { data, error } = await query;
    if (error) throw AppError.internal(error.message);
    return data as Task[];
  },

  async findById(id: string): Promise<Task | null> {
    const sb = getSupabaseAdmin();
    const { data, error } = await sb
      .from('tasks')
      .select('*')
      .eq('id', id)
      .single();
    if (error && error.code !== 'PGRST116') throw AppError.internal(error.message);
    return data as Task | null;
  },

  async create(input: CreateTaskInput): Promise<Task> {
    const sb = getSupabaseAdmin();
    const { data, error } = await sb
      .from('tasks')
      .insert(input)
      .select()
      .single();
    if (error) throw AppError.internal(error.message);
    return data as Task;
  },

  async update(id: string, input: UpdateTaskInput): Promise<Task> {
    const sb = getSupabaseAdmin();
    const { data, error } = await sb
      .from('tasks')
      .update(input)
      .eq('id', id)
      .select()
      .single();
    if (error) throw AppError.internal(error.message);
    return data as Task;
  },

  async delete(id: string): Promise<void> {
    const sb = getSupabaseAdmin();
    const { error } = await sb.from('tasks').delete().eq('id', id);
    if (error) throw AppError.internal(error.message);
  },
};

export const policyRepo = {
  async findAll(): Promise<Policy[]> {
    const sb = getSupabaseAdmin();
    const { data, error } = await sb
      .from('policies')
      .select('*')
      .order('title', { ascending: true });
    if (error) throw AppError.internal(error.message);
    return data as Policy[];
  },

  async create(input: CreatePolicyInput): Promise<Policy> {
    const sb = getSupabaseAdmin();
    const { data, error } = await sb
      .from('policies')
      .insert(input)
      .select()
      .single();
    if (error) throw AppError.internal(error.message);
    return data as Policy;
  },

  async update(id: string, input: UpdatePolicyInput): Promise<Policy> {
    const sb = getSupabaseAdmin();
    const { data, error } = await sb
      .from('policies')
      .update(input)
      .eq('id', id)
      .select()
      .single();
    if (error) throw AppError.internal(error.message);
    return data as Policy;
  },
};

export const privacyRepo = {
  async get(): Promise<PrivacySettings | null> {
    const sb = getSupabaseAdmin();
    const { data, error } = await sb
      .from('privacy_settings')
      .select('*')
      .limit(1)
      .single();
    if (error && error.code !== 'PGRST116') throw AppError.internal(error.message);
    return data as PrivacySettings | null;
  },

  async update(input: UpdatePrivacySettingsInput): Promise<PrivacySettings> {
    const sb = getSupabaseAdmin();
    const { data: existing } = await sb.from('privacy_settings').select('id').limit(1).single();
    if (existing) {
      const { data, error } = await sb
        .from('privacy_settings')
        .update({ ...input, updated_at: new Date().toISOString() })
        .eq('id', existing.id)
        .select()
        .single();
      if (error) throw AppError.internal(error.message);
      return data as PrivacySettings;
    } else {
      const { data, error } = await sb
        .from('privacy_settings')
        .insert(input)
        .select()
        .single();
      if (error) throw AppError.internal(error.message);
      return data as PrivacySettings;
    }
  },
};

export const auditRepo = {
  async log(params: {
    actorId?: string;
    actorEmail?: string;
    action: string;
    resource: string;
    resourceId?: string;
    metadata?: Record<string, unknown>;
  }): Promise<void> {
    const sb = getSupabaseAdmin();
    await sb.from('audit_logs').insert({
      actor_id: params.actorId ?? null,
      actor_email: params.actorEmail ?? null,
      action: params.action,
      resource: params.resource,
      resource_id: params.resourceId ?? null,
      metadata: params.metadata ?? null,
    });
  },
};
