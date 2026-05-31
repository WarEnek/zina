#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")" && pwd)"
FN_ENV="$ROOT/supabase/functions/sync-roll-event/.env"
WEB_ENV_LOCAL="$ROOT/apps/web/.env.local"
WEB_ENV="$ROOT/apps/web/.env"

if ! bunx --bun supabase --version >/dev/null 2>&1; then
  echo "Missing supabase CLI. Install local: bun add -d supabase@latest"
  echo "Or global: https://supabase.com/docs/guides/cli/getting-started"
  exit 1
fi

if [ ! -f "$FN_ENV" ]; then
  echo "Missing $FN_ENV. Copy from .env.example and fill values."
  exit 1
fi

set -a
source "$FN_ENV"
set +a

for v in SEPOLIA_RPC_URL PROOFROLL_CONTRACT_ADDRESS SUPABASE_URL SUPABASE_SERVICE_ROLE_KEY; do
  if [ -z "${!v:-}" ]; then
    echo "Missing env var in function env: $v"
    exit 1
  fi
done

SUPABASE_PROJECT_REF="${SUPABASE_PROJECT_REF:-}"
if [ -z "$SUPABASE_PROJECT_REF" ]; then
  SUPABASE_PROJECT_REF="$(echo "$SUPABASE_URL" | sed -E 's#https://([^.]+)\.supabase\.co#\1#')"
fi

if [ -z "$SUPABASE_PROJECT_REF" ] || [ "$SUPABASE_PROJECT_REF" = "$SUPABASE_URL" ]; then
  echo "Could not derive SUPABASE_PROJECT_REF from SUPABASE_URL."
  echo "Set SUPABASE_PROJECT_REF in $FN_ENV"
  exit 1
fi

SUPABASE_SYNC_ROLL_EVENT_URL="${SUPABASE_SYNC_ROLL_EVENT_URL:-}"
if [ -z "$SUPABASE_SYNC_ROLL_EVENT_URL" ]; then
  echo "WARN: SUPABASE_SYNC_ROLL_EVENT_URL not set in function env."
  echo "Will deploy function, but you must set VITE_SUPABASE_SYNC_ROLL_EVENT_URL manually in web env."
fi

echo "Setting Supabase secrets..."
bunx --bun supabase secrets set \
  --project-ref "$SUPABASE_PROJECT_REF" \
  SEPOLIA_RPC_URL="$SEPOLIA_RPC_URL" \
  PROOFROLL_CONTRACT_ADDRESS="$PROOFROLL_CONTRACT_ADDRESS" \
  SUPABASE_URL="$SUPABASE_URL" \
  SUPABASE_SERVICE_ROLE_KEY="$SUPABASE_SERVICE_ROLE_KEY"

echo "Deploying function sync-roll-event..."
bunx --bun supabase functions deploy sync-roll-event --project-ref "$SUPABASE_PROJECT_REF"

TARGET_WEB_ENV="$WEB_ENV_LOCAL"
if [ ! -f "$TARGET_WEB_ENV" ] && [ -f "$WEB_ENV" ]; then
  TARGET_WEB_ENV="$WEB_ENV"
fi

if [ -n "$SUPABASE_SYNC_ROLL_EVENT_URL" ]; then
  touch "$TARGET_WEB_ENV"
  if grep -q '^VITE_SUPABASE_SYNC_ROLL_EVENT_URL=' "$TARGET_WEB_ENV"; then
    sed -i "s|^VITE_SUPABASE_SYNC_ROLL_EVENT_URL=.*|VITE_SUPABASE_SYNC_ROLL_EVENT_URL=$SUPABASE_SYNC_ROLL_EVENT_URL|" "$TARGET_WEB_ENV"
  else
    echo "VITE_SUPABASE_SYNC_ROLL_EVENT_URL=$SUPABASE_SYNC_ROLL_EVENT_URL" >> "$TARGET_WEB_ENV"
  fi
  echo "Updated $TARGET_WEB_ENV with VITE_SUPABASE_SYNC_ROLL_EVENT_URL"
fi

echo "Supabase deploy done."
