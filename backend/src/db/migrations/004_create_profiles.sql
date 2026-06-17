-- ============================================================
-- Migration 004 — Profiles (Public User Display Data)
-- ============================================================

CREATE TYPE gender_type AS ENUM ('male', 'female', 'non_binary', 'prefer_not_to_say');

CREATE TABLE IF NOT EXISTS profiles (
  id              UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID         NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  college_id      UUID         REFERENCES colleges(id) ON DELETE SET NULL,
  username        VARCHAR(50)  NOT NULL UNIQUE,
  display_name    VARCHAR(100) NOT NULL,
  bio             TEXT,
  avatar_url      VARCHAR(500),
  cover_url       VARCHAR(500),
  gender          gender_type,
  date_of_birth   DATE,
  graduation_year SMALLINT,
  degree          VARCHAR(100),
  department      VARCHAR(150),
  website_url     VARCHAR(255),
  instagram_url   VARCHAR(255),
  linkedin_url    VARCHAR(255),
  is_private      BOOLEAN      NOT NULL DEFAULT FALSE,
  is_verified     BOOLEAN      NOT NULL DEFAULT FALSE,  -- College verified badge
  followers_count INT          NOT NULL DEFAULT 0,
  following_count INT          NOT NULL DEFAULT 0,
  posts_count     INT          NOT NULL DEFAULT 0,
  created_at      TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_profiles_user_id        ON profiles (user_id);
CREATE INDEX IF NOT EXISTS idx_profiles_college_id     ON profiles (college_id);
CREATE INDEX IF NOT EXISTS idx_profiles_username       ON profiles (username);
CREATE INDEX IF NOT EXISTS idx_profiles_is_private     ON profiles (is_private);
CREATE INDEX IF NOT EXISTS idx_profiles_is_verified    ON profiles (is_verified);
CREATE INDEX IF NOT EXISTS idx_profiles_followers      ON profiles (followers_count DESC);

-- Ensure graduation year is reasonable
ALTER TABLE profiles ADD CONSTRAINT chk_profiles_graduation_year
  CHECK (graduation_year IS NULL OR (graduation_year >= 1950 AND graduation_year <= 2050));

COMMENT ON TABLE profiles IS 'Public-facing profile data for each user. 1:1 with users table.';
COMMENT ON COLUMN profiles.is_verified IS 'True if the user has verified their college affiliation.';
