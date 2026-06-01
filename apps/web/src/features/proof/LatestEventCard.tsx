import { useMemo } from 'react'
import { useReadContract } from 'wagmi'
import { BakeEvent } from '../../shared/types/game'
import { getCookieMetaByTokenId, getRarityByIndex } from '../../shared/config/cookies'
import { cookieForgeAbi } from '../../shared/contracts/cookieForgeAbi'
import { cookieForgeAddress } from '../../shared/contracts/addresses'

export function LatestEventCard({ latestBake }: { latestBake: BakeEvent | null }) {
  const weightsQuery = useReadContract({
    address: cookieForgeAddress,
    abi: cookieForgeAbi,
    functionName: 'getWeights',
    query: { enabled: Boolean(latestBake) },
  })

  if (!latestBake) return <p className="text-sm text-slate-600">No confirmed bake event yet.</p>

  const rarity = getRarityByIndex(latestBake.rarity)
  const cookieMeta = getCookieMetaByTokenId(Number(latestBake.tokenId))

  const declaredProbability = useMemo(() => {
    const weights = weightsQuery.data
    if (!weights) return 'n/a'

    const totalWeight = weights.reduce((acc, value) => acc + Number(value), 0)
    const idx = Number(latestBake.tokenId) - 1
    const tokenWeight = idx >= 0 && idx < weights.length ? Number(weights[idx]) : 0
    if (totalWeight <= 0) return 'n/a'

    return `${((tokenWeight / totalWeight) * 100).toFixed(2)}%`
  }, [latestBake.tokenId, weightsQuery.data])

  return (
    <div className="rounded-sm border border-slate-300 p-3 text-sm">
      <p>Bake request id: {latestBake.requestId.toString()}</p>
      <p>Minted to: {latestBake.player}</p>
      <p>Cookie: {cookieMeta?.name ?? `Token ${latestBake.tokenId.toString()}`}</p>
      <p>Cookie token id: {latestBake.tokenId.toString()}</p>
      <p>
        Rarity: <span className={`rarity-pill rarity-${String(rarity).toLowerCase()}`}>{rarity}</span>
      </p>
      <p>Declared probability: {declaredProbability}</p>
      <p>Random value: {latestBake.randomValue.toString()}</p>
    </div>
  )
}
