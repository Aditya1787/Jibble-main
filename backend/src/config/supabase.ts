/**
 * @file config/supabase.ts
 * @description Supabase Admin client singleton (uses SERVICE_ROLE key).
 *              Bypasses Row Level Security server-side in backend.
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { env } from './env';
import { logger } from './logger';

let _supabaseAdmin: SupabaseClient | null = null;

export const getSupabaseAdmin = (): SupabaseClient => {
  if (_supabaseAdmin) return _supabaseAdmin;

  if (!env.SUPABASE_URL || !env.SUPABASE_SERVICE_ROLE_KEY) {
    logger.error('❌ SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY not configured');
    throw new Error('Supabase environment variables are not configured');
  }

  _supabaseAdmin = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  logger.info('✅  Supabase admin client initialised');
  return _supabaseAdmin;
};

export const getSupabaseAnon = (): SupabaseClient => {
  if (!env.SUPABASE_URL || !env.SUPABASE_ANON_KEY) {
    throw new Error('Supabase anon key not configured');
  }
  return createClient(env.SUPABASE_URL, env.SUPABASE_ANON_KEY);
};
