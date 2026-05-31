import { env } from '../config/env'
import { TxHash } from '../types/game'

export async function syncRollEvent(txHash: TxHash): Promise<void> {
  if (!env.supabaseSyncRollEventUrl) return

  const response = await fetch(env.supabaseSyncRollEventUrl, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify({ txHash }),
  })

  if (!response.ok) {
    const text = await response.text()
    throw new Error(`Supabase sync failed: ${response.status} ${text}`)
  }
}
