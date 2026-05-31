import { sepolia } from 'wagmi/chains'
import { proofRollArenaAddress } from '../contracts/addresses'
import { proofRollArenaAbi } from '../contracts/proofRollArenaAbi'
import { getAddressUrl } from '../utils/explorer'

export function useProofRollContract() {
  return {
    address: proofRollArenaAddress,
    abi: proofRollArenaAbi,
    chainId: sepolia.id,
    explorerContractUrl: getAddressUrl(proofRollArenaAddress),
  }
}
