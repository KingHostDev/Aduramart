# AduraMart

AduraMart is a premium faith-based multi-vendor spiritual marketplace for white garment churches, worship communities, vendors, and customers across Nigeria and beyond.

## What is included

- Next.js 15 app router application
- Tailwind CSS 4 styling with the AduraMart brand palette
- Supabase-ready data access for vendors, products, orders, messages, and notifications
- Vendor onboarding with pending approval status
- Product submission with pending review status
- Admin dashboard queues for vendor approval and listing moderation
- Marketplace, product details, vendor storefronts, cart, checkout, vendor login, admin login, messaging, notifications, settings, and order tracking

## Go live setup

1. Install dependencies:

```bash
npm.cmd install
```

2. Create `.env.local` from `.env.example` and add your Supabase and Paystack keys. This workspace already has a local `.env.local`; keep it private.

3. Run `supabase-schema.sql` in your Supabase SQL editor.

4. Create Supabase Storage buckets for:

- `vendor-government-ids`
- `vendor-selfies`
- `vendor-banners`
- `vendor-logos`
- `product-images`

5. Start development:

```bash
npm.cmd run dev
```

## Approval model

- Vendor onboarding lives at `/vendor/onboarding`.
- Vendor login lives at `/vendor-login`.
- Admin login lives at `/admin`.
- New vendor applications are inserted with `status = pending`.
- The public vendors page fetches only `status = approved`.
- New product listings are inserted with `status = pending`.
- The public marketplace fetches only `status = approved`.
- Admin approval endpoints update pending records when connected to authenticated admin controls.
