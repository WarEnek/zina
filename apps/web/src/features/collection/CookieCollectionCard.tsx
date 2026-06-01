import { useMemo, useState } from 'react'
import { useAccount, useReadContracts } from 'wagmi'
import { cookieForgeAbi } from '../../shared/contracts/cookieForgeAbi'
import { cookieForgeAddress } from '../../shared/contracts/addresses'
import { COOKIE_CATALOG, RARITY_ORDER, type CookieRarity } from '../../shared/config/cookies'

export function CookieCollectionCard() {
  const { address } = useAccount()
  const [rarityFilter, setRarityFilter] = useState<CookieRarity | 'All'>('All')

  const contracts = useMemo(
    () =>
      address
        ? COOKIE_CATALOG.map((cookie) => ({
            address: cookieForgeAddress,
            abi: cookieForgeAbi,
            functionName: 'balanceOf' as const,
            args: [address, BigInt(cookie.tokenId)] as const,
          }))
        : [],
    [address]
  )

  const balancesQuery = useReadContracts({
    contracts,
    query: { enabled: Boolean(address) },
  })

  const entries = COOKIE_CATALOG.map((cookie, index) => {
    const balance = balancesQuery.data?.[index]?.result ?? 0n
    return {
      ...cookie,
      balance,
      owned: balance > 0n,
    }
  }).filter((item) => rarityFilter === 'All' || item.rarity === rarityFilter)

  return (
    <div className="card space-y-3">
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-xl font-semibold">Cookie collection</h2>
        <select
          className="border border-slate-300 bg-white px-2 py-1 text-sm"
          value={rarityFilter}
          onChange={(e) => setRarityFilter(e.target.value as CookieRarity | 'All')}
        >
          <option value="All">All rarities</option>
          {RARITY_ORDER.map((rarity) => (
            <option key={rarity} value={rarity}>
              {rarity}
            </option>
          ))}
        </select>
      </div>

      {!address ? <p className="text-sm text-slate-600">Connect wallet to load inventory.</p> : null}
      {address && balancesQuery.isLoading ? <p className="text-sm text-slate-600">Loading collection...</p> : null}

      <div className="grid gap-2 sm:grid-cols-2">
        {entries.map((item) => (
          <div key={item.tokenId} className={`border p-3 text-sm ${item.owned ? 'border-slate-300 bg-white' : 'border-slate-200 bg-slate-50 text-slate-400'}`}>
            <p className="font-semibold">{item.owned ? item.name : 'Unknown cookie silhouette'}</p>
            <p>
              Rarity: <span className={`rarity-pill rarity-${item.rarity.toLowerCase()}`}>{item.rarity}</span>
            </p>
            <p>Token id: {item.tokenId}</p>
            <p>Owned: {item.balance.toString()}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
