import { useLeaderboard } from './useLeaderboard'

export function LeaderboardTable() {
  const { data, isLoading, error } = useLeaderboard()
  if (isLoading) return <p className="text-sm text-slate-600">Loading cookie analytics...</p>
  if (error) {
    const code = (error as { code?: string } | null)?.code
    if (code === 'PGRST205') {
      return <p className="text-sm text-amber-700">Cookie analytics cache is not initialized in Supabase (missing schema migration).</p>
    }
    return <p className="text-sm text-amber-700">Supabase unavailable. On-chain baking still works.</p>
  }
  if (!data?.length) return <p className="text-sm text-slate-600">No cached cookie mints yet.</p>

  return (
    <table className="w-full text-left text-sm">
      <thead>
        <tr>
          <th>Wallet</th><th>Bakes</th><th>Epic+</th><th>Mythic</th>
        </tr>
      </thead>
      <tbody>
        {data.map((row) => (
          <tr key={row.wallet_address}>
            <td>{row.wallet_address.slice(0, 8)}...</td>
            <td>{row.total_bakes}</td>
            <td>{row.epic_count + row.legendary_count + row.mythic_count}</td>
            <td>{row.mythic_count}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
