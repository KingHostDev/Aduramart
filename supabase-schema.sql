create type approval_status as enum ('pending', 'approved', 'rejected', 'hidden', 'suspended');
create type order_status as enum ('placed', 'confirmed', 'packed', 'in-transit', 'delivered');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  role text not null check (role in ('customer', 'vendor', 'admin', 'super_admin')) default 'customer',
  phone text,
  created_at timestamptz not null default now()
);

create table public.vendors (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id),
  owner_name text not null,
  store_name text not null,
  email text not null,
  phone text not null,
  category text not null,
  location text not null default 'Nigeria',
  whatsapp text,
  description text,
  government_id_url text,
  selfie_url text,
  id_type text,
  id_number text,
  date_of_birth date,
  kyc_status text not null default 'not_configured',
  kyc_provider text,
  kyc_reference text,
  kyc_result jsonb,
  banner_url text,
  logo_url text,
  status approval_status not null default 'pending',
  verified boolean not null default false,
  rating numeric default 0,
  likes_count integer not null default 0,
  sales integer not null default 0,
  created_at timestamptz not null default now()
);


create table public.vendor_likes (
  id uuid primary key default gen_random_uuid(),
  vendor_id uuid not null references public.vendors(id) on delete cascade,
  visitor_key text not null,
  created_at timestamptz not null default now(),
  unique (vendor_id, visitor_key)
);
create table public.products (
  id uuid primary key default gen_random_uuid(),
  vendor_id uuid not null references public.vendors(id) on delete cascade,
  name text not null,
  category text not null,
  price integer not null check (price >= 0),
  description text,
  stock integer not null default 0,
  image_url text,
  status approval_status not null default 'pending',
  rejection_reason text,
  featured boolean not null default false,
  created_at timestamptz not null default now()
);

create table public.orders (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid references auth.users(id),
  customer_name text not null,
  customer_email text not null,
  delivery_address text not null,
  delivery_method text not null,
  payment_method text not null,
  status order_status not null default 'placed',
  total integer not null,
  created_at timestamptz not null default now()
);

create table public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id uuid not null references public.products(id),
  vendor_id uuid not null references public.vendors(id),
  quantity integer not null check (quantity > 0),
  unit_price integer not null
);

create table public.messages (
  id uuid primary key default gen_random_uuid(),
  sender_id uuid references auth.users(id),
  vendor_id uuid references public.vendors(id),
  body text not null,
  read_at timestamptz,
  created_at timestamptz not null default now()
);

create table public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id),
  title text not null,
  body text not null,
  read_at timestamptz,
  created_at timestamptz not null default now()
);

alter table public.vendors enable row level security;
alter table public.vendor_likes enable row level security;
alter table public.products enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.messages enable row level security;
alter table public.notifications enable row level security;

create policy "Approved vendors are public" on public.vendors for select using (status = 'approved' or auth.uid() is not null);
create policy "Vendor likes are readable" on public.vendor_likes for select using (true);
create policy "Approved products are public" on public.products for select using (status = 'approved' or auth.uid() is not null);
create policy "Vendors can submit applications" on public.vendors for insert with check (status = 'pending');
create policy "Products enter review queue" on public.products for insert with check (
  status = 'pending'
  and exists (
    select 1 from public.vendors
    where vendors.id = vendor_id
      and vendors.user_id = auth.uid()
      and vendors.status = 'approved'
  )
);
