# sync-roll-event

Verifies Sepolia transaction receipt, confirms target contract, decodes `RollResolved`, upserts `roll_events_cache`.

## Deploy

```bash
supabase functions deploy sync-roll-event
```

## Set Secrets

```bash
supabase secrets set SEPOLIA_RPC_URL=... \
  PROOFROLL_CONTRACT_ADDRESS=0x... \
  SUPABASE_URL=https://YOUR_PROJECT.supabase.co \
  SUPABASE_SERVICE_ROLE_KEY=...
```

## Local invoke example

```bash
supabase functions serve sync-roll-event
curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/sync-roll-event' \
  --header 'Content-Type: application/json' \
  --data '{"txHash":"0x..."}'
```
