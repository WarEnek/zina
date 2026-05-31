import { isAddress } from 'viem'

const rawAddress = import.meta.env.VITE_PROOFROLL_CONTRACT_ADDRESS ?? ''

export const proofRollArenaAddress = rawAddress as `0x${string}`

export const isProofRollArenaAddressConfigured =
  isAddress(rawAddress) && rawAddress !== '0x0000000000000000000000000000000000000000'
