-- ============================================================
-- Migration 005 — Follows (Social Graph)
-- ============================================================

CREATE TABLE IF NOT EXISTS follows (
  id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  follower_id  UUID        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  following_id UUID        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  is_accepted  BOOLEAN     NOT NULL DEFAULT TRUE,   -- FALSE = pending (for private accounts)
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- A user cannot follow the same person twice
  CONSTRAINT uq_follows UNIQUE (follower_id, following_id),
  -- A user cannot follow themselves
  CONSTRAINT chk_follows_no_self_follow CHECK (follower_id != following_id)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_follows_follower_id  ON follows (follower_id);
CREATE INDEX IF NOT EXISTS idx_follows_following_id ON follows (following_id);
CREATE INDEX IF NOT EXISTS idx_follows_is_accepted  ON follows (is_accepted);
CREATE INDEX IF NOT EXISTS idx_follows_created_at   ON follows (created_at DESC);

COMMENT ON TABLE follows IS 'Social graph — tracks who follows whom. Supports pending state for private accounts.';
