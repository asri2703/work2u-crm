-- Work2U expense reporting step 03
-- Monthly rollup and summary
-- Run after docs/work2u-expense-step-02-receipts.sql

create extension if not exists pgcrypto;

create table if not exists public.monthly_expense_snapshots (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces on delete cascade,
  month_key date not null,
  currency text not null default 'MYR',
  gross_revenue numeric(12,2) not null default 0,
  total_expenses numeric(12,2) not null default 0,
  total_overhead numeric(12,2) not null default 0,
  net_profit numeric(12,2) not null default 0,
  receipt_count integer not null default 0,
  approved_receipt_count integer not null default 0,
  unreviewed_receipt_count integer not null default 0,
  category_breakdown jsonb not null default '{}'::jsonb,
  vendor_breakdown jsonb not null default '{}'::jsonb,
  ai_summary text,
  generated_by text not null default 'system',
  generated_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint monthly_expense_snapshots_unique_workspace_month unique (workspace_id, month_key)
);

drop trigger if exists set_monthly_expense_snapshots_updated_at on public.monthly_expense_snapshots;
create trigger set_monthly_expense_snapshots_updated_at
before update on public.monthly_expense_snapshots
for each row
execute procedure public.set_updated_at();

create index if not exists monthly_expense_snapshots_workspace_id_idx on public.monthly_expense_snapshots (workspace_id);
create index if not exists monthly_expense_snapshots_month_key_idx on public.monthly_expense_snapshots (month_key);

alter table public.monthly_expense_snapshots enable row level security;

drop policy if exists monthly_expense_snapshots_select_owner on public.monthly_expense_snapshots;
drop policy if exists monthly_expense_snapshots_insert_owner on public.monthly_expense_snapshots;
drop policy if exists monthly_expense_snapshots_update_owner on public.monthly_expense_snapshots;
drop policy if exists monthly_expense_snapshots_delete_owner on public.monthly_expense_snapshots;
drop policy if exists monthly_expense_snapshots_select_super_admin on public.monthly_expense_snapshots;
drop policy if exists monthly_expense_snapshots_insert_super_admin on public.monthly_expense_snapshots;
drop policy if exists monthly_expense_snapshots_update_super_admin on public.monthly_expense_snapshots;
drop policy if exists monthly_expense_snapshots_delete_super_admin on public.monthly_expense_snapshots;

create policy monthly_expense_snapshots_select_owner
on public.monthly_expense_snapshots
for select
to authenticated
using (public.workspace_has_access(workspace_id));

create policy monthly_expense_snapshots_insert_owner
on public.monthly_expense_snapshots
for insert
to authenticated
with check (public.workspace_has_access(workspace_id));

create policy monthly_expense_snapshots_update_owner
on public.monthly_expense_snapshots
for update
to authenticated
using (public.workspace_has_access(workspace_id))
with check (public.workspace_has_access(workspace_id));

create policy monthly_expense_snapshots_delete_owner
on public.monthly_expense_snapshots
for delete
to authenticated
using (public.workspace_has_access(workspace_id));

create policy monthly_expense_snapshots_select_super_admin
on public.monthly_expense_snapshots
for select
to authenticated
using (public.is_super_admin());

create policy monthly_expense_snapshots_insert_super_admin
on public.monthly_expense_snapshots
for insert
to authenticated
with check (public.is_super_admin());

create policy monthly_expense_snapshots_update_super_admin
on public.monthly_expense_snapshots
for update
to authenticated
using (public.is_super_admin())
with check (public.is_super_admin());

create policy monthly_expense_snapshots_delete_super_admin
on public.monthly_expense_snapshots
for delete
to authenticated
using (public.is_super_admin());

