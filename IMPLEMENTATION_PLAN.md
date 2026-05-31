# Codex Implementation Plan: Verifiable On-Chain Game Demo

## 0. Purpose

Build a polished 48-hour demo product that shows frontend engineering, blockchain integration, transaction UX, Supabase backend usage, and on-chain verifiability.

This project must be implemented as a **testnet-only verifiable on-chain game demo**, not as a real gambling product.

The app should demonstrate these capabilities:

- wallet connection;
- testnet network guard;
- smart contract interaction;
- on-chain game result storage;
- block explorer verification links;
- polished React UI;
- Supabase-backed profile and leaderboard cache;
- strong error states;
- mobile-first UX;
- clean README and deployment instructions.

## 1. Hard Safety and Product Constraints

Do not implement any real-money or real-value mechanics.

Do not implement:

- real deposits;
- real withdrawals;
- staking;
- wagering;
- casino payouts;
- house-edge profit mechanics;
- real token custody;
- any mainnet flow;
- any mechanism that helps users gamble or move value.

Allowed implementation:

- testnet only;
- wallet connect;
- public testnet transactions;
- non-transferable demo score / XP;
- on-chain roll result;
- leaderboard based on verified on-chain events;
- clear disclaimer that this is not a gambling product.

The app should be positioned as:

> Verifiable on-chain game demo. No real money. No real value. No wagering. Testnet only.

## 2. Recommended Stack

### Frontend

Use:

- React 19+
- TypeScript
- Vite
- Bun
- Tailwind CSS
- shadcn/ui or Radix UI primitives
- Framer Motion for small visual polish
- lucide-react for icons
- TanStack Query
- wagmi
- viem
- RainbowKit
- Supabase JS client

### Blockchain

Use:

- Ethereum Sepolia
- Solidity
- Foundry
- OpenZeppelin Contracts
- Etherscan-compatible contract verification

Reasoning:

- Sepolia + Solidity + Foundry is faster for a 48-hour implementation than Solana unless the developer already has strong Anchor experience.
- wagmi + viem gives a clean React integration layer.
- Foundry gives fast contract testing, deploy scripts, and verification flow.

### Backend / Off-chain Layer

Use Supabase only for convenience data:

- user profile;
- username/avatar;
- cached verified roll events;
- leaderboard cache;
- optional realtime leaderboard updates.

Supabase must not be the source of truth for game results.

Source of truth:

- smart contract state;
- emitted smart contract events;
- public block explorer.

## 3. High-Level Product Concept

Product name suggestion:

> ProofRoll Arena

Core flow:

1. User opens the app.
2. User connects wallet.
3. App checks that the user is on Sepolia.
4. User creates or updates a public profile.
5. User clicks `Roll`.
6. Wallet opens transaction confirmation.
7. Contract stores the roll result on-chain.
8. Contract emits `RollResolved` event.
9. UI shows result, score delta, and transaction link.
10. Supabase cache syncs the verified event.
11. Leaderboard updates.
12. User can open proof panel and verify contract / transaction / event.

There must be no deposit and no withdrawal flow.

## 4. Main Acceptance Criteria

The implementation is complete only if all items below work.

### Wallet and Network

- User can connect wallet via RainbowKit.
- App shows connected address.
- App shows active network.
- App blocks gameplay on unsupported networks.
- App offers a switch-to-Sepolia action.
- App handles disconnected, connecting, connected, wrong network, rejected connection states.

### Contract

- Contract is deployed on Sepolia.
- Contract source is verified on a block explorer.
- Contract stores roll result on-chain.
- Contract emits events for each roll.
- Contract has tests.
- Contract has clear comments explaining demo randomness limitations.
- Contract has no real-value token custody.
- Contract has no deposit/withdraw/payout functions.

### Game UI

- User can trigger a roll transaction.
- UI shows pending wallet confirmation.
- UI shows pending transaction mining.
- UI shows confirmed state.
- UI shows rejected transaction state.
- UI shows contract revert state.
- UI shows last result.
- UI shows score / streak / total rolls.
- UI shows latest transaction hash with explorer link.

### Verification UI

- App shows contract address.
- App links to verified contract page.
- App links to latest transaction.
- App links to latest block.
- App shows decoded event data from the latest roll.
- App explains what is on-chain and what is only cached in Supabase.

### Supabase

- Supabase project is configured with RLS.
- Public profile table exists.
- Verified event cache table exists.
- Leaderboard view/table exists.
- Public reads are limited to safe public fields.
- Writes are protected by RLS or server-side verification.
- No service role key is exposed to the browser.

### Deployment

- Frontend deployed to public URL.
- README contains:
  - public URL;
  - contract address;
  - explorer link;
  - setup instructions;
  - environment variables;
  - how to verify a roll;
  - limitations;
  - testnet-only disclaimer.

## 5. Repo Structure

Use a monorepo-like structure:

```txt
.
├── apps/
│   └── web/
│       ├── src/
│       │   ├── app/
│       │   │   ├── App.tsx
│       │   │   ├── main.tsx
│       │   │   └── providers.tsx
│       │   ├── features/
│       │   │   ├── wallet/
│       │   │   ├── network/
│       │   │   ├── game/
│       │   │   ├── proof/
│       │   │   ├── leaderboard/
│       │   │   └── profile/
│       │   ├── shared/
│       │   │   ├── config/
│       │   │   ├── contracts/
│       │   │   ├── hooks/
│       │   │   ├── lib/
│       │   │   ├── ui/
│       │   │   └── utils/
│       │   ├── styles/
│       │   └── vite-env.d.ts
│       ├── public/
│       ├── index.html
│       ├── package.json
│       ├── vite.config.ts
│       ├── tsconfig.json
│       └── .env.example
├── packages/
│   └── contracts/
│       ├── src/
│       │   └── ProofRollArena.sol
│       ├── script/
│       │   └── Deploy.s.sol
│       ├── test/
│       │   └── ProofRollArena.t.sol
│       ├── foundry.toml
│       └── .env.example
├── supabase/
│   ├── migrations/
│   │   ├── 001_profiles.sql
│   │   ├── 002_roll_events.sql
│   │   └── 003_leaderboard.sql
│   └── functions/
│       └── sync-roll-event/
├── README.md
└── IMPLEMENTATION_PLAN.md
```

## 6. Setup Commands

### Root

```bash
mkdir proofroll-arena
cd proofroll-arena
git init
```

### Frontend

```bash
mkdir -p apps
cd apps
bun create vite web --template react-ts
cd web
bun install
bun add @rainbow-me/rainbowkit wagmi viem @tanstack/react-query @supabase/supabase-js
bun add clsx tailwind-merge lucide-react framer-motion
bun add -d tailwindcss postcss autoprefixer prettier eslint
bunx tailwindcss init -p
```

If shadcn/ui is used:

```bash
bunx shadcn@latest init
bunx shadcn@latest add button card badge alert dialog tabs input label skeleton toast
```

### Contracts

```bash
mkdir -p ../../packages
cd ../../packages
forge init contracts
cd contracts
forge install OpenZeppelin/openzeppelin-contracts
```

## 7. Environment Variables

### apps/web/.env.example

```bash
VITE_APP_NAME=ProofRoll Arena
VITE_CHAIN_ID=11155111
VITE_SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_KEY
VITE_WALLETCONNECT_PROJECT_ID=YOUR_PROJECT_ID
VITE_PROOFROLL_CONTRACT_ADDRESS=0x0000000000000000000000000000000000000000
VITE_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=YOUR_PUBLISHABLE_KEY
VITE_ETHERSCAN_BASE_URL=https://sepolia.etherscan.io
```

### packages/contracts/.env.example

```bash
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_KEY
PRIVATE_KEY=YOUR_TESTNET_DEPLOYER_PRIVATE_KEY
ETHERSCAN_API_KEY=YOUR_ETHERSCAN_API_KEY
```

Rules:

- Never commit `.env`.
- Never expose private key.
- Never expose Supabase service role / secret key in frontend.
- Use testnet deployer wallet only.

## 8. Smart Contract Design

File:

```txt
packages/contracts/src/ProofRollArena.sol
```

Contract responsibilities:

- allow a user to roll;
- compute a demo result;
- store latest stats;
- emit events;
- expose read functions for UI;
- avoid custody of any asset.

Suggested Solidity shape:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract ProofRollArena {
    struct PlayerStats {
        uint256 totalRolls;
        uint256 score;
        uint256 bestStreak;
        uint256 currentStreak;
        uint256 lastRollId;
    }

    struct Roll {
        uint256 id;
        address player;
        uint8 result;
        int256 scoreDelta;
        uint256 blockNumber;
        uint256 timestamp;
    }

    uint256 public totalRolls;

    mapping(address => PlayerStats) public playerStats;
    mapping(uint256 => Roll) public rolls;

    event RollResolved(
        uint256 indexed rollId,
        address indexed player,
        uint8 result,
        int256 scoreDelta,
        uint256 newScore,
        uint256 currentStreak,
        uint256 bestStreak
    );

    function roll() external returns (uint256 rollId) {
        // Implement demo-only deterministic randomness.
        // Must be clearly documented as not production-secure.
    }

    function getPlayerStats(address player) external view returns (PlayerStats memory) {
        return playerStats[player];
    }

    function getRoll(uint256 rollId_) external view returns (Roll memory) {
        return rolls[rollId_];
    }
}
```

Important:

- Do not add payable functions.
- Do not add token transfers.
- Do not add deposit/withdraw functions.
- Do not add payout logic.
- Do not pretend blockhash randomness is production-secure.

Recommended demo scoring:

```txt
result 1-2: scoreDelta = -1, currentStreak = 0
result 3-5: scoreDelta = +1, currentStreak += 1
result 6:   scoreDelta = +3, currentStreak += 1
```

This is a score system only. It has no monetary value.

## 9. Contract Tests

File:

```txt
packages/contracts/test/ProofRollArena.t.sol
```

Test cases:

- initial state is empty;
- user can roll;
- roll increments totalRolls;
- roll creates Roll record;
- roll updates PlayerStats;
- roll emits RollResolved event;
- multiple users have separate stats;
- score never represents withdrawable value;
- no payable/custody flow exists.

Run:

```bash
forge test -vvv
```

## 10. Contract Deployment

File:

```txt
packages/contracts/script/Deploy.s.sol
```

Deploy command:

```bash
forge script script/Deploy.s.sol:Deploy \
  --rpc-url $SEPOLIA_RPC_URL \
  --broadcast \
  --verify \
  --etherscan-api-key $ETHERSCAN_API_KEY
```

After deploy:

- copy contract address;
- update `apps/web/.env`;
- export ABI from Foundry artifact;
- place ABI into `apps/web/src/shared/contracts/proofRollArenaAbi.ts`.

## 11. Frontend Architecture

### Core Provider Tree

File:

```txt
apps/web/src/app/providers.tsx
```

Providers:

```txt
QueryClientProvider
WagmiProvider
RainbowKitProvider
Supabase provider/helper
App shell
```

### Feature Slices

Use feature-based structure.

```txt
features/wallet
- ConnectWalletButton.tsx
- WalletStatus.tsx
- useWalletStatus.ts

features/network
- NetworkGuard.tsx
- UnsupportedNetworkBanner.tsx
- SwitchNetworkButton.tsx

features/game
- GamePanel.tsx
- RollButton.tsx
- DiceVisual.tsx
- ResultCard.tsx
- PlayerStatsCard.tsx
- RecentRolls.tsx
- useRoll.ts
- usePlayerStats.ts

features/proof
- ProofPanel.tsx
- ExplorerLink.tsx
- ContractVerificationCard.tsx
- LatestEventCard.tsx

features/leaderboard
- LeaderboardTable.tsx
- LeaderboardCard.tsx
- useLeaderboard.ts

features/profile
- ProfileCard.tsx
- EditProfileDialog.tsx
- useProfile.ts
```

## 12. React 19+ Best Practices

Use:

- small components;
- composition over large container components;
- TypeScript-first domain types;
- strict props;
- controlled loading/error states;
- TanStack Query for async server/cache state;
- wagmi hooks for wallet and contract state;
- local state only for local UI concerns;
- `useActionState` only where it improves form-like interactions;
- `useOptimistic` only for safe UI hints, never for final blockchain result;
- `useTransition` for non-urgent UI transitions if needed.

Avoid:

- global store for everything;
- duplicated derived state;
- manually caching contract data outside query/cache layer;
- assuming a transaction succeeded before receipt confirmation;
- hiding contract or RPC errors;
- broad `any` types;
- optimistic final roll result.

## 13. Blockchain Frontend Flow

### Reading State

Use wagmi read hooks for:

- `totalRolls`;
- `playerStats(address)`;
- `rolls(id)`;
- optional recent roll reads by roll id.

### Writing State

Use viem or wagmi write flow:

1. validate wallet connected;
2. validate Sepolia;
3. simulate contract call;
4. ask wallet to sign/send transaction;
5. wait for receipt;
6. decode event from receipt;
7. update UI;
8. sync verified event to Supabase if implemented.

Pseudo-flow:

```ts
const simulation = await publicClient.simulateContract({
  address: proofRollAddress,
  abi: proofRollAbi,
  functionName: 'roll',
  account: address,
})

const hash = await walletClient.writeContract(simulation.request)
const receipt = await publicClient.waitForTransactionReceipt({ hash })
```

Never display final result before the receipt/event is available.

## 14. Transaction State Machine

Implement explicit transaction states:

```ts
type TxState =
  | { status: 'idle' }
  | { status: 'checking-wallet' }
  | { status: 'wrong-network' }
  | { status: 'simulating' }
  | { status: 'awaiting-signature' }
  | { status: 'rejected' }
  | { status: 'submitted'; hash: `0x${string}` }
  | { status: 'confirming'; hash: `0x${string}` }
  | { status: 'confirmed'; hash: `0x${string}`; rollId: bigint }
  | { status: 'failed'; message: string }
```

UI copy examples:

```txt
Connect wallet to start.
Switch to Sepolia to continue.
Check your wallet to confirm the transaction.
Transaction submitted. Waiting for confirmation.
Roll confirmed on-chain.
You rejected the transaction in your wallet.
The contract rejected this transaction.
RPC is unavailable. Try again later.
```

## 15. Supabase Database

Supabase is not trusted for game truth. It is a cache and product layer.

### 15.1 profiles table

Migration:

```sql
create table if not exists public.profiles (
  id uuid primary key default gen_random_uuid(),
  wallet_address text not null unique,
  username text,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

grant select on public.profiles to anon, authenticated;
grant insert, update on public.profiles to authenticated;

create policy "profiles are publicly readable"
  on public.profiles
  for select
  to anon, authenticated
  using (true);

-- If wallet-only auth is not implemented, keep profile writes server-side.
-- Do not allow arbitrary client writes unless wallet ownership is verified.
```

Implementation note:

If there is no wallet-sign-in auth, do not let users update any wallet profile freely from the browser. Either:

- keep profile editing out of MVP; or
- implement SIWE/wallet signature auth; or
- implement a Supabase Edge Function that verifies wallet signature before updating.

For 48 hours, profile editing can be optional.

### 15.2 roll_events_cache table

```sql
create table if not exists public.roll_events_cache (
  id uuid primary key default gen_random_uuid(),
  chain_id integer not null,
  contract_address text not null,
  tx_hash text not null unique,
  block_number bigint not null,
  roll_id numeric not null,
  wallet_address text not null,
  result integer not null,
  score_delta integer not null,
  new_score numeric not null,
  current_streak numeric not null,
  best_streak numeric not null,
  created_at timestamptz not null default now()
);

alter table public.roll_events_cache enable row level security;

grant select on public.roll_events_cache to anon, authenticated;

create policy "roll events are publicly readable"
  on public.roll_events_cache
  for select
  to anon, authenticated
  using (true);
```

Do not allow direct browser inserts unless the row is verified server-side.

### 15.3 leaderboard view

```sql
create or replace view public.leaderboard as
select
  lower(wallet_address) as wallet_address,
  max(new_score) as score,
  count(*) as total_rolls,
  max(best_streak) as best_streak,
  max(created_at) as updated_at
from public.roll_events_cache
group by lower(wallet_address)
order by score desc, best_streak desc, total_rolls asc;

grant select on public.leaderboard to anon, authenticated;
```

If Supabase requires additional grants for views, add them in migrations.

## 16. Supabase Edge Function: sync-roll-event

Optional but recommended.

Purpose:

- receive tx hash from frontend;
- fetch transaction receipt from Sepolia RPC;
- verify transaction was sent to the known contract;
- decode `RollResolved` event;
- insert/update `roll_events_cache`;
- return verified event data.

Input:

```json
{
  "txHash": "0x..."
}
```

Validation:

- tx hash format is valid;
- receipt exists;
- receipt status is success;
- receipt `to` equals known contract address;
- receipt has expected event signature;
- event decodes successfully;
- chain id is Sepolia;
- duplicate tx hash is ignored/upserted.

Security:

- Edge Function may use secret/service key.
- Secret/service key must never be exposed to browser.
- Function must not trust frontend-provided result values.
- Function must derive all game values from the transaction receipt/logs.

For MVP, if Edge Function is too slow to implement, skip Supabase event writes and read directly from contract/events in the frontend. Product polish matters, but correctness matters more.

## 17. UI Layout

### Home Page Sections

1. Hero
2. Wallet / Network status
3. Game panel
4. Proof panel
5. Leaderboard
6. How verification works
7. Footer disclaimer

### Hero Copy

```txt
ProofRoll Arena
A testnet-only on-chain game demo where every result is stored in a verified smart contract.
No real money. No real value. No wagering.
```

### Primary CTA States

```txt
Connect wallet
Switch to Sepolia
Roll on-chain
Waiting for wallet
Confirming transaction
Roll again
```

### Proof Panel Copy

```txt
Every roll is a Sepolia transaction.
The smart contract stores the result and emits an event.
You can inspect the verified contract source, transaction receipt, and event logs in the block explorer.
Supabase only caches public event data for faster UI and leaderboard rendering.
```

## 18. Visual Design Direction

Use a polished but restrained iGaming-inspired visual style without real gambling mechanics.

Design style:

- dark background;
- glass cards;
- high-contrast typography;
- gradient accents;
- animated dice / cube;
- clear proof/verification badges;
- mobile-first layout;
- obvious disabled states;
- readable error messages.

Avoid:

- aggressive gambling language;
- misleading payout language;
- “win money” copy;
- “deposit” / “withdraw” UI;
- fake balances that look like real money.

Suggested pages/components:

```txt
<AppShell>
  <Hero />
  <WalletStatusCard />
  <NetworkGuard />
  <GamePanel />
  <ProofPanel />
  <Leaderboard />
  <VerificationExplainer />
</AppShell>
```

## 19. Error Handling Matrix

Implement user-facing messages for these cases:

| Case | UI behavior |
|---|---|
| No wallet | Show connect CTA |
| Wrong network | Show switch network CTA |
| User rejects signature | Show neutral rejected message |
| RPC unavailable | Show retry message |
| Contract simulation fails | Show readable contract error |
| Transaction submitted | Show explorer link immediately |
| Transaction stuck | Keep confirmation state and show explorer link |
| Transaction failed | Show failed state and explorer link |
| Supabase unavailable | Game still works; leaderboard shows fallback |
| Contract address missing | Disable game and show config error |

## 20. Hooks to Implement

### useProofRollContract

Returns:

```ts
{
  address,
  abi,
  chainId,
  explorerContractUrl,
}
```

### usePlayerStats

Inputs:

```ts
address?: `0x${string}`
```

Returns:

```ts
{
  stats,
  isLoading,
  error,
  refetch,
}
```

### useRoll

Returns:

```ts
{
  roll,
  txState,
  latestRoll,
  reset,
}
```

Responsibilities:

- validate wallet;
- validate network;
- simulate contract;
- send transaction;
- wait for receipt;
- decode event;
- trigger Supabase sync if available;
- refetch player stats.

### useLeaderboard

Returns public leaderboard data from Supabase.

Fallback:

- if Supabase fails, show empty state and explain that on-chain game still works.

## 21. TypeScript Domain Types

Create:

```txt
apps/web/src/shared/types/game.ts
```

Types:

```ts
export type HexAddress = `0x${string}`
export type TxHash = `0x${string}`

export type PlayerStats = {
  totalRolls: bigint
  score: bigint
  bestStreak: bigint
  currentStreak: bigint
  lastRollId: bigint
}

export type RollEvent = {
  rollId: bigint
  player: HexAddress
  result: number
  scoreDelta: bigint
  newScore: bigint
  currentStreak: bigint
  bestStreak: bigint
  txHash: TxHash
  blockNumber: bigint
}
```

Rules:

- Keep blockchain numeric values as `bigint` until formatting.
- Format only at UI boundary.
- Do not use `number` for uint256 values.

## 22. Explorer Links

Create:

```txt
apps/web/src/shared/utils/explorer.ts
```

Functions:

```ts
export function getAddressUrl(address: string): string
export function getTxUrl(hash: string): string
export function getBlockUrl(blockNumber: bigint | number): string
```

Use Sepolia explorer base URL from env.

## 23. Contract ABI Management

After deploy, copy ABI to:

```txt
apps/web/src/shared/contracts/proofRollArenaAbi.ts
```

Export as const:

```ts
export const proofRollArenaAbi = [
  // ABI here
] as const
```

Also create:

```txt
apps/web/src/shared/contracts/addresses.ts
```

```ts
export const proofRollArenaAddress = import.meta.env.VITE_PROOFROLL_CONTRACT_ADDRESS as `0x${string}`
```

## 24. README Structure

Create README.md with:

```md
# ProofRoll Arena

## Public Demo

URL: ...

## Contract

Network: Sepolia  
Address: ...  
Explorer: ...

## What this is

Testnet-only verifiable on-chain game demo.

## What this is not

Not gambling. No real money. No real value. No deposits. No withdrawals. No payouts.

## Tech Stack

React 19+, Bun, Vite, TypeScript, wagmi, viem, Supabase, Solidity, Foundry.

## How to run

...

## How to verify a roll

1. Connect wallet.
2. Roll.
3. Open transaction link.
4. Check emitted RollResolved event.
5. Compare event values with UI.
6. Open verified contract source.

## Limitations

Demo randomness is not production-secure.
Supabase is only a cache.
Testnet only.
```

## 25. 48-Hour Execution Plan

### Phase 1: Project Skeleton

Tasks:

- create monorepo folders;
- create Vite React app;
- configure Bun scripts;
- configure Tailwind;
- configure basic UI kit;
- add lint/format scripts;
- create initial README.

Acceptance:

- `bun install` works;
- `bun run dev` works;
- home page renders;
- Tailwind works.

### Phase 2: Wallet and Network

Tasks:

- configure wagmi;
- configure RainbowKit;
- add Sepolia chain config;
- build connect wallet button;
- build network guard;
- add explorer URL helpers.

Acceptance:

- user can connect wallet;
- user sees address;
- user sees wrong network warning;
- user can switch to Sepolia.

### Phase 3: Contract

Tasks:

- create ProofRollArena contract;
- implement roll function;
- implement events;
- implement stats;
- write tests;
- deploy to Sepolia;
- verify contract;
- copy ABI/address to frontend.

Acceptance:

- `forge test` passes;
- contract deployed;
- contract verified;
- contract can be called from block explorer.

### Phase 4: Game Integration

Tasks:

- create contract read hooks;
- create roll write hook;
- simulate before write;
- wait for receipt;
- decode event;
- show result;
- show transaction lifecycle.

Acceptance:

- user can roll from UI;
- UI waits for confirmation;
- UI displays result from event;
- UI links to transaction.

### Phase 5: Supabase

Tasks:

- create Supabase project;
- add migrations;
- enable RLS;
- add public leaderboard read;
- optionally add Edge Function for tx verification;
- connect frontend leaderboard.

Acceptance:

- public leaderboard renders;
- Supabase keys are safe;
- no service role key in frontend;
- app works even if Supabase cache is unavailable.

### Phase 6: Polish

Tasks:

- improve visual design;
- add animations;
- add proof panel;
- add empty states;
- add error messages;
- add mobile layout;
- improve copy;
- test with a clean wallet.

Acceptance:

- app looks presentable on desktop and mobile;
- all states are understandable;
- demo can be completed without explanation.

### Phase 7: Deploy and Final QA

Tasks:

- deploy frontend;
- test public URL;
- test wallet connect;
- test Sepolia switch;
- test roll;
- test explorer links;
- test Supabase read;
- update README;
- record demo notes.

Acceptance:

- public URL works;
- fresh user can complete flow;
- README contains all links;
- no secrets are committed.

## 26. Package Scripts

### apps/web/package.json

Use scripts like:

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "preview": "vite preview",
    "lint": "eslint .",
    "format": "prettier --write .",
    "typecheck": "tsc --noEmit"
  }
}
```

### packages/contracts

Use Foundry commands:

```bash
forge build
forge test
forge fmt
forge script script/Deploy.s.sol:Deploy --rpc-url $SEPOLIA_RPC_URL --broadcast --verify
```

## 27. Quality Bar

Prioritize:

1. correctness;
2. verifiability;
3. transaction UX;
4. visual polish;
5. README clarity;
6. Supabase convenience.

Do not prioritize:

- complex backend;
- many games;
- real token mechanics;
- multi-chain;
- complex oracle integration;
- admin panel.

## 28. Implementation Rules for Codex

When implementing, follow these rules:

1. Keep the app testnet-only.
2. Do not add deposits, withdrawals, payouts, staking, or wagering.
3. Do not store any private key in code.
4. Do not expose Supabase secret/service role key in frontend.
5. Keep contract logic simple and verified.
6. Use TypeScript strict typing.
7. Do not use `any` unless there is a documented reason.
8. Do not hide blockchain errors.
9. Always show transaction hash after submission.
10. Always derive final game result from confirmed on-chain data.
11. Treat Supabase as cache only.
12. Write clear comments where trust boundaries exist.
13. Keep UI mobile-friendly.
14. Keep README updated as implementation changes.

## 29. Suggested Initial Codex Prompt

Use this prompt to start the implementation:

```txt
You are implementing a 48-hour polished demo called ProofRoll Arena.

Build a React 19+ + TypeScript + Vite + Bun frontend with wagmi, viem, RainbowKit, TanStack Query, Tailwind, shadcn/ui, and Supabase.

Build a Foundry Solidity contract called ProofRollArena on Sepolia. The contract must implement a testnet-only on-chain game result flow. It must not implement deposits, withdrawals, payouts, staking, wagering, or any real-value mechanism. It should store roll results, update player stats, and emit RollResolved events. Contract source must be verifiable on a block explorer.

Supabase is only for profiles, public verified event cache, and leaderboard. It must not be the source of truth. Enable RLS on every exposed table. Never expose service role or secret keys in frontend.

Follow the structure and acceptance criteria in IMPLEMENTATION_PLAN.md. Implement incrementally. After each phase, run typecheck/tests and update README.
```

## 30. Official Documentation References

Use these references while implementing:

- React: https://react.dev/
- React useActionState: https://react.dev/reference/react/useActionState
- Bun: https://bun.com/docs
- wagmi: https://wagmi.sh/
- viem simulateContract: https://viem.sh/docs/contract/simulateContract
- viem writeContract: https://viem.sh/docs/contract/writeContract
- Supabase RLS: https://supabase.com/docs/guides/database/postgres/row-level-security
- Supabase securing data: https://supabase.com/docs/guides/database/secure-data/
- Supabase API keys: https://supabase.com/docs/guides/getting-started/api-keys
- Foundry: https://getfoundry.sh/
- OpenZeppelin Contracts: https://docs.openzeppelin.com/contracts/
