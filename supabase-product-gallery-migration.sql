-- Run this once to support up to 5 product images per listing.

alter table public.products
  add column if not exists image_urls text[];

update public.products
set image_urls = array[image_url]
where image_url is not null
  and (image_urls is null or cardinality(image_urls) = 0);