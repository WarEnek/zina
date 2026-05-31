import { useReadContract } from 'wagmi'
import { proofRollArenaAbi } from '../../shared/contracts/proofRollArenaAbi'
import { proofRollArenaAddress } from '../../shared/contracts/addresses'
import { HexAddress, PlayerStats } from '../../shared/types/game'

export function usePlayerStats(address?: HexAddress) {
  const query = useReadContract({
    address: proofRollArenaAddress,
    abi: proofRollArenaAbi,
    functionName: 'playerStats',
    args: address ? [address] : undefined,
    query: { enabled: Boolean(address) },
  })

  const raw = query.data
  const stats: PlayerStats | undefined = raw
    ? {
        totalRolls: raw[0],
        score: BigInt(raw[1]),
        bestStreak: raw[2],
        currentStreak: raw[3],
        lastRollId: raw[4],
      }
    : undefined

  return {
    stats,
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  }
}
