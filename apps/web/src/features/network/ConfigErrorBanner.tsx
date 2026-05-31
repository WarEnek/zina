export function ConfigErrorBanner() {
  return (
    <div className="card border-red-400/40">
      <h3 className="font-semibold text-red-300">Configuration error</h3>
      <p className="text-sm text-white/70">
        Contract address missing or invalid. Set <code>VITE_PROOFROLL_CONTRACT_ADDRESS</code> to deployed Sepolia contract.
      </p>
    </div>
  )
}
