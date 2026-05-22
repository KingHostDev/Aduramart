-- Run this once if product image uploads fail or the product-images bucket does not exist.
-- The app uploads product photos with the service role and reads them publicly for marketplace cards/details.

insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do update set public = true;

drop policy if exists "Product images are publicly readable" on storage.objects;
create policy "Product images are publicly readable"
on storage.objects for select
using (bucket_id = 'product-images');