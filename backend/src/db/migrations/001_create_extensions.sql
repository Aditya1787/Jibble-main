-- ============================================================
-- Migration 001 — PostgreSQL Extensions & Migration Tracking
-- ============================================================

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Migration tracking table
CREATE TABLE IF NOT EXISTS schema_migrations (
  id          SERIAL PRIMARY KEY,
  filename    VARCHAR(255) NOT NULL UNIQUE,
  executed_at TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE schema_migrations IS 'Tracks all executed SQL migration files to prevent duplicate execution.';
