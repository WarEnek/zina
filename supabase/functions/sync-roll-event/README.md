# sync-roll-event

Verifies Sepolia transaction receipt, confirms target contract, decodes `CookieMinted`, and upserts `cookie_events_cache`.

## Deploy

```bash
supabase functions deploy sync-roll-event
```

## Required secrets

- `SEPOLIA_RPC_URL`
- `COOKIEFORGE_CONTRACT_ADDRESS` (legacy fallback: `PROOFROLL_CONTRACT_ADDRESS`)
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`

## Local test

```bash
supabase start
supabase functions serve sync-roll-event
curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/sync-roll-event' \
  --header 'Content-Type: application/json' \
  --data '{"txHash":"0x..."}'
```
