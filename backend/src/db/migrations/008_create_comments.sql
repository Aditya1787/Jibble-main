-- ============================================================
-- Migration 008 — Comments
-- ============================================================

CREATE TABLE IF NOT EXISTS comments (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id     UUID        NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  user_id     UUID        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  parent_id   UUID        REFERENCES comments(id) ON DELETE CASCADE,  -- NULL = top-level
  content     TEXT        NOT NULL,
  media_url   VARCHAR(500),                           -- Optional image in comment
  mentions    UUID[],                                 -- Array of mentioned user IDs
  likes_count INT         NOT NULL DEFAULT 0,
  replies_count INT       NOT NULL DEFAULT 0,
  is_pinned   BOOLEAN     NOT NULL DEFAULT FALSE,     -- Pinned by post author
  is_deleted  BOOLEAN     NOT NULL DEFAULT FALSE,     -- Soft delete
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- Content required unless soft-deleted
  CONSTRAINT chk_comments_content CHECK (is_deleted = TRUE OR length(trim(content)) > 0)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_comments_post_id    ON comments (post_id);
CREATE INDEX IF NOT EXISTS idx_comments_user_id    ON comments (user_id);
CREATE INDEX IF NOT EXISTS idx_comments_parent_id  ON comments (parent_id);
CREATE INDEX IF NOT EXISTS idx_comments_created_at ON comments (post_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_comments_mentions   ON comments USING GIN (mentions);
-- Partial index: only active (non-deleted) comments
CREATE INDEX IF NOT EXISTS idx_comments_active     ON comments (post_id, created_at DESC)
  WHERE is_deleted = FALSE;

COMMENT ON TABLE comments IS 'Threaded comments on posts. Supports replies via self-referential parent_id.';
COMMENT ON COLUMN comments.parent_id IS 'NULL for top-level comments; points to parent comment for replies.';
