-- Run this once to store buyer/vendor/admin contact messages.

create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  sender_email text not null,
  sender_name text,
  recipient_type text not null check (recipient_type in ('admin', 'vendor')),
  recipient_id uuid,
  subject text not null,
  body text not null,
  status text not null default 'new' check (status in ('new', 'read', 'resolved')),
  created_at timestamptz not null default now()
);

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
