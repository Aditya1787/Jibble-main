-- Quick verification queries to run after migrations
-- Usage: psql $DATABASE_URL -f database/verify.sql

\echo '============================================'
\echo 'Jibble — Migration Verification'
\echo '============================================'

\echo '\n[1] Executed Migrations:'
SELECT id, filename, executed_at FROM schema_migrations ORDER BY id;

\echo '\n[2] All Tables:'
SELECT tablename, tableowner
FROM pg_tables
WHERE schemaname = 'current_schema'()
   OR schemaname = 'public'
ORDER BY tablename;

\echo '\n[3] All Enum Types:'
SELECT t.typname AS enum_name,
       string_agg(e.enumlabel, ', ' ORDER BY e.enumsortorder) AS values
FROM pg_type t
JOIN pg_enum e ON t.oid = e.enumtypid
GROUP BY t.typname
ORDER BY t.typname;

\echo '\n[4] All Indexes:'
SELECT indexname, tablename
FROM pg_indexes
WHERE schemaname = 'public'
ORDER BY tablename, indexname;

\echo '\n[5] Foreign Key Constraints:'
SELECT
  tc.table_name,
  kcu.column_name,
  ccu.table_name AS foreign_table,
  ccu.column_name AS foreign_column,
  rc.delete_rule
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
  ON tc.constraint_name = kcu.constraint_name
JOIN information_schema.referential_constraints AS rc
  ON tc.constraint_name = rc.constraint_name
JOIN information_schema.constraint_column_usage AS ccu
  ON ccu.constraint_name = rc.unique_constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY'
ORDER BY tc.table_name;

\echo '\n============================================'
\echo 'Verification complete!'
\echo '============================================'
