import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { useEffect, useMemo, useState } from 'react'
import { BakeEvent, TxState } from '../../shared/types/game'
import { getCookieMetaByTokenId, getRarityByIndex } from '../../shared/config/cookies'

type RevealPhase = 'drop' | 'flip' | 'revealed'

export function ResultCard({ latestBake, txStatus }: { latestBake: BakeEvent | null; txStatus?: TxState['status'] }) {
  const prefersReducedMotion = useReducedMotion()
  const [phase, setPhase] = useState<RevealPhase>('revealed')

  const rarity = useMemo(() => (latestBake ? getRarityByIndex(latestBake.rarity) : null), [latestBake])
  const cookieMeta = useMemo(
    () => (latestBake ? getCookieMetaByTokenId(Number(latestBake.tokenId)) : null),
    [latestBake]
  )

  useEffect(() => {
    if (!latestBake) return
    if (prefersReducedMotion) {
      setPhase('revealed')
      return
    }

    setPhase('drop')
    const flipTimer = window.setTimeout(() => setPhase('flip'), 680)
    const revealedTimer = window.setTimeout(() => setPhase('revealed'), 1320)

    return () => {
      window.clearTimeout(flipTimer)
      window.clearTimeout(revealedTimer)
    }
  }, [latestBake?.requestId, prefersReducedMotion])

  if (!latestBake) return null

  const revealKey = latestBake.requestId.toString()
  const revealReady = phase === 'revealed'
  const isMinting = txStatus === 'simulating' || txStatus === 'awaiting-signature' || txStatus === 'submitted' || txStatus === 'confirming'
  const rarityClass = `loot-rarity-${String(rarity).toLowerCase()}`
  const cookieName = cookieMeta?.name ?? `Token ${latestBake.tokenId.toString()}`

  return (
    <div className="rounded-sm border border-slate-300 p-3">
      <div className="mb-2 flex items-center justify-between">
        <p className="text-sm font-semibold">Reward reveal</p>
        <span className={`rarity-pill rarity-${String(rarity).toLowerCase()}`}>{rarity}</span>
      </div>
      <div className={`loot-scene ${isMinting ? 'loot-scene-pending' : ''}`}>
        <AnimatePresence mode="wait">
          <motion.div
            key={revealKey}
            className="loot-card-shell"
            initial={prefersReducedMotion ? false : { y: -220, rotate: -18, scale: 0.68, opacity: 0 }}
            animate={
              prefersReducedMotion
                ? { y: 0, rotate: 0, scale: 1, opacity: 1 }
                : phase === 'drop'
                  ? { y: 8, rotate: 3, scale: 1, opacity: 1 }
                  : { y: 0, rotate: 0, scale: 1, opacity: 1 }
            }
            transition={{
              duration: prefersReducedMotion ? 0.15 : 0.65,
              ease: [0.18, 0.88, 0.24, 0.98],
            }}
          >
            <motion.div
              className="loot-card-flip"
              initial={false}
              animate={{ rotateY: prefersReducedMotion || revealReady ? 180 : 0 }}
              transition={{ duration: prefersReducedMotion ? 0 : 0.56, ease: [0.2, 0.82, 0.2, 1] }}
            >
              <div className="loot-face loot-card-back">
                <p className="loot-back-title">Cookie Forge</p>
                <p className="loot-back-subtitle">Mystery Drop</p>
              </div>

              <div className={`loot-face loot-card-front ${rarityClass}`}>
                <motion.p
                  initial={false}
                  animate={{
                    letterSpacing: revealReady ? '0.06em' : '0.24em',
                    opacity: revealReady ? 1 : 0.6,
                  }}
                  transition={{ duration: 0.42, ease: 'easeOut' }}
                  className="loot-rarity-label"
                >
                  {rarity}
                </motion.p>
                <p className="loot-cookie-name">{cookieName}</p>
                <p className="loot-cookie-id">ID #{latestBake.tokenId.toString()}</p>
              </div>
            </motion.div>
          </motion.div>
        </AnimatePresence>

        {!prefersReducedMotion ? (
          <>
            <motion.span
              className="loot-spark loot-spark-1"
              animate={{ opacity: [0, 0.9, 0], scale: [0.4, 1.4, 0.7] }}
              transition={{ duration: 1.3, repeat: Infinity, ease: 'easeInOut' }}
            />
            <motion.span
              className="loot-spark loot-spark-2"
              animate={{ opacity: [0.1, 0.95, 0.1], scale: [0.5, 1.15, 0.5] }}
              transition={{ duration: 1.45, repeat: Infinity, ease: 'easeInOut', delay: 0.28 }}
            />
            <motion.span
              className="loot-spark loot-spark-3"
              animate={{ opacity: [0, 0.8, 0], scale: [0.35, 1.25, 0.55] }}
              transition={{ duration: 1.22, repeat: Infinity, ease: 'easeInOut', delay: 0.54 }}
            />
          </>
        ) : null}
      </div>
      <div className="mt-3 space-y-1 text-sm">
        <p>Cookie: {cookieName}</p>
        <p>Cookie token id: {latestBake.tokenId.toString()}</p>
        <p>Request id: {latestBake.requestId.toString()}</p>
      </div>
    </div>
  )
}
