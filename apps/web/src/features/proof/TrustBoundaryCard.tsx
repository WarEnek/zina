export function TrustBoundaryCard() {
  return (
    <div className="rounded-sm border border-slate-300 p-3 text-sm">
      <p className="font-semibold">Trust boundary</p>
      <p className="text-slate-600">Contract events determine game truth. Supabase stores derived public cache only. Browser never gets Supabase service role key.</p>
    </div>
  )
}
