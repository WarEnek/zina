import { RollEvent } from '../../shared/types/game'

export function ResultCard({ latestRoll }: { latestRoll: RollEvent | null }) {
  if (!latestRoll) return null
  return (
    <div className="rounded-xl border border-white/15 p-3 text-sm">
      <p>Result: {latestRoll.result}</p>
      <p>Score delta: {latestRoll.scoreDelta.toString()}</p>
      <p>Roll id: {latestRoll.rollId.toString()}</p>
    </div>
  )
}
