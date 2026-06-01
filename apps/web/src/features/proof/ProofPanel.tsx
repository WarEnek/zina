import { BakeEvent } from '../../shared/types/game'
import { getAddressUrl, getBlockUrl, getTxUrl } from '../../shared/utils/explorer'
import { cookieForgeAddress } from '../../shared/contracts/addresses'
import { ExplorerLink } from './ExplorerLink'
import { ContractVerificationCard } from './ContractVerificationCard'
import { LatestEventCard } from './LatestEventCard'
import { TrustBoundaryCard } from './TrustBoundaryCard'

export function ProofPanel({ latestBake }: { latestBake: BakeEvent | null }) {
  return (
    <div className="card space-y-2">
      <h2 className="text-xl font-semibold">Transparency panel</h2>
      <p className="text-sm text-slate-600">Every cookie bake is Sepolia tx. Contract stores mint results; Supabase only caches public data.</p>
      <TrustBoundaryCard />
      <ContractVerificationCard contractUrl={getAddressUrl(cookieForgeAddress)} />
      {latestBake ? (
        <>
          <ExplorerLink href={getTxUrl(latestBake.txHash)} label="Bake transaction" />
          <ExplorerLink href={getBlockUrl(latestBake.blockNumber)} label="VRF fulfillment / mint block" />
        </>
      ) : null}
      <LatestEventCard latestBake={latestBake} />
    </div>
  )
}
