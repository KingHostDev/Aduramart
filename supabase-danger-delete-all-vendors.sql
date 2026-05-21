-- DANGER: Run only if you intentionally want to permanently remove every vendor.
-- This clears vendor likes, products, vendor profiles, and related vendor auth/profile rows where possible.
-- Review carefully before running in Supabase SQL Editor.

begin;

create temporary table vendors_to_delete as
select id, user_id
from public.vendors;

delete from public.vendor_likes
where vendor_id in (select id from vendors_to_delete);

delete from public.products
where vendor_id in (select id from vendors_to_delete);

delete from public.vendors
where id in (select id from vendors_to_delete);

delete from public.profiles
where id in (select user_id from vendors_to_delete where user_id is not null)
  and role = 'vendor';

commit;

-- Auth users cannot always be deleted safely from SQL Editor in hosted Supabase.
-- If you need to remove vendor auth users too, use the Supabase Auth Users screen
-- or the Super Admin permanent deletion button for each vendor before clearing all records.
