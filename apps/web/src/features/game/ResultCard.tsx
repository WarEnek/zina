import { lazy, Suspense, useMemo } from 'react'
import { useReducedMotion } from 'framer-motion'
import { BakeEvent, TxState } from '../../shared/types/game'
import { getCookieMetaByTokenId, getRarityByIndex } from '../../shared/config/cookies'

const LazyThreeCardReveal = lazy(async () => {
  const module = await import('./ThreeCardReveal')
  return { default: module.ThreeCardReveal }
})

export function ResultCard({ latestBake, txStatus }: { latestBake: BakeEvent | null; txStatus?: TxState['status'] }) {
  const prefersReducedMotion = useReducedMotion()

  if (!latestBake) return null

  const rarity = getRarityByIndex(latestBake.rarity)
  const cookieMeta = getCookieMetaByTokenId(Number(latestBake.tokenId))
  const isMinting = txStatus === 'simulating' || txStatus === 'awaiting-signature' || txStatus === 'submitted' || txStatus === 'confirming'
  const cookieName = cookieMeta?.name ?? `Token ${latestBake.tokenId.toString()}`
  const revealKey = useMemo(() => latestBake.requestId.toString(), [latestBake.requestId])

  return (
    <div className="rounded-sm border border-slate-300 p-3">
      <div className="mb-2 flex items-center justify-between">
        <p className="text-sm font-semibold">Reward reveal</p>
        <span className={`rarity-pill rarity-${String(rarity).toLowerCase()}`}>{rarity}</span>
      </div>

      <Suspense fallback={<div className="three-loot-scene three-loot-scene-pending" />}>
        <LazyThreeCardReveal
          key={revealKey}
          revealId={revealKey}
          rarity={String(rarity)}
          cookieName={cookieName}
          tokenId={latestBake.tokenId.toString()}
          isMinting={isMinting}
          reducedMotion={Boolean(prefersReducedMotion)}
        />
      </Suspense>

      <div className="mt-3 space-y-1 text-sm">
        <p>Cookie: {cookieName}</p>
        <p>Cookie token id: {latestBake.tokenId.toString()}</p>
        <p>Request id: {latestBake.requestId.toString()}</p>
      </div>
    </div>
  )
}
