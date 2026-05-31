import { RollEvent } from '../../shared/types/game'

export function LatestEventCard({ latestRoll }: { latestRoll: RollEvent | null }) {
  if (!latestRoll) return <p className="text-sm text-white/70">No confirmed event yet.</p>
  return (
    <div className="rounded-xl border border-white/15 p-3 text-sm">
      <p>Event: rollId={latestRoll.rollId.toString()}</p>
      <p>result={latestRoll.result} scoreDelta={latestRoll.scoreDelta.toString()}</p>
      <p>newScore={latestRoll.newScore.toString()}</p>
    </div>
  )
}
