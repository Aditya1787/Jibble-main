import * as fs from 'fs';
import * as path from 'path';
import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

// ─────────────────────────────────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────────────────────────────────
const MIGRATIONS_DIR = path.join(__dirname, 'migrations');
const TRACKING_TABLE = 'schema_migrations';

// ─────────────────────────────────────────────────────────────────────────────
// Build pool (inline so migrate.ts is self-contained)
// ─────────────────────────────────────────────────────────────────────────────
const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error('\n[Migrate] ✗  DATABASE_URL is not set in your .env file.\n');
  process.exit(1);
}

const pool = new Pool({
  connectionString: DATABASE_URL,
  max: 5,
  ssl: DATABASE_URL.includes('localhost') || DATABASE_URL.includes('127.0.0.1')
    ? false
    : { rejectUnauthorized: false },
});

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

/** Ensure the schema_migrations tracking table exists */
async function ensureTrackingTable(pool: Pool): Promise<void> {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS ${TRACKING_TABLE} (
      id          SERIAL       PRIMARY KEY,
      filename    VARCHAR(255) NOT NULL UNIQUE,
      executed_at TIMESTAMPTZ  NOT NULL DEFAULT NOW()
    );
  `);
}

/** Return filenames of migrations that have already been executed */
async function getExecutedMigrations(pool: Pool): Promise<Set<string>> {
  const result = await pool.query<{ filename: string }>(
    `SELECT filename FROM ${TRACKING_TABLE} ORDER BY id ASC`
  );
  return new Set(result.rows.map((r) => r.filename));
}

/** Return sorted list of all .sql files in the migrations directory */
function getMigrationFiles(): string[] {
  if (!fs.existsSync(MIGRATIONS_DIR)) {
    throw new Error(`[Migrate] migrations directory not found: ${MIGRATIONS_DIR}`);
  }
  return fs
    .readdirSync(MIGRATIONS_DIR)
    .filter((f) => f.endsWith('.sql'))
    .sort(); // lexicographic — 001_, 002_, … ensures correct order
}

/** Execute a single migration file inside a transaction */
async function executeMigration(pool: Pool, filename: string): Promise<void> {
  const filePath = path.join(MIGRATIONS_DIR, filename);
  const sql = fs.readFileSync(filePath, 'utf-8');

  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    await client.query(sql);
    await client.query(
      `INSERT INTO ${TRACKING_TABLE} (filename) VALUES ($1)`,
      [filename]
    );
    await client.query('COMMIT');
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Main runner
// ─────────────────────────────────────────────────────────────────────────────
async function runMigrations(): Promise<void> {
  console.log('\n╔══════════════════════════════════════════════════╗');
  console.log(  '║         Jibble — Database Migration Runner       ║');
  console.log(  '╚══════════════════════════════════════════════════╝\n');

  // 1. Verify DB connectivity
  try {
    await pool.query('SELECT 1');
    console.log('[Migrate] ✓  Database connection established');
  } catch (err) {
    console.error('[Migrate] ✗  Cannot connect to database:', (err as Error).message);
    process.exit(1);
  }

  // 2. Ensure tracking table exists
  await ensureTrackingTable(pool);
  console.log(`[Migrate] ✓  Tracking table "${TRACKING_TABLE}" ready\n`);

  // 3. Diff pending migrations
  const allFiles = getMigrationFiles();
  const executed = await getExecutedMigrations(pool);
  const pending  = allFiles.filter((f) => !executed.has(f));

  if (pending.length === 0) {
    console.log('[Migrate] ✓  All migrations are up to date. Nothing to run.\n');
    await pool.end();
    process.exit(0);
  }

  console.log(`[Migrate] Found ${pending.length} pending migration(s):\n`);
  pending.forEach((f, i) => console.log(`  ${i + 1}. ${f}`));
  console.log('');

  // 4. Execute each pending migration sequentially
  let successCount = 0;
  for (const filename of pending) {
    process.stdout.write(`  Running  ${filename} ... `);
    try {
      await executeMigration(pool, filename);
      process.stdout.write('✓\n');
      successCount++;
    } catch (err) {
      process.stdout.write('✗\n');
      console.error(`\n[Migrate] ERROR in ${filename}:`);
      console.error((err as Error).message);
      console.error('\n[Migrate] Migration halted. Fix the error and re-run.\n');
      await pool.end();
      process.exit(1);
    }
  }

  // 5. Summary
  console.log('\n──────────────────────────────────────────────────');
  console.log(`[Migrate] ✓  ${successCount} migration(s) applied successfully.`);
  console.log('──────────────────────────────────────────────────\n');

  await pool.end();
  process.exit(0);
}

runMigrations().catch((err) => {
  console.error('[Migrate] Unexpected error:', err);
  pool.end().finally(() => process.exit(1));
});
