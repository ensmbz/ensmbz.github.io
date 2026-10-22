create or replace function public.moderate_photo(
  photo_id bigint,
  approve boolean,
  photo_url text default null,
  photo_name text default null
)
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  changed integer;
begin
  if not public.has_staff_permission('review_photos') then
    raise exception 'You do not have permission to review photos.' using errcode = '42501';
  end if;

  update public.photo_submissions
  set approved = approve,
      status = case when approve then 'approved' else 'rejected' end
  where status = 'pending'
    and approved = false
    and (id = photo_id or (photo_url is not null and photo_name is not null and image_url = photo_url and name = photo_name));
  get diagnostics changed = row_count;
  if changed = 0 then raise exception 'This submission has already been reviewed.'; end if;
  return changed;
end;
$$;

revoke all on function public.moderate_photo(bigint, boolean, text, text) from public;
grant execute on function public.moderate_photo(bigint, boolean, text, text) to authenticated;
