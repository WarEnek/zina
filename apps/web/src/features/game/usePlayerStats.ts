import { useReadContract } from 'wagmi'
import { cookieForgeAbi } from '../../shared/contracts/cookieForgeAbi'
import { cookieForgeAddress } from '../../shared/contracts/addresses'
import { HexAddress, PlayerStats } from '../../shared/types/game'

export function usePlayerStats(address?: HexAddress) {
  const query = useReadContract({
    address: cookieForgeAddress,
    abi: cookieForgeAbi,
    functionName: 'playerStats',
    args: address ? [address] : undefined,
    query: { enabled: Boolean(address) },
  })

  const raw = query.data
  const stats: PlayerStats | undefined = raw
    ? {
        totalBakes: raw[0],
        commonCount: raw[1],
        rareCount: raw[2],
        epicCount: raw[3],
        legendaryCount: raw[4],
        mythicCount: raw[5],
        lastRequestId: raw[6],
      }
    : undefined

  return {
    stats,
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  }
}
