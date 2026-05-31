import { useAccount, useChainId } from 'wagmi'
import { sepolia } from 'wagmi/chains'

export function useWalletStatus() {
  const { address, isConnected, isConnecting } = useAccount()
  const chainId = useChainId()

  return {
    address,
    isConnected,
    isConnecting,
    chainId,
    isWrongNetwork: isConnected && chainId !== sepolia.id,
  }
}
