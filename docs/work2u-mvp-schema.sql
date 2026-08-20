-- Work2U MVP schema skeleton
-- Phase 2 and onward of the Supabase execution order.
-- Run docs/work2u-supabase-schema.sql first, then this file in the Supabase SQL editor.
-- This file turns the data / API map into a more complete Supabase-ready schema draft.
-- It is intentionally aligned to the MVP flow: auth, workspace, CRM, communication, accounting, automation, AI, billing, and ops.

create extension if not exists pgcrypto;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace function public.is_super_admin()
returns boolean
language sql
stable
as $$
  select coalesce((auth.jwt() -> 'app_metadata' ->> 'role') = 'Super Admin', false);
$$;

create or replace function public.workspace_is_owner(target_workspace uuid)
returns boolean
language sql
stable
as $$
  select exists (
    select 1
    from public.workspaces w
    where w.id = target_workspace
      and w.owner_id = (select auth.uid())
  );
$$;

create table if not exists public.workspaces (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users on delete cascade,
  name text not null default 'Work2U Studio',
  region text not null default 'Malaysia',
  language text not null default 'BM + English',
  package text not null default 'Starter',
  setup_complete boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger set_workspaces_updated_at
before update on public.workspaces
for each row execute procedure public.set_updated_at();

create table if not exists public.leads (
  id text primary key,
  workspace_id uuid not null references public.workspaces on delete cascade,
  name text not null,
  company text,
  stage text not null default 'cold',
  source text not null default 'WhatsApp',
  value numeric(12,2) not null default 0,
  next_follow_up text,
  note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger set_leads_updated_at
before update on public.leads
for each row execute procedure public.set_updated_at();

create table if not exists public.clients (
  id text primary key,
  workspace_id uuid not null references public.workspaces on delete cascade,
  name text not null,
  company text,
  status text not null default 'active',
  service text,
  value numeric(12,2) not null default 0,
  timeline jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger set_clients_updated_at
before update on public.clients
for each row execute procedure public.set_updated_at();

create table if not exists public.tasks (
  id text primary key,
  workspace_id uuid not null references public.workspaces on delete cascade,
  title text not null,
  stage text not null default 'todo',
  progress integer not null default 0,
  due_at timestamptz,
  owner text,
  client_id text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger set_tasks_updated_at
before update on public.tasks
for each row execute procedure public.set_updated_at();

create table if not exists public.cases (
  id text primary key,
  workspace_id uuid not null references public.workspaces on delete cascade,
  title text not null,
  type text not null default 'general',
  status text not null default 'open',
  client_id text,
  owner text,
  summary text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger set_cases_updated_at
before update on public.cases
for each row execute procedure public.set_updated_at();

create table if not exists public.services (
  id text primary key,
  workspace_id uuid not null references public.workspaces on delete cascade,
  name text not null,
  description text,
  price numeric(12,2) not null default 0,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger set_services_updated_at
before update on public.services
for each row execute procedure public.set_updated_at();

create table if not exists public.notes (
  id text primary key,
  workspace_id uuid not null references public.workspaces on delete cascade,
  entity_type text not null,
  entity_id text not null,
  body text not null,
  created_by uuid references auth.users,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger set_notes_updated_at
before update on public.notes
for each row execute procedure public.set_updated_at();

create table if not exists public.channels (
  id text primary key,
  workspace_id uuid not null references public.workspaces on delete cascade,
  provider text not null,
  label text not null,
  status text not null default 'disconnected',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger set_channels_updated_at
before update on public.channels
for each row execute procedure public.set_updated_at();

create table if not exists public.channel_connections (
  id text primary key,
  workspace_id uuid not null references public.workspaces on delete cascade,
  channel_id text not null references public.channels on delete cascade,
  provider_account_id text,
  provider_meta jsonb not null default '{}'::jsonb,
  status text not null default 'pending',
  connected_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger set_channel_connections_updated_at
before update on public.channel_connections
for each row execute procedure public.set_updated_at();

create table if not exists public.threads (
  id text primary key,
  workspace_id uuid not null references public.workspaces on delete cascade,
  channel text not null,
  subject text,
  contact_name text,
  status text not null default 'open',
  last_message_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger set_threads_updated_at
before update on public.threads
for each row execute procedure public.set_updated_at();

create table if not exists public.messages (
  id text primary key,
  workspace_id uuid not null references public.workspaces on delete cascade,
  thread_id text not null references public.threads on delete cascade,
  direction text not null,
  body text not null,
  status text not null default 'queued',
  provider_message_id text,
  sent_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger set_messages_updated_at
before update on public.messages
for each row execute procedure public.set_updated_at();

create table if not exists public.templates (
  id text primary key,
  workspace_id uuid not null references public.workspaces on delete cascade,
  name text not null,
  channel text not null,
  body text not null,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger set_templates_updated_at
before update on public.templates
for each row execute procedure public.set_updated_at();

create table if not exists public.invoices (
  id text primary key,
  workspace_id uuid not null references public.workspaces on delete cascade,
  number text not null,
  client_id text,
  client_name text not null,
  amount numeric(12,2) not null default 0,
  status text not null default 'draft',
  due_date date,
  region text not null default 'Malaysia',
  document_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger set_invoices_updated_at
before update on public.invoices
for each row execute procedure public.set_updated_at();

create table if not exists public.invoice_items (
  id text primary key,
  workspace_id uuid not null references public.workspaces on delete cascade,
  invoice_id text not null references public.invoices on delete cascade,
  description text not null,
  quantity numeric(12,2) not null default 1,
  unit_price numeric(12,2) not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger set_invoice_items_updated_at
before update on public.invoice_items
for each row execute procedure public.set_updated_at();

create table if not exists public.receipts (
  id text primary key,
  workspace_id uuid not null references public.workspaces on delete cascade,
  invoice_id text not null references public.invoices on delete cascade,
  number text not null,
  amount numeric(12,2) not null default 0,
  paid_at timestamptz,
  document_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger set_receipts_updated_at
before update on public.receipts
for each row execute procedure public.set_updated_at();

create table if not exists public.payments (
  id text primary key,
  workspace_id uuid not null references public.workspaces on delete cascade,
  invoice_id text references public.invoices on delete set null,
  provider text not null,
  provider_reference text,
  amount numeric(12,2) not null default 0,
  status text not null default 'pending',
  raw_payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger set_payments_updated_at
before update on public.payments
for each row execute procedure public.set_updated_at();

create table if not exists public.ledger_entries (
  id text primary key,
  workspace_id uuid not null references public.workspaces on delete cascade,
  entry_type text not null,
  entry_date date not null default current_date,
  amount numeric(12,2) not null default 0,
  ref_type text,
  ref_id text,
  memo text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger set_ledger_entries_updated_at
before update on public.ledger_entries
for each row execute procedure public.set_updated_at();

create table if not exists public.document_links (
  id text primary key,
  workspace_id uuid not null references public.workspaces on delete cascade,
  entity_type text not null,
  entity_id text not null,
  file_name text not null,
  file_url text not null,
  mime_type text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger set_document_links_updated_at
before update on public.document_links
for each row execute procedure public.set_updated_at();

create table if not exists public.calendar_events (
  id text primary key,
  workspace_id uuid not null references public.workspaces on delete cascade,
  owner_id uuid references auth.users,
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
  priority integer not null default 3,
  remind_before_minutes integer not null default 60,
  location text,
  recurrence_rule text,
  parent_event_id text references public.calendar_events on delete set null,
  metadata jsonb not null default '{}'::jsonb,
  created_by uuid references auth.users,
  updated_by uuid references auth.users,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger set_calendar_events_updated_at
before update on public.calendar_events
for each row execute procedure public.set_updated_at();

create table if not exists public.calendar_reminders (
  id text primary key,
  workspace_id uuid not null references public.workspaces on delete cascade,
  calendar_event_id text not null references public.calendar_events on delete cascade,
  channel text not null default 'in_app',
  status text not null default 'pending',
  scheduled_at timestamptz not null,
  sent_at timestamptz,
  retry_count integer not null default 0,
  last_error text,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger set_calendar_reminders_updated_at
before update on public.calendar_reminders
for each row execute procedure public.set_updated_at();

create table if not exists public.calendar_connections (
  id text primary key,
  workspace_id uuid not null references public.workspaces on delete cascade,
  provider text not null default 'internal',
  status text not null default 'active',
  external_calendar_id text,
  last_synced_at timestamptz,
  sync_cursor text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger set_calendar_connections_updated_at
before update on public.calendar_connections
for each row execute procedure public.set_updated_at();

create table if not exists public.automation_rules (
  id text primary key,
  workspace_id uuid not null references public.workspaces on delete cascade,
  name text not null,
  trigger_event text not null,
  action_type text not null,
  enabled boolean not null default true,
  config jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger set_automation_rules_updated_at
before update on public.automation_rules
for each row execute procedure public.set_updated_at();

create table if not exists public.automation_runs (
  id text primary key,
  workspace_id uuid not null references public.workspaces on delete cascade,
  rule_id text references public.automation_rules on delete set null,
  status text not null default 'queued',
  payload jsonb not null default '{}'::jsonb,
  error_message text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger set_automation_runs_updated_at
before update on public.automation_runs
for each row execute procedure public.set_updated_at();

create table if not exists public.scheduled_jobs (
  id text primary key,
  workspace_id uuid not null references public.workspaces on delete cascade,
  job_type text not null,
  run_at timestamptz not null,
  status text not null default 'scheduled',
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger set_scheduled_jobs_updated_at
before update on public.scheduled_jobs
for each row execute procedure public.set_updated_at();

create table if not exists public.ai_sessions (
  id text primary key,
  workspace_id uuid not null references public.workspaces on delete cascade,
  user_id uuid references auth.users,
  topic text not null,
  status text not null default 'open',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger set_ai_sessions_updated_at
before update on public.ai_sessions
for each row execute procedure public.set_updated_at();

create table if not exists public.ai_usage (
  id text primary key,
  workspace_id uuid not null references public.workspaces on delete cascade,
  usage_date date not null default current_date,
  tokens_in integer not null default 0,
  tokens_out integer not null default 0,
  cost numeric(12,4) not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger set_ai_usage_updated_at
before update on public.ai_usage
for each row execute procedure public.set_updated_at();

create table if not exists public.ai_credits (
  id text primary key,
  workspace_id uuid not null references public.workspaces on delete cascade,
  plan_name text not null,
  balance integer not null default 0,
  reset_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger set_ai_credits_updated_at
before update on public.ai_credits
for each row execute procedure public.set_updated_at();

create table if not exists public.plans (
  code text primary key,
  name text not null,
  price_monthly numeric(12,2) not null default 0,
  currency text not null default 'MYR',
  billing_period text not null default 'monthly',
  features jsonb not null default '[]'::jsonb,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger set_plans_updated_at
before update on public.plans
for each row execute procedure public.set_updated_at();

create table if not exists public.subscriptions (
  id text primary key,
  owner_id uuid not null references auth.users on delete cascade,
  plan_code text not null references public.plans(code),
  provider text not null default 'stripe',
  status text not null default 'trialing',
  email text not null default '',
  workspace_name text not null default 'Work2U Studio',
  name text not null default 'Work2U Customer',
  region text not null default 'Global',
  customer_id text not null default '',
  subscription_id text not null default '',
  session_id text not null default '',
  bill_id text not null default '',
  payment_url text not null default '',
  amount_cents numeric(12,2) not null default 0,
  currency text not null default 'MYR',
  current_period_start timestamptz,
  current_period_end timestamptz,
  cancel_at_period_end boolean not null default false,
  trial_ends_at timestamptz,
  metadata jsonb not null default '{}'::jsonb,
  raw_payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger set_subscriptions_updated_at
before update on public.subscriptions
for each row execute procedure public.set_updated_at();

create table if not exists public.entitlements (
  id text primary key,
  owner_id uuid not null references auth.users on delete cascade,
  plan_code text not null references public.plans(code),
  feature_key text not null,
  limit_value numeric(12,2) not null default 0,
  limit_unit text not null default 'count',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger set_entitlements_updated_at
before update on public.entitlements
for each row execute procedure public.set_updated_at();

create table if not exists public.usage_meters (
  id text primary key,
  owner_id uuid not null references auth.users on delete cascade,
  meter_key text not null,
  meter_value numeric(12,2) not null default 0,
  period_start date not null default current_date,
  period_end date not null default current_date,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger set_usage_meters_updated_at
before update on public.usage_meters
for each row execute procedure public.set_updated_at();

create table if not exists public.billing_events (
  id text primary key,
  owner_id uuid not null references auth.users on delete cascade,
  provider text not null default 'stripe',
  event_type text not null,
  status text not null default 'received',
  email text not null default '',
  workspace_name text not null default 'Work2U Studio',
  subscription_id text not null default '',
  customer_id text not null default '',
  raw_payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger set_billing_events_updated_at
before update on public.billing_events
for each row execute procedure public.set_updated_at();

create table if not exists public.audit_logs (
  id text primary key,
  workspace_id uuid not null references public.workspaces on delete cascade,
  actor_id uuid references auth.users,
  action text not null,
  entity_type text,
  entity_id text,
  details jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger set_audit_logs_updated_at
before update on public.audit_logs
for each row execute procedure public.set_updated_at();

create table if not exists public.notifications (
  id text primary key,
  workspace_id uuid not null references public.workspaces on delete cascade,
  user_id uuid references auth.users,
  title text not null,
  body text,
  status text not null default 'unread',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger set_notifications_updated_at
before update on public.notifications
for each row execute procedure public.set_updated_at();

create table if not exists public.attachments (
  id text primary key,
  workspace_id uuid not null references public.workspaces on delete cascade,
  entity_type text not null,
  entity_id text not null,
  file_name text not null,
  file_url text not null,
  mime_type text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger set_attachments_updated_at
before update on public.attachments
for each row execute procedure public.set_updated_at();

create table if not exists public.settings (
  id text primary key,
  workspace_id uuid not null references public.workspaces on delete cascade,
  key text not null,
  value jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger set_settings_updated_at
before update on public.settings
for each row execute procedure public.set_updated_at();

create table if not exists public.integrations (
  id text primary key,
  workspace_id uuid not null references public.workspaces on delete cascade,
  provider text not null,
  config jsonb not null default '{}'::jsonb,
  status text not null default 'inactive',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger set_integrations_updated_at
before update on public.integrations
for each row execute procedure public.set_updated_at();

create or replace function public.workspace_has_access(target_workspace uuid)
returns boolean
language sql
stable
as $$
  select public.workspace_is_owner(target_workspace) or public.is_super_admin();
$$;

do $$
declare
  workspace_tables text[] := array[
    'leads',
    'clients',
    'tasks',
    'cases',
    'services',
    'notes',
    'channels',
    'channel_connections',
    'threads',
    'messages',
    'templates',
    'invoices',
    'invoice_items',
    'receipts',
    'payments',
    'ledger_entries',
    'document_links',
    'automation_rules',
    'automation_runs',
    'scheduled_jobs',
    'ai_sessions',
    'ai_usage',
    'ai_credits',
    'audit_logs',
    'notifications',
    'attachments',
    'settings',
    'integrations',
    'calendar_events',
    'calendar_reminders',
    'calendar_connections'
  ];
  table_name text;
begin
  foreach table_name in array workspace_tables loop
    execute format('alter table public.%I enable row level security', table_name);
    execute format('drop policy if exists %I_select_workspace on public.%I', table_name, table_name);
    execute format('drop policy if exists %I_insert_workspace on public.%I', table_name, table_name);
    execute format('drop policy if exists %I_update_workspace on public.%I', table_name, table_name);
    execute format('drop policy if exists %I_delete_workspace on public.%I', table_name, table_name);
    execute format(
      'create policy %I_select_workspace on public.%I for select to authenticated using (public.workspace_has_access(workspace_id))',
      table_name,
      table_name
    );
    execute format(
      'create policy %I_insert_workspace on public.%I for insert to authenticated with check (public.workspace_has_access(workspace_id))',
      table_name,
      table_name
    );
    execute format(
      'create policy %I_update_workspace on public.%I for update to authenticated using (public.workspace_has_access(workspace_id)) with check (public.workspace_has_access(workspace_id))',
      table_name,
      table_name
    );
    execute format(
      'create policy %I_delete_workspace on public.%I for delete to authenticated using (public.workspace_has_access(workspace_id))',
      table_name,
      table_name
    );
  end loop;
end;
$$;

alter table public.subscriptions enable row level security;
drop policy if exists subscriptions_select_owner on public.subscriptions;
drop policy if exists subscriptions_insert_owner on public.subscriptions;
drop policy if exists subscriptions_update_owner on public.subscriptions;
drop policy if exists subscriptions_delete_owner on public.subscriptions;
drop policy if exists subscriptions_select_super_admin on public.subscriptions;
drop policy if exists subscriptions_insert_super_admin on public.subscriptions;
drop policy if exists subscriptions_update_super_admin on public.subscriptions;
drop policy if exists subscriptions_delete_super_admin on public.subscriptions;
create policy subscriptions_select_owner
on public.subscriptions
for select
to authenticated
using ((select auth.uid()) = owner_id or public.is_super_admin());
create policy subscriptions_insert_owner
on public.subscriptions
for insert
to authenticated
with check ((select auth.uid()) = owner_id or public.is_super_admin());
create policy subscriptions_update_owner
on public.subscriptions
for update
to authenticated
using ((select auth.uid()) = owner_id or public.is_super_admin())
with check ((select auth.uid()) = owner_id or public.is_super_admin());
create policy subscriptions_delete_owner
on public.subscriptions
for delete
to authenticated
using ((select auth.uid()) = owner_id or public.is_super_admin());

alter table public.entitlements enable row level security;
drop policy if exists entitlements_select_owner on public.entitlements;
drop policy if exists entitlements_insert_owner on public.entitlements;
drop policy if exists entitlements_update_owner on public.entitlements;
drop policy if exists entitlements_delete_owner on public.entitlements;
drop policy if exists entitlements_select_super_admin on public.entitlements;
drop policy if exists entitlements_insert_super_admin on public.entitlements;
drop policy if exists entitlements_update_super_admin on public.entitlements;
drop policy if exists entitlements_delete_super_admin on public.entitlements;
create policy entitlements_select_owner
on public.entitlements
for select
to authenticated
using ((select auth.uid()) = owner_id or public.is_super_admin());
create policy entitlements_insert_owner
on public.entitlements
for insert
to authenticated
with check ((select auth.uid()) = owner_id or public.is_super_admin());
create policy entitlements_update_owner
on public.entitlements
for update
to authenticated
using ((select auth.uid()) = owner_id or public.is_super_admin())
with check ((select auth.uid()) = owner_id or public.is_super_admin());
create policy entitlements_delete_owner
on public.entitlements
for delete
to authenticated
using ((select auth.uid()) = owner_id or public.is_super_admin());

alter table public.usage_meters enable row level security;
drop policy if exists usage_meters_select_owner on public.usage_meters;
drop policy if exists usage_meters_insert_owner on public.usage_meters;
drop policy if exists usage_meters_update_owner on public.usage_meters;
drop policy if exists usage_meters_delete_owner on public.usage_meters;
drop policy if exists usage_meters_select_super_admin on public.usage_meters;
drop policy if exists usage_meters_insert_super_admin on public.usage_meters;
drop policy if exists usage_meters_update_super_admin on public.usage_meters;
drop policy if exists usage_meters_delete_super_admin on public.usage_meters;
create policy usage_meters_select_owner
on public.usage_meters
for select
to authenticated
using ((select auth.uid()) = owner_id or public.is_super_admin());
create policy usage_meters_insert_owner
on public.usage_meters
for insert
to authenticated
with check ((select auth.uid()) = owner_id or public.is_super_admin());
create policy usage_meters_update_owner
on public.usage_meters
for update
to authenticated
using ((select auth.uid()) = owner_id or public.is_super_admin())
with check ((select auth.uid()) = owner_id or public.is_super_admin());
create policy usage_meters_delete_owner
on public.usage_meters
for delete
to authenticated
using ((select auth.uid()) = owner_id or public.is_super_admin());

alter table public.billing_events enable row level security;
drop policy if exists billing_events_select_owner on public.billing_events;
drop policy if exists billing_events_insert_owner on public.billing_events;
drop policy if exists billing_events_update_owner on public.billing_events;
drop policy if exists billing_events_delete_owner on public.billing_events;
drop policy if exists billing_events_select_super_admin on public.billing_events;
drop policy if exists billing_events_insert_super_admin on public.billing_events;
drop policy if exists billing_events_update_super_admin on public.billing_events;
drop policy if exists billing_events_delete_super_admin on public.billing_events;
create policy billing_events_select_owner
on public.billing_events
for select
to authenticated
using ((select auth.uid()) = owner_id or public.is_super_admin());
create policy billing_events_insert_owner
on public.billing_events
for insert
to authenticated
with check ((select auth.uid()) = owner_id or public.is_super_admin());
create policy billing_events_update_owner
on public.billing_events
for update
to authenticated
using ((select auth.uid()) = owner_id or public.is_super_admin())
with check ((select auth.uid()) = owner_id or public.is_super_admin());
create policy billing_events_delete_owner
on public.billing_events
for delete
to authenticated
using ((select auth.uid()) = owner_id or public.is_super_admin());

alter table public.plans enable row level security;
drop policy if exists plans_select_authenticated on public.plans;
drop policy if exists plans_insert_super_admin on public.plans;
drop policy if exists plans_update_super_admin on public.plans;
drop policy if exists plans_delete_super_admin on public.plans;
create policy plans_select_authenticated
on public.plans
for select
to authenticated
using (true);
create policy plans_insert_super_admin
on public.plans
for insert
to authenticated
with check (public.is_super_admin());
create policy plans_update_super_admin
on public.plans
for update
to authenticated
using (public.is_super_admin())
with check (public.is_super_admin());
create policy plans_delete_super_admin
on public.plans
for delete
to authenticated
using (public.is_super_admin());

alter table public.workspaces enable row level security;
drop policy if exists workspaces_select_owner on public.workspaces;
drop policy if exists workspaces_insert_owner on public.workspaces;
drop policy if exists workspaces_update_owner on public.workspaces;
drop policy if exists workspaces_delete_owner on public.workspaces;
create policy workspaces_select_owner
on public.workspaces
for select
to authenticated
using ((select auth.uid()) = owner_id or public.is_super_admin());
create policy workspaces_insert_owner
on public.workspaces
for insert
to authenticated
with check ((select auth.uid()) = owner_id or public.is_super_admin());
create policy workspaces_update_owner
on public.workspaces
for update
to authenticated
using ((select auth.uid()) = owner_id or public.is_super_admin())
with check ((select auth.uid()) = owner_id or public.is_super_admin());
create policy workspaces_delete_owner
on public.workspaces
for delete
to authenticated
using ((select auth.uid()) = owner_id or public.is_super_admin());

-- RLS guidance:
-- Apply the same ownership pattern used by profiles/workspace_members.
-- For MVP, workspace-scoped data should be readable/writable only when public.workspace_has_access(workspace_id) is true,
-- with an additional super-admin override for platform maintenance.
