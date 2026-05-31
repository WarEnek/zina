# Deployment Checklist (Sepolia Demo)

## 1. Contract Deploy

0. Run preflight:
   ```bash
   bun run preflight:external
   ```
1. Configure `packages/contracts/.env` from `.env.example`.
2. Run deploy + verify:
   ```bash
   cd packages/contracts
   forge script script/Deploy.s.sol:Deploy \
     --rpc-url $SEPOLIA_RPC_URL \
     --broadcast \
     --verify \
     --etherscan-api-key $ETHERSCAN_API_KEY
   ```
   Or one command from repo root:
   ```bash
   bun run deploy:sepolia
   ```
3. Confirm contract exists on Sepolia explorer.

## 2. Sync Frontend Artifacts

1. From repo root, run:
   ```bash
   bun run contracts:sync-web
   ```
2. If auto-detect fails, pass address explicitly:
   ```bash
   bun run contracts:sync-web -- 0xYourContractAddress
   ```
3. Ensure generated file exists: `apps/web/.env.local`.
4. Finalize README placeholders:
   ```bash
   bun run finalize:readme -- https://your-app.example 0xYourContractAddress https://sepolia.etherscan.io
   ```

## 3. Supabase Setup

1. Apply SQL migrations in `supabase/migrations`.
2. Deploy Edge Function `sync-roll-event`.
   Or run:
   ```bash
   bun run deploy:supabase
   ```
3. Set function secrets:
   - `SEPOLIA_RPC_URL`
   - `PROOFROLL_CONTRACT_ADDRESS`
   - `SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`
4. Set frontend env:
   - `VITE_SUPABASE_SYNC_ROLL_EVENT_URL`

## 4. Frontend Deploy

1. Build and verify locally:
   ```bash
   bun run verify:local
   ```
2. Deploy `apps/web` to hosting.
3. Set public env values on host.

## 5. Final Acceptance QA

1. Wallet connect works.
2. Wrong network blocked, Sepolia switch works.
3. Roll flow shows states: awaiting signature, submitted, confirming, confirmed/rejected/failed.
4. Tx link opens explorer.
5. Proof panel shows contract/tx/block links.
6. `RollResolved` values in explorer match UI.
7. Leaderboard still non-critical if Supabase unavailable.
8. README updated with:
   - public URL
   - contract address
   - contract explorer link
   - limitations and testnet disclaimer
