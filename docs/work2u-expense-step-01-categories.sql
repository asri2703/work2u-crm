-- Work2U expense reporting step 01
-- Categories foundation
-- Run after docs/work2u-mvp-schema.sql

create extension if not exists pgcrypto;

create table if not exists public.expense_categories (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces on delete cascade,
  name text not null,
  slug text not null,
  parent_id uuid references public.expense_categories on delete set null,
  is_overhead boolean not null default false,
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_by uuid references auth.users on delete set null,
  updated_by uuid references auth.users on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint expense_categories_name_check check (length(trim(name)) > 0),
  constraint expense_categories_slug_check check (length(trim(slug)) > 0),
  constraint expense_categories_unique_workspace_slug unique (workspace_id, slug)
);

drop trigger if exists set_expense_categories_updated_at on public.expense_categories;
create trigger set_expense_categories_updated_at
before update on public.expense_categories
for each row
execute procedure public.set_updated_at();

create index if not exists expense_categories_workspace_id_idx on public.expense_categories (workspace_id);
create index if not exists expense_categories_parent_id_idx on public.expense_categories (parent_id);
create index if not exists expense_categories_is_overhead_idx on public.expense_categories (is_overhead);

alter table public.expense_categories enable row level security;

drop policy if exists expense_categories_select_owner on public.expense_categories;
drop policy if exists expense_categories_insert_owner on public.expense_categories;
drop policy if exists expense_categories_update_owner on public.expense_categories;
drop policy if exists expense_categories_delete_owner on public.expense_categories;
drop policy if exists expense_categories_select_super_admin on public.expense_categories;
drop policy if exists expense_categories_insert_super_admin on public.expense_categories;
drop policy if exists expense_categories_update_super_admin on public.expense_categories;
drop policy if exists expense_categories_delete_super_admin on public.expense_categories;

create policy expense_categories_select_owner
on public.expense_categories
for select
to authenticated
using (public.workspace_has_access(workspace_id));

create policy expense_categories_insert_owner
on public.expense_categories
for insert
to authenticated
with check (public.workspace_has_access(workspace_id));

create policy expense_categories_update_owner
on public.expense_categories
for update
to authenticated
using (public.workspace_has_access(workspace_id))
with check (public.workspace_has_access(workspace_id));

create policy expense_categories_delete_owner
on public.expense_categories
for delete
to authenticated
using (public.workspace_has_access(workspace_id));

create policy expense_categories_select_super_admin
on public.expense_categories
for select
to authenticated
using (public.is_super_admin());

create policy expense_categories_insert_super_admin
on public.expense_categories
for insert
to authenticated
with check (public.is_super_admin());

create policy expense_categories_update_super_admin
on public.expense_categories
for update
to authenticated
using (public.is_super_admin())
with check (public.is_super_admin());

create policy expense_categories_delete_super_admin
on public.expense_categories
for delete
to authenticated
using (public.is_super_admin());

