import { isAddress } from 'viem'

const rawAddress = import.meta.env.VITE_COOKIEFORGE_CONTRACT_ADDRESS ?? import.meta.env.VITE_PROOFROLL_CONTRACT_ADDRESS ?? ''

export const cookieForgeAddress = rawAddress as `0x${string}`
export const isCookieForgeAddressConfigured =
  isAddress(rawAddress) && rawAddress !== '0x0000000000000000000000000000000000000000'

// Backward-compatible aliases
export const proofRollArenaAddress = cookieForgeAddress
export const isProofRollArenaAddressConfigured = isCookieForgeAddressConfigured
