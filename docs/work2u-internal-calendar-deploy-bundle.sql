-- Work2U internal calendar deployment bundle
-- Paste/run this file after docs/work2u-supabase-schema.sql and docs/work2u-mvp-schema.sql
-- Order: events -> reminders -> connections

-- ============================================================
-- SOURCE: docs/work2u-internal-calendar-step-01-events.sql
-- ============================================================
-- Work2U internal calendar step 01
-- Events foundation
-- Run after docs/work2u-supabase-schema.sql

create extension if not exists pgcrypto;

create or replace function public.calendar_can_access_workspace(target_workspace uuid)
returns boolean
language sql
stable
as $$
  select exists (
    select 1
    from public.workspaces w
    where w.id = target_workspace
      and w.owner_id = (select auth.uid())
  ) or public.is_super_admin();
$$;

create table if not exists public.calendar_events (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces on delete cascade,
  owner_id uuid not null references auth.users on delete cascade,
  title text not null,
  description text,
  event_type text not null default 'task',
  status text not null default 'scheduled',
  starts_at timestamptz,
  ends_at timestamptz,
  timezone text not null default 'Asia/Kuala_Lumpur',
  all_day boolean not null default false,
  source_type text not null default 'task',
  source_id text,
  priority smallint not null default 3,
  remind_before_minutes integer not null default 60,
  location text,
  recurrence_rule text,
  parent_event_id uuid references public.calendar_events on delete set null,
  metadata jsonb not null default '{}'::jsonb,
  created_by uuid references auth.users on delete set null,
  updated_by uuid references auth.users on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint calendar_events_priority_check check (priority between 1 and 5),
  constraint calendar_events_event_type_check check (event_type in ('task', 'meeting', 'reminder', 'deadline', 'call', 'follow_up')),
  constraint calendar_events_status_check check (status in ('draft', 'scheduled', 'completed', 'canceled')),
  constraint calendar_events_source_type_check check (source_type in ('task', 'lead', 'client', 'invoice', 'case', 'service', 'manual'))
);

drop trigger if exists set_calendar_events_updated_at on public.calendar_events;
create trigger set_calendar_events_updated_at
before update on public.calendar_events
for each row
execute procedure public.set_updated_at();

create index if not exists calendar_events_workspace_id_idx on public.calendar_events (workspace_id);
create index if not exists calendar_events_owner_id_idx on public.calendar_events (owner_id);
create index if not exists calendar_events_starts_at_idx on public.calendar_events (starts_at);
create index if not exists calendar_events_status_idx on public.calendar_events (status);
create index if not exists calendar_events_source_idx on public.calendar_events (source_type, source_id);

alter table public.calendar_events enable row level security;

drop policy if exists calendar_events_select_owner on public.calendar_events;
drop policy if exists calendar_events_insert_owner on public.calendar_events;
drop policy if exists calendar_events_update_owner on public.calendar_events;
drop policy if exists calendar_events_delete_owner on public.calendar_events;
drop policy if exists calendar_events_select_super_admin on public.calendar_events;
drop policy if exists calendar_events_insert_super_admin on public.calendar_events;
drop policy if exists calendar_events_update_super_admin on public.calendar_events;
drop policy if exists calendar_events_delete_super_admin on public.calendar_events;

create policy calendar_events_select_owner
on public.calendar_events
for select
to authenticated
using (public.calendar_can_access_workspace(workspace_id));

create policy calendar_events_insert_owner
on public.calendar_events
for insert
to authenticated
with check (public.calendar_can_access_workspace(workspace_id));

create policy calendar_events_update_owner
on public.calendar_events
for update
to authenticated
using (public.calendar_can_access_workspace(workspace_id))
with check (public.calendar_can_access_workspace(workspace_id));

create policy calendar_events_delete_owner
on public.calendar_events
for delete
to authenticated
using (public.calendar_can_access_workspace(workspace_id));

create policy calendar_events_select_super_admin
on public.calendar_events
for select
to authenticated
using (public.is_super_admin());

create policy calendar_events_insert_super_admin
on public.calendar_events
for insert
to authenticated
with check (public.is_super_admin());

create policy calendar_events_update_super_admin
on public.calendar_events
for update
to authenticated
using (public.is_super_admin())
with check (public.is_super_admin());

create policy calendar_events_delete_super_admin
on public.calendar_events
for delete
to authenticated
using (public.is_super_admin());

-- ============================================================
-- SOURCE: docs/work2u-internal-calendar-step-02-reminders.sql
-- ============================================================
-- Work2U internal calendar step 02
-- Reminder queue
-- Run after docs/work2u-internal-calendar-step-01-events.sql

create extension if not exists pgcrypto;

create table if not exists public.calendar_reminders (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces on delete cascade,
  calendar_event_id uuid not null references public.calendar_events on delete cascade,
  channel text not null default 'in_app',
  status text not null default 'pending',
  scheduled_at timestamptz not null,
  sent_at timestamptz,
  retry_count integer not null default 0,
  last_error text,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint calendar_reminders_channel_check check (channel in ('in_app', 'email', 'whatsapp', 'telegram', 'push')),
  constraint calendar_reminders_status_check check (status in ('pending', 'sent', 'failed', 'canceled'))
);

drop trigger if exists set_calendar_reminders_updated_at on public.calendar_reminders;
create trigger set_calendar_reminders_updated_at
before update on public.calendar_reminders
for each row
execute procedure public.set_updated_at();

create index if not exists calendar_reminders_workspace_id_idx on public.calendar_reminders (workspace_id);
create index if not exists calendar_reminders_event_id_idx on public.calendar_reminders (calendar_event_id);
create index if not exists calendar_reminders_scheduled_at_idx on public.calendar_reminders (scheduled_at);
create index if not exists calendar_reminders_status_idx on public.calendar_reminders (status);

alter table public.calendar_reminders enable row level security;

drop policy if exists calendar_reminders_select_owner on public.calendar_reminders;
drop policy if exists calendar_reminders_insert_owner on public.calendar_reminders;
drop policy if exists calendar_reminders_update_owner on public.calendar_reminders;
drop policy if exists calendar_reminders_delete_owner on public.calendar_reminders;
drop policy if exists calendar_reminders_select_super_admin on public.calendar_reminders;
drop policy if exists calendar_reminders_insert_super_admin on public.calendar_reminders;
drop policy if exists calendar_reminders_update_super_admin on public.calendar_reminders;
drop policy if exists calendar_reminders_delete_super_admin on public.calendar_reminders;

create policy calendar_reminders_select_owner
on public.calendar_reminders
for select
to authenticated
using (public.calendar_can_access_workspace(workspace_id));

create policy calendar_reminders_insert_owner
on public.calendar_reminders
for insert
to authenticated
with check (public.calendar_can_access_workspace(workspace_id));

create policy calendar_reminders_update_owner
on public.calendar_reminders
for update
to authenticated
using (public.calendar_can_access_workspace(workspace_id))
with check (public.calendar_can_access_workspace(workspace_id));

create policy calendar_reminders_delete_owner
on public.calendar_reminders
for delete
to authenticated
using (public.calendar_can_access_workspace(workspace_id));

create policy calendar_reminders_select_super_admin
on public.calendar_reminders
for select
to authenticated
using (public.is_super_admin());

create policy calendar_reminders_insert_super_admin
on public.calendar_reminders
for insert
to authenticated
with check (public.is_super_admin());

create policy calendar_reminders_update_super_admin
on public.calendar_reminders
for update
to authenticated
using (public.is_super_admin())
with check (public.is_super_admin());

create policy calendar_reminders_delete_super_admin
on public.calendar_reminders
for delete
to authenticated
using (public.is_super_admin());

-- ============================================================
-- SOURCE: docs/work2u-internal-calendar-step-03-connections.sql
-- ============================================================
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

