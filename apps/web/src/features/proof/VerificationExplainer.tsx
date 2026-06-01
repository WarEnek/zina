export function VerificationExplainer() {
  return (
    <section className="card space-y-2">
      <h2 className="text-xl font-semibold">How verification works</h2>
      <p className="text-sm text-slate-700">Each bake is an on-chain Sepolia transaction. UI shows final collectible only after transaction receipt and decoded CookieMinted event.</p>
      <ul className="list-disc space-y-1 pl-5 text-sm text-slate-600">
        <li>On-chain source of truth: contract storage, tx receipt, and event logs.</li>
        <li>Supabase role: optional cache for analytics and faster reads.</li>
        <li>If Supabase is down, minting and on-chain proof still work.</li>
      </ul>
    </section>
  )
}
