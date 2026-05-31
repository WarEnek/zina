export type HexAddress = `0x${string}`
export type TxHash = `0x${string}`

export type PlayerStats = {
  totalRolls: bigint
  score: bigint
  bestStreak: bigint
  currentStreak: bigint
  lastRollId: bigint
}

export type RollEvent = {
  rollId: bigint
  player: HexAddress
  result: number
  scoreDelta: bigint
  newScore: bigint
  currentStreak: bigint
  bestStreak: bigint
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
  | { status: 'confirmed'; hash: TxHash; rollId: bigint }
  | { status: 'failed'; message: string }
