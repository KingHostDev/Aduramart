-- Run this if public.messages already exists but is missing the newer AduraMart columns.
-- It safely repairs the table without dropping existing message rows.

alter table public.messages
  add column if not exists sender_email text,
  add column if not exists sender_name text,
  add column if not exists recipient_type text,
  add column if not exists recipient_id uuid,
  add column if not exists subject text,
  add column if not exists body text,
  add column if not exists status text default 'new',
  add column if not exists created_at timestamptz default now();

update public.messages
set sender_email = coalesce(sender_email, 'unknown@aduramart.local'),
    recipient_type = coalesce(recipient_type, 'admin'),
    subject = coalesce(subject, 'AduraMart message'),
    body = coalesce(body, 'No message body provided.'),
    status = coalesce(status, 'new'),
    created_at = coalesce(created_at, now())
where sender_email is null
   or recipient_type is null
   or subject is null
   or body is null
   or status is null
   or created_at is null;

alter table public.messages
  alter column sender_email set not null,
  alter column recipient_type set not null,
  alter column subject set not null,
  alter column body set not null,
  alter column status set not null,
  alter column created_at set not null;

do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'messages_recipient_type_check'
      and conrelid = 'public.messages'::regclass
  ) then
    alter table public.messages
      add constraint messages_recipient_type_check
      check (recipient_type in ('admin', 'vendor'));
  end if;

  if not exists (
    select 1 from pg_constraint
    where conname = 'messages_status_check'
      and conrelid = 'public.messages'::regclass
  ) then
    alter table public.messages
      add constraint messages_status_check
      check (status in ('new', 'read', 'resolved'));
  end if;
end $$;

create index if not exists messages_recipient_idx on public.messages(recipient_type, recipient_id);
create index if not exists messages_created_at_idx on public.messages(created_at desc);

alter table public.messages enable row level security;

drop policy if exists "Anyone can submit contact messages" on public.messages;
create policy "Anyone can submit contact messages" on public.messages
for insert
with check (true);

drop policy if exists "Admins can read messages" on public.messages;
create policy "Admins can read messages" on public.messages
for select
using (
  exists (
    select 1 from public.profiles
    where profiles.id = auth.uid()
      and profiles.role in ('admin', 'super_admin')
  )
);
