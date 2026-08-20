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
