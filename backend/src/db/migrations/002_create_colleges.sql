-- ============================================================
-- Migration 002 — Colleges (Lookup Table)
-- ============================================================

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

-- Indexes
CREATE INDEX IF NOT EXISTS idx_colleges_name    ON colleges (name);
CREATE INDEX IF NOT EXISTS idx_colleges_city    ON colleges (city);
CREATE INDEX IF NOT EXISTS idx_colleges_state   ON colleges (state);
CREATE INDEX IF NOT EXISTS idx_colleges_active  ON colleges (is_active);

COMMENT ON TABLE colleges IS 'Lookup table for college/university records referenced by user profiles.';
