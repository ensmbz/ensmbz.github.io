-- Run once in the Supabase SQL Editor to enable reviewed video submissions.
alter table public.photo_submissions
  add column if not exists media_type text not null default 'image';

alter table public.photo_submissions
  drop constraint if exists photo_submissions_media_type_check;

alter table public.photo_submissions
  add constraint photo_submissions_media_type_check
  check (media_type in ('image', 'video'));

drop policy if exists "Anyone can submit photos for review" on public.photo_submissions;
create policy "Anyone can submit photos for review"
on public.photo_submissions
for insert
to anon
with check (
  char_length(name) between 1 and 60
  and char_length(image_url) <= 2048
  and media_type in ('image', 'video')
  and approved = false
);

update storage.buckets
set file_size_limit = null,
    allowed_mime_types = array['image/*', 'video/*']
where id = 'zayed-photos';
