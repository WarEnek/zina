import { COOKIE_CATALOG } from '../../shared/config/cookies'

type OddsWeight = number | bigint

export type OddsPresentationInput = {
  weights: readonly OddsWeight[] | null | undefined
  oddsHash: string | null | undefined
  oddsUpdatedAt: OddsWeight | null | undefined
}

export type OddsRowPresentation = {
  name: string
  weight: number
  percentValue: number
  percentText: string
}

export type OddsPresentation = {
  status: 'ready' | 'uninitialized'
  summary: string
  rows: OddsRowPresentation[]
  hashText: string
  updatedAtText: string
}

export function buildOddsPresentation(input: OddsPresentationInput): OddsPresentation {
  const weights = COOKIE_CATALOG.map((_, index) => Number(input.weights?.[index] ?? 0))
  const totalWeight = weights.reduce((acc, value) => acc + value, 0)
  const isInitialized = totalWeight > 0

  return {
    status: isInitialized ? 'ready' : 'uninitialized',
    summary: isInitialized
      ? 'Odds feed is live on this network'
      : 'Odds feed is not initialized on this network',
    rows: COOKIE_CATALOG.map((cookie, index) => {
      const weight = weights[index] ?? 0
      const percentValue = totalWeight > 0 ? (weight / totalWeight) * 100 : 0

      return {
        name: cookie.name,
        weight,
        percentValue,
        percentText: `${percentValue.toFixed(2)}%`,
      }
    }),
    hashText: formatOddsHash(input.oddsHash),
    updatedAtText: formatOddsUpdatedAt(input.oddsUpdatedAt),
  }
}

function formatOddsHash(hash: string | null | undefined): string {
  if (!hash) return 'n/a'
  if (hash.length <= 16) return hash

  return `${hash.slice(0, 10)}…${hash.slice(-4)}`
}

function formatOddsUpdatedAt(timestamp: OddsWeight | null | undefined): string {
  if (timestamp == null) return 'Unknown'

  const date = new Date(Number(timestamp) * 1000)
  const formatted = new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
    timeZone: 'UTC',
  }).format(date)

  return `${formatted} UTC`
}
