# ProofRoll Arena

## Public Demo

URL: TODO

## Contract

Network: Sepolia  
Address: `0x7bf135b84ac39ffe258318a6ce21e651143cf9d6`  
Explorer: https://sepolia.etherscan.io/address/0x7bf135b84ac39ffe258318a6ce21e651143cf9d6

## What this is

Testnet-only verifiable on-chain game demo.

## What this is not

Not gambling. No real money. No real value. No deposits. No withdrawals. No payouts.

## Stack

- React 19 + TypeScript + Vite + Tailwind
- wagmi + viem + RainbowKit
- Supabase JS client (cache/leaderboard only)
- Solidity + Foundry

## Repo

- `apps/web`: frontend
- `packages/contracts`: smart contracts and tests
- `supabase/migrations`: SQL schema and RLS
- `supabase/functions/sync-roll-event`: tx verification and cache sync function

## Run frontend

```bash
cd apps/web
bun install
cp .env.example .env
bun run dev
```

Or from repo root:

```bash
bun run web:dev
```

## Run contracts

```bash
cd packages/contracts
forge install OpenZeppelin/openzeppelin-contracts
forge test -vvv
```

Or from repo root:

```bash
bun run contracts:test
```

## Local verification

Run full local check from root:

```bash
bun run verify:local
```

Optional local on-chain smoke (anvil deploy + roll):

```bash
bun run e2e:local
```

External deploy readiness check:

```bash
bun run preflight:external
```

External deploy command walkthrough:

```bash
bun run help:external
```

Automated deploy helpers:

```bash
bun run deploy:sepolia
bun run deploy:supabase
```

## Deploy contract (Sepolia)

```bash
cd packages/contracts
cp .env.example .env
forge script script/Deploy.s.sol:Deploy \
  --rpc-url $SEPOLIA_RPC_URL \
  --broadcast \
  --verify \
  --etherscan-api-key $ETHERSCAN_API_KEY
```

## Sync ABI to frontend

After contract build/deploy:

```bash
bun run contracts:build
bun run contracts:export-abi
```

Then set `VITE_PROOFROLL_CONTRACT_ADDRESS` in `apps/web/.env`.

One-step sync (address + ABI):

```bash
bun run contracts:sync-web
```

If auto-detect fails, pass deployed address:

```bash
bun run contracts:sync-web -- 0xYourContractAddress
```

Finalize README after real deploy:

```bash
bun run finalize:readme -- https://your-app.example 0xYourContractAddress https://sepolia.etherscan.io
```

## How to verify roll

1. Connect wallet.
2. Switch to Sepolia.
3. Click `Roll on-chain`.
4. Open tx explorer link from UI.
5. Check `RollResolved` event values in logs.
6. Compare event values with UI result card.
7. Open verified contract source page.

## Supabase trust boundary

- Source of truth: on-chain contract state and events.
- Supabase stores public cache only.
- Never expose service role key in browser.
- Keep write paths server-verified (Edge Function or SIWE flow).

### Edge Function `sync-roll-event`

Set in Supabase function secrets:

- `SEPOLIA_RPC_URL`
- `PROOFROLL_CONTRACT_ADDRESS`
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`

Function verifies tx receipt against Sepolia RPC, checks target contract, decodes `RollResolved`, then upserts cache by `tx_hash`.

## Deployment Checklist

See [DEPLOYMENT_CHECKLIST.md](/home/warenek/projects/zina/DEPLOYMENT_CHECKLIST.md).

## Limitations

- Demo randomness is deterministic and not production-secure.
- Deploy-specific values (public URL and live contract address) still placeholders until real deploy.
- Testnet only.
