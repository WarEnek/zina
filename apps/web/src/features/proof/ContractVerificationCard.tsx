import { ExplorerLink } from './ExplorerLink'

export function ContractVerificationCard({ contractUrl }: { contractUrl: string }) {
  return (
    <div className="rounded-sm border border-slate-300 p-3 text-sm">
      <p>Contract source verification</p>
      <ExplorerLink href={contractUrl} label="Open verified contract" />
    </div>
  )
}
