#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")" && pwd)"
CONTRACT_ENV="$ROOT/packages/contracts/.env"
WEB_ENV_LOCAL="$ROOT/apps/web/.env.local"
WEB_ENV_DOTENV="$ROOT/apps/web/.env"

if [ -f "$WEB_ENV_LOCAL" ]; then
  WEB_ENV="$WEB_ENV_LOCAL"
elif [ -f "$WEB_ENV_DOTENV" ]; then
  WEB_ENV="$WEB_ENV_DOTENV"
else
  WEB_ENV="$WEB_ENV_LOCAL"
fi

fail=0

if [ -d "$HOME/.foundry/bin" ]; then
  export PATH="$HOME/.foundry/bin:$PATH"
fi

check_cmd() {
  local c="$1"
  if command -v "$c" >/dev/null 2>&1; then
    echo "OK   command: $c"
  else
    echo "MISS command: $c"
    fail=1
  fi
}

check_var_in_file() {
  local file="$1"
  local key="$2"
  if [ ! -f "$file" ]; then
    echo "MISS file: $file"
    fail=1
    return
  fi
  if grep -qE "^${key}=.+$" "$file"; then
    echo "OK   $key in $(basename "$file")"
  else
    echo "MISS $key in $(basename "$file")"
    fail=1
  fi
}

echo "== Commands =="
check_cmd bun
check_cmd forge
check_cmd cast
if bunx --bun supabase --version >/dev/null 2>&1; then
  echo "OK   command: supabase (via bunx)"
else
  echo "MISS command: supabase (bunx)"
  fail=1
  echo "HINT install local CLI: bun add -d supabase@latest"
  echo "HINT global install: https://supabase.com/docs/guides/cli/getting-started"
fi

echo "== Contract Env =="
check_var_in_file "$CONTRACT_ENV" "SEPOLIA_RPC_URL"
check_var_in_file "$CONTRACT_ENV" "PRIVATE_KEY"
check_var_in_file "$CONTRACT_ENV" "ETHERSCAN_API_KEY"

echo "== Web Env =="
echo "Using web env file: $WEB_ENV"
check_var_in_file "$WEB_ENV" "VITE_PROOFROLL_CONTRACT_ADDRESS"
check_var_in_file "$WEB_ENV" "VITE_SUPABASE_URL"
check_var_in_file "$WEB_ENV" "VITE_SUPABASE_PUBLISHABLE_KEY"
check_var_in_file "$WEB_ENV" "VITE_SUPABASE_SYNC_ROLL_EVENT_URL"

echo "== Address sanity =="
if [ -f "$WEB_ENV" ]; then
  ADDR="$(grep -E '^VITE_PROOFROLL_CONTRACT_ADDRESS=' "$WEB_ENV" | head -n1 | cut -d= -f2-)"
  if [[ "$ADDR" =~ ^0x[a-fA-F0-9]{40}$ ]] && [[ "$ADDR" != "0x0000000000000000000000000000000000000000" ]]; then
    echo "OK   contract address format"
  else
    echo "MISS contract address format"
    fail=1
  fi
fi

echo "== Result =="
if [ "$fail" -eq 0 ]; then
  echo "READY external deploy"
else
  echo "NOT READY external deploy"
  echo "Fix missing items above, then rerun: bun run preflight:external"
  exit 1
fi
