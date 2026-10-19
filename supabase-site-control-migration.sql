-- Create public read-only site status for the pause screen.
create table if not exists public.site_control (
  id boolean primary key default true check (id is true),
  is_live boolean not null default true,
  updated_at timestamptz not null default now()
);

insert into public.site_control (id, is_live)
values (true, true)
on conflict (id) do nothing;

alter table public.site_control enable row level security;
grant select on public.site_control to anon, authenticated;

create policy "Anyone can read site status"
on public.site_control
for select
to anon, authenticated
using (id is true);
