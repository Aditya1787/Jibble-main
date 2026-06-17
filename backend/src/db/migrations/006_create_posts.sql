-- ============================================================
-- Migration 006 — Posts
-- ============================================================

CREATE TYPE post_type       AS ENUM ('text', 'image', 'video', 'carousel', 'link', 'poll');
CREATE TYPE visibility_type AS ENUM ('public', 'followers', 'college_only', 'private');

CREATE TABLE IF NOT EXISTS posts (
  id             UUID            PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id        UUID            NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  college_id     UUID            REFERENCES colleges(id) ON DELETE SET NULL,  -- college tag
  type           post_type       NOT NULL DEFAULT 'text',
  visibility     visibility_type NOT NULL DEFAULT 'public',
  caption        TEXT,
  media_urls     TEXT[],                                 -- Array of S3/CloudFront URLs
  thumbnail_url  VARCHAR(500),
  link_url       VARCHAR(500),                           -- For link posts
  link_preview   JSONB,                                  -- { title, description, image }
  poll_options   JSONB,                                  -- [{ id, text, votes }]
  poll_ends_at   TIMESTAMPTZ,
  location       VARCHAR(255),
  hashtags       TEXT[],
  mentions       UUID[],                                 -- Array of mentioned user IDs
  is_pinned      BOOLEAN         NOT NULL DEFAULT FALSE,
  is_archived    BOOLEAN         NOT NULL DEFAULT FALSE,
  likes_count    INT             NOT NULL DEFAULT 0,
  comments_count INT             NOT NULL DEFAULT 0,
  shares_count   INT             NOT NULL DEFAULT 0,
  views_count    BIGINT          NOT NULL DEFAULT 0,
  created_at     TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
  updated_at     TIMESTAMPTZ     NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_posts_user_id       ON posts (user_id);
CREATE INDEX IF NOT EXISTS idx_posts_college_id    ON posts (college_id);
CREATE INDEX IF NOT EXISTS idx_posts_type          ON posts (type);
CREATE INDEX IF NOT EXISTS idx_posts_visibility    ON posts (visibility);
CREATE INDEX IF NOT EXISTS idx_posts_created_at    ON posts (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_posts_likes_count   ON posts (likes_count DESC);
CREATE INDEX IF NOT EXISTS idx_posts_hashtags      ON posts USING GIN (hashtags);
CREATE INDEX IF NOT EXISTS idx_posts_mentions      ON posts USING GIN (mentions);
CREATE INDEX IF NOT EXISTS idx_posts_is_archived   ON posts (is_archived) WHERE is_archived = FALSE;

COMMENT ON TABLE posts IS 'Core content table — supports text, image, video, carousel, link, and poll post types.';
COMMENT ON COLUMN posts.media_urls   IS 'Array of S3/CloudFront media URLs. Ordered for carousels.';
COMMENT ON COLUMN posts.poll_options IS 'JSON array of poll options with id, text, and vote count.';
