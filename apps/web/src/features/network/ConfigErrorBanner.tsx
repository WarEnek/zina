export function ConfigErrorBanner() {
  return (
    <div className="card border-red-400/40">
      <h3 className="font-semibold text-red-700">Configuration error</h3>
      <p className="text-sm text-slate-600">
        Contract address missing or invalid. Set <code>VITE_COOKIEFORGE_CONTRACT_ADDRESS</code> (or legacy <code>VITE_PROOFROLL_CONTRACT_ADDRESS</code>)
        to deployed Sepolia Cookie Forge contract.
      </p>
    </div>
  )
}
