import { useQuery } from '@tanstack/react-query'
import { supabase } from '../../shared/lib/supabase'

type LeaderboardRow = {
  wallet_address: string
  score: number
  total_rolls: number
  best_streak: number
}

export function useLeaderboard() {
  return useQuery({
    queryKey: ['leaderboard'],
    queryFn: async (): Promise<LeaderboardRow[]> => {
      if (!supabase) return []
      const { data, error } = await supabase
        .from('leaderboard')
        .select('wallet_address,score,total_rolls,best_streak')
        .limit(20)
      if (error) throw error
      return data ?? []
    },
  })
}
