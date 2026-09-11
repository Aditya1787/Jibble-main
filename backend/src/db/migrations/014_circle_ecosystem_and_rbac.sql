-- ============================================================
-- Migration 014 — Circle Ecosystem, RBAC & Content Permissions
-- ============================================================

-- 1. Extend users table for 3 account modes & role switching
ALTER TABLE users 
  ADD COLUMN IF NOT EXISTS account_type VARCHAR(30) NOT NULL DEFAULT 'USER', -- 'USER', 'CREATOR', 'CIRCLE_COMMUNITY'
  ADD COLUMN IF NOT EXISTS roles TEXT[] NOT NULL DEFAULT ARRAY['USER']::TEXT[],
  ADD COLUMN IF NOT EXISTS active_circle_id UUID REFERENCES circles(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_users_account_type ON users (account_type);

-- 2. Creator Profiles Table
CREATE TABLE IF NOT EXISTS creator_profiles (
  user_id       UUID        PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  bio           TEXT,
  category      VARCHAR(100),
  website_url   VARCHAR(500),
  is_verified   BOOLEAN     NOT NULL DEFAULT FALSE,
  total_reach   BIGINT      NOT NULL DEFAULT 0,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Extend posts table for Circle destinations & privacy controls
ALTER TABLE posts
  ADD COLUMN IF NOT EXISTS circle_id UUID REFERENCES circles(id) ON DELETE CASCADE,
  ADD COLUMN IF NOT EXISTS target_destination VARCHAR(30) NOT NULL DEFAULT 'global_feed', -- 'global_feed', 'reels_section', 'circle_only'
  ADD COLUMN IF NOT EXISTS hide_likes_and_views BOOLEAN NOT NULL DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS hide_comments BOOLEAN NOT NULL DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS is_anonymous BOOLEAN NOT NULL DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS anonymous_alias VARCHAR(100);

CREATE INDEX IF NOT EXISTS idx_posts_circle_id ON posts (circle_id);
CREATE INDEX IF NOT EXISTS idx_posts_target_destination ON posts (target_destination);

-- 4. Extend events table for Circle integration and redirect join link
ALTER TABLE events
  ADD COLUMN IF NOT EXISTS circle_id UUID REFERENCES circles(id) ON DELETE CASCADE,
  ADD COLUMN IF NOT EXISTS join_link VARCHAR(500);

CREATE INDEX IF NOT EXISTS idx_events_circle_id ON events (circle_id);

-- 5. Circle Sub-Groups Table
CREATE TABLE IF NOT EXISTS circle_groups (
  id          UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
  circle_id   UUID         NOT NULL REFERENCES circles(id) ON DELETE CASCADE,
  created_by  UUID         NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name        VARCHAR(100) NOT NULL,
  description TEXT,
  icon_name   VARCHAR(50)  DEFAULT 'group',
  is_private  BOOLEAN      NOT NULL DEFAULT FALSE,
  members_count INT        NOT NULL DEFAULT 1,
  created_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_circle_groups_circle_id ON circle_groups (circle_id);

-- 6. Circle Group Members
CREATE TABLE IF NOT EXISTS circle_group_members (
  id        UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id  UUID        NOT NULL REFERENCES circle_groups(id) ON DELETE CASCADE,
  user_id   UUID        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role      VARCHAR(20) NOT NULL DEFAULT 'member', -- 'admin', 'member'
  joined_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT uq_circle_group_member UNIQUE (group_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_circle_group_members_group ON circle_group_members (group_id);
CREATE INDEX IF NOT EXISTS idx_circle_group_members_user  ON circle_group_members (user_id);

-- 7. Circle Group Messages (Group Chat)
CREATE TABLE IF NOT EXISTS circle_group_messages (
  id         UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id   UUID        NOT NULL REFERENCES circle_groups(id) ON DELETE CASCADE,
  sender_id  UUID        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  content    TEXT        NOT NULL,
  media_url  VARCHAR(500),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_circle_group_messages_group ON circle_group_messages (group_id, created_at DESC);

-- 8. Post View Tracking Table
CREATE TABLE IF NOT EXISTS post_views (
  id         UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id    UUID        NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  viewer_id  UUID        REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT uq_post_viewer UNIQUE (post_id, viewer_id)
);

CREATE INDEX IF NOT EXISTS idx_post_views_post ON post_views (post_id);
