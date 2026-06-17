-- ============================================================
-- Migration 003 — Users (Authentication Identity)
-- ============================================================

CREATE TYPE user_status AS ENUM ('active', 'inactive', 'banned', 'pending_verification');
CREATE TYPE auth_provider AS ENUM ('local', 'google', 'apple');

CREATE TABLE IF NOT EXISTS users (
  id                UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
  email             VARCHAR(255)  UNIQUE,
  phone             VARCHAR(20)   UNIQUE,
  password_hash     VARCHAR(255),                        -- NULL for OAuth users
  provider          auth_provider NOT NULL DEFAULT 'local',
  provider_id       VARCHAR(255),                        -- OAuth provider user ID
  status            user_status   NOT NULL DEFAULT 'pending_verification',
  email_verified    BOOLEAN       NOT NULL DEFAULT FALSE,
  phone_verified    BOOLEAN       NOT NULL DEFAULT FALSE,
  last_login_at     TIMESTAMPTZ,
  refresh_token     VARCHAR(512),                        -- hashed refresh token
  created_at        TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ   NOT NULL DEFAULT NOW(),

  -- At least one identifier must be present
  CONSTRAINT chk_users_identifier CHECK (email IS NOT NULL OR phone IS NOT NULL)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_users_email          ON users (email);
CREATE INDEX IF NOT EXISTS idx_users_phone          ON users (phone);
CREATE INDEX IF NOT EXISTS idx_users_status         ON users (status);
CREATE INDEX IF NOT EXISTS idx_users_provider       ON users (provider, provider_id);
CREATE INDEX IF NOT EXISTS idx_users_created_at     ON users (created_at DESC);

COMMENT ON TABLE users IS 'Core authentication identity table. Keeps auth data separate from profile data.';
COMMENT ON COLUMN users.provider    IS 'Authentication provider: local (email/password), google, or apple.';
COMMENT ON COLUMN users.provider_id IS 'OAuth provider subject/user ID for SSO logins.';
