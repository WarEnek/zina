# Acceptance Audit

Date: 2026-06-01

## Legend

- `DONE (local evidence)` — implemented and verified in repo.
- `PENDING (external)` — requires deployed infra or external credentials/state.
- `UNVERIFIED IN THIS ENV` — implementation exists, but runtime evidence not produced in current environment.

## 1. Wallet and Network

1. Connect wallet via RainbowKit — `DONE (local evidence)`
   - Evidence: `apps/web/src/features/wallet/ConnectWalletButton.tsx`, `apps/web/src/app/providers.tsx`.
2. Show connected address/network state — `DONE (local evidence)`
   - Evidence: `apps/web/src/features/wallet/WalletStatus.tsx`.
3. Block unsupported networks and offer switch to Sepolia — `DONE (local evidence)`
   - Evidence: `apps/web/src/features/network/NetworkGuard.tsx`, `UnsupportedNetworkBanner.tsx`, `SwitchNetworkButton.tsx`.
4. Disconnected/connecting/connected/wrong-network/rejected states — `DONE (local evidence)`
   - Evidence: `useWalletStatus.ts`, `useBakeCookie.ts`, `GamePanel.tsx`.

## 2. Contract

1. Contract stores bake result, stats, emits events, no custody/payments — `DONE (local evidence)`
   - Evidence: `packages/contracts/src/CookieForge.sol`.
2. Contract tests exist — `DONE (local evidence)`
   - Evidence: `packages/contracts/test/CookieForge.t.sol`.
3. Contract tests pass in current environment — `DONE (local evidence)`
   - Evidence: `bun run verify:local` succeeded; `forge test -vvv` shows `6 passed, 0 failed` for `CookieForge.t.sol`.
4. Deployed on Sepolia + verified source — `PENDING (external)`
   - Needs fresh post-rename verification for `CookieForge` artifact.

## 3. Bake UI

1. Trigger bake transaction and show lifecycle — `DONE (local evidence)`
   - Evidence: `apps/web/src/features/game/useBakeCookie.ts`, `GamePanel.tsx`.
2. Show latest cookie result and tx hash link — `DONE (local evidence)`
   - Evidence: `ResultCard.tsx`, `GamePanel.tsx`.
3. Show bake stats by rarity — `DONE (local evidence)`
   - Evidence: `PlayerStatsCard.tsx`, `usePlayerStats.ts`.

## 4. Transparency UI

1. Show contract/tx/block links — `DONE (local evidence)`
   - Evidence: `ProofPanel.tsx`, `ExplorerLink.tsx`, `shared/utils/explorer.ts`.
2. Show decoded bake event fields — `DONE (local evidence)`
   - Evidence: `LatestEventCard.tsx`.
3. Show declared probability and odds transparency — `DONE (local evidence)`
   - Evidence: `LatestEventCard.tsx`, `OddsTransparencyCard.tsx`.

## 5. Collection and Analytics

1. Cookie collection from ERC-1155 balances — `DONE (local evidence)`
   - Evidence: `CookieCollectionCard.tsx`.
2. Rarity filter and owned/silhouette states — `DONE (local evidence)`
   - Evidence: `CookieCollectionCard.tsx`.
3. Supabase cookie analytics cache/view wiring — `DONE (local evidence)`
   - Evidence: `supabase/migrations/004_cookie_events.sql`, `features/leaderboard/*`.

## 6. Supabase Function and Migrations

1. Server-verified event sync function for `CookieMinted` — `DONE (local evidence)`
   - Evidence: `supabase/functions/sync-roll-event/index.ts`.
2. Secrets naming aligned with cookieforge + fallback — `DONE (local evidence)`
   - Evidence: `sync-roll-event/.env.example`, `scripts_deploy_supabase.sh`.
3. Function deployed with real secrets — `PENDING (external)`

## 7. Deployment Tooling and Docs

1. Deploy/sync scripts aligned with `CookieForge` artifact naming — `DONE (local evidence)`
   - Evidence: `Deploy.s.sol`, `export-abi.sh`, `sync-web-artifacts.sh`, `scripts_deploy_sepolia.sh`, `scripts_local_e2e.sh`.
2. README and checklist aligned with cookie terminology — `DONE (local evidence)`
   - Evidence: `README.md`, `DEPLOYMENT_CHECKLIST.md`.

## 8. Verification Commands (this run)

- `bun run verify:local` — PASS.
  - Includes `web:typecheck` — PASS.
  - Includes `web:build` — PASS.
  - Includes `contracts:test` — PASS (`6 passed, 0 failed`).

## Current Status

- Implementation is substantially aligned with `Cookie Forge` objective.
- External proof steps (deployed/verified contract post-rename and Supabase deployed secrets) remain pending.
