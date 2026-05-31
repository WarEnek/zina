#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")" && pwd)"

echo "== Local Verification =="
(cd "$ROOT" && bun run verify:local >/tmp/proofroll_verify.log && echo "verify:local PASS")

echo "== Key Files Check =="
for f in \
  apps/web/src/features/game/useRoll.ts \
  apps/web/src/features/proof/ProofPanel.tsx \
  packages/contracts/src/ProofRollArena.sol \
  packages/contracts/test/ProofRollArena.t.sol \
  .github/workflows/ci.yml \
  supabase/functions/sync-roll-event/index.ts \
  supabase/functions/sync-roll-event/README.md \
  supabase/migrations/001_profiles.sql \
  supabase/migrations/002_roll_events.sql \
  supabase/migrations/003_leaderboard.sql \
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
echo "- Sepolia deploy + verified explorer URL"
echo "- Public frontend URL"
echo "- Supabase function deployed with secrets"
