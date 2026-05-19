-- Run this once to add buyer likes for approved vendor profiles.

alter table public.vendors
  add column if not exists likes_count integer not null default 0;

create table if not exists public.vendor_likes (
  id uuid primary key default gen_random_uuid(),
  vendor_id uuid not null references public.vendors(id) on delete cascade,
  visitor_key text not null,
  created_at timestamptz not null default now(),
  unique (vendor_id, visitor_key)
);

create index if not exists vendor_likes_vendor_id_idx on public.vendor_likes(vendor_id);

alter table public.vendor_likes enable row level security;

drop policy if exists "Vendor likes are readable" on public.vendor_likes;
create policy "Vendor likes are readable" on public.vendor_likes
for select using (true);

update public.vendors v
set likes_count = counts.total
from (
  select vendor_id, count(*)::integer as total
  from public.vendor_likes
  group by vendor_id
) counts
where counts.vendor_id = v.id;