-- Run this once to store vendor payout preferences for live settlements.

alter table public.vendors
  add column if not exists payment_bank_name text,
  add column if not exists payment_account_name text,
  add column if not exists payment_account_number text;