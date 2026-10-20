-- Track the Discord message for each approved photo in #photo-archive.
alter table public.photo_submissions
  add column if not exists discord_archive_message_id text;
