alter table public.chat_messages
  add column if not exists sender_role text not null default 'guest'
  check (sender_role in ('guest', 'staff', 'owner'));

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
  elsif signed_in_email <> '' and exists (
    select 1 from public.staff_permissions where email = signed_in_email
  ) then
    new.sender_role := 'staff';
  end if;
  return new;
end;
$$;

drop trigger if exists label_chat_sender_before_insert on public.chat_messages;
create trigger label_chat_sender_before_insert
before insert on public.chat_messages
for each row execute function public.label_chat_sender();
