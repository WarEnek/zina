import { useQuery } from '@tanstack/react-query'
import { supabase } from '../../shared/lib/supabase'

type LeaderboardRow = {
  wallet_address: string
  total_bakes: number
  common_count: number
  rare_count: number
  epic_count: number
  legendary_count: number
  mythic_count: number
}

export function useLeaderboard() {
  return useQuery({
    queryKey: ['cookie-leaderboard'],
    queryFn: async (): Promise<LeaderboardRow[]> => {
      if (!supabase) return []
      const { data, error } = await supabase
        .from('cookie_leaderboard')
        .select('wallet_address,total_bakes,common_count,rare_count,epic_count,legendary_count,mythic_count')
        .limit(20)
      if (error) throw error
      return data ?? []
    },
  })
}
