#!/bin/bash
# ============================================================================
#  Jibble — Database Rollback Script
#  Usage:
#    ./infrastructure/scripts/rollback_db.sh              # roll back last 1
#    ./infrastructure/scripts/rollback_db.sh --steps 3   # roll back last 3
#    ./infrastructure/scripts/rollback_db.sh --list       # list executed migrations
# ============================================================================

set -euo pipefail

GREEN='\033[0;32m'; YELLOW='\033[1;33m'; RED='\033[0;31m'
CYAN='\033[0;36m'; BOLD='\033[1m'; NC='\033[0m'

echo -e "\n${CYAN}${BOLD}╔══════════════════════════════════════════════════╗${NC}"
echo -e "${CYAN}${BOLD}║     Jibble — Database Rollback Script            ║${NC}"
echo -e "${CYAN}${BOLD}╚══════════════════════════════════════════════════╝${NC}\n"

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "${SCRIPT_DIR}/../.." && pwd)"
BACKEND_DIR="${PROJECT_ROOT}/backend"
ENV_FILE="${BACKEND_DIR}/.env"

STEPS=1
LIST_ONLY=false
ENV_TARGET="development"

while [[ $# -gt 0 ]]; do
  case "$1" in
    --steps) STEPS="$2"; shift 2 ;;
    --list)  LIST_ONLY=true; shift ;;
    --env)   ENV_TARGET="$2"; shift 2 ;;
    --help|-h)
      echo "Usage: $0 [--steps N] [--list] [--env development|production]"
      exit 0 ;;
    *) echo -e "${RED}Unknown argument: $1${NC}"; exit 1 ;;
  esac
done

# Load .env
if [[ -f "${ENV_FILE}" ]]; then
  set -o allexport
  source <(grep -E '^[A-Za-z_][A-Za-z0-9_]*=' "${ENV_FILE}")
  set +o allexport
else
  echo -e "${RED}[Rollback] ✗  .env not found at ${ENV_FILE}${NC}"; exit 1
fi

if [[ -z "${DATABASE_URL:-}" ]]; then
  echo -e "${RED}[Rollback] ✗  DATABASE_URL is not set${NC}"; exit 1
fi

# List executed migrations
echo -e "${YELLOW}[Rollback]${NC} Fetching executed migrations from database...\n"
psql "${DATABASE_URL}" -c "SELECT id, filename, executed_at FROM schema_migrations ORDER BY id DESC LIMIT 20;" 2>/dev/null \
  || { echo -e "${RED}[Rollback] ✗  Could not connect or schema_migrations table missing${NC}"; exit 1; }

if [[ "${LIST_ONLY}" == true ]]; then
  echo -e "\n${GREEN}[Rollback]${NC} List complete."; exit 0
fi

# Safety prompt
if [[ "${ENV_TARGET}" == "production" ]]; then
  echo -e "\n${RED}${BOLD}⚠  WARNING: Rolling back PRODUCTION database!${NC}"
  read -rp "Type 'yes-rollback-production' to confirm: " CONFIRM
  [[ "${CONFIRM}" == "yes-rollback-production" ]] || { echo "Aborted."; exit 0; }
fi

echo -e "\n${YELLOW}[Rollback]${NC} Removing last ${BOLD}${STEPS}${NC} migration record(s) from schema_migrations...\n"

# Remove last N entries from tracking table (does NOT drop tables — controlled rollback)
psql "${DATABASE_URL}" <<SQL
DO \$\$
DECLARE
  rec RECORD;
  removed INT := 0;
BEGIN
  FOR rec IN
    SELECT id, filename FROM schema_migrations ORDER BY id DESC LIMIT ${STEPS}
  LOOP
    RAISE NOTICE 'Removing migration record: %', rec.filename;
    DELETE FROM schema_migrations WHERE id = rec.id;
    removed := removed + 1;
  END LOOP;
  RAISE NOTICE 'Removed % migration record(s).', removed;
END
\$\$;
SQL

echo -e "\n${GREEN}${BOLD}[Rollback] ✓  Done. Re-run migrate_db.sh to replay migrations.${NC}\n"
echo -e "${YELLOW}[Rollback] NOTE: This script removes tracking records only.${NC}"
echo -e "${YELLOW}[Rollback]       To drop tables, write a down-migration SQL file and apply manually.${NC}\n"
