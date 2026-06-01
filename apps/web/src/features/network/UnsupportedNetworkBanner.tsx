import { SwitchNetworkButton } from './SwitchNetworkButton'

export function UnsupportedNetworkBanner() {
  return (
    <div className="card border-red-400/40">
      <h3 className="font-semibold text-red-700">Unsupported network</h3>
      <p className="text-sm text-slate-600">Cookie baking is blocked. Switch to Sepolia.</p>
      <div className="mt-3">
        <SwitchNetworkButton />
      </div>
    </div>
  )
}
