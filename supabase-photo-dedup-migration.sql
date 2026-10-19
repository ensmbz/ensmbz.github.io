-- Apply once in the Supabase SQL Editor to detect exact and visually similar uploads.
alter table public.photo_submissions
  add column if not exists content_hash text,
  add column if not exists perceptual_hash text;

create unique index if not exists photo_submissions_content_hash_key
  on public.photo_submissions (content_hash)
  where content_hash is not null;

create unique index if not exists photo_submissions_perceptual_hash_key
  on public.photo_submissions (perceptual_hash)
  where perceptual_hash is not null;

create or replace function public.photo_hash_distance(left_hash text, right_hash text)
returns integer
language plpgsql
immutable
strict
as $$
declare
  left_bytes bytea;
  right_bytes bytea;
  distance integer := 0;
  bit_index integer;
begin
  if left_hash !~ '^[0-9a-fA-F]{16}$' or right_hash !~ '^[0-9a-fA-F]{16}$' then
    return null;
  end if;
  left_bytes := decode(left_hash, 'hex');
  right_bytes := decode(right_hash, 'hex');
  for bit_index in 0..63 loop
    if get_bit(left_bytes, bit_index) <> get_bit(right_bytes, bit_index) then
      distance := distance + 1;
    end if;
  end loop;
  return distance;
end;
$$;

create or replace function public.is_duplicate_photo(
  candidate_hash text,
  candidate_content_hash text,
  max_distance integer default 6
)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.photo_submissions as photos
    where photos.content_hash = candidate_content_hash
       or (
         photos.perceptual_hash ~ '^[0-9a-fA-F]{16}$'
         and public.photo_hash_distance(photos.perceptual_hash, candidate_hash)
             <= greatest(0, least(coalesce(max_distance, 6), 12))
       )
  );
$$;

revoke all on function public.is_duplicate_photo(text, text, integer) from public;
grant execute on function public.is_duplicate_photo(text, text, integer) to anon, authenticated;

create or replace function public.reject_duplicate_photo()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if new.content_hash is null or new.content_hash !~ '^[0-9a-fA-F]{64}$'
     or new.perceptual_hash is null or new.perceptual_hash !~ '^[0-9a-fA-F]{16}$' then
    raise exception using errcode = '23514', message = 'Photo fingerprints are required';
  end if;

  -- Serialize submissions so two people cannot upload near-identical photos at once.
  perform pg_catalog.pg_advisory_xact_lock(735501928);

  if exists (
    select 1
    from public.photo_submissions as photos
    where photos.content_hash = new.content_hash
       or (
         photos.perceptual_hash ~ '^[0-9a-fA-F]{16}$'
         and public.photo_hash_distance(photos.perceptual_hash, new.perceptual_hash) <= 6
       )
  ) then
    raise exception using errcode = '23505', message = 'Duplicate photo detected';
  end if;

  return new;
end;
$$;

drop trigger if exists photo_submissions_reject_duplicates on public.photo_submissions;
create trigger photo_submissions_reject_duplicates
before insert on public.photo_submissions
for each row execute function public.reject_duplicate_photo();

drop policy if exists "Anyone can submit photos for review" on public.photo_submissions;
create policy "Anyone can submit photos for review"
on public.photo_submissions
for insert
to anon
with check (
  char_length(name) between 1 and 60
  and char_length(image_url) <= 2048
  and approved = false
  and content_hash ~ '^[0-9a-fA-F]{64}$'
  and perceptual_hash ~ '^[0-9a-fA-F]{16}$'
);
