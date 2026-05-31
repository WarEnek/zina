import { RollEvent } from '../../shared/types/game'
import { getAddressUrl, getBlockUrl, getTxUrl } from '../../shared/utils/explorer'
import { proofRollArenaAddress } from '../../shared/contracts/addresses'
import { ExplorerLink } from './ExplorerLink'
import { ContractVerificationCard } from './ContractVerificationCard'
import { LatestEventCard } from './LatestEventCard'
import { TrustBoundaryCard } from './TrustBoundaryCard'

export function ProofPanel({ latestRoll }: { latestRoll: RollEvent | null }) {
  return (
    <div className="card space-y-2">
      <h2 className="text-xl font-semibold">Proof panel</h2>
      <p className="text-sm text-white/70">Every roll is Sepolia tx. Contract stores result; Supabase only caches public data.</p>
      <TrustBoundaryCard />
      <ContractVerificationCard contractUrl={getAddressUrl(proofRollArenaAddress)} />
      {latestRoll ? (
        <>
          <ExplorerLink href={getTxUrl(latestRoll.txHash)} label="Latest transaction" />
          <ExplorerLink href={getBlockUrl(latestRoll.blockNumber)} label="Latest block" />
        </>
      ) : null}
      <LatestEventCard latestRoll={latestRoll} />
    </div>
  )
}
