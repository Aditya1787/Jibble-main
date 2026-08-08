/**
 * @file env.ts
 * @description Loads .env via dotenv and validates all required/optional
 *              environment variables using Zod. Throws at startup if invalid.
 */

import dotenv from 'dotenv';
import { z } from 'zod';
import path from 'path';

// Load .env from the backend root (two levels up from src/config/)
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

// ---------------------------------------------------------------------------
// Schema
// ---------------------------------------------------------------------------

const envSchema = z.object({
  // ── General ──────────────────────────────────────────────────────────────
  NODE_ENV: z
    .enum(['development', 'test', 'staging', 'production'])
    .default('development'),
  PORT: z.coerce.number().int().positive().default(8080),

  // ── Database ─────────────────────────────────────────────────────────────
  DATABASE_URL: z
    .string()
    .url('DATABASE_URL must be a valid connection URL (Neon Postgres)'),

  // ── Redis ────────────────────────────────────────────────────────────────
  REDIS_URL: z.string().url('REDIS_URL must be a valid Redis connection URL'),

  // ── JWT ──────────────────────────────────────────────────────────────────
  JWT_ACCESS_SECRET: z
    .string()
    .min(32, 'JWT_ACCESS_SECRET must be at least 32 characters'),
  JWT_REFRESH_SECRET: z
    .string()
    .min(32, 'JWT_REFRESH_SECRET must be at least 32 characters'),
  JWT_ACCESS_EXPIRES_IN: z.string().default('15m'),
  JWT_REFRESH_EXPIRES_IN: z.string().default('7d'),

  // ── AWS / S3 ─────────────────────────────────────────────────────────────
  AWS_ACCESS_KEY_ID: z.string().min(1, 'AWS_ACCESS_KEY_ID is required'),
  AWS_SECRET_ACCESS_KEY: z
    .string()
    .min(1, 'AWS_SECRET_ACCESS_KEY is required'),
  AWS_REGION: z.string().default('us-east-1'),
  S3_BUCKET_PROFILE: z.string().min(1, 'S3_BUCKET_PROFILE is required'),
  S3_BUCKET_POSTS: z.string().min(1, 'S3_BUCKET_POSTS is required'),
  S3_BUCKET_STORIES: z.string().min(1, 'S3_BUCKET_STORIES is required'),

  // ── CloudFront ───────────────────────────────────────────────────────────
  CLOUDFRONT_URL: z.string().url('CLOUDFRONT_URL must be a valid URL'),

  // ── CORS ─────────────────────────────────────────────────────────────────
  CLIENT_BASE_URL: z
    .string()
    .url('CLIENT_BASE_URL must be a valid URL')
    .default('http://localhost:3000'),

  // ── BullMQ / Queue Redis ─────────────────────────────────────────────────
  BULLMQ_REDIS_URL: z
    .string()
    .url('BULLMQ_REDIS_URL must be a valid Redis connection URL')
    .optional(),

  // ── Rate Limiting ────────────────────────────────────────────────────────
  RATE_LIMIT_WINDOW_MS: z.coerce.number().int().positive().default(60_000),
  RATE_LIMIT_GLOBAL_MAX: z.coerce.number().int().positive().default(100),
  RATE_LIMIT_AUTH_MAX: z.coerce.number().int().positive().default(10),
  RATE_LIMIT_CHAT_MAX: z.coerce.number().int().positive().default(600),
  RATE_LIMIT_POST_MAX: z.coerce.number().int().positive().default(60),

  // ── Feature Flags ────────────────────────────────────────────────────────
  FEATURE_FLAGS: z.string().optional().default(''),

  // ── Supabase ─────────────────────────────────────────────────────────────
  SUPABASE_URL: z.string().optional().default(''),
  SUPABASE_SERVICE_ROLE_KEY: z.string().optional().default(''),
  SUPABASE_ANON_KEY: z.string().optional().default(''),
});

// ---------------------------------------------------------------------------
// Parse & export
// ---------------------------------------------------------------------------

const _parsed = envSchema.safeParse(process.env);

if (!_parsed.success) {
  console.error('❌  Invalid environment variables:\n');
  _parsed.error.errors.forEach((e) => {
    console.error(`   • ${e.path.join('.')} — ${e.message}`);
  });
  process.exit(1);
}

/**
 * Fully-typed, validated environment configuration.
 * Import this instead of reading `process.env` directly.
 */
export const env = _parsed.data;

/** Convenience: are we running in production? */
export const isProduction = env.NODE_ENV === 'production';

/** Convenience: are we running tests? */
export const isTest = env.NODE_ENV === 'test';

export type Env = z.infer<typeof envSchema>;
