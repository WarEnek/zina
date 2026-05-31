import { ExplorerLink } from './ExplorerLink'

export function ContractVerificationCard({ contractUrl }: { contractUrl: string }) {
  return (
    <div className="rounded-xl border border-white/15 p-3 text-sm">
      <p>Contract source verification</p>
      <ExplorerLink href={contractUrl} label="Open verified contract" />
    </div>
  )
}
