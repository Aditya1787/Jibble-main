-- ============================================================
-- Migration 009 — Likes (Polymorphic)
-- ============================================================

CREATE TYPE reaction_type AS ENUM ('like', 'love', 'haha', 'wow', 'sad', 'angry');
CREATE TYPE likeable_type AS ENUM ('post', 'comment', 'story');

CREATE TABLE IF NOT EXISTS likes (
  id            UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID          NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  likeable_type likeable_type NOT NULL,
  likeable_id   UUID          NOT NULL,              -- ID of post, comment, or story
  reaction      reaction_type NOT NULL DEFAULT 'like',
  created_at    TIMESTAMPTZ   NOT NULL DEFAULT NOW(),

  -- A user can only react once per target
  CONSTRAINT uq_likes UNIQUE (user_id, likeable_type, likeable_id)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_likes_user_id      ON likes (user_id);
CREATE INDEX IF NOT EXISTS idx_likes_target       ON likes (likeable_type, likeable_id);
CREATE INDEX IF NOT EXISTS idx_likes_created_at   ON likes (likeable_type, likeable_id, created_at DESC);

COMMENT ON TABLE likes IS 'Polymorphic reactions table supporting posts, comments, and stories.';
COMMENT ON COLUMN likes.likeable_type IS 'The entity type being liked: post, comment, or story.';
COMMENT ON COLUMN likes.likeable_id   IS 'UUID of the liked entity (post_id, comment_id, or story_id).';
