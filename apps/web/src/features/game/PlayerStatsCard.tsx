import { PlayerStats } from '../../shared/types/game'

export function PlayerStatsCard({ stats }: { stats: PlayerStats | undefined }) {
  return (
    <div className="grid grid-cols-2 gap-2 text-sm">
      <p>Total bakes: {stats?.totalBakes.toString() ?? '0'}</p>
      <p>Last request: {stats?.lastRequestId.toString() ?? '0'}</p>
      <p>Common: {stats?.commonCount.toString() ?? '0'}</p>
      <p>Rare: {stats?.rareCount.toString() ?? '0'}</p>
      <p>Epic: {stats?.epicCount.toString() ?? '0'}</p>
      <p>Legendary+: {((stats?.legendaryCount ?? 0n) + (stats?.mythicCount ?? 0n)).toString()}</p>
    </div>
  )
}
