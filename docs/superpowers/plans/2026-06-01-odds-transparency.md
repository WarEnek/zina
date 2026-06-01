# Odds Transparency Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn the odds transparency card into a production-ready product block with clear states, readable odds rows, and trustworthy metadata handling.

**Architecture:** Extract odds formatting and state derivation into a small pure helper so the UI can render consistent states without duplicating math or formatting logic. Keep the React card focused on fetching on-chain data and rendering the derived view model, with a clear empty/uninitialized state when the contract has not been configured.

**Tech Stack:** React 19, TypeScript, wagmi, Tailwind CSS, Bun test runner

---

### Task 1: Add odds presentation tests and helper contract

**Files:**
- Create: `apps/web/src/features/odds/oddsPresentation.test.ts`
- Create: `apps/web/src/features/odds/oddsPresentation.ts`

- [ ] **Step 1: Write the failing test**

```ts
import { describe, expect, test } from 'bun:test'
import { buildOddsPresentation } from './oddsPresentation'

test('treats all-zero odds as uninitialized', () => {
  const result = buildOddsPresentation({
    weights: [0, 0, 0, 0, 0, 0, 0, 0],
    oddsHash: null,
    oddsUpdatedAt: null,
  })

  expect(result.status).toBe('uninitialized')
  expect(result.summary).toBe('Odds feed is not initialized on this network')
  expect(result.rows[0]).toMatchObject({
    name: 'Vanilla Cookie',
    weight: 0,
    percentText: '0.00%',
  })
  expect(result.hashText).toBe('n/a')
  expect(result.updatedAtText).toBe('Unknown')
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd apps/web && bun test src/features/odds/oddsPresentation.test.ts`
Expected: FAIL because `buildOddsPresentation` does not exist yet.

- [ ] **Step 3: Write minimal implementation**

Implement the smallest pure helper that returns the status, rows, hash text, and updated-at text for the card.

- [ ] **Step 4: Run test to verify it passes**

Run: `cd apps/web && bun test src/features/odds/oddsPresentation.test.ts`
Expected: PASS with one passing test and no unexpected warnings.

### Task 2: Rebuild the odds card UI around the presentation model

**Files:**
- Modify: `apps/web/src/features/odds/OddsTransparencyCard.tsx`
- Modify: `apps/web/src/styles/index.css`

- [ ] **Step 1: Write the failing test**

Extend `apps/web/src/features/odds/oddsPresentation.test.ts` with a second case that checks non-zero weights produce percentage text and a configured status.

- [ ] **Step 2: Run test to verify it fails**

Run: `cd apps/web && bun test src/features/odds/oddsPresentation.test.ts`
Expected: FAIL until the helper handles the non-zero case.

- [ ] **Step 3: Write minimal implementation**

Render the card with:
- a top-line status chip
- a compact summary sentence
- an 8-row odds list with progress bars
- a metadata footer for hash and last update
- a clear empty state when the odds feed is not initialized

- [ ] **Step 4: Run test to verify it passes**

Run: `cd apps/web && bun test src/features/odds/oddsPresentation.test.ts`
Expected: PASS with both helper cases green.

### Task 3: Verify the app builds and the card reads cleanly

**Files:**
- Modify: any files changed in Tasks 1-2

- [ ] **Step 1: Run the build**

Run: `cd apps/web && bun run build`
Expected: exit 0.

- [ ] **Step 2: Review rendered output**

Open the local app and confirm the odds block no longer reads like raw zero-value placeholders, and that the status/metadata hierarchy feels product-ready on desktop and mobile.

- [ ] **Step 3: Commit the work**

Run:
```bash
git status --short
git add docs/superpowers/plans/2026-06-01-odds-transparency.md apps/web/src/features/odds/oddsPresentation.test.ts apps/web/src/features/odds/oddsPresentation.ts apps/web/src/features/odds/OddsTransparencyCard.tsx apps/web/src/styles/index.css
git commit -m "feat: polish odds transparency card"
```

