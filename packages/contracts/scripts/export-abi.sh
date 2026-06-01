#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/../../.." && pwd)"
CONTRACT_OUT="$ROOT_DIR/packages/contracts/out/CookieForge.sol/CookieForge.json"
TARGET_TS="$ROOT_DIR/apps/web/src/shared/contracts/cookieForgeAbi.ts"

if ! command -v bun >/dev/null 2>&1; then
  echo "bun is required. Install bun and re-run."
  exit 1
fi

if [ ! -f "$CONTRACT_OUT" ]; then
  echo "Missing artifact: $CONTRACT_OUT"
  echo "Run: cd packages/contracts && forge build"
  exit 1
fi

bun --eval "
const data = await Bun.file(process.argv[1]).json();
const content = 'export const cookieForgeAbi = ' + JSON.stringify(data.abi, null, 2) + ' as const\\n\\n' +
  '// Backward-compatible alias\\nexport const proofRollArenaAbi = cookieForgeAbi\\n';
await Bun.write(process.argv[2], content);
" "$CONTRACT_OUT" "$TARGET_TS"

echo "ABI exported to $TARGET_TS"
