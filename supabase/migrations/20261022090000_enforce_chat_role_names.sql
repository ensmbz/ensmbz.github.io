create or replace function public.label_chat_sender()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  signed_in_email text := lower(coalesce(auth.jwt()->>'email', ''));
begin
  new.sender_role := 'guest';
  if signed_in_email <> '' and exists (
    select 1 from public.photo_admin_emails where email = signed_in_email
  ) then
    new.sender_role := 'owner';
    new.name := 'Owner';
  elsif signed_in_email <> '' and exists (
    select 1 from public.staff_permissions where email = signed_in_email
  ) then
    new.sender_role := 'staff';
    new.name := 'Staff';
  elsif lower(trim(new.name)) in ('owner', 'staff') then
    new.name := 'Guest';
  end if;
  return new;
end;
$$;
