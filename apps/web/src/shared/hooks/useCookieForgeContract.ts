import { sepolia } from 'wagmi/chains'
import { cookieForgeAddress } from '../contracts/addresses'
import { cookieForgeAbi } from '../contracts/cookieForgeAbi'
import { getAddressUrl } from '../utils/explorer'

export function useCookieForgeContract() {
  return {
    address: cookieForgeAddress,
    abi: cookieForgeAbi,
    chainId: sepolia.id,
    explorerContractUrl: getAddressUrl(cookieForgeAddress),
  }
}
