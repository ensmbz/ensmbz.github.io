create table if not exists public.staff_permissions (
  email text primary key check (email = lower(email)),
  review_photos boolean not null default false,
  manage_comments boolean not null default false,
  manage_reports boolean not null default false,
  manage_takedowns boolean not null default false,
  manage_chat boolean not null default false,
  manage_site boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.site_reports add column if not exists status text not null default 'open';

create or replace function public.is_site_owner()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.photo_admin_emails
    where email = lower(coalesce(auth.jwt()->>'email', ''))
  );
$$;

create or replace function public.has_staff_permission(permission_name text)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select public.is_site_owner() or exists (
    select 1 from public.staff_permissions
    where email = lower(coalesce(auth.jwt()->>'email', ''))
      and case permission_name
        when 'review_photos' then review_photos
        when 'manage_comments' then manage_comments
        when 'manage_reports' then manage_reports
        when 'manage_takedowns' then manage_takedowns
        when 'manage_chat' then manage_chat
        when 'manage_site' then manage_site
        else false
      end
  );
$$;

revoke all on function public.is_site_owner() from public;
revoke all on function public.has_staff_permission(text) from public;
grant execute on function public.is_site_owner() to authenticated;
grant execute on function public.has_staff_permission(text) to authenticated;

alter table public.staff_permissions enable row level security;
revoke all on public.staff_permissions from anon;
grant select, insert, update, delete on public.staff_permissions to authenticated;
drop policy if exists "staff reads own permissions" on public.staff_permissions;
create policy "staff reads own permissions" on public.staff_permissions for select to authenticated
  using (email = lower(coalesce(auth.jwt()->>'email', '')) or public.is_site_owner());
drop policy if exists "owner adds staff" on public.staff_permissions;
create policy "owner adds staff" on public.staff_permissions for insert to authenticated
  with check (public.is_site_owner());
drop policy if exists "owner updates staff" on public.staff_permissions;
create policy "owner updates staff" on public.staff_permissions for update to authenticated
  using (public.is_site_owner()) with check (public.is_site_owner());
drop policy if exists "owner removes staff" on public.staff_permissions;
create policy "owner removes staff" on public.staff_permissions for delete to authenticated
  using (public.is_site_owner());

drop policy if exists "staff reviews pending photos" on public.photo_submissions;
create policy "staff reviews pending photos" on public.photo_submissions for select to authenticated
  using (approved = false and status = 'pending' and public.has_staff_permission('review_photos'));
drop policy if exists "staff decides pending photos" on public.photo_submissions;
create policy "staff decides pending photos" on public.photo_submissions for update to authenticated
  using (approved = false and status = 'pending' and public.has_staff_permission('review_photos'))
  with check (status in ('approved','rejected') and public.has_staff_permission('review_photos'));

drop policy if exists "staff reviews comments" on public.photo_comments;
create policy "staff reviews comments" on public.photo_comments for select to authenticated
  using (public.has_staff_permission('manage_comments'));
drop policy if exists "staff moderates comments" on public.photo_comments;
create policy "staff moderates comments" on public.photo_comments for update to authenticated
  using (public.has_staff_permission('manage_comments'))
  with check (status in ('visible','removed') and public.has_staff_permission('manage_comments'));

drop policy if exists "staff reviews reports" on public.site_reports;
create policy "staff reviews reports" on public.site_reports for select to authenticated
  using (public.has_staff_permission('manage_reports'));
drop policy if exists "staff resolves reports" on public.site_reports;
create policy "staff resolves reports" on public.site_reports for update to authenticated
  using (public.has_staff_permission('manage_reports'))
  with check (status in ('open','resolved') and public.has_staff_permission('manage_reports'));

drop policy if exists "staff reviews takedowns" on public.photo_takedown_requests;
create policy "staff reviews takedowns" on public.photo_takedown_requests for select to authenticated
  using (public.has_staff_permission('manage_takedowns'));
drop policy if exists "staff resolves takedowns" on public.photo_takedown_requests;
create policy "staff resolves takedowns" on public.photo_takedown_requests for update to authenticated
  using (public.has_staff_permission('manage_takedowns'))
  with check (status in ('pending','resolved') and public.has_staff_permission('manage_takedowns'));
drop policy if exists "staff removes approved photos" on public.photo_submissions;
create policy "staff removes approved photos" on public.photo_submissions for update to authenticated
  using (approved = true and status = 'approved' and public.has_staff_permission('manage_takedowns'))
  with check (approved = false and status = 'rejected' and public.has_staff_permission('manage_takedowns'));

grant delete on public.chat_messages to authenticated;
drop policy if exists "staff deletes chat messages" on public.chat_messages;
create policy "staff deletes chat messages" on public.chat_messages for delete to authenticated
  using (public.has_staff_permission('manage_chat'));

grant update (is_live, updated_at) on public.site_control to authenticated;
drop policy if exists "staff controls site status" on public.site_control;
create policy "staff controls site status" on public.site_control for update to authenticated
  using (id is true and public.has_staff_permission('manage_site'))
  with check (id is true and public.has_staff_permission('manage_site'));
