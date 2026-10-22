-- Run after photo-moderation-auth.sql. Uses the existing owner email allowlist.
-- Gives the allowlisted owner private access to reports, comments, and takedown requests.

alter table public.site_reports
  add column if not exists status text not null default 'open';
do $$ begin
  alter table public.site_reports add constraint site_reports_status_check
    check (status in ('open', 'resolved'));
exception when duplicate_object then null;
end $$;

grant select, update (status) on public.photo_comments to authenticated;
drop policy if exists "Owners can review all comments" on public.photo_comments;
create policy "Owners can review all comments" on public.photo_comments
  for select to authenticated
  using (exists (
    select 1 from public.photo_admin_emails a
    where a.email = lower(coalesce(auth.jwt()->>'email', ''))
  ));
drop policy if exists "Owners can hide comments" on public.photo_comments;
create policy "Owners can hide comments" on public.photo_comments
  for update to authenticated
  using (exists (
    select 1 from public.photo_admin_emails a
    where a.email = lower(coalesce(auth.jwt()->>'email', ''))
  ))
  with check (status in ('visible', 'removed') and exists (
    select 1 from public.photo_admin_emails a
    where a.email = lower(coalesce(auth.jwt()->>'email', ''))
  ));

grant select, update (status) on public.site_reports to authenticated;
drop policy if exists "Owners can review reports" on public.site_reports;
create policy "Owners can review reports" on public.site_reports
  for select to authenticated
  using (exists (
    select 1 from public.photo_admin_emails a
    where a.email = lower(coalesce(auth.jwt()->>'email', ''))
  ));
drop policy if exists "Owners can resolve reports" on public.site_reports;
create policy "Owners can resolve reports" on public.site_reports
  for update to authenticated
  using (status = 'open' and exists (
    select 1 from public.photo_admin_emails a
    where a.email = lower(coalesce(auth.jwt()->>'email', ''))
  ))
  with check (status in ('open', 'resolved') and exists (
    select 1 from public.photo_admin_emails a
    where a.email = lower(coalesce(auth.jwt()->>'email', ''))
  ));

grant select, update (status) on public.photo_takedown_requests to authenticated;
drop policy if exists "Owners can review takedown requests" on public.photo_takedown_requests;
create policy "Owners can review takedown requests" on public.photo_takedown_requests
  for select to authenticated
  using (exists (
    select 1 from public.photo_admin_emails a
    where a.email = lower(coalesce(auth.jwt()->>'email', ''))
  ));
drop policy if exists "Owners can resolve takedown requests" on public.photo_takedown_requests;
create policy "Owners can resolve takedown requests" on public.photo_takedown_requests
  for update to authenticated
  using (status = 'pending' and exists (
    select 1 from public.photo_admin_emails a
    where a.email = lower(coalesce(auth.jwt()->>'email', ''))
  ))
  with check (status in ('pending', 'resolved') and exists (
    select 1 from public.photo_admin_emails a
    where a.email = lower(coalesce(auth.jwt()->>'email', ''))
  ));

grant update (approved, status) on public.photo_submissions to authenticated;
drop policy if exists "Owners can review approved photos for takedown" on public.photo_submissions;
create policy "Owners can review approved photos for takedown" on public.photo_submissions
  for select to authenticated
  using (approved = true and status = 'approved' and exists (
    select 1 from public.photo_admin_emails a
    where a.email = lower(coalesce(auth.jwt()->>'email', ''))
  ));
drop policy if exists "Owners can take down approved photos" on public.photo_submissions;
create policy "Owners can take down approved photos" on public.photo_submissions
  for update to authenticated
  using (approved = true and status = 'approved' and exists (
    select 1 from public.photo_admin_emails a
    where a.email = lower(coalesce(auth.jwt()->>'email', ''))
  ))
  with check (approved = false and status = 'rejected' and exists (
    select 1 from public.photo_admin_emails a
    where a.email = lower(coalesce(auth.jwt()->>'email', ''))
  ));
