alter table public.site_control add column if not exists panic_mode boolean not null default false;
grant update (panic_mode) on public.site_control to authenticated;
