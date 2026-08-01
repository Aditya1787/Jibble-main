-- ============================================================
-- Migration 013 — Circles (Communities), Admin Approval & 10 Components
-- ============================================================

-- 1. Circles (Communities) Table
CREATE TABLE IF NOT EXISTS circles (
  id               UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  name             VARCHAR(100) NOT NULL,
  slug             VARCHAR(100) NOT NULL UNIQUE,
  description      TEXT,
  avatar_url       VARCHAR(500),
  banner_url       VARCHAR(500),
  type             VARCHAR(30)  NOT NULL DEFAULT 'general', -- 'college', 'school', 'interest', 'creator', 'organization', 'general'
  status           VARCHAR(20)  NOT NULL DEFAULT 'pending', -- 'pending', 'approved', 'rejected'
  college_id       UUID        REFERENCES colleges(id) ON DELETE SET NULL,
  created_by       UUID        REFERENCES users(id) ON DELETE SET NULL,
  is_private       BOOLEAN     NOT NULL DEFAULT FALSE,
  members_count    INT         NOT NULL DEFAULT 1,
  rejection_reason TEXT,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for circles
CREATE INDEX IF NOT EXISTS idx_circles_slug ON circles (slug);
CREATE INDEX IF NOT EXISTS idx_circles_status ON circles (status);
CREATE INDEX IF NOT EXISTS idx_circles_type ON circles (type);
CREATE INDEX IF NOT EXISTS idx_circles_college_id ON circles (college_id);
CREATE INDEX IF NOT EXISTS idx_circles_created_by ON circles (created_by);

-- 2. Circle Members Table
CREATE TABLE IF NOT EXISTS circle_members (
  id         UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  circle_id  UUID        NOT NULL REFERENCES circles(id) ON DELETE CASCADE,
  user_id    UUID        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role       VARCHAR(20) NOT NULL DEFAULT 'member', -- 'owner', 'admin', 'moderator', 'member'
  joined_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT  unique_circle_member UNIQUE (circle_id, user_id)
);

-- Indexes for circle_members
CREATE INDEX IF NOT EXISTS idx_circle_members_circle ON circle_members (circle_id);
CREATE INDEX IF NOT EXISTS idx_circle_members_user   ON circle_members (user_id);

-- 3. Component Templates Catalog Table (10 Features)
CREATE TABLE IF NOT EXISTS component_templates (
  key           VARCHAR(50) PRIMARY KEY,
  name          VARCHAR(100) NOT NULL,
  description   TEXT,
  icon          VARCHAR(50),
  is_default    BOOLEAN     NOT NULL DEFAULT FALSE,
  display_order INT         NOT NULL DEFAULT 0,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Seed 10 default component templates
INSERT INTO component_templates (key, name, description, icon, is_default, display_order)
VALUES
  ('anonymous',      'Anonymous Confessions',      'Share thoughts and confessions anonymously',          'lock_outline',  TRUE,  1),
  ('events',         'Events & Meetups',           'Host and discover campus & community events',          'event',         TRUE,  2),
  ('groups',         'Interest Groups & Clubs',    'Join sub-clubs, interest circles & squads',          'groups',        TRUE,  3),
  ('matching',       'Buddy Match & Networking',    'Find study buddies, networking & speed matches',     'people',        TRUE,  4),
  ('marketplace',    'Buy & Sell Marketplace',     'Trade books, electronics, and gear within community', 'storefront',    FALSE, 5),
  ('study_buddies',  'Study Groups & Notes',       'Form study sessions and share course materials',      'school',        FALSE, 6),
  ('announcements', 'Official News & Broadcasts',  'Important announcements and official updates',        'campaign',      FALSE, 7),
  ('discussions',    'Forums & Debates',           'Start open topics, polls and debates',                'forum',         FALSE, 8),
  ('resources',      'Shared Resource Library',    'Access notes, cheat sheets and drive links',          'folder_shared', FALSE, 9),
  ('lost_and_found', 'Lost & Found Board',         'Report and reclaim lost items',                       'find_in_page',  FALSE, 10)
ON CONFLICT (key) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  icon = EXCLUDED.icon,
  is_default = EXCLUDED.is_default,
  display_order = EXCLUDED.display_order;

-- 4. Community Components Table (Circle Toggles & Custom Names)
CREATE TABLE IF NOT EXISTS community_components (
  id            UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  circle_id     UUID        NOT NULL REFERENCES circles(id) ON DELETE CASCADE,
  component_key VARCHAR(50) NOT NULL REFERENCES component_templates(key) ON DELETE CASCADE,
  is_enabled    BOOLEAN     NOT NULL DEFAULT TRUE,
  custom_name   VARCHAR(100),
  settings      JSONB,
  display_order INT         NOT NULL DEFAULT 0,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT    unique_circle_component UNIQUE (circle_id, component_key)
);

-- Index for community_components
CREATE INDEX IF NOT EXISTS idx_community_components_circle ON community_components (circle_id, is_enabled);
