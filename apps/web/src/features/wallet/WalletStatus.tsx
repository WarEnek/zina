import { useWalletStatus } from './useWalletStatus'

export function WalletStatus() {
  const { address, isConnected, isConnecting, chainId } = useWalletStatus()
  return (
    <div className="card">
      <h2 className="text-lg font-semibold">Wallet status</h2>
      <p className="text-sm text-white/70">State: {isConnecting ? 'connecting' : isConnected ? 'connected' : 'disconnected'}</p>
      <p className="text-sm text-white/70">Address: {address ?? 'not connected'}</p>
      <p className="text-sm text-white/70">Network: {chainId ?? 'unknown'}</p>
    </div>
  )
}
