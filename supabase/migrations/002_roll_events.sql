create table if not exists public.roll_events_cache (
  id uuid primary key default gen_random_uuid(),
  chain_id integer not null,
  contract_address text not null,
  tx_hash text not null unique,
  block_number bigint not null,
  roll_id numeric not null,
  wallet_address text not null,
  result integer not null,
  score_delta integer not null,
  new_score numeric not null,
  current_streak numeric not null,
  best_streak numeric not null,
  created_at timestamptz not null default now()
);

alter table public.roll_events_cache enable row level security;

grant select on public.roll_events_cache to anon, authenticated;

drop policy if exists "roll events are publicly readable" on public.roll_events_cache;
create policy "roll events are publicly readable"
  on public.roll_events_cache
  for select
  to anon, authenticated
  using (true);
