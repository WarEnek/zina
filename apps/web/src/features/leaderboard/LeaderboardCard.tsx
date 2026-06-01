import { LeaderboardTable } from './LeaderboardTable'

export function LeaderboardCard() {
  return (
    <div className="card">
      <h2 className="text-xl font-semibold">Cookie analytics cache</h2>
      <LeaderboardTable />
    </div>
  )
}
