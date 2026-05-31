create or replace view public.leaderboard as
select
  lower(wallet_address) as wallet_address,
  max(new_score) as score,
  count(*) as total_rolls,
  max(best_streak) as best_streak,
  max(created_at) as updated_at
from public.roll_events_cache
group by lower(wallet_address)
order by score desc, best_streak desc, total_rolls asc;

grant select on public.leaderboard to anon, authenticated;
