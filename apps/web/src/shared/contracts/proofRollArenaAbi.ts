export const proofRollArenaAbi = [
  {
    "type": "function",
    "name": "getPlayerStats",
    "inputs": [
      {
        "name": "player",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "tuple",
        "internalType": "struct ProofRollArena.PlayerStats",
        "components": [
          {
            "name": "totalRolls",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "score",
            "type": "int256",
            "internalType": "int256"
          },
          {
            "name": "bestStreak",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "currentStreak",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "lastRollId",
            "type": "uint256",
            "internalType": "uint256"
          }
        ]
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getRoll",
    "inputs": [
      {
        "name": "rollId_",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "tuple",
        "internalType": "struct ProofRollArena.Roll",
        "components": [
          {
            "name": "id",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "player",
            "type": "address",
            "internalType": "address"
          },
          {
            "name": "result",
            "type": "uint8",
            "internalType": "uint8"
          },
          {
            "name": "scoreDelta",
            "type": "int256",
            "internalType": "int256"
          },
          {
            "name": "blockNumber",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "timestamp",
            "type": "uint256",
            "internalType": "uint256"
          }
        ]
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "playerStats",
    "inputs": [
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [
      {
        "name": "totalRolls",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "score",
        "type": "int256",
        "internalType": "int256"
      },
      {
        "name": "bestStreak",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "currentStreak",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "lastRollId",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "roll",
    "inputs": [],
    "outputs": [
      {
        "name": "rollId",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "rolls",
    "inputs": [
      {
        "name": "",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [
      {
        "name": "id",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "player",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "result",
        "type": "uint8",
        "internalType": "uint8"
      },
      {
        "name": "scoreDelta",
        "type": "int256",
        "internalType": "int256"
      },
      {
        "name": "blockNumber",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "timestamp",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "totalRolls",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "event",
    "name": "RollResolved",
    "inputs": [
      {
        "name": "rollId",
        "type": "uint256",
        "indexed": true,
        "internalType": "uint256"
      },
      {
        "name": "player",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "result",
        "type": "uint8",
        "indexed": false,
        "internalType": "uint8"
      },
      {
        "name": "scoreDelta",
        "type": "int256",
        "indexed": false,
        "internalType": "int256"
      },
      {
        "name": "newScore",
        "type": "int256",
        "indexed": false,
        "internalType": "int256"
      },
      {
        "name": "currentStreak",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      },
      {
        "name": "bestStreak",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      }
    ],
    "anonymous": false
  }
] as const
