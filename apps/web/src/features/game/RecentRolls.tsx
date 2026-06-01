import { BakeEvent } from '../../shared/types/game'

export function RecentRolls({ latestRoll }: { latestRoll: BakeEvent | null }) {
  return (
    <div className="text-sm text-slate-600">
      {latestRoll
        ? `Latest bake #${latestRoll.requestId.toString()} minted token ${latestRoll.tokenId.toString()}`
        : 'No cookie bakes yet.'}
    </div>
  )
}
