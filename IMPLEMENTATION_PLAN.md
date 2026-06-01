# Implementation Plan: Cookie Forge (Bake-to-Reveal Cookie Collectibles)

## 0. Product Goal

Build a polished web3 collectible demo where users mint randomized cookie collectibles using verifiable randomness and can audit every step on-chain.

Primary product statement:

> A web3 collectible cookie-opening experience with transparent on-chain history, verifiable randomness, inventory, rarity analytics and animated reveals.

This is a collectible minting experience, not a gambling or payout product.

## 1. Safety and Product Constraints (Non-Gambling)

Hard constraints:

- testnet only;
- no real-money deposits;
- no withdrawals;
- no payout mechanics;
- no cash-equivalent rewards;
- no wagering language in UI;
- no “casino” framing.

Allowed:

- wallet connection;
- Bake transaction to mint collectible cookie tokens;
- ERC-1155 inventory;
- verifiable randomness flow;
- transparent transaction/event history;
- analytics of rarity outcomes;
- optional free daily bakes or non-monetary `crumbs`.

Required UI positioning:

> Cookie collectible minting demo. No real money. No wagering. Testnet only.

## 2. Naming and UX Language

Use terms:

- `Bake Cookie`
- `Cookie Minting`
- `Bake-to-Reveal`
- `Mystery Cookie Jar`
- `On-chain Cookie Reveal`

Avoid terms:

- lootbox
- slot
- jackpot
- winnings
- gamble

## 3. Rarity and Cookie Catalog

Initial rarity map:

- Common: Vanilla Cookie
- Common: Oat Cookie
- Rare: Chocolate Cookie
- Rare: Strawberry Cookie
- Epic: Lava Cookie
- Epic: Macaron Cookie
- Legendary: Golden Cookie
- Mythic: Cosmic Cookie

Initial rarity weights (example, configurable on-chain):

- Vanilla Cookie: 4000
- Chocolate Cookie: 2500
- Strawberry Cookie: 1500
- Lava Cookie: 700
- Golden Cookie: 250
- Cosmic Cookie: 50

Note: if Oat and Macaron are included in weights, update table and displayed probabilities so total weight is explicit and consistent in both contract and UI.

## 4. Web3 Architecture

Recommended chain + standards:

- EVM testnet (Sepolia preferred);
- Solidity + Foundry;
- ERC-1155 for multi-token cookie types;
- OpenZeppelin base contracts;
- VRF-based verifiable randomness (e.g., Chainlink VRF model).

Bake flow:

1. User clicks `Bake Cookie`.
2. Frontend submits transaction to contract.
3. Contract emits `CookieBakeRequested(user, requestId)`.
4. VRF request is fulfilled.
5. Contract resolves rarity + cookie type from random value and weights.
6. Contract mints ERC-1155 token(s) to user inventory.
7. Contract emits mint/resolution events.
8. UI reveal animation runs after confirmed result.
9. Transparency panel shows all proof artifacts.

## 5. Smart Contract Scope (MVP)

Core contract responsibilities:

- maintain cookie type definitions (token ids, rarity tiers, metadata refs);
- maintain weighted odds config;
- store odds hash and odds last-updated timestamp;
- request and consume verifiable randomness;
- mint ERC-1155 collectible token on resolution;
- expose read methods for odds, rarity map, counters, and user stats;
- emit auditable events.

Recommended events:

```solidity
event CookieBakeRequested(address indexed user, uint256 indexed requestId);
event CookieMinted(
    address indexed user,
    uint256 indexed tokenId,
    uint8 rarity,
    uint256 randomValue,
    uint256 requestId
);
event OddsUpdated(bytes32 oldHash, bytes32 newHash, uint256 updatedAt);
```

Minimum read methods:

- `getOdds()` / `getWeights()`
- `getOddsHash()`
- `getCookieInfo(tokenId)`
- `getTotalBakes()`
- `getRarityMintCounts()`
- `getUserBakeCount(user)`

Admin controls (limited):

- update odds table;
- emit odds hash update;
- pause/unpause bake if needed.

## 6. Frontend Product Surfaces

### Screen 1: Cookie Oven

- central oven or cookie jar visual;
- primary CTA `Bake Cookie`;
- wallet + network state;
- available free bakes or `crumbs` balance;
- pending transaction states (wallet confirmation, submitting, mining).

Animation sequence:

- oven closes;
- warm glow + crumbs particles;
- `Baking...` timer;
- slight camera shake;
- cookie lands on tray;
- reveal card transition.

### Screen 2: Reveal

Rarity-based reveal treatment:

- Common: soft pop-up;
- Rare: glaze sparkle + smooth scale;
- Epic: cookie crack/open filling reveal;
- Legendary: gold dust + strong glow + short slow-motion;
- Mythic: cosmic particles + brief flash.

### Screen 3: Cookie Collection

- grid of all cookie types;
- owned cookies in full color;
- unowned as silhouettes;
- rarity filters;
- per-item details: token id, rarity, obtained date, tx hash.

### Screen 4: Transparency Panel

Display per bake:

- bake tx hash;
- randomness request id;
- VRF fulfillment tx hash;
- minted cookie token id;
- rarity;
- declared probability/weight;
- minted-to address;
- timestamp.

Also show:

- current odds hash;
- last odds update time;
- contract address + verified explorer links.

## 7. Analytics Scope

Analytics panel must include:

- total cookies baked;
- rarity distribution counts;
- realized drop rates (%);
- expected vs realized comparison;
- latest 20 mint events.

Data source priority:

1. on-chain events/state (truth);
2. indexed cache for speed (optional).

## 8. Optional Baker’s Luck Meter (Pity)

If included, define transparent rules:

- pity only boosts chance for Epic+ after a documented dry streak;
- rules are published in UI and contract docs;
- state transitions are logged on-chain (or derivable from events);
- no manipulative timers or pay-to-reset behavior.

If timeline is tight, exclude pity from MVP and leave as phase-2 feature.

## 9. Tech Stack

Frontend:

- Next.js or React + Vite;
- TypeScript;
- Tailwind CSS;
- Framer Motion;
- wagmi + viem;
- RainbowKit;
- Recharts or Chart.js for analytics.

Contracts:

- Solidity;
- Foundry;
- OpenZeppelin ERC-1155;
- VRF consumer integration;
- test suite for minting, odds math, event emission, admin updates.

Backend (optional for demo quality):

- Supabase/Postgres for event indexing cache;
- metadata/image API for cookie art;
- leaderboard or activity feed.

## 10. MVP Acceptance Criteria

Wallet and network:

- connect wallet;
- enforce supported testnet;
- clear unsupported-network UI.

Bake and mint flow:

- user can trigger bake transaction;
- all pending/success/error states handled;
- confirmed bake resolves into minted ERC-1155 cookie collectible.

Transparency:

- show tx hashes and explorer links;
- show request id and fulfillment reference;
- show token id, rarity, probability/weight;
- show odds hash and update timestamp.

Collection and analytics:

- inventory reflects owned quantities per token type;
- rarity filters work;
- analytics shows expected vs realized distribution;
- latest mint activity is visible.

Safety/disclaimer:

- clear non-gambling messaging in app and README;
- no deposit/withdraw or real-value flows.

## 11. Implementation Phases

Phase 1 (Contract foundation):

- ERC-1155 cookie schema;
- odds storage + hash;
- bake request + randomness fulfillment + mint;
- event model;
- Foundry tests.

Phase 2 (Core frontend):

- wallet/network integration;
- oven screen + bake CTA;
- reveal flow;
- collection grid.

Phase 3 (Transparency + analytics):

- proof panel with tx/request/mint chain;
- odds panel + hash;
- rarity analytics and recent events.

Phase 4 (Polish + deploy):

- animation refinement;
- mobile UX;
- testnet deploy + contract verification;
- README finalization with proof walkthrough.

## 12. README Requirements

README must include:

- product framing as collectible minting;
- explicit non-gambling disclaimer;
- public testnet URL;
- contract address + verified explorer links;
- bake-to-reveal flow description;
- transparency panel explanation;
- odds table + odds hash explanation;
- local setup and env vars;
- known limitations and future improvements.

## 13. Visual Direction

Design targets:

- warm background palette;
- soft shadows and tactile cards;
- crumb particles as feedback;
- glaze color as rarity indicator;
- oven/jar as central scene object.

Avoid:

- casino motifs;
- chip/slot/jackpot visuals;
- aggressive “win” language;
- overlong animations that block interaction.

Suggested rarity colors:

- Common: cream/beige
- Rare: chocolate brown / berry pink
- Epic: premium glaze accent
- Legendary: warm gold glow
- Mythic: deep cookie base + cosmic sprinkles
