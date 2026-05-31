import { useState } from 'react'
import { decodeEventLog } from 'viem'
import { useAccount, usePublicClient, useWalletClient } from 'wagmi'
import { sepolia } from 'wagmi/chains'
import { proofRollArenaAbi } from '../../shared/contracts/proofRollArenaAbi'
import { proofRollArenaAddress } from '../../shared/contracts/addresses'
import { syncRollEvent } from '../../shared/lib/syncRollEvent'
import { RollEvent, TxState } from '../../shared/types/game'

export function useRoll(onSettled?: () => Promise<unknown> | unknown) {
  const { address, chainId, isConnected } = useAccount()
  const publicClient = usePublicClient()
  const { data: walletClient } = useWalletClient()

  const [txState, setTxState] = useState<TxState>({ status: 'idle' })
  const [latestRoll, setLatestRoll] = useState<RollEvent | null>(null)

  async function roll() {
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
        address: proofRollArenaAddress,
        abi: proofRollArenaAbi,
        functionName: 'roll',
        account: address,
      })

      setTxState({ status: 'awaiting-signature' })
      const hash = await walletClient.writeContract(simulation.request)
      setTxState({ status: 'submitted', hash })

      setTxState({ status: 'confirming', hash })
      const receipt = await publicClient.waitForTransactionReceipt({ hash })

      const rollLog = receipt.logs.find((log) => log.address.toLowerCase() === proofRollArenaAddress.toLowerCase())
      if (!rollLog) {
        setTxState({ status: 'failed', message: 'RollResolved event not found.' })
        return
      }

      const decoded = decodeEventLog({
        abi: proofRollArenaAbi,
        data: rollLog.data,
        topics: rollLog.topics,
        eventName: 'RollResolved',
      })

      const event: RollEvent = {
        rollId: decoded.args.rollId,
        player: decoded.args.player,
        result: decoded.args.result,
        scoreDelta: decoded.args.scoreDelta,
        newScore: decoded.args.newScore,
        currentStreak: decoded.args.currentStreak,
        bestStreak: decoded.args.bestStreak,
        txHash: hash,
        blockNumber: receipt.blockNumber,
      }

      setLatestRoll(event)
      setTxState({ status: 'confirmed', hash, rollId: event.rollId })
      // Optional cache sync. On-chain data remains source of truth.
      try {
        await syncRollEvent(hash)
      } catch {
        // Ignore cache sync errors: blockchain result already confirmed.
      }
      if (onSettled) await onSettled()
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown failure'
      if (message.toLowerCase().includes('user rejected')) {
        setTxState({ status: 'rejected' })
      } else {
        setTxState({ status: 'failed', message })
      }
    }
  }

  function reset() {
    setTxState({ status: 'idle' })
  }

  return { roll, txState, latestRoll, reset }
}
