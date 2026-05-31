#!/usr/bin/env bash
set -euo pipefail

echo "1) Fill contract env"
echo "cp packages/contracts/.env.example packages/contracts/.env"
echo "# set SEPOLIA_RPC_URL, PRIVATE_KEY, ETHERSCAN_API_KEY"
echo
echo "2) Deploy and verify contract"
echo "cd packages/contracts"
echo "forge script script/Deploy.s.sol:Deploy --rpc-url \$SEPOLIA_RPC_URL --broadcast --verify --etherscan-api-key \$ETHERSCAN_API_KEY"
echo "cd -"
echo
echo "3) Sync ABI and address into web"
echo "bun run contracts:sync-web -- 0xYourContractAddress"
echo
echo "4) Fill web env (if needed)"
echo "cp apps/web/.env.example apps/web/.env"
echo "# set VITE_SUPABASE_URL, VITE_SUPABASE_PUBLISHABLE_KEY, VITE_SUPABASE_SYNC_ROLL_EVENT_URL"
echo
echo "5) Install/login Supabase CLI"
echo "bun add -d supabase@latest"
echo "bunx --bun supabase login"
echo
echo "6) Deploy Supabase function + secrets"
echo "bunx --bun supabase functions deploy sync-roll-event"
echo "bunx --bun supabase secrets set SEPOLIA_RPC_URL=... PROOFROLL_CONTRACT_ADDRESS=0x... SUPABASE_URL=https://... SUPABASE_SERVICE_ROLE_KEY=..."
echo
echo "7) Final checks"
echo "bun run preflight:external"
echo "bun run verify:local"
echo
echo "8) Finalize README"
echo "bun run finalize:readme -- https://your-app.example 0xYourContractAddress https://sepolia.etherscan.io"
