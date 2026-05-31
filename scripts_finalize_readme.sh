#!/usr/bin/env bash
set -euo pipefail

if [ "$#" -ne 3 ]; then
  echo "Usage: $0 <PUBLIC_URL> <CONTRACT_ADDRESS> <ETHERSCAN_BASE_URL>"
  exit 1
fi

PUBLIC_URL="$1"
ADDRESS="$2"
BASE_URL="$3"
ROOT="$(cd "$(dirname "$0")" && pwd)"
README="$ROOT/README.md"

if ! [[ "$ADDRESS" =~ ^0x[a-fA-F0-9]{40}$ ]]; then
  echo "Invalid contract address: $ADDRESS"
  exit 1
fi

sed -i "s|^URL: .*|URL: $PUBLIC_URL|" "$README"
sed -i "s|^Address: .*|Address: \`$ADDRESS\`  |" "$README"
sed -i "s|^Explorer: .*|Explorer: $BASE_URL/address/$ADDRESS|" "$README"

echo "README finalized"
echo "URL: $PUBLIC_URL"
echo "Address: $ADDRESS"
