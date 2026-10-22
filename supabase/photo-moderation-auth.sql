-- Run after replacing OWNER_EMAIL_HERE with the owner's Supabase Auth email.
-- This email is an access identifier, not an API secret. Never place a service key here.
create table if not exists public.photo_admin_emails (
  email text primary key check (email = lower(email))
);
alter table public.photo_admin_emails enable row level security;
revoke all on public.photo_admin_emails from anon, authenticated;
grant select on public.photo_admin_emails to authenticated;
drop policy if exists "Owners can read their own admin email" on public.photo_admin_emails;
create policy "Owners can read their own admin email" on public.photo_admin_emails
  for select to authenticated
  using (email = lower(coalesce(auth.jwt()->>'email', '')));

insert into public.photo_admin_emails(email) values (lower('OWNER_EMAIL_HERE'))
on conflict (email) do nothing;

grant update (approved, status) on public.photo_submissions to authenticated;
drop policy if exists "Owners can review pending photos" on public.photo_submissions;
create policy "Owners can review pending photos" on public.photo_submissions
  for select to authenticated
  using (
    approved = false and status = 'pending'
    and exists (select 1 from public.photo_admin_emails a where a.email = lower(coalesce(auth.jwt()->>'email', '')))
  );
drop policy if exists "Owners can approve or decline photos" on public.photo_submissions;
create policy "Owners can approve or decline photos" on public.photo_submissions
  for update to authenticated
  using (
    approved = false and status = 'pending'
    and exists (select 1 from public.photo_admin_emails a where a.email = lower(coalesce(auth.jwt()->>'email', '')))
  )
  with check (
    status in ('approved','rejected')
    and exists (select 1 from public.photo_admin_emails a where a.email = lower(coalesce(auth.jwt()->>'email', '')))
  );
