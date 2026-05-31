import { ReactNode } from 'react'
import { useWalletStatus } from '../wallet/useWalletStatus'
import { UnsupportedNetworkBanner } from './UnsupportedNetworkBanner'

export function NetworkGuard({ children }: { children: ReactNode }) {
  const { isConnected, isWrongNetwork } = useWalletStatus()
  if (!isConnected) return <div className="card">Connect wallet to start.</div>
  if (isWrongNetwork) return <UnsupportedNetworkBanner />
  return <>{children}</>
}
