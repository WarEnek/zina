import { useLeaderboard } from './useLeaderboard'

export function LeaderboardTable() {
  const { data, isLoading, error } = useLeaderboard()
  if (isLoading) return <p className="text-sm text-white/70">Loading leaderboard...</p>
  if (error) return <p className="text-sm text-yellow-300">Supabase unavailable. On-chain game still works.</p>
  if (!data?.length) return <p className="text-sm text-white/70">No cached events yet.</p>

  return (
    <table className="w-full text-left text-sm">
      <thead>
        <tr>
          <th>Wallet</th><th>Score</th><th>Rolls</th><th>Best streak</th>
        </tr>
      </thead>
      <tbody>
        {data.map((row) => (
          <tr key={row.wallet_address}>
            <td>{row.wallet_address.slice(0, 8)}...</td>
            <td>{row.score}</td>
            <td>{row.total_rolls}</td>
            <td>{row.best_streak}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
