#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")" && pwd)"

echo "== Local Verification =="
(cd "$ROOT" && bun run verify:local >/tmp/cookieforge_verify.log && echo "verify:local PASS")

echo "== Key Files Check =="
for f in \
  apps/web/src/features/game/useBakeCookie.ts \
  apps/web/src/features/proof/ProofPanel.tsx \
  packages/contracts/src/CookieForge.sol \
  packages/contracts/test/CookieForge.t.sol \
  .github/workflows/ci.yml \
  supabase/functions/sync-roll-event/index.ts \
  supabase/functions/sync-roll-event/README.md \
  supabase/migrations/001_profiles.sql \
  supabase/migrations/004_cookie_events.sql \
  DEPLOYMENT_CHECKLIST.md \
  scripts_external_readiness.sh \
  scripts_finalize_readme.sh \
  ACCEPTANCE_AUDIT.md; do
  if [ -f "$ROOT/$f" ]; then
    echo "OK  $f"
  else
    echo "MISS $f"
    exit 1
  fi
done

echo "== External Pending =="
README_FILE="$ROOT/README.md"
CONTRACT_ADDR="0x7bf135b84ac39ffe258318a6ce21e651143cf9d6"

if rg -q "^URL: https://[^ ]+" "$README_FILE"; then
  echo "DONE - Public frontend URL"
else
  echo "PENDING - Public frontend URL"
fi

if rg -qi "Address: \`$CONTRACT_ADDR\`" "$README_FILE" && rg -q "https://sepolia.etherscan.io/address/$CONTRACT_ADDR" "$README_FILE"; then
  echo "DONE - Sepolia deploy + verified explorer URL"
else
  echo "PENDING - Sepolia deploy + verified explorer URL"
fi

if rg -q "SUPABASE_SYNC_ROLL_EVENT_URL=https://[^ ]+/sync-roll-event" "$ROOT/apps/web/.env.local"; then
  echo "DONE - Supabase function deployed with secrets (env wired)"
else
  echo "PENDING - Supabase function deployed with secrets"
fi
