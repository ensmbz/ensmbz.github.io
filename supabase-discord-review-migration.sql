-- Run once in Supabase SQL Editor to add review status and message tracking.
alter table public.photo_submissions
  add column if not exists status text not null default 'pending',
  add column if not exists discord_message_id text;

update public.photo_submissions
set status = 'approved'
where approved = true and status = 'pending';

do $$
begin
  alter table public.photo_submissions
    add constraint photo_submissions_status_check
    check (status in ('pending', 'approved', 'rejected'));
exception when duplicate_object then null;
end $$;

create index if not exists photo_submissions_status_created_at_idx
  on public.photo_submissions (status, created_at desc);
