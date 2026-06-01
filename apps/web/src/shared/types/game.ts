export type HexAddress = `0x${string}`
export type TxHash = `0x${string}`

export type PlayerStats = {
  totalBakes: bigint
  commonCount: bigint
  rareCount: bigint
  epicCount: bigint
  legendaryCount: bigint
  mythicCount: bigint
  lastRequestId: bigint
}

export type BakeEvent = {
  requestId: bigint
  player: HexAddress
  tokenId: bigint
  rarity: number
  randomValue: bigint
  txHash: TxHash
  blockNumber: bigint
}

export type TxState =
  | { status: 'idle' }
  | { status: 'checking-wallet' }
  | { status: 'wrong-network' }
  | { status: 'simulating' }
  | { status: 'awaiting-signature' }
  | { status: 'rejected' }
  | { status: 'submitted'; hash: TxHash }
  | { status: 'confirming'; hash: TxHash }
  | { status: 'confirmed'; hash: TxHash; requestId: bigint }
  | { status: 'failed'; message: string }
