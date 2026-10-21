alter table public.chat_messages
  add column if not exists client_id text;

alter table public.chat_messages
  drop constraint if exists chat_messages_client_id_length;

alter table public.chat_messages
  add constraint chat_messages_client_id_length
  check (client_id is null or char_length(client_id) between 8 and 100);
