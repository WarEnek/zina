import { useEffect } from 'react'
import { useAccount } from 'wagmi'
import { usePlayerStats } from './usePlayerStats'
import { useBakeCookie } from './useBakeCookie'
import { BakeEvent } from '../../shared/types/game'
import { getTxUrl } from '../../shared/utils/explorer'
import { BakeButton } from './BakeButton'
import { PlayerStatsCard } from './PlayerStatsCard'
import { ResultCard } from './ResultCard'
import { RecentRolls } from './RecentRolls'
import { DiceVisual } from './DiceVisual'

export function GamePanel({ onLatestBake }: { onLatestBake: (bake: BakeEvent | null) => void }) {
  const { address } = useAccount()
  const { stats, refetch } = usePlayerStats(address)
  const { bakeCookie, txState, latestBake } = useBakeCookie(refetch)

  useEffect(() => {
    onLatestBake(latestBake)
  }, [latestBake, onLatestBake])

  const disabled = txState.status === 'simulating' || txState.status === 'awaiting-signature' || txState.status === 'confirming'
  const isRolling = txState.status === 'simulating' || txState.status === 'awaiting-signature' || txState.status === 'confirming' || txState.status === 'submitted'

  return (
    <div className="card space-y-3">
      <h2 className="text-xl font-semibold">Cookie oven</h2>
      <DiceVisual value={latestBake?.tokenId} isRolling={isRolling} />
      <BakeButton
        disabled={disabled}
        onClick={() => void bakeCookie()}
        label={txState.status === 'awaiting-signature' ? 'Waiting for wallet' : txState.status === 'confirming' ? 'Baking on-chain' : 'Bake Cookie'}
      />
      <p className="text-sm text-slate-600">Tx state: {txState.status}</p>
      {txState.status === 'wrong-network' ? <p className="text-sm text-amber-700">Switch to Sepolia to continue.</p> : null}
      {txState.status === 'awaiting-signature' ? <p className="text-sm text-slate-600">Check wallet and confirm bake transaction.</p> : null}
      {txState.status === 'confirming' ? <p className="text-sm text-slate-600">Transaction submitted. Waiting for mint confirmation.</p> : null}
      {txState.status === 'confirmed' ? <p className="text-sm text-green-700">Cookie minted on-chain.</p> : null}
      {'hash' in txState ? <a className="text-blue-700 underline" href={getTxUrl(txState.hash)} target="_blank" rel="noreferrer">Latest tx</a> : null}
      {txState.status === 'failed' ? <p className="text-sm text-red-700">{txState.message}</p> : null}
      {txState.status === 'rejected' ? <p className="text-sm text-amber-700">You rejected transaction in wallet.</p> : null}
      <PlayerStatsCard stats={stats} />
      <ResultCard latestBake={latestBake} txStatus={txState.status} />
      <RecentRolls latestRoll={latestBake} />
    </div>
  )
}
