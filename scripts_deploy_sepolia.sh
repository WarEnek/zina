#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")" && pwd)"
export PATH="$HOME/.foundry/bin:$PATH"
CONTRACTS_DIR="$ROOT/packages/contracts"
ENV_FILE="$CONTRACTS_DIR/.env"

if [ ! -f "$ENV_FILE" ]; then
  echo "Missing $ENV_FILE. Copy from .env.example and fill secrets."
  exit 1
fi

set -a
source "$ENV_FILE"
set +a

for v in SEPOLIA_RPC_URL PRIVATE_KEY ETHERSCAN_API_KEY; do
  if [ -z "${!v:-}" ]; then
    echo "Missing env var: $v"
    exit 1
  fi
done

echo "Deploying and verifying ProofRollArena on Sepolia..."
(
  cd "$CONTRACTS_DIR"
  forge script script/Deploy.s.sol:Deploy \
    --rpc-url "$SEPOLIA_RPC_URL" \
    --broadcast \
    --verify \
    --etherscan-api-key "$ETHERSCAN_API_KEY"
)

BROADCAST_FILE="$CONTRACTS_DIR/broadcast/Deploy.s.sol/11155111/run-latest.json"
if [ ! -f "$BROADCAST_FILE" ]; then
  echo "Missing broadcast file: $BROADCAST_FILE"
  exit 1
fi

ADDRESS="$(bun --eval '
const data = await Bun.file(process.argv[1]).json();
const tx = (data.transactions || []).find((t) => t.contractName === "ProofRollArena" && t.contractAddress);
console.log(tx?.contractAddress ?? "");
' "$BROADCAST_FILE")"

if ! [[ "$ADDRESS" =~ ^0x[a-fA-F0-9]{40}$ ]]; then
  echo "Could not parse deployed address from broadcast"
  exit 1
fi

echo "Deployed: $ADDRESS"
cd "$ROOT"
bun run contracts:sync-web -- "$ADDRESS"

echo "Done. Next: bun run finalize:readme -- <public-url> $ADDRESS https://sepolia.etherscan.io"
