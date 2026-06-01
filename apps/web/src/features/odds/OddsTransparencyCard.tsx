import { useReadContract } from 'wagmi'
import { cookieForgeAbi } from '../../shared/contracts/cookieForgeAbi'
import { cookieForgeAddress } from '../../shared/contracts/addresses'
import { COOKIE_CATALOG } from '../../shared/config/cookies'

export function OddsTransparencyCard() {
  const weightsQuery = useReadContract({
    address: cookieForgeAddress,
    abi: cookieForgeAbi,
    functionName: 'getWeights',
  })

  const hashQuery = useReadContract({
    address: cookieForgeAddress,
    abi: cookieForgeAbi,
    functionName: 'oddsHash',
  })

  const updatedAtQuery = useReadContract({
    address: cookieForgeAddress,
    abi: cookieForgeAbi,
    functionName: 'oddsUpdatedAt',
  })

  const weights = weightsQuery.data
  const totalWeight = weights ? weights.reduce((acc, v) => acc + Number(v), 0) : 0

  const updatedAtText = updatedAtQuery.data
    ? new Date(Number(updatedAtQuery.data) * 1000).toLocaleString()
    : 'Unknown'

  return (
    <div className="card space-y-3">
      <h2 className="text-xl font-semibold">Transparent odds</h2>
      {weightsQuery.isLoading ? <p className="text-sm text-slate-600">Loading odds from chain...</p> : null}

      <div className="space-y-1 text-sm">
        {COOKIE_CATALOG.map((cookie, index) => {
          const weight = weights ? Number(weights[index]) : 0
          const pct = totalWeight > 0 ? ((weight / totalWeight) * 100).toFixed(2) : '0.00'
          return (
            <p key={cookie.tokenId}>
              {cookie.name}: {weight} weight ({pct}%)
            </p>
          )
        })}
      </div>

      <div className="text-xs text-slate-600">
        <p>Odds hash: {hashQuery.data ?? 'n/a'}</p>
        <p>Last odds update: {updatedAtText}</p>
      </div>
    </div>
  )
}
