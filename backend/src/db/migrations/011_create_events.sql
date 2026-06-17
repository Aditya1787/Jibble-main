-- ============================================================
-- Migration 011 — Events (College Events)
-- ============================================================

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
  location_coords POINT,                                -- PostGIS-compatible lat/lng
  online_link     VARCHAR(500),                         -- Zoom/Meet/Teams URL
  is_online       BOOLEAN          NOT NULL DEFAULT FALSE,
  starts_at       TIMESTAMPTZ      NOT NULL,
  ends_at         TIMESTAMPTZ      NOT NULL,
  max_attendees   INT,                                  -- NULL = unlimited
  attendees_count INT              NOT NULL DEFAULT 0,
  tags            TEXT[],
  metadata        JSONB,                                -- Flexible additional data
  created_at      TIMESTAMPTZ      NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ      NOT NULL DEFAULT NOW(),

  -- End must be after start
  CONSTRAINT chk_events_dates CHECK (ends_at > starts_at),
  -- Max attendees must be positive
  CONSTRAINT chk_events_max_attendees CHECK (max_attendees IS NULL OR max_attendees > 0)
);

-- Event RSVPs / Registrations
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

-- Indexes
CREATE INDEX IF NOT EXISTS idx_events_creator_id  ON events (creator_id);
CREATE INDEX IF NOT EXISTS idx_events_college_id  ON events (college_id);
CREATE INDEX IF NOT EXISTS idx_events_status      ON events (status);
CREATE INDEX IF NOT EXISTS idx_events_starts_at   ON events (starts_at);
CREATE INDEX IF NOT EXISTS idx_events_visibility  ON events (visibility);
CREATE INDEX IF NOT EXISTS idx_events_tags        ON events USING GIN (tags);

CREATE INDEX IF NOT EXISTS idx_event_rsvps_event  ON event_rsvps (event_id);
CREATE INDEX IF NOT EXISTS idx_event_rsvps_user   ON event_rsvps (user_id);
CREATE INDEX IF NOT EXISTS idx_event_rsvps_status ON event_rsvps (event_id, status);

COMMENT ON TABLE events     IS 'College and campus events with RSVP support.';
COMMENT ON TABLE event_rsvps IS 'User RSVPs to events — going, maybe, or not_going.';
