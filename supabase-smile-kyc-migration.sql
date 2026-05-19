-- Run this once to prepare vendor records for Smile ID automatic KYC.

alter table public.vendors
  add column if not exists id_type text,
  add column if not exists id_number text,
  add column if not exists date_of_birth date,
  add column if not exists kyc_status text not null default 'not_configured',
  add column if not exists kyc_provider text,
  add column if not exists kyc_reference text,
  add column if not exists kyc_result jsonb;

create index if not exists vendors_kyc_status_idx on public.vendors(kyc_status);
create index if not exists vendors_kyc_reference_idx on public.vendors(kyc_reference);