import { createClient } from 'npm:@supabase/supabase-js@2'
import { createPublicClient, http, isAddressEqual, parseEventLogs } from 'npm:viem@2'
import { sepolia } from 'npm:viem@2/chains'

const rollResolvedAbi = [
  {
    type: 'event',
    name: 'RollResolved',
    inputs: [
      { indexed: true, name: 'rollId', type: 'uint256' },
      { indexed: true, name: 'player', type: 'address' },
      { indexed: false, name: 'result', type: 'uint8' },
      { indexed: false, name: 'scoreDelta', type: 'int256' },
      { indexed: false, name: 'newScore', type: 'int256' },
      { indexed: false, name: 'currentStreak', type: 'uint256' },
      { indexed: false, name: 'bestStreak', type: 'uint256' },
    ],
    anonymous: false,
  },
] as const

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'content-type': 'application/json' },
  })
}

Deno.serve(async (request) => {
  try {
    if (request.method !== 'POST') return json({ ok: false, message: 'Method not allowed' }, 405)

    const body = await request.json().catch(() => null) as { txHash?: string } | null
    const txHash = body?.txHash
    if (!txHash || !/^0x[a-fA-F0-9]{64}$/.test(txHash)) {
      return json({ ok: false, message: 'Invalid txHash format' }, 400)
    }

    const rpcUrl = Deno.env.get('SEPOLIA_RPC_URL')
    const contractAddress = Deno.env.get('PROOFROLL_CONTRACT_ADDRESS') as `0x${string}` | undefined
    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

    if (!rpcUrl || !contractAddress || !supabaseUrl || !serviceRoleKey) {
      return json({ ok: false, message: 'Missing required environment variables' }, 500)
    }

    const publicClient = createPublicClient({ chain: sepolia, transport: http(rpcUrl) })

    const [tx, receipt] = await Promise.all([
      publicClient.getTransaction({ hash: txHash as `0x${string}` }),
      publicClient.getTransactionReceipt({ hash: txHash as `0x${string}` }),
    ])

    if (!tx.to || !isAddressEqual(tx.to, contractAddress)) {
      return json({ ok: false, message: 'Transaction target does not match contract' }, 400)
    }

    if (receipt.status !== 'success') {
      return json({ ok: false, message: 'Transaction failed on-chain' }, 400)
    }

    const logs = parseEventLogs({
      abi: rollResolvedAbi,
      logs: receipt.logs,
      eventName: 'RollResolved',
      strict: false,
    })

    const event = logs.find((log) => log.address && isAddressEqual(log.address, contractAddress))
    if (!event || !event.args) {
      return json({ ok: false, message: 'RollResolved event not found' }, 400)
    }

    const supabase = createClient(supabaseUrl, serviceRoleKey)
    const payload = {
      chain_id: sepolia.id,
      contract_address: contractAddress.toLowerCase(),
      tx_hash: txHash.toLowerCase(),
      block_number: Number(receipt.blockNumber),
      roll_id: event.args.rollId.toString(),
      wallet_address: event.args.player.toLowerCase(),
      result: Number(event.args.result),
      score_delta: Number(event.args.scoreDelta),
      new_score: event.args.newScore.toString(),
      current_streak: event.args.currentStreak.toString(),
      best_streak: event.args.bestStreak.toString(),
    }

    const { error } = await supabase.from('roll_events_cache').upsert(payload, { onConflict: 'tx_hash' })
    if (error) return json({ ok: false, message: error.message }, 500)

    return json({
      ok: true,
      event: {
        txHash,
        rollId: event.args.rollId.toString(),
        player: event.args.player,
        result: Number(event.args.result),
        scoreDelta: Number(event.args.scoreDelta),
      },
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    return json({ ok: false, message }, 500)
  }
})
