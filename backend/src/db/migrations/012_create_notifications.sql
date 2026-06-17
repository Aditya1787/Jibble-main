-- ============================================================
-- Migration 012 — Notifications
-- ============================================================

CREATE TYPE notification_type AS ENUM (
  'like_post',
  'like_comment',
  'comment_post',
  'reply_comment',
  'follow_request',
  'follow_accepted',
  'new_follower',
  'mention_post',
  'mention_comment',
  'post_share',
  'story_reaction',
  'story_reply',
  'event_invite',
  'event_reminder',
  'system'
);

CREATE TABLE IF NOT EXISTS notifications (
  id           UUID              PRIMARY KEY DEFAULT gen_random_uuid(),
  recipient_id UUID              NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  actor_id     UUID              REFERENCES users(id) ON DELETE CASCADE,   -- Who triggered it (NULL for system)
  type         notification_type NOT NULL,
  -- Polymorphic reference to the entity
  entity_type  VARCHAR(50),                                                -- 'post', 'comment', 'story', 'event', etc.
  entity_id    UUID,                                                       -- ID of the related entity
  title        VARCHAR(255),                                               -- Push notification title
  body         TEXT,                                                       -- Push notification body
  deep_link    VARCHAR(500),                                               -- In-app deep link URL
  is_read      BOOLEAN           NOT NULL DEFAULT FALSE,
  is_pushed    BOOLEAN           NOT NULL DEFAULT FALSE,                   -- FCM/APNS push sent
  metadata     JSONB,                                                      -- Extra data (e.g. preview snippet)
  created_at   TIMESTAMPTZ       NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_notifications_recipient    ON notifications (recipient_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notifications_unread       ON notifications (recipient_id, is_read)
  WHERE is_read = FALSE;
CREATE INDEX IF NOT EXISTS idx_notifications_actor        ON notifications (actor_id);
CREATE INDEX IF NOT EXISTS idx_notifications_type         ON notifications (type);
CREATE INDEX IF NOT EXISTS idx_notifications_entity       ON notifications (entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at   ON notifications (created_at DESC);

COMMENT ON TABLE notifications IS 'Fan-out notification table. Supports 15 notification types with push delivery tracking.';
COMMENT ON COLUMN notifications.actor_id    IS 'User who triggered the notification. NULL for system-generated.';
COMMENT ON COLUMN notifications.entity_type IS 'Type of entity this notification is about (post, comment, story, event).';
COMMENT ON COLUMN notifications.deep_link   IS 'In-app navigation URL for mobile deep linking.';
