-- ============================================================
-- Migration 007 — Stories (Ephemeral Content)
-- ============================================================

CREATE TYPE story_type AS ENUM ('image', 'video', 'text', 'boomerang');

CREATE TABLE IF NOT EXISTS stories (
  id            UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type          story_type  NOT NULL DEFAULT 'image',
  media_url     VARCHAR(500),
  thumbnail_url VARCHAR(500),
  text_content  TEXT,                                   -- For text stories
  text_style    JSONB,                                  -- { font, color, bg_color, position }
  stickers      JSONB,                                  -- Array of sticker objects
  music         JSONB,                                  -- { track_id, title, artist, start_time }
  duration      SMALLINT    NOT NULL DEFAULT 5,        -- seconds (5–30)
  views_count   INT         NOT NULL DEFAULT 0,
  is_highlight  BOOLEAN     NOT NULL DEFAULT FALSE,
  highlight_id  UUID,                                   -- Future: story highlight albums
  expires_at    TIMESTAMPTZ NOT NULL DEFAULT (NOW() + INTERVAL '24 hours'),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_stories_user_id       ON stories (user_id);
CREATE INDEX IF NOT EXISTS idx_stories_expires_at    ON stories (expires_at);
CREATE INDEX IF NOT EXISTS idx_stories_is_highlight  ON stories (is_highlight);
CREATE INDEX IF NOT EXISTS idx_stories_created_at    ON stories (created_at DESC);
-- Partial index: only active (non-expired) stories
CREATE INDEX IF NOT EXISTS idx_stories_active        ON stories (user_id, created_at DESC)
  WHERE expires_at > NOW();

COMMENT ON TABLE stories IS '24-hour ephemeral stories. Expires after 24 hours by default. Supports highlights.';
COMMENT ON COLUMN stories.text_style IS 'JSON styling config for text-only stories (font, colors, positioning).';
COMMENT ON COLUMN stories.stickers   IS 'Array of sticker objects with type, position, and metadata.';
