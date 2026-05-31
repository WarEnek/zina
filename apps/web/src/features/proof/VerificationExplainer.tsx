export function VerificationExplainer() {
  return (
    <section className="card space-y-2">
      <h2 className="text-xl font-semibold">How verification works</h2>
      <p className="text-sm text-white/80">Each roll is on-chain Sepolia transaction. UI final result comes only after transaction receipt and decoded RollResolved event.</p>
      <ul className="list-disc space-y-1 pl-5 text-sm text-white/70">
        <li>On-chain source of truth: contract storage, tx receipt, event logs.</li>
        <li>Supabase role: cache for leaderboard and faster reads.</li>
        <li>If Supabase down, gameplay still works from chain data.</li>
      </ul>
    </section>
  )
}
