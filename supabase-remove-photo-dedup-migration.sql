-- Remove duplicate-photo enforcement while preserving all existing submissions.
drop trigger if exists photo_submissions_reject_duplicates on public.photo_submissions;
drop function if exists public.reject_duplicate_photo();
drop function if exists public.is_duplicate_photo(text, text, integer);
drop function if exists public.photo_hash_distance(text, text);
drop index if exists public.photo_submissions_content_hash_key;
drop index if exists public.photo_submissions_perceptual_hash_key;

drop policy if exists "Anyone can submit photos for review" on public.photo_submissions;
create policy "Anyone can submit photos for review"
on public.photo_submissions
for insert
to anon
with check (
  char_length(name) between 1 and 60
  and char_length(image_url) <= 2048
  and approved = false
);
