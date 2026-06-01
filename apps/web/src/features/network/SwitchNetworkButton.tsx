import { useSwitchChain } from 'wagmi'
import { sepolia } from 'wagmi/chains'

export function SwitchNetworkButton() {
  const { switchChain, isPending } = useSwitchChain()
  return (
    <button
      className="rounded-sm bg-blue-600 px-4 py-2 font-semibold text-white disabled:opacity-50"
      onClick={() => switchChain({ chainId: sepolia.id })}
      disabled={isPending}
    >
      {isPending ? 'Switching...' : 'Switch to Sepolia'}
    </button>
  )
}
