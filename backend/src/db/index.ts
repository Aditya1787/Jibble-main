// ─────────────────────────────────────────────────────────────────────────────
// Database — primary exports
// ─────────────────────────────────────────────────────────────────────────────
// Re-export the pg Pool and query helper from connection.ts so the rest of
// the application can import from '@db' (alias configured in tsconfig paths).
export { pool, query, checkDatabaseConnection } from './connection';
