#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")" && pwd)"
export PATH="$HOME/.foundry/bin:$PATH"

for c in anvil forge cast bun; do
  if ! command -v "$c" >/dev/null 2>&1; then
    echo "Missing command: $c"
    exit 1
  fi
done

ANVIL_LOG="/tmp/proofroll_anvil.log"
RPC_URL="http://127.0.0.1:8545"
DEPLOYER_KEY="0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"

echo "Starting anvil..."
anvil --port 8545 --chain-id 31337 > "$ANVIL_LOG" 2>&1 &
ANVIL_PID=$!
trap 'kill "$ANVIL_PID" >/dev/null 2>&1 || true' EXIT
sleep 1

echo "Deploying ProofRollArena to local anvil..."
(
  cd "$ROOT/packages/contracts"
  PRIVATE_KEY="$DEPLOYER_KEY" forge script script/Deploy.s.sol:Deploy --rpc-url "$RPC_URL" --broadcast >/tmp/proofroll_e2e_deploy.log 2>&1
)

BROADCAST_FILE="$ROOT/packages/contracts/broadcast/Deploy.s.sol/31337/run-latest.json"
if [ ! -f "$BROADCAST_FILE" ]; then
  echo "Broadcast file missing: $BROADCAST_FILE"
  cat /tmp/proofroll_e2e_deploy.log || true
  exit 1
fi

CONTRACT_ADDRESS="$(bun --eval '
const data = await Bun.file(process.argv[1]).json();
const tx = (data.transactions || []).find((t) => t.contractName === "ProofRollArena" && t.contractAddress);
console.log(tx?.contractAddress ?? "");
' "$BROADCAST_FILE")"

if ! [[ "$CONTRACT_ADDRESS" =~ ^0x[a-fA-F0-9]{40}$ ]]; then
  echo "Deploy failed. Could not parse contract address."
  cat /tmp/proofroll_e2e_deploy.log || true
  exit 1
fi

echo "Contract: $CONTRACT_ADDRESS"

CODE_HEX="$(cast code "$CONTRACT_ADDRESS" --rpc-url "$RPC_URL")"
if [ -z "$CODE_HEX" ] || [ "$CODE_HEX" = "0x" ]; then
  echo "No bytecode at deployed address: $CONTRACT_ADDRESS"
  exit 1
fi

echo "Calling roll()..."
ROLL_CALLDATA="$(cast calldata "roll()")"
ROLL_TX="$(cast send "$CONTRACT_ADDRESS" --data "$ROLL_CALLDATA" --rpc-url "$RPC_URL" --private-key "$DEPLOYER_KEY" --gas-limit 500000 --json | bun --eval 'const j=JSON.parse(require("fs").readFileSync(0,"utf8")); console.log(j.transactionHash ?? "")')"
if ! [[ "$ROLL_TX" =~ ^0x[a-fA-F0-9]{64}$ ]]; then
  echo "roll() tx hash not found"
  exit 1
fi

echo "Roll tx: $ROLL_TX"
RECEIPT_STATUS="$(cast receipt "$ROLL_TX" --rpc-url "$RPC_URL" --json | bun --eval 'const j=JSON.parse(require("fs").readFileSync(0,"utf8")); console.log(j.status ?? "")')"
if [ "$RECEIPT_STATUS" != "0x1" ] && [ "$RECEIPT_STATUS" != "1" ]; then
  echo "roll() failed: status=$RECEIPT_STATUS"
  cast receipt "$ROLL_TX" --rpc-url "$RPC_URL" || true
  exit 1
fi

TOTAL_ROLLS_HEX="$(cast call "$CONTRACT_ADDRESS" "totalRolls()(uint256)" --rpc-url "$RPC_URL")"
TOTAL_ROLLS_DEC="$(cast --to-dec "$TOTAL_ROLLS_HEX")"
if [ "$TOTAL_ROLLS_DEC" != "1" ]; then
  echo "Unexpected totalRolls: $TOTAL_ROLLS_DEC"
  exit 1
fi

echo "Local e2e PASS: deploy + roll + receipt + totalRolls=1"
