import * as readline from 'readline';
import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const TRACKING_TABLE = 'schema_migrations';

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error('\n[Rollback] ✗  DATABASE_URL is not set.\n');
  process.exit(1);
}

const pool = new Pool({
  connectionString: DATABASE_URL,
  max: 3,
  ssl: DATABASE_URL.includes('localhost') || DATABASE_URL.includes('127.0.0.1')
    ? false
    : { rejectUnauthorized: false },
});

const STEPS = parseInt(process.argv[2] ?? '1', 10);
const LIST_ONLY = process.argv.includes('--list');

async function listMigrations(): Promise<{ id: number; filename: string; executed_at: Date }[]> {
  const result = await pool.query(
    `SELECT id, filename, executed_at FROM ${TRACKING_TABLE} ORDER BY id DESC`
  );
  return result.rows;
}

async function rollback(): Promise<void> {
  console.log('\n╔══════════════════════════════════════════════════╗');
  console.log(  '║     Jibble — Migration Rollback Tool             ║');
  console.log(  '╚══════════════════════════════════════════════════╝\n');

  // Verify connection
  try {
    await pool.query('SELECT 1');
    console.log('[Rollback] ✓  Database connected\n');
  } catch (err) {
    console.error('[Rollback] ✗  Cannot connect:', (err as Error).message);
    process.exit(1);
  }

  // List mode
  const migrations = await listMigrations();

  if (migrations.length === 0) {
    console.log('[Rollback] No migrations have been executed yet.\n');
    await pool.end();
    return;
  }

  console.log('[Rollback] Executed migrations (newest first):\n');
  migrations.forEach((m, i) => {
    const marker = i < STEPS ? '  → will remove' : '             ';
    console.log(`  ${String(m.id).padStart(3)}. ${m.filename}  ${marker}`);
  });

  if (LIST_ONLY) {
    console.log('\n[Rollback] --list mode. No changes made.\n');
    await pool.end();
    return;
  }

  // Safety confirmation
  const target = migrations.slice(0, STEPS);
  if (target.length === 0) {
    console.log('[Rollback] Nothing to roll back.\n');
    await pool.end();
    return;
  }

  console.log(`\n[Rollback] About to remove ${target.length} migration record(s):`);
  target.forEach((m) => console.log(`  - ${m.filename}`));

  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  await new Promise<void>((resolve) => {
    rl.question('\n  Confirm? (yes/no): ', async (answer) => {
      rl.close();
      if (answer.trim().toLowerCase() !== 'yes') {
        console.log('\n[Rollback] Aborted.\n');
        await pool.end();
        process.exit(0);
      }
      resolve();
    });
  });

  // Remove records
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    for (const m of target) {
      await client.query(`DELETE FROM ${TRACKING_TABLE} WHERE id = $1`, [m.id]);
      console.log(`  ✓  Removed: ${m.filename}`);
    }
    await client.query('COMMIT');
    console.log(`\n[Rollback] ✓  ${target.length} record(s) removed.`);
    console.log('[Rollback]    Re-run "npm run db:migrate:raw" to replay these migrations.\n');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('[Rollback] ✗  Error:', (err as Error).message);
    process.exit(1);
  } finally {
    client.release();
  }

  await pool.end();
}

rollback().catch((err) => {
  console.error('[Rollback] Unexpected error:', err);
  pool.end().finally(() => process.exit(1));
});
