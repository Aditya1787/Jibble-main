-- ============================================================================
--  Jibble — Full PostgreSQL Database Schema (DDL)
--  This file is the canonical reference. Individual migration files in
--  backend/src/db/migrations/ apply these changes incrementally.
--  DO NOT run this file directly on a production database;
--  use the migration runner instead (npm run db:migrate:raw).
-- ============================================================================

-- ─────────────────────────────────────────────────────────────────────────────
-- 0. Extensions & Migration Tracking
-- ─────────────────────────────────────────────────────────────────────────────
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS schema_migrations (
  id          SERIAL       PRIMARY KEY,
  filename    VARCHAR(255) NOT NULL UNIQUE,
  executed_at TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- ─────────────────────────────────────────────────────────────────────────────
-- 1. Colleges (Lookup Table)
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS colleges (
  id         UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
  name       VARCHAR(255) NOT NULL UNIQUE,
  short_name VARCHAR(50),
  city       VARCHAR(100),
  state      VARCHAR(100),
  country    VARCHAR(100) NOT NULL DEFAULT 'India',
  website    VARCHAR(255),
  logo_url   VARCHAR(500),
  is_active  BOOLEAN      NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_colleges_name   ON colleges (name);
CREATE INDEX IF NOT EXISTS idx_colleges_city   ON colleges (city);
CREATE INDEX IF NOT EXISTS idx_colleges_state  ON colleges (state);
CREATE INDEX IF NOT EXISTS idx_colleges_active ON colleges (is_active);

-- ─────────────────────────────────────────────────────────────────────────────
-- 2. Users (Authentication Identity)
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TYPE user_status   AS ENUM ('active', 'inactive', 'banned', 'pending_verification');
CREATE TYPE auth_provider AS ENUM ('local', 'google', 'apple');

CREATE TABLE IF NOT EXISTS users (
  id             UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
  email          VARCHAR(255)  UNIQUE,
  phone          VARCHAR(20)   UNIQUE,
  password_hash  VARCHAR(255),
  provider       auth_provider NOT NULL DEFAULT 'local',
  provider_id    VARCHAR(255),
  status         user_status   NOT NULL DEFAULT 'pending_verification',
  email_verified BOOLEAN       NOT NULL DEFAULT FALSE,
  phone_verified BOOLEAN       NOT NULL DEFAULT FALSE,
  last_login_at  TIMESTAMPTZ,
  refresh_token  VARCHAR(512),
  created_at     TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  updated_at     TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  CONSTRAINT chk_users_identifier CHECK (email IS NOT NULL OR phone IS NOT NULL)
);

CREATE INDEX IF NOT EXISTS idx_users_email      ON users (email);
CREATE INDEX IF NOT EXISTS idx_users_phone      ON users (phone);
CREATE INDEX IF NOT EXISTS idx_users_status     ON users (status);
CREATE INDEX IF NOT EXISTS idx_users_provider   ON users (provider, provider_id);
CREATE INDEX IF NOT EXISTS idx_users_created_at ON users (created_at DESC);

-- ─────────────────────────────────────────────────────────────────────────────
-- 3. Profiles (Public Display Data)
-- ─────────────────────────────────────────────────────────────────────────────
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
  is_verified     BOOLEAN      NOT NULL DEFAULT FALSE,
  followers_count INT          NOT NULL DEFAULT 0,
  following_count INT          NOT NULL DEFAULT 0,
  posts_count     INT          NOT NULL DEFAULT 0,
  created_at      TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  CONSTRAINT chk_profiles_graduation_year
    CHECK (graduation_year IS NULL OR (graduation_year >= 1950 AND graduation_year <= 2050))
);

CREATE INDEX IF NOT EXISTS idx_profiles_user_id     ON profiles (user_id);
CREATE INDEX IF NOT EXISTS idx_profiles_college_id  ON profiles (college_id);
CREATE INDEX IF NOT EXISTS idx_profiles_username    ON profiles (username);
CREATE INDEX IF NOT EXISTS idx_profiles_followers   ON profiles (followers_count DESC);

-- ─────────────────────────────────────────────────────────────────────────────
-- 4. Follows (Social Graph)
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS follows (
  id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  follower_id  UUID        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  following_id UUID        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  is_accepted  BOOLEAN     NOT NULL DEFAULT TRUE,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT uq_follows UNIQUE (follower_id, following_id),
  CONSTRAINT chk_follows_no_self_follow CHECK (follower_id != following_id)
);

CREATE INDEX IF NOT EXISTS idx_follows_follower_id  ON follows (follower_id);
CREATE INDEX IF NOT EXISTS idx_follows_following_id ON follows (following_id);
CREATE INDEX IF NOT EXISTS idx_follows_is_accepted  ON follows (is_accepted);

-- ─────────────────────────────────────────────────────────────────────────────
-- 5. Posts
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TYPE post_type       AS ENUM ('text', 'image', 'video', 'carousel', 'link', 'poll');
CREATE TYPE visibility_type AS ENUM ('public', 'followers', 'college_only', 'private');

CREATE TABLE IF NOT EXISTS posts (
  id             UUID            PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id        UUID            NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  college_id     UUID            REFERENCES colleges(id) ON DELETE SET NULL,
  type           post_type       NOT NULL DEFAULT 'text',
  visibility     visibility_type NOT NULL DEFAULT 'public',
  caption        TEXT,
  media_urls     TEXT[],
  thumbnail_url  VARCHAR(500),
  link_url       VARCHAR(500),
  link_preview   JSONB,
  poll_options   JSONB,
  poll_ends_at   TIMESTAMPTZ,
  location       VARCHAR(255),
  hashtags       TEXT[],
  mentions       UUID[],
  is_pinned      BOOLEAN         NOT NULL DEFAULT FALSE,
  is_archived    BOOLEAN         NOT NULL DEFAULT FALSE,
  likes_count    INT             NOT NULL DEFAULT 0,
  comments_count INT             NOT NULL DEFAULT 0,
  shares_count   INT             NOT NULL DEFAULT 0,
  views_count    BIGINT          NOT NULL DEFAULT 0,
  created_at     TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
  updated_at     TIMESTAMPTZ     NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_posts_user_id     ON posts (user_id);
CREATE INDEX IF NOT EXISTS idx_posts_college_id  ON posts (college_id);
CREATE INDEX IF NOT EXISTS idx_posts_visibility  ON posts (visibility);
CREATE INDEX IF NOT EXISTS idx_posts_created_at  ON posts (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_posts_likes_count ON posts (likes_count DESC);
CREATE INDEX IF NOT EXISTS idx_posts_hashtags    ON posts USING GIN (hashtags);
CREATE INDEX IF NOT EXISTS idx_posts_mentions    ON posts USING GIN (mentions);
CREATE INDEX IF NOT EXISTS idx_posts_is_archived ON posts (is_archived) WHERE is_archived = FALSE;

-- ─────────────────────────────────────────────────────────────────────────────
-- 6. Stories (Ephemeral 24-hour Content)
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TYPE story_type AS ENUM ('image', 'video', 'text', 'boomerang');

CREATE TABLE IF NOT EXISTS stories (
  id            UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type          story_type  NOT NULL DEFAULT 'image',
  media_url     VARCHAR(500),
  thumbnail_url VARCHAR(500),
  text_content  TEXT,
  text_style    JSONB,
  stickers      JSONB,
  music         JSONB,
  duration      SMALLINT    NOT NULL DEFAULT 5,
  views_count   INT         NOT NULL DEFAULT 0,
  is_highlight  BOOLEAN     NOT NULL DEFAULT FALSE,
  highlight_id  UUID,
  expires_at    TIMESTAMPTZ NOT NULL DEFAULT (NOW() + INTERVAL '24 hours'),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_stories_user_id    ON stories (user_id);
CREATE INDEX IF NOT EXISTS idx_stories_expires_at ON stories (expires_at);
CREATE INDEX IF NOT EXISTS idx_stories_active     ON stories (user_id, created_at DESC)
  WHERE expires_at > NOW();

-- ─────────────────────────────────────────────────────────────────────────────
-- 7. Comments (Threaded)
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS comments (
  id            UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id       UUID        NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  user_id       UUID        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  parent_id     UUID        REFERENCES comments(id) ON DELETE CASCADE,
  content       TEXT        NOT NULL,
  media_url     VARCHAR(500),
  mentions      UUID[],
  likes_count   INT         NOT NULL DEFAULT 0,
  replies_count INT         NOT NULL DEFAULT 0,
  is_pinned     BOOLEAN     NOT NULL DEFAULT FALSE,
  is_deleted    BOOLEAN     NOT NULL DEFAULT FALSE,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT chk_comments_content CHECK (is_deleted = TRUE OR length(trim(content)) > 0)
);

CREATE INDEX IF NOT EXISTS idx_comments_post_id   ON comments (post_id);
CREATE INDEX IF NOT EXISTS idx_comments_user_id   ON comments (user_id);
CREATE INDEX IF NOT EXISTS idx_comments_parent_id ON comments (parent_id);
CREATE INDEX IF NOT EXISTS idx_comments_active    ON comments (post_id, created_at DESC)
  WHERE is_deleted = FALSE;

-- ─────────────────────────────────────────────────────────────────────────────
-- 8. Likes (Polymorphic Reactions)
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TYPE reaction_type AS ENUM ('like', 'love', 'haha', 'wow', 'sad', 'angry');
CREATE TYPE likeable_type AS ENUM ('post', 'comment', 'story');

CREATE TABLE IF NOT EXISTS likes (
  id            UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID          NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  likeable_type likeable_type NOT NULL,
  likeable_id   UUID          NOT NULL,
  reaction      reaction_type NOT NULL DEFAULT 'like',
  created_at    TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  CONSTRAINT uq_likes UNIQUE (user_id, likeable_type, likeable_id)
);

CREATE INDEX IF NOT EXISTS idx_likes_user_id  ON likes (user_id);
CREATE INDEX IF NOT EXISTS idx_likes_target   ON likes (likeable_type, likeable_id);

-- ─────────────────────────────────────────────────────────────────────────────
-- 9. Messages (Direct Messaging)
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TYPE message_type   AS ENUM ('text', 'image', 'video', 'audio', 'file', 'post_share', 'story_reply', 'location');
CREATE TYPE message_status AS ENUM ('sent', 'delivered', 'read', 'failed');

CREATE TABLE IF NOT EXISTS messages (
  id                      UUID           PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id               UUID           NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  recipient_id            UUID           NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type                    message_type   NOT NULL DEFAULT 'text',
  content                 TEXT,
  media_url               VARCHAR(500),
  media_mime              VARCHAR(100),
  file_size               BIGINT,
  shared_post_id          UUID           REFERENCES posts(id) ON DELETE SET NULL,
  reply_to_id             UUID           REFERENCES messages(id) ON DELETE SET NULL,
  status                  message_status NOT NULL DEFAULT 'sent',
  is_deleted_by_sender    BOOLEAN        NOT NULL DEFAULT FALSE,
  is_deleted_by_recipient BOOLEAN        NOT NULL DEFAULT FALSE,
  delivered_at            TIMESTAMPTZ,
  read_at                 TIMESTAMPTZ,
  created_at              TIMESTAMPTZ    NOT NULL DEFAULT NOW(),
  updated_at              TIMESTAMPTZ    NOT NULL DEFAULT NOW(),
  CONSTRAINT chk_messages_no_self_message CHECK (sender_id != recipient_id),
  CONSTRAINT chk_messages_content CHECK (type != 'text' OR length(trim(content)) > 0)
);

CREATE INDEX IF NOT EXISTS idx_messages_sender_id    ON messages (sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_recipient_id ON messages (recipient_id);
CREATE INDEX IF NOT EXISTS idx_messages_conversation ON messages (
  LEAST(sender_id, recipient_id),
  GREATEST(sender_id, recipient_id),
  created_at DESC
);
CREATE INDEX IF NOT EXISTS idx_messages_status ON messages (status);

-- ─────────────────────────────────────────────────────────────────────────────
-- 10. Events & RSVPs
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TYPE event_status     AS ENUM ('draft', 'published', 'cancelled', 'completed');
CREATE TYPE event_visibility AS ENUM ('public', 'college_only', 'invite_only');

CREATE TABLE IF NOT EXISTS events (
  id              UUID             PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id      UUID             NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  college_id      UUID             REFERENCES colleges(id) ON DELETE SET NULL,
  title           VARCHAR(255)     NOT NULL,
  description     TEXT,
  cover_url       VARCHAR(500),
  status          event_status     NOT NULL DEFAULT 'draft',
  visibility      event_visibility NOT NULL DEFAULT 'college_only',
  location_name   VARCHAR(255),
  online_link     VARCHAR(500),
  is_online       BOOLEAN          NOT NULL DEFAULT FALSE,
  starts_at       TIMESTAMPTZ      NOT NULL,
  ends_at         TIMESTAMPTZ      NOT NULL,
  max_attendees   INT,
  attendees_count INT              NOT NULL DEFAULT 0,
  tags            TEXT[],
  metadata        JSONB,
  created_at      TIMESTAMPTZ      NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ      NOT NULL DEFAULT NOW(),
  CONSTRAINT chk_events_dates CHECK (ends_at > starts_at),
  CONSTRAINT chk_events_max_attendees CHECK (max_attendees IS NULL OR max_attendees > 0)
);

CREATE TYPE rsvp_status AS ENUM ('going', 'maybe', 'not_going');

CREATE TABLE IF NOT EXISTS event_rsvps (
  id         UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id   UUID        NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  user_id    UUID        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  status     rsvp_status NOT NULL DEFAULT 'going',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT uq_event_rsvps UNIQUE (event_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_events_creator_id ON events (creator_id);
CREATE INDEX IF NOT EXISTS idx_events_college_id ON events (college_id);
CREATE INDEX IF NOT EXISTS idx_events_status     ON events (status);
CREATE INDEX IF NOT EXISTS idx_events_starts_at  ON events (starts_at);
CREATE INDEX IF NOT EXISTS idx_events_tags       ON events USING GIN (tags);

CREATE INDEX IF NOT EXISTS idx_event_rsvps_event  ON event_rsvps (event_id);
CREATE INDEX IF NOT EXISTS idx_event_rsvps_user   ON event_rsvps (user_id);

-- ─────────────────────────────────────────────────────────────────────────────
-- 11. Notifications
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TYPE notification_type AS ENUM (
  'like_post', 'like_comment', 'comment_post', 'reply_comment',
  'follow_request', 'follow_accepted', 'new_follower',
  'mention_post', 'mention_comment', 'post_share',
  'story_reaction', 'story_reply',
  'event_invite', 'event_reminder', 'system'
);

CREATE TABLE IF NOT EXISTS notifications (
  id           UUID              PRIMARY KEY DEFAULT gen_random_uuid(),
  recipient_id UUID              NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  actor_id     UUID              REFERENCES users(id) ON DELETE CASCADE,
  type         notification_type NOT NULL,
  entity_type  VARCHAR(50),
  entity_id    UUID,
  title        VARCHAR(255),
  body         TEXT,
  deep_link    VARCHAR(500),
  is_read      BOOLEAN           NOT NULL DEFAULT FALSE,
  is_pushed    BOOLEAN           NOT NULL DEFAULT FALSE,
  metadata     JSONB,
  created_at   TIMESTAMPTZ       NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_notifications_recipient ON notifications (recipient_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notifications_unread    ON notifications (recipient_id, is_read)
  WHERE is_read = FALSE;
CREATE INDEX IF NOT EXISTS idx_notifications_entity   ON notifications (entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_notifications_type     ON notifications (type);

-- ============================================================================
-- End of Jibble Schema DDL
-- ============================================================================
