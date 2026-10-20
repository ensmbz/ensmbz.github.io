-- Apply once before enabling the owner-only full-site panic command.
-- No website data is deleted by this migration.
create table if not exists public.site_panic_state (
  id boolean primary key default true check (id),
  job_id uuid,
  status text not null default 'idle' check (status in ('idle', 'running', 'failed')),
  steps jsonb not null default '{}'::jsonb,
  last_error text,
  updated_at timestamptz not null default now()
);
create table if not exists public.site_panic_receipts (
  interaction_id text primary key,
  created_at timestamptz not null default now()
);
alter table public.site_panic_state enable row level security;
alter table public.site_panic_receipts enable row level security;
revoke all on public.site_panic_state, public.site_panic_receipts from public, anon, authenticated;
grant select, insert, update on public.site_panic_state to service_role;
grant select, insert on public.site_panic_receipts to service_role;
insert into public.site_panic_state (id) values (true) on conflict (id) do nothing;

create or replace function public.claim_site_panic(p_job_id uuid, p_interaction_id text)
returns setof public.site_panic_state
language plpgsql
security invoker
set search_path = ''
as $$
begin
  -- A signed Discord interaction can never start a second deletion after failure.
  if exists (select 1 from public.site_panic_receipts where interaction_id = p_interaction_id) then
    return;
  end if;
  update public.site_panic_state
  set job_id = p_job_id, status = 'running', last_error = null, updated_at = now()
  where id = true
    and (status <> 'running' or updated_at < now() - interval '15 minutes');
  if not found then return; end if;
  insert into public.site_panic_receipts (interaction_id) values (p_interaction_id);
  return query select * from public.site_panic_state where id = true;
end;
$$;
revoke all on function public.claim_site_panic(uuid, text) from public, anon, authenticated;
grant execute on function public.claim_site_panic(uuid, text) to service_role;
