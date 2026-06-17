-- ============================================================
-- Migration 010 — Messages (Direct Messaging)
-- ============================================================

CREATE TYPE message_type   AS ENUM ('text', 'image', 'video', 'audio', 'file', 'post_share', 'story_reply', 'location');
CREATE TYPE message_status AS ENUM ('sent', 'delivered', 'read', 'failed');

CREATE TABLE IF NOT EXISTS messages (
  id            UUID           PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id     UUID           NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  recipient_id  UUID           NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type          message_type   NOT NULL DEFAULT 'text',
  content       TEXT,                                    -- Text body (nullable for media-only)
  media_url     VARCHAR(500),
  media_mime    VARCHAR(100),                            -- MIME type for files
  file_size     BIGINT,                                  -- bytes
  shared_post_id UUID          REFERENCES posts(id) ON DELETE SET NULL,
  reply_to_id   UUID           REFERENCES messages(id) ON DELETE SET NULL,
  status        message_status NOT NULL DEFAULT 'sent',
  is_deleted_by_sender    BOOLEAN NOT NULL DEFAULT FALSE,
  is_deleted_by_recipient BOOLEAN NOT NULL DEFAULT FALSE,
  delivered_at  TIMESTAMPTZ,
  read_at       TIMESTAMPTZ,
  created_at    TIMESTAMPTZ    NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ    NOT NULL DEFAULT NOW(),

  -- Prevent self-messaging
  CONSTRAINT chk_messages_no_self_message CHECK (sender_id != recipient_id),
  -- Content required for text messages
  CONSTRAINT chk_messages_content CHECK (type != 'text' OR length(trim(content)) > 0)
);

-- Indexes — optimized for conversation queries
CREATE INDEX IF NOT EXISTS idx_messages_sender_id    ON messages (sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_recipient_id ON messages (recipient_id);
CREATE INDEX IF NOT EXISTS idx_messages_conversation ON messages (
  LEAST(sender_id, recipient_id),
  GREATEST(sender_id, recipient_id),
  created_at DESC
);
CREATE INDEX IF NOT EXISTS idx_messages_status       ON messages (status);
CREATE INDEX IF NOT EXISTS idx_messages_created_at   ON messages (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_messages_reply_to     ON messages (reply_to_id);

COMMENT ON TABLE messages IS 'Direct messages between users. Supports media, post shares, story replies, and threading.';
COMMENT ON COLUMN messages.shared_post_id  IS 'Reference to a post shared via DM.';
COMMENT ON COLUMN messages.reply_to_id     IS 'Message being replied to (quoted reply thread).';
