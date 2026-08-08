-- ============================================================================
--  Jibble Admin Panel — Supabase Database Schema
--  Run this entire file in your Supabase SQL Editor (once).
--  It creates all tables, indexes, RLS policies, and seed data.
-- ============================================================================

-- Enable UUID extension (usually already enabled in Supabase)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- 1. JOB CATEGORIES
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.job_categories (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name        TEXT NOT NULL UNIQUE,
  icon        TEXT NOT NULL DEFAULT '🏢',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- 2. JOB ROLES
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.job_roles (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category_id  UUID NOT NULL REFERENCES public.job_categories(id) ON DELETE CASCADE,
  title        TEXT NOT NULL,
  subcategory  TEXT,                  -- e.g. 'Backend', 'Frontend', 'DevOps'
  level        TEXT NOT NULL DEFAULT 'contributor',  -- 'intern','contributor','senior','lead','executive'
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- 3. EMPLOYEES  (core table — linked to Supabase auth.users)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.employees (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  auth_user_id    UUID UNIQUE REFERENCES auth.users(id) ON DELETE SET NULL,
  username        TEXT NOT NULL UNIQUE,
  full_name       TEXT NOT NULL,
  email           TEXT NOT NULL UNIQUE,
  avatar_emoji    TEXT NOT NULL DEFAULT '👤',
  avatar_url      TEXT,
  role            TEXT NOT NULL,
  category        TEXT NOT NULL,
  subcategory     TEXT,
  reports_to_id   UUID REFERENCES public.employees(id) ON DELETE SET NULL,
  location        TEXT DEFAULT 'India',
  mobile_number   TEXT,
  address         TEXT,
  hometown        TEXT,
  fav_food        TEXT DEFAULT '🍕 Pizza & Chai',
  hobbies         TEXT[] DEFAULT ARRAY['💻 Tech', '🎧 Music', '📚 Reading'],
  status          TEXT NOT NULL DEFAULT 'active',  -- 'active','inactive','banned'
  joined_date     DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- 4. TEAMS
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.teams (
  id                   UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name                 TEXT NOT NULL,
  department           TEXT NOT NULL,
  lead_employee_id     UUID REFERENCES public.employees(id) ON DELETE SET NULL,
  lead_name            TEXT,
  description          TEXT,
  active_projects_count INT NOT NULL DEFAULT 0,
  created_at           TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at           TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- 5. TEAM MEMBERS (join table)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.team_members (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  team_id       UUID NOT NULL REFERENCES public.teams(id) ON DELETE CASCADE,
  employee_id   UUID NOT NULL REFERENCES public.employees(id) ON DELETE CASCADE,
  team_role     TEXT NOT NULL DEFAULT 'Member',
  joined_date   TEXT DEFAULT 'Jan 2025',
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(team_id, employee_id)
);

-- ============================================================================
-- 6. PROJECTS
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.projects (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name         TEXT NOT NULL,
  team_id      UUID REFERENCES public.teams(id) ON DELETE SET NULL,
  team_name    TEXT,
  status       TEXT NOT NULL DEFAULT 'planning',  -- 'planning','in_progress','completed','on_hold'
  description  TEXT,
  target_date  TEXT,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- 7. TASKS
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.tasks (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title            TEXT NOT NULL,
  project_id       UUID REFERENCES public.projects(id) ON DELETE SET NULL,
  project_name     TEXT,
  assignee_id      UUID REFERENCES public.employees(id) ON DELETE SET NULL,
  assignee_name    TEXT,
  assignee_avatar  TEXT,
  priority         TEXT NOT NULL DEFAULT 'medium',  -- 'low','medium','high','urgent'
  status           TEXT NOT NULL DEFAULT 'todo',    -- 'todo','in_progress','in_review','completed'
  cadence          TEXT NOT NULL DEFAULT 'week',    -- 'day','week','month','year'
  due_date         TEXT,
  description      TEXT,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- 8. POLICIES
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.policies (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title            TEXT NOT NULL,
  category         TEXT NOT NULL,  -- 'Data Privacy','Security','Code of Conduct','Remote Work','Access Control'
  content          TEXT,
  version          TEXT NOT NULL DEFAULT 'v1.0',
  effective_date   TEXT,
  is_mandatory     BOOLEAN NOT NULL DEFAULT TRUE,
  compliance_rate  INT NOT NULL DEFAULT 0,  -- 0-100
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- 9. PRIVACY SETTINGS (single-row config)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.privacy_settings (
  id                          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  gdpr_compliant              BOOLEAN NOT NULL DEFAULT TRUE,
  pii_masking_enabled         BOOLEAN NOT NULL DEFAULT TRUE,
  data_retention_months       INT NOT NULL DEFAULT 12,
  audit_logging_enabled       BOOLEAN NOT NULL DEFAULT TRUE,
  auto_archive_inactive_users BOOLEAN NOT NULL DEFAULT FALSE,
  updated_at                  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- 10. AUDIT LOGS
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  actor_id     UUID REFERENCES public.employees(id) ON DELETE SET NULL,
  actor_email  TEXT,
  action       TEXT NOT NULL,  -- 'CREATE_TASK', 'UPDATE_EMPLOYEE', etc.
  resource     TEXT NOT NULL,  -- table name or resource name
  resource_id  TEXT,
  metadata     JSONB,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- INDEXES
-- ============================================================================
CREATE INDEX IF NOT EXISTS idx_employees_category ON public.employees(category);
CREATE INDEX IF NOT EXISTS idx_employees_status ON public.employees(status);
CREATE INDEX IF NOT EXISTS idx_employees_auth_user ON public.employees(auth_user_id);
CREATE INDEX IF NOT EXISTS idx_tasks_status ON public.tasks(status);
CREATE INDEX IF NOT EXISTS idx_tasks_project ON public.tasks(project_id);
CREATE INDEX IF NOT EXISTS idx_tasks_assignee ON public.tasks(assignee_id);
CREATE INDEX IF NOT EXISTS idx_team_members_team ON public.team_members(team_id);
CREATE INDEX IF NOT EXISTS idx_team_members_employee ON public.team_members(employee_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_actor ON public.audit_logs(actor_id);

-- ============================================================================
-- UPDATED_AT TRIGGER FUNCTION
-- ============================================================================
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply triggers
CREATE TRIGGER trg_employees_updated_at
  BEFORE UPDATE ON public.employees
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER trg_teams_updated_at
  BEFORE UPDATE ON public.teams
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER trg_projects_updated_at
  BEFORE UPDATE ON public.projects
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER trg_tasks_updated_at
  BEFORE UPDATE ON public.tasks
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER trg_policies_updated_at
  BEFORE UPDATE ON public.policies
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ============================================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE public.employees       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_categories  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_roles       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teams           ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_members    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks           ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.policies        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.privacy_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs      ENABLE ROW LEVEL SECURITY;

-- Allow the service role (backend) to bypass RLS completely
-- The service_role key used in the backend bypasses RLS automatically.

-- Allow authenticated users to READ employees, teams, projects, tasks, policies
CREATE POLICY "Authenticated users can read employees"
  ON public.employees FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can read teams"
  ON public.teams FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can read team_members"
  ON public.team_members FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can read projects"
  ON public.projects FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can read tasks"
  ON public.tasks FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can read policies"
  ON public.policies FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can read job_categories"
  ON public.job_categories FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can read job_roles"
  ON public.job_roles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can read privacy_settings"
  ON public.privacy_settings FOR SELECT
  TO authenticated
  USING (true);

-- Write operations go through the backend service_role (bypasses RLS)
-- No client-side write policies needed since all mutations are via backend.

-- ============================================================================
-- SEED DATA
-- ============================================================================

-- Insert default privacy settings row
INSERT INTO public.privacy_settings (
  gdpr_compliant, pii_masking_enabled, data_retention_months,
  audit_logging_enabled, auto_archive_inactive_users
) VALUES (true, true, 12, true, false)
ON CONFLICT DO NOTHING;

-- Insert default policies
INSERT INTO public.policies (title, category, content, version, effective_date, is_mandatory, compliance_rate)
VALUES
  (
    'Corporate Data Privacy & GDPR Guidelines',
    'Data Privacy',
    'Outlines strict guidelines for handling user data, personally identifiable information (PII), consent tracking, and GDPR compliance standards.',
    'v2.4', 'Jan 01, 2026', true, 94
  ),
  (
    'Information Security & Access Control Policy',
    'Security',
    'Mandates multi-factor authentication (MFA), password complexity standards, key rotation schedules, and role-based authorization rules.',
    'v3.1', 'Feb 15, 2026', true, 98
  ),
  (
    'Remote Work & Spatial Workplace Conduct',
    'Remote Work',
    'Provides best practices for flexible remote working, virtual meeting decorum, workspace ergonomic allowances, and async communication.',
    'v1.8', 'Mar 10, 2026', false, 88
  ),
  (
    'Employee Code of Ethics & Community Values',
    'Code of Conduct',
    'Establishes standards of professional integrity, zero-tolerance anti-harassment rules, and inclusive community engagement guidelines.',
    'v2.0', 'Jan 15, 2026', true, 96
  )
ON CONFLICT DO NOTHING;

-- NOTE: Employees are seeded via the backend seed script (npm run db:seed:admin)
-- after auth users are created in Supabase Auth, since employees.auth_user_id
-- references auth.users(id).
