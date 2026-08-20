-- Work2U expense reporting step 02
-- Expense receipts and OCR extraction
-- Run after docs/work2u-expense-step-01-categories.sql

create extension if not exists pgcrypto;

create table if not exists public.expense_receipts (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces on delete cascade,
  owner_id uuid not null references auth.users on delete cascade,
  category_id uuid references public.expense_categories on delete set null,
  source_channel text not null default 'upload',
  expense_month date not null default date_trunc('month', now())::date,
  vendor_name text not null default '',
  vendor_normalized_name text not null default '',
  receipt_number text,
  receipt_date date,
  currency text not null default 'MYR',
  subtotal_amount numeric(12,2) not null default 0,
  tax_amount numeric(12,2) not null default 0,
  total_amount numeric(12,2) not null default 0,
  payment_method text,
  expense_type text not null default 'direct',
  ocr_status text not null default 'pending',
  review_status text not null default 'pending',
  ocr_provider text,
  ocr_confidence numeric(5,2) not null default 0,
  raw_text text,
  extracted_data jsonb not null default '{}'::jsonb,
  duplicate_hash text,
  file_name text not null,
  file_url text not null,
  mime_type text,
  file_size integer,
  notes text,
  reviewed_by uuid references auth.users on delete set null,
  reviewed_at timestamptz,
  created_by uuid references auth.users on delete set null,
  updated_by uuid references auth.users on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint expense_receipts_source_channel_check check (source_channel in ('upload', 'manual', 'email', 'import')),
  constraint expense_receipts_expense_type_check check (expense_type in ('direct', 'overhead', 'travel', 'tools', 'marketing', 'subscription', 'other')),
  constraint expense_receipts_ocr_status_check check (ocr_status in ('pending', 'processing', 'complete', 'failed')),
  constraint expense_receipts_review_status_check check (review_status in ('pending', 'approved', 'flagged', 'rejected')),
  constraint expense_receipts_amount_check check (subtotal_amount >= 0 and tax_amount >= 0 and total_amount >= 0),
  constraint expense_receipts_ocr_confidence_check check (ocr_confidence between 0 and 100)
);

drop trigger if exists set_expense_receipts_updated_at on public.expense_receipts;
create trigger set_expense_receipts_updated_at
before update on public.expense_receipts
for each row
execute procedure public.set_updated_at();

create index if not exists expense_receipts_workspace_id_idx on public.expense_receipts (workspace_id);
create index if not exists expense_receipts_owner_id_idx on public.expense_receipts (owner_id);
create index if not exists expense_receipts_category_id_idx on public.expense_receipts (category_id);
create index if not exists expense_receipts_expense_month_idx on public.expense_receipts (expense_month);
create index if not exists expense_receipts_review_status_idx on public.expense_receipts (review_status);
create index if not exists expense_receipts_vendor_idx on public.expense_receipts (workspace_id, vendor_normalized_name);
create unique index if not exists expense_receipts_duplicate_hash_uidx
on public.expense_receipts (workspace_id, duplicate_hash)
where duplicate_hash is not null;

alter table public.expense_receipts enable row level security;

drop policy if exists expense_receipts_select_owner on public.expense_receipts;
drop policy if exists expense_receipts_insert_owner on public.expense_receipts;
drop policy if exists expense_receipts_update_owner on public.expense_receipts;
drop policy if exists expense_receipts_delete_owner on public.expense_receipts;
drop policy if exists expense_receipts_select_super_admin on public.expense_receipts;
drop policy if exists expense_receipts_insert_super_admin on public.expense_receipts;
drop policy if exists expense_receipts_update_super_admin on public.expense_receipts;
drop policy if exists expense_receipts_delete_super_admin on public.expense_receipts;

create policy expense_receipts_select_owner
on public.expense_receipts
for select
to authenticated
using (public.workspace_has_access(workspace_id));

create policy expense_receipts_insert_owner
on public.expense_receipts
for insert
to authenticated
with check (public.workspace_has_access(workspace_id));

create policy expense_receipts_update_owner
on public.expense_receipts
for update
to authenticated
using (public.workspace_has_access(workspace_id))
with check (public.workspace_has_access(workspace_id));

create policy expense_receipts_delete_owner
on public.expense_receipts
for delete
to authenticated
using (public.workspace_has_access(workspace_id));

create policy expense_receipts_select_super_admin
on public.expense_receipts
for select
to authenticated
using (public.is_super_admin());

create policy expense_receipts_insert_super_admin
on public.expense_receipts
for insert
to authenticated
with check (public.is_super_admin());

create policy expense_receipts_update_super_admin
on public.expense_receipts
for update
to authenticated
using (public.is_super_admin())
with check (public.is_super_admin());

create policy expense_receipts_delete_super_admin
on public.expense_receipts
for delete
to authenticated
using (public.is_super_admin());

create table if not exists public.expense_receipt_extractions (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces on delete cascade,
  expense_receipt_id uuid not null references public.expense_receipts on delete cascade,
  model_provider text not null default 'openai',
  model_name text,
  prompt_version text,
  raw_text text,
  extracted_json jsonb not null default '{}'::jsonb,
  confidence_score numeric(5,2) not null default 0,
  review_status text not null default 'draft',
  applied_by uuid references auth.users on delete set null,
  applied_at timestamptz,
  created_by uuid references auth.users on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint expense_receipt_extractions_review_status_check check (review_status in ('draft', 'applied', 'discarded')),
  constraint expense_receipt_extractions_confidence_check check (confidence_score between 0 and 100)
);

drop trigger if exists set_expense_receipt_extractions_updated_at on public.expense_receipt_extractions;
create trigger set_expense_receipt_extractions_updated_at
before update on public.expense_receipt_extractions
for each row
execute procedure public.set_updated_at();

create index if not exists expense_receipt_extractions_workspace_id_idx on public.expense_receipt_extractions (workspace_id);
create index if not exists expense_receipt_extractions_receipt_id_idx on public.expense_receipt_extractions (expense_receipt_id);
create index if not exists expense_receipt_extractions_review_status_idx on public.expense_receipt_extractions (review_status);

alter table public.expense_receipt_extractions enable row level security;

drop policy if exists expense_receipt_extractions_select_owner on public.expense_receipt_extractions;
drop policy if exists expense_receipt_extractions_insert_owner on public.expense_receipt_extractions;
drop policy if exists expense_receipt_extractions_update_owner on public.expense_receipt_extractions;
drop policy if exists expense_receipt_extractions_delete_owner on public.expense_receipt_extractions;
drop policy if exists expense_receipt_extractions_select_super_admin on public.expense_receipt_extractions;
drop policy if exists expense_receipt_extractions_insert_super_admin on public.expense_receipt_extractions;
drop policy if exists expense_receipt_extractions_update_super_admin on public.expense_receipt_extractions;
drop policy if exists expense_receipt_extractions_delete_super_admin on public.expense_receipt_extractions;

create policy expense_receipt_extractions_select_owner
on public.expense_receipt_extractions
for select
to authenticated
using (public.workspace_has_access(workspace_id));

create policy expense_receipt_extractions_insert_owner
on public.expense_receipt_extractions
for insert
to authenticated
with check (public.workspace_has_access(workspace_id));

create policy expense_receipt_extractions_update_owner
on public.expense_receipt_extractions
for update
to authenticated
using (public.workspace_has_access(workspace_id))
with check (public.workspace_has_access(workspace_id));

create policy expense_receipt_extractions_delete_owner
on public.expense_receipt_extractions
for delete
to authenticated
using (public.workspace_has_access(workspace_id));

create policy expense_receipt_extractions_select_super_admin
on public.expense_receipt_extractions
for select
to authenticated
using (public.is_super_admin());

create policy expense_receipt_extractions_insert_super_admin
on public.expense_receipt_extractions
for insert
to authenticated
with check (public.is_super_admin());

create policy expense_receipt_extractions_update_super_admin
on public.expense_receipt_extractions
for update
to authenticated
using (public.is_super_admin())
with check (public.is_super_admin());

create policy expense_receipt_extractions_delete_super_admin
on public.expense_receipt_extractions
for delete
to authenticated
using (public.is_super_admin());

create table if not exists public.expense_receipt_events (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces on delete cascade,
  expense_receipt_id uuid not null references public.expense_receipts on delete cascade,
  event_type text not null,
  event_label text,
  event_status text,
  event_source text not null default 'system',
  event_details jsonb not null default '{}'::jsonb,
  created_by uuid references auth.users on delete set null,
  created_at timestamptz not null default now()
);

create index if not exists expense_receipt_events_workspace_id_idx on public.expense_receipt_events (workspace_id);
create index if not exists expense_receipt_events_receipt_id_idx on public.expense_receipt_events (expense_receipt_id);
create index if not exists expense_receipt_events_created_at_idx on public.expense_receipt_events (created_at);
create index if not exists expense_receipt_events_event_type_idx on public.expense_receipt_events (event_type);

alter table public.expense_receipt_events enable row level security;

drop policy if exists expense_receipt_events_select_owner on public.expense_receipt_events;
drop policy if exists expense_receipt_events_insert_owner on public.expense_receipt_events;
drop policy if exists expense_receipt_events_select_super_admin on public.expense_receipt_events;
drop policy if exists expense_receipt_events_insert_super_admin on public.expense_receipt_events;

create policy expense_receipt_events_select_owner
on public.expense_receipt_events
for select
to authenticated
using (public.workspace_has_access(workspace_id));

create policy expense_receipt_events_insert_owner
on public.expense_receipt_events
for insert
to authenticated
with check (public.workspace_has_access(workspace_id));

create policy expense_receipt_events_select_super_admin
on public.expense_receipt_events
for select
to authenticated
using (public.is_super_admin());

create policy expense_receipt_events_insert_super_admin
on public.expense_receipt_events
for insert
to authenticated
with check (public.is_super_admin());
