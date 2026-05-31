import { RollEvent } from '../../shared/types/game'

export function RecentRolls({ latestRoll }: { latestRoll: RollEvent | null }) {
  return (
    <div className="text-sm text-white/70">
      {latestRoll ? `Recent roll #${latestRoll.rollId.toString()} result ${latestRoll.result}` : 'No rolls yet.'}
    </div>
  )
}
