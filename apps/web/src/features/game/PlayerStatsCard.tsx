import { PlayerStats } from '../../shared/types/game'

export function PlayerStatsCard({ stats }: { stats: PlayerStats | undefined }) {
  return (
    <div className="grid grid-cols-2 gap-2 text-sm">
      <p>Total rolls: {stats?.totalRolls.toString() ?? '0'}</p>
      <p>Score: {stats?.score.toString() ?? '0'}</p>
      <p>Current streak: {stats?.currentStreak.toString() ?? '0'}</p>
      <p>Best streak: {stats?.bestStreak.toString() ?? '0'}</p>
    </div>
  )
}
