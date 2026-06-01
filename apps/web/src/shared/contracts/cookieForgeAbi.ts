export const cookieForgeAbi = [
  {
    type: 'function',
    name: 'bakeCookie',
    inputs: [],
    outputs: [{ name: 'requestId', type: 'uint256', internalType: 'uint256' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'balanceOf',
    inputs: [
      { name: 'account', type: 'address', internalType: 'address' },
      { name: 'id', type: 'uint256', internalType: 'uint256' },
    ],
    outputs: [{ name: '', type: 'uint256', internalType: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'playerStats',
    inputs: [{ name: '', type: 'address', internalType: 'address' }],
    outputs: [
      { name: 'totalBakes', type: 'uint256', internalType: 'uint256' },
      { name: 'commonCount', type: 'uint256', internalType: 'uint256' },
      { name: 'rareCount', type: 'uint256', internalType: 'uint256' },
      { name: 'epicCount', type: 'uint256', internalType: 'uint256' },
      { name: 'legendaryCount', type: 'uint256', internalType: 'uint256' },
      { name: 'mythicCount', type: 'uint256', internalType: 'uint256' },
      { name: 'lastRequestId', type: 'uint256', internalType: 'uint256' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'bakes',
    inputs: [{ name: '', type: 'uint256', internalType: 'uint256' }],
    outputs: [
      { name: 'requestId', type: 'uint256', internalType: 'uint256' },
      { name: 'user', type: 'address', internalType: 'address' },
      { name: 'tokenId', type: 'uint256', internalType: 'uint256' },
      { name: 'rarity', type: 'uint8', internalType: 'uint8' },
      { name: 'randomValue', type: 'uint256', internalType: 'uint256' },
      { name: 'blockNumber', type: 'uint256', internalType: 'uint256' },
      { name: 'timestamp', type: 'uint256', internalType: 'uint256' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'totalBakes',
    inputs: [],
    outputs: [{ name: '', type: 'uint256', internalType: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'getWeights',
    inputs: [],
    outputs: [{ name: 'weights', type: 'uint32[8]', internalType: 'uint32[8]' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'oddsHash',
    inputs: [],
    outputs: [{ name: '', type: 'bytes32', internalType: 'bytes32' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'oddsUpdatedAt',
    inputs: [],
    outputs: [{ name: '', type: 'uint256', internalType: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'event',
    name: 'CookieBakeRequested',
    inputs: [
      { name: 'user', type: 'address', indexed: true, internalType: 'address' },
      { name: 'requestId', type: 'uint256', indexed: true, internalType: 'uint256' },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'CookieMinted',
    inputs: [
      { name: 'user', type: 'address', indexed: true, internalType: 'address' },
      { name: 'tokenId', type: 'uint256', indexed: true, internalType: 'uint256' },
      { name: 'rarity', type: 'uint8', indexed: false, internalType: 'uint8' },
      { name: 'randomValue', type: 'uint256', indexed: false, internalType: 'uint256' },
      { name: 'requestId', type: 'uint256', indexed: false, internalType: 'uint256' },
    ],
    anonymous: false,
  },
] as const

// Backward-compatible alias
export const proofRollArenaAbi = cookieForgeAbi
