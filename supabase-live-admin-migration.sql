-- Run this once on an existing AduraMart Supabase project.
-- It adds Super Admin/Admin team roles and vendor lifecycle states.

alter type approval_status add value if not exists 'hidden';
alter type approval_status add value if not exists 'suspended';

do $$
declare
  constraint_name text;
begin
  select conname into constraint_name
  from pg_constraint
  where conrelid = 'public.profiles'::regclass
    and contype = 'c'
    and pg_get_constraintdef(oid) like '%role%';

  if constraint_name is not null then
    execute format('alter table public.profiles drop constraint %I', constraint_name);
  end if;
end $$;

alter table public.profiles
  add constraint profiles_role_check
  check (role in ('customer', 'vendor', 'admin', 'super_admin'));

drop policy if exists "Products enter review queue" on public.products;

create policy "Products enter review queue" on public.products
for insert
with check (
  status = 'pending'
  and exists (
    select 1 from public.vendors
    where vendors.id = vendor_id
      and vendors.user_id = auth.uid()
      and vendors.status = 'approved'
  )
);
-- Promote the current project owner account to Super Admin.
insert into public.profiles (id, full_name, role, phone)
select id, 'AduraMart Super Admin', 'super_admin', null
from auth.users
where email = 'the1kinghost@gmail.com'
on conflict (id) do update
set role = 'super_admin',
    full_name = coalesce(public.profiles.full_name, 'AduraMart Super Admin');