create table if not exists public.content_ip_log (
  content_type text not null,
  content_id text not null,
  ip_address text not null,
  created_at timestamptz not null default now(),
  primary key (content_type, content_id)
);

alter table public.content_ip_log enable row level security;
revoke all on public.content_ip_log from anon;
grant select on public.content_ip_log to authenticated;

drop policy if exists "owner can read content ips" on public.content_ip_log;
create policy "owner can read content ips"
on public.content_ip_log for select
to authenticated
using (lower(coalesce(auth.jwt() ->> 'email', '')) = 'max378641@gmail.com');

create or replace function public.capture_content_ip()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  request_headers jsonb := coalesce(nullif(current_setting('request.headers', true), ''), '{}')::jsonb;
  visitor_ip text := coalesce(
    request_headers ->> 'cf-connecting-ip',
    split_part(coalesce(request_headers ->> 'x-forwarded-for', ''), ',', 1),
    request_headers ->> 'x-real-ip'
  );
begin
  visitor_ip := trim(visitor_ip);
  if visitor_ip <> '' then
    insert into public.content_ip_log (content_type, content_id, ip_address)
    values (tg_table_name, new.id::text, visitor_ip)
    on conflict (content_type, content_id) do update set ip_address = excluded.ip_address;
  end if;
  return new;
end;
$$;

do $$
declare table_name text;
begin
  foreach table_name in array array['photo_submissions', 'photo_comments', 'chat_messages'] loop
    execute format('drop trigger if exists capture_content_ip on public.%I', table_name);
    execute format('create trigger capture_content_ip after insert on public.%I for each row execute function public.capture_content_ip()', table_name);
  end loop;
end $$;
