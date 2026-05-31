import { useEffect } from 'react'
import { useAccount } from 'wagmi'
import { usePlayerStats } from './usePlayerStats'
import { useRoll } from './useRoll'
import { RollEvent } from '../../shared/types/game'
import { getTxUrl } from '../../shared/utils/explorer'
import { RollButton } from './RollButton'
import { PlayerStatsCard } from './PlayerStatsCard'
import { ResultCard } from './ResultCard'
import { RecentRolls } from './RecentRolls'
import { DiceVisual } from './DiceVisual'

export function GamePanel({ onLatestRoll }: { onLatestRoll: (roll: RollEvent | null) => void }) {
  const { address } = useAccount()
  const { stats, refetch } = usePlayerStats(address)
  const { roll, txState, latestRoll } = useRoll(refetch)

  useEffect(() => {
    onLatestRoll(latestRoll)
  }, [latestRoll, onLatestRoll])

  const disabled = txState.status === 'simulating' || txState.status === 'awaiting-signature' || txState.status === 'confirming'

  return (
    <div className="card space-y-3">
      <h2 className="text-xl font-semibold">Game panel</h2>
      <DiceVisual value={latestRoll?.result} />
      <RollButton
        disabled={disabled}
        onClick={() => void roll()}
        label={txState.status === 'awaiting-signature' ? 'Waiting for wallet' : txState.status === 'confirming' ? 'Confirming transaction' : 'Roll on-chain'}
      />
      <p className="text-sm text-white/70">Tx state: {txState.status}</p>
      {txState.status === 'wrong-network' ? (
        <p className="text-sm text-yellow-300">Switch to Sepolia to continue.</p>
      ) : null}
      {txState.status === 'awaiting-signature' ? (
        <p className="text-sm text-white/70">Check wallet and confirm transaction.</p>
      ) : null}
      {txState.status === 'confirming' ? (
        <p className="text-sm text-white/70">Transaction submitted. Waiting for confirmation.</p>
      ) : null}
      {txState.status === 'confirmed' ? (
        <p className="text-sm text-green-300">Roll confirmed on-chain.</p>
      ) : null}
      {'hash' in txState ? <a className="text-accent underline" href={getTxUrl(txState.hash)} target="_blank" rel="noreferrer">Latest tx</a> : null}
      {txState.status === 'failed' ? <p className="text-sm text-red-300">{txState.message}</p> : null}
      {txState.status === 'rejected' ? <p className="text-sm text-yellow-300">You rejected transaction in wallet.</p> : null}
      <PlayerStatsCard stats={stats} />
      <ResultCard latestRoll={latestRoll} />
      <RecentRolls latestRoll={latestRoll} />
    </div>
  )
}
