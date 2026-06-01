create table if not exists public.cookie_events_cache (
  id uuid primary key default gen_random_uuid(),
  chain_id integer not null,
  contract_address text not null,
  tx_hash text not null unique,
  block_number bigint not null,
  request_id numeric not null,
  wallet_address text not null,
  token_id integer not null,
  rarity integer not null,
  random_value numeric not null,
  created_at timestamptz not null default now()
);

alter table public.cookie_events_cache enable row level security;

grant select on public.cookie_events_cache to anon, authenticated;

drop policy if exists "cookie events are publicly readable" on public.cookie_events_cache;
create policy "cookie events are publicly readable"
  on public.cookie_events_cache
  for select
  to anon, authenticated
  using (true);

create or replace view public.cookie_leaderboard as
select
  lower(wallet_address) as wallet_address,
  count(*) as total_bakes,
  count(*) filter (where rarity = 0) as common_count,
  count(*) filter (where rarity = 1) as rare_count,
  count(*) filter (where rarity = 2) as epic_count,
  count(*) filter (where rarity = 3) as legendary_count,
  count(*) filter (where rarity = 4) as mythic_count,
  max(created_at) as updated_at
from public.cookie_events_cache
group by lower(wallet_address)
order by mythic_count desc, legendary_count desc, epic_count desc, total_bakes desc;

grant select on public.cookie_leaderboard to anon, authenticated;
