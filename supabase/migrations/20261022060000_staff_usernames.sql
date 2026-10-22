alter table public.staff_permissions add column if not exists username text;

update public.staff_permissions
set username = lower(regexp_replace(split_part(email, '@', 1), '[^a-z0-9_-]', '', 'g'))
where username is null;

alter table public.staff_permissions alter column username set not null;
alter table public.staff_permissions add constraint staff_permissions_username_format
  check (username ~ '^[a-z0-9][a-z0-9_-]{2,31}$') not valid;
alter table public.staff_permissions validate constraint staff_permissions_username_format;
create unique index if not exists staff_permissions_username_key on public.staff_permissions (username);
