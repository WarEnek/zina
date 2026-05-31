# Acceptance Audit

Date: 2026-05-31

## Legend

- `DONE (local evidence)` — implemented and verified in repo.
- `PENDING (external)` — requires deployed infra or external credentials/state.

## 1. Wallet and Network

1. Connect wallet via RainbowKit — `DONE (local evidence)`
   - Evidence: `apps/web/src/features/wallet/ConnectWalletButton.tsx`, `apps/web/src/app/providers.tsx`.
2. Show connected address/network state — `DONE (local evidence)`
   - Evidence: `apps/web/src/features/wallet/WalletStatus.tsx`.
3. Block unsupported networks and offer switch to Sepolia — `DONE (local evidence)`
   - Evidence: `apps/web/src/features/network/NetworkGuard.tsx`, `UnsupportedNetworkBanner.tsx`, `SwitchNetworkButton.tsx`.
4. Disconnected/connecting/connected/wrong-network/rejected states — `DONE (local evidence)`
   - Evidence: `useWalletStatus.ts`, `useRoll.ts`, `GamePanel.tsx`.

## 2. Contract

1. Contract stores roll result, stats, emits events, no custody/payments — `DONE (local evidence)`
   - Evidence: `packages/contracts/src/ProofRollArena.sol`.
2. Contract tests exist and pass — `DONE (local evidence)`
   - Evidence: `packages/contracts/test/ProofRollArena.t.sol`, `forge test` output (`6/6` pass).
3. Deployed on Sepolia + verified source — `DONE (external evidence)`
   - Evidence: deployed `0x7bf135b84ac39ffe258318a6ce21e651143cf9d6`, explorer shows verified source: `https://sepolia.etherscan.io/address/0x7bf135b84ac39ffe258318a6ce21e651143cf9d6`.

## 3. Game UI

1. Trigger roll transaction, show lifecycle (signature/submitted/confirming/confirmed/rejected/failed) — `DONE (local evidence)`
   - Evidence: `apps/web/src/features/game/useRoll.ts`, `GamePanel.tsx`.
2. Show latest result and tx hash link — `DONE (local evidence)`
   - Evidence: `ResultCard.tsx`, `GamePanel.tsx`.
3. Show score/streak/total rolls — `DONE (local evidence)`
   - Evidence: `PlayerStatsCard.tsx`, `usePlayerStats.ts`.

## 4. Verification UI

1. Show contract address and explorer links (contract/tx/block) — `DONE (local evidence)`
   - Evidence: `ProofPanel.tsx`, `ExplorerLink.tsx`, `shared/utils/explorer.ts`.
2. Show decoded event data + explain on-chain vs Supabase cache — `DONE (local evidence)`
   - Evidence: `LatestEventCard.tsx`, `TrustBoundaryCard.tsx`, `VerificationExplainer.tsx`.

## 5. Supabase

1. Profiles/events/leaderboard migrations + RLS/public-read policies — `DONE (local evidence)`
   - Evidence: `supabase/migrations/001_profiles.sql`, `002_roll_events.sql`, `003_leaderboard.sql`.
2. No service role key in frontend — `DONE (local evidence)`
   - Evidence: `apps/web/.env.example` (publishable key only), no service-role usage in frontend code.
3. Server-verified event sync function — `DONE (local evidence)`
   - Evidence: `supabase/functions/sync-roll-event/index.ts` validates receipt/contract/event before upsert.
4. Supabase project/function deployed with real secrets — `DONE (external evidence)`
   - Evidence: `bun run deploy:supabase` completed (`functions deploy sync-roll-event`, `secrets set`).

## 6. Deployment and README

1. Root scripts for local verification — `DONE (local evidence)`
   - Evidence: `package.json` (`verify:local`, `contracts:*`, `web:*`).
2. ABI/address sync automation — `DONE (local evidence)`
   - Evidence: `packages/contracts/scripts/export-abi.sh`, `sync-web-artifacts.sh`.
3. README finalization automation for live URL/address/explorer — `DONE (local evidence)`
   - Evidence: `scripts_finalize_readme.sh`, `package.json` (`finalize:readme`).
4. Public frontend URL + live contract address + explorer in README — `PENDING (external)`
   - Contract address + explorer filled; public frontend URL still pending.

## 6.1 CI Gate

1. CI workflow to enforce local gates on push/PR — `DONE (local evidence)`
   - Evidence: `.github/workflows/ci.yml` (`bun run verify:local`).

## 7. Safety Constraints

1. No deposit/withdraw/payout/stake/wager logic — `DONE (local evidence)`
   - Evidence: contract/API surface; app copy/disclaimers in `README.md`, `App.tsx`.
2. Testnet-only positioning and disclaimer — `DONE (local evidence)`
   - Evidence: UI hero/footer + README sections.

## 8. Verification Commands (last run)

- `bun run verify:local` — PASS.
- Includes:
  - `bun run web:typecheck` — PASS.
  - `bun run web:build` — PASS.
  - `bun run contracts:test` — PASS (`6/6`).
- `bun run e2e:local` — PASS.
  - Includes: local `anvil` deploy, `roll()` tx, receipt success, `totalRolls == 1`.

## Final Objective Status

- Full objective: `NOT COMPLETE YET`.
- Blocking external items only:
  1. Public frontend deployment URL.
