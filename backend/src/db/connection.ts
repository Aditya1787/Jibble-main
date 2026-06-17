import { Pool, PoolConfig } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

// ─────────────────────────────────────────────────────────────────────────────
// Validate required environment variable
// ─────────────────────────────────────────────────────────────────────────────
const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  throw new Error(
    '[DB] DATABASE_URL is not set. ' +
    'Add it to backend/.env (e.g. postgresql://user:pass@host/dbname?sslmode=require)'
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Connection pool configuration
// ─────────────────────────────────────────────────────────────────────────────
const poolConfig: PoolConfig = {
  connectionString: DATABASE_URL,
  max: 20,                // Maximum connections in pool
  idleTimeoutMillis: 30_000,  // Close idle connections after 30 s
  connectionTimeoutMillis: 5_000,  // Fail fast if DB unreachable
  // SSL required for Neon DB and any cloud PostgreSQL instance
  ssl: DATABASE_URL.includes('localhost') || DATABASE_URL.includes('127.0.0.1')
    ? false
    : { rejectUnauthorized: false },
};

// ─────────────────────────────────────────────────────────────────────────────
// Create & export the pool
// ─────────────────────────────────────────────────────────────────────────────
export const pool = new Pool(poolConfig);

// ─────────────────────────────────────────────────────────────────────────────
// Convenience query helper (tagged-template / parameterized)
// Usage:  const { rows } = await query('SELECT * FROM users WHERE id = $1', [id]);
// ─────────────────────────────────────────────────────────────────────────────
export const query = (text: string, params?: unknown[]) =>
  pool.query(text, params);

// ─────────────────────────────────────────────────────────────────────────────
// Health check — verifies the connection is alive
// ─────────────────────────────────────────────────────────────────────────────
export const checkDatabaseConnection = async (): Promise<void> => {
  const client = await pool.connect();
  try {
    const result = await client.query('SELECT NOW() AS now, version() AS pg_version');
    const { now, pg_version } = result.rows[0];
    console.log(`[DB] Connected ✓  ${now}`);
    console.log(`[DB] PostgreSQL version: ${pg_version.split(' ').slice(0, 2).join(' ')}`);
  } finally {
    client.release();
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// Graceful shutdown — drain the pool on process exit
// ─────────────────────────────────────────────────────────────────────────────
process.on('SIGINT',  () => { pool.end(); process.exit(0); });
process.on('SIGTERM', () => { pool.end(); process.exit(0); });

export default pool;
