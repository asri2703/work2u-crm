-- Work2U internal calendar step 03
-- External connector layer
-- Run after docs/work2u-internal-calendar-step-02-reminders.sql

create extension if not exists pgcrypto;

create table if not exists public.calendar_connections (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces on delete cascade,
  provider text not null default 'internal',
  status text not null default 'active',
  external_calendar_id text,
  last_synced_at timestamptz,
  sync_cursor text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint calendar_connections_provider_check check (provider in ('internal', 'google', 'outlook', 'apple', 'other')),
  constraint calendar_connections_status_check check (status in ('active', 'paused', 'error', 'disconnected'))
);

drop trigger if exists set_calendar_connections_updated_at on public.calendar_connections;
create trigger set_calendar_connections_updated_at
before update on public.calendar_connections
for each row
execute procedure public.set_updated_at();

create index if not exists calendar_connections_workspace_id_idx on public.calendar_connections (workspace_id);
create index if not exists calendar_connections_provider_idx on public.calendar_connections (provider);
create index if not exists calendar_connections_status_idx on public.calendar_connections (status);

alter table public.calendar_connections enable row level security;

drop policy if exists calendar_connections_select_owner on public.calendar_connections;
drop policy if exists calendar_connections_insert_owner on public.calendar_connections;
drop policy if exists calendar_connections_update_owner on public.calendar_connections;
drop policy if exists calendar_connections_delete_owner on public.calendar_connections;
drop policy if exists calendar_connections_select_super_admin on public.calendar_connections;
drop policy if exists calendar_connections_insert_super_admin on public.calendar_connections;
drop policy if exists calendar_connections_update_super_admin on public.calendar_connections;
drop policy if exists calendar_connections_delete_super_admin on public.calendar_connections;

create policy calendar_connections_select_owner
on public.calendar_connections
for select
to authenticated
using (public.calendar_can_access_workspace(workspace_id));

create policy calendar_connections_insert_owner
on public.calendar_connections
for insert
to authenticated
with check (public.calendar_can_access_workspace(workspace_id));

create policy calendar_connections_update_owner
on public.calendar_connections
for update
to authenticated
using (public.calendar_can_access_workspace(workspace_id))
with check (public.calendar_can_access_workspace(workspace_id));

create policy calendar_connections_delete_owner
on public.calendar_connections
for delete
to authenticated
using (public.calendar_can_access_workspace(workspace_id));

create policy calendar_connections_select_super_admin
on public.calendar_connections
for select
to authenticated
using (public.is_super_admin());

create policy calendar_connections_insert_super_admin
on public.calendar_connections
for insert
to authenticated
with check (public.is_super_admin());

create policy calendar_connections_update_super_admin
on public.calendar_connections
for update
to authenticated
using (public.is_super_admin())
with check (public.is_super_admin());

create policy calendar_connections_delete_super_admin
on public.calendar_connections
for delete
to authenticated
using (public.is_super_admin());
