import { createClient } from 'npm:@supabase/supabase-js@2'
import { createPublicClient, http, isAddressEqual, parseEventLogs } from 'npm:viem@2'
import { sepolia } from 'npm:viem@2/chains'

const cookieMintedAbi = [
  {
    type: 'event',
    name: 'CookieMinted',
    inputs: [
      { indexed: true, name: 'user', type: 'address' },
      { indexed: true, name: 'tokenId', type: 'uint256' },
      { indexed: false, name: 'rarity', type: 'uint8' },
      { indexed: false, name: 'randomValue', type: 'uint256' },
      { indexed: false, name: 'requestId', type: 'uint256' },
    ],
    anonymous: false,
  },
] as const

const corsHeaders = {
  'access-control-allow-origin': '*',
  'access-control-allow-headers': 'authorization, x-client-info, apikey, content-type',
  'access-control-allow-methods': 'POST, OPTIONS',
}

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'content-type': 'application/json', ...corsHeaders },
  })
}

Deno.serve(async (request) => {
  try {
    if (request.method === 'OPTIONS') {
      return new Response('ok', { headers: corsHeaders })
    }
    if (request.method !== 'POST') return json({ ok: false, message: 'Method not allowed' }, 405)

    const body = await request.json().catch(() => null) as { txHash?: string } | null
    const txHash = body?.txHash
    if (!txHash || !/^0x[a-fA-F0-9]{64}$/.test(txHash)) {
      return json({ ok: false, message: 'Invalid txHash format' }, 400)
    }

    const rpcUrl = Deno.env.get('SEPOLIA_RPC_URL')
    const contractAddress =
      (Deno.env.get('COOKIEFORGE_CONTRACT_ADDRESS') ?? Deno.env.get('PROOFROLL_CONTRACT_ADDRESS')) as
        | `0x${string}`
        | undefined
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
      abi: cookieMintedAbi,
      logs: receipt.logs,
      eventName: 'CookieMinted',
      strict: false,
    })

    const event = logs.find((log) => log.address && isAddressEqual(log.address, contractAddress))
    if (!event || !event.args) {
      return json({ ok: false, message: 'CookieMinted event not found' }, 400)
    }

    const supabase = createClient(supabaseUrl, serviceRoleKey)
    const payload = {
      chain_id: sepolia.id,
      contract_address: contractAddress.toLowerCase(),
      tx_hash: txHash.toLowerCase(),
      block_number: Number(receipt.blockNumber),
      request_id: event.args.requestId.toString(),
      wallet_address: event.args.user.toLowerCase(),
      token_id: Number(event.args.tokenId),
      rarity: Number(event.args.rarity),
      random_value: event.args.randomValue.toString(),
    }

    const { error } = await supabase.from('cookie_events_cache').upsert(payload, { onConflict: 'tx_hash' })
    if (error) return json({ ok: false, message: error.message }, 500)

    return json({
      ok: true,
      event: {
        txHash,
        requestId: event.args.requestId.toString(),
        user: event.args.user,
        tokenId: Number(event.args.tokenId),
        rarity: Number(event.args.rarity),
      },
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    return json({ ok: false, message }, 500)
  }
})
