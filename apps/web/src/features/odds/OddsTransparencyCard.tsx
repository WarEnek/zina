import { useMemo } from 'react'
import { AlertTriangle, Clock3, Hash, ShieldCheck, Sparkles } from 'lucide-react'
import { useReadContract } from 'wagmi'
import { COOKIE_CATALOG } from '../../shared/config/cookies'
import { cookieForgeAbi } from '../../shared/contracts/cookieForgeAbi'
import { cookieForgeAddress } from '../../shared/contracts/addresses'
import { buildOddsPresentation } from './oddsPresentation'

const RARITY_FILL_CLASSES = {
  Common: 'bg-gradient-to-r from-amber-400 to-orange-500',
  Rare: 'bg-gradient-to-r from-rose-400 to-pink-500',
  Epic: 'bg-gradient-to-r from-fuchsia-500 to-purple-600',
  Legendary: 'bg-gradient-to-r from-yellow-400 to-amber-500',
  Mythic: 'bg-gradient-to-r from-sky-400 to-blue-600',
} as const

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

  const presentation = useMemo(
    () =>
      buildOddsPresentation({
        weights: weightsQuery.data,
        oddsHash: hashQuery.data,
        oddsUpdatedAt: updatedAtQuery.data,
      }),
    [weightsQuery.data, hashQuery.data, updatedAtQuery.data],
  )

  const queryError = weightsQuery.error ?? hashQuery.error ?? updatedAtQuery.error
  const isLoading = weightsQuery.isLoading || hashQuery.isLoading || updatedAtQuery.isLoading
  const errorMessage = queryError instanceof Error ? queryError.message : 'Unable to load odds from chain.'

  return (
    <div className="card space-y-4">
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <ShieldCheck size={18} className="text-blue-700" />
            <h2 className="text-xl font-semibold">Transparent odds</h2>
          </div>
          <p className="max-w-2xl text-sm text-slate-600">{presentation.summary}</p>
        </div>
        <StatusBadge
          tone={queryError ? 'error' : isLoading ? 'loading' : presentation.status === 'ready' ? 'ready' : 'uninitialized'}
        />
      </div>

      {queryError ? (
        <div className="rounded-sm border border-red-200 bg-red-50 p-3 text-sm text-red-800">
          <div className="flex items-start gap-2">
            <AlertTriangle size={16} className="mt-0.5 shrink-0" />
            <p>{errorMessage}</p>
          </div>
        </div>
      ) : isLoading ? (
        <div className="space-y-3">
          {COOKIE_CATALOG.map((cookie) => (
            <div key={cookie.tokenId} className="space-y-2 rounded-sm border border-slate-200 bg-slate-50 p-3">
              <div className="flex items-center justify-between gap-3">
                <div className="h-4 w-32 rounded bg-slate-200" />
                <div className="h-3 w-16 rounded bg-slate-200" />
              </div>
              <div className="h-2 w-full rounded-full bg-slate-200" />
            </div>
          ))}
        </div>
      ) : (
        <>
          {presentation.status === 'uninitialized' ? (
            <div className="rounded-sm border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
              Odds feed has not been initialized on this network yet. Values below reflect the current on-chain default state.
            </div>
          ) : null}

          <div className="space-y-3">
            {presentation.rows.map((row, index) => {
              const cookie = COOKIE_CATALOG[index]
              const fillClass = RARITY_FILL_CLASSES[cookie.rarity]

              return (
                <div key={cookie.tokenId} className="rounded-sm border border-slate-200 bg-white p-3">
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <span className={`rarity-pill rarity-${cookie.rarity.toLowerCase()}`}>{cookie.rarity}</span>
                      <span className="font-medium text-slate-900">{row.name}</span>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-semibold text-slate-900">{row.weight.toLocaleString()}</div>
                      <div className="text-xs text-slate-500">{row.percentText}</div>
                    </div>
                  </div>

                  <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className={`h-full rounded-full ${fillClass}`}
                      style={{ width: `${Math.max(0, Math.min(100, row.percentValue))}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>

          <div className="grid gap-3 border-t border-slate-200 pt-3 sm:grid-cols-2">
            <MetaItem icon={Hash} label="Odds hash" value={presentation.hashText} title={hashQuery.data ?? undefined} />
            <MetaItem icon={Clock3} label="Last update" value={presentation.updatedAtText} />
          </div>

          <p className="flex items-center gap-2 border-t border-slate-200 pt-3 text-xs text-slate-500">
            <Sparkles size={14} />
            The odds digest is derived directly from on-chain contract state. No off-chain overrides.
          </p>
        </>
      )}
    </div>
  )
}

function StatusBadge({ tone }: { tone: 'ready' | 'uninitialized' | 'loading' | 'error' }) {
  const label =
    tone === 'ready'
      ? 'Live'
      : tone === 'uninitialized'
        ? 'Not initialized'
        : tone === 'loading'
          ? 'Loading'
          : 'Error'

  const toneClass =
    tone === 'ready'
      ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
      : tone === 'uninitialized'
        ? 'border-amber-200 bg-amber-50 text-amber-800'
        : tone === 'loading'
          ? 'border-slate-200 bg-slate-50 text-slate-700'
          : 'border-red-200 bg-red-50 text-red-800'

  return <span className={`flat-chip whitespace-nowrap normal-case tracking-normal ${toneClass}`}>{label}</span>
}

function MetaItem({
  icon: Icon,
  label,
  value,
  title,
}: {
  icon: typeof Hash
  label: string
  value: string
  title?: string
}) {
  return (
    <div className="rounded-sm border border-slate-200 bg-slate-50 p-3">
      <div className="mb-1 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">
        <Icon size={14} />
        <span>{label}</span>
      </div>
      <p className="break-words font-mono text-sm text-slate-800" title={title}>
        {value}
      </p>
    </div>
  )
}
