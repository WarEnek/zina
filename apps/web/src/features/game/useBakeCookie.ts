import { useState } from 'react'
import { parseEventLogs } from 'viem'
import { useAccount, usePublicClient, useWalletClient } from 'wagmi'
import { sepolia } from 'wagmi/chains'
import { cookieForgeAbi } from '../../shared/contracts/cookieForgeAbi'
import { cookieForgeAddress } from '../../shared/contracts/addresses'
import { syncRollEvent } from '../../shared/lib/syncRollEvent'
import { BakeEvent, TxState } from '../../shared/types/game'

export function useBakeCookie(onSettled?: () => Promise<unknown> | unknown) {
  const { address, chainId, isConnected } = useAccount()
  const publicClient = usePublicClient()
  const { data: walletClient } = useWalletClient()

  const [txState, setTxState] = useState<TxState>({ status: 'idle' })
  const [latestBake, setLatestBake] = useState<BakeEvent | null>(null)

  async function bakeCookie() {
    try {
      setTxState({ status: 'checking-wallet' })
      if (!isConnected || !address || !walletClient || !publicClient) {
        setTxState({ status: 'failed', message: 'Wallet is not connected.' })
        return
      }
      if (chainId !== sepolia.id) {
        setTxState({ status: 'wrong-network' })
        return
      }

      setTxState({ status: 'simulating' })
      const simulation = await publicClient.simulateContract({
        address: cookieForgeAddress,
        abi: cookieForgeAbi,
        functionName: 'bakeCookie',
        account: address,
      })

      setTxState({ status: 'awaiting-signature' })
      const hash = await walletClient.writeContract(simulation.request)
      setTxState({ status: 'submitted', hash })

      setTxState({ status: 'confirming', hash })
      const receipt = await publicClient.waitForTransactionReceipt({ hash })

      const decodedLogs = parseEventLogs({
        abi: cookieForgeAbi,
        logs: receipt.logs,
        eventName: 'CookieMinted',
        strict: false,
      })
      const mintedEvent = decodedLogs.find((log) => log.address.toLowerCase() === cookieForgeAddress.toLowerCase())
      if (!mintedEvent?.args) {
        setTxState({ status: 'failed', message: 'CookieMinted event not found.' })
        return
      }
      const { requestId, user, tokenId, rarity, randomValue } = mintedEvent.args
      if (
        requestId === undefined ||
        user === undefined ||
        tokenId === undefined ||
        rarity === undefined ||
        randomValue === undefined
      ) {
        setTxState({ status: 'failed', message: 'Decoded CookieMinted event is incomplete.' })
        return
      }

      const event: BakeEvent = {
        requestId,
        player: user,
        tokenId,
        rarity,
        randomValue,
        txHash: hash,
        blockNumber: receipt.blockNumber,
      }

      setLatestBake(event)
      setTxState({ status: 'confirmed', hash, requestId: event.requestId })
      try {
        await syncRollEvent(hash)
      } catch {
        // blockchain is source of truth; cache sync can fail safely
      }
      if (onSettled) await onSettled()
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown failure'
      if (message.toLowerCase().includes('user rejected')) {
        setTxState({ status: 'rejected' })
      } else if (message.toLowerCase().includes('execution reverted')) {
        setTxState({
          status: 'failed',
          message:
            'Contract call reverted. This usually means the contract address is not a compatible CookieForge deployment for the current ABI/network.',
        })
      } else {
        setTxState({ status: 'failed', message })
      }
    }
  }

  function reset() {
    setTxState({ status: 'idle' })
  }

  return { bakeCookie, txState, latestBake, reset }
}
