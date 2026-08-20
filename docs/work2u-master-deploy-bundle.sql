-- Work2U master deployment bundle
-- Paste/run this file in Supabase SQL editor
-- Order: base auth/profile -> MVP core -> expense -> internal calendar

-- ============================================================
-- SOURCE: docs/work2u-supabase-schema.sql
-- ============================================================
-- Work2U Supabase profile schema
-- Phase 1 of the Supabase execution order.
-- Run this first in the Supabase SQL editor before docs/work2u-mvp-schema.sql.

create table if not exists public.profiles (
  id uuid primary key references auth.users on delete cascade,
  email text,
  workspace_name text not null default 'Work2U Studio',
  persona text not null default 'Freelancer',
  primary_goal text not null default 'Follow up prospects',
  package text not null default 'Starter',
  channels jsonb not null default '["whatsapp","email","telegram"]'::jsonb,
  access_role text not null default 'Admin',
  auth_method text not null default 'Email',
  login_email text,
  mailbox_type text not null default 'Own email',
  ai_mode text not null default 'Suggest only',
  ai_source text not null default 'Work2U managed',
  language text not null default 'BM + English',
  region text not null default 'Malaysia',
  team_size text not null default '1',
  setup_complete boolean not null default false,
  onboarding_step text not null default 'survey',
  login_state text not null default 'pending_verification',
  notes text not null default '',
  last_login_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_profiles_updated_at on public.profiles;
create trigger set_profiles_updated_at
before update on public.profiles
for each row
execute procedure public.set_updated_at();

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  insert into public.profiles (
    id,
    email,
    login_email,
    access_role,
    setup_complete,
    onboarding_step,
    login_state
  )
  values (
    new.id,
    new.email,
    new.email,
    'Admin',
    false,
    'survey',
    case
      when new.email_confirmed_at is null then 'pending_verification'
      else 'verified'
    end
  )
  on conflict (id) do update set
    email = excluded.email,
    login_email = excluded.login_email,
    login_state = excluded.login_state,
    updated_at = now();
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row
execute procedure public.handle_new_user();

create policy "profiles_select_own"
on public.profiles
for select
to authenticated
using ((select auth.uid()) = id);

create policy "profiles_insert_own"
on public.profiles
for insert
to authenticated
with check ((select auth.uid()) = id);

create policy "profiles_update_own"
on public.profiles
for update
to authenticated
using ((select auth.uid()) = id)
with check ((select auth.uid()) = id);

create policy "profiles_select_super_admin"
on public.profiles
for select
to authenticated
using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'Super Admin');

create policy "profiles_update_super_admin"
on public.profiles
for update
to authenticated
using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'Super Admin')
with check ((auth.jwt() -> 'app_metadata' ->> 'role') = 'Super Admin');

create table if not exists public.workspace_members (
  id text primary key,
  owner_id uuid not null references auth.users on delete cascade,
  workspace_name text not null default 'Work2U Studio',
  name text not null,
  email text,
  role text not null default 'User',
  preset text not null default 'Operations',
  scope text not null default 'Workspace',
  status text not null default 'Active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.workspace_members enable row level security;

drop trigger if exists set_workspace_members_updated_at on public.workspace_members;
create trigger set_workspace_members_updated_at
before update on public.workspace_members
for each row
execute procedure public.set_updated_at();

create or replace function public.handle_new_workspace_member()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  insert into public.workspace_members (
    id,
    owner_id,
    workspace_name,
    name,
    email,
    role,
    preset,
    scope,
    status
  )
  values (
    'm-owner',
    new.id,
    coalesce(new.raw_user_meta_data ->> 'workspace_name', 'Work2U Studio'),
    coalesce(new.raw_user_meta_data ->> 'full_name', new.email, 'Workspace Owner'),
    new.email,
    coalesce(new.raw_user_meta_data ->> 'role', 'Admin'),
    'Manager',
    'Workspace',
    case
      when new.email_confirmed_at is null then 'Invited'
      else 'Active'
    end
  )
  on conflict (id) do update set
    owner_id = excluded.owner_id,
    workspace_name = excluded.workspace_name,
    name = excluded.name,
    email = excluded.email,
    role = excluded.role,
    preset = excluded.preset,
    scope = excluded.scope,
    status = excluded.status,
    updated_at = now();
  return new;
end;
$$;

drop trigger if exists on_auth_workspace_member_created on auth.users;
create trigger on_auth_workspace_member_created
after insert on auth.users
for each row
execute procedure public.handle_new_workspace_member();

create policy "workspace_members_select_own"
on public.workspace_members
for select
to authenticated
using ((select auth.uid()) = owner_id);

create policy "workspace_members_insert_own"
on public.workspace_members
for insert
to authenticated
with check ((select auth.uid()) = owner_id);

create policy "workspace_members_update_own"
on public.workspace_members
for update
to authenticated
using ((select auth.uid()) = owner_id)
with check ((select auth.uid()) = owner_id);

create policy "workspace_members_delete_own"
on public.workspace_members
for delete
to authenticated
using ((select auth.uid()) = owner_id);

create policy "workspace_members_select_super_admin"
on public.workspace_members
for select
to authenticated
using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'Super Admin');

create policy "workspace_members_insert_super_admin"
on public.workspace_members
for insert
to authenticated
with check ((auth.jwt() -> 'app_metadata' ->> 'role') = 'Super Admin');

create policy "workspace_members_update_super_admin"
on public.workspace_members
for update
to authenticated
using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'Super Admin')
with check ((auth.jwt() -> 'app_metadata' ->> 'role') = 'Super Admin');

create policy "workspace_members_delete_super_admin"
on public.workspace_members
for delete
to authenticated
using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'Super Admin');

create or replace function public.is_super_admin()
returns boolean
language sql
stable
as $$
  select coalesce((auth.jwt() -> 'app_metadata' ->> 'role') = 'Super Admin', false);
$$;

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

alter table public.plans enable row level security;

drop trigger if exists set_plans_updated_at on public.plans;
create trigger set_plans_updated_at
before update on public.plans
for each row
execute procedure public.set_updated_at();

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

-- Pricing model notes:
-- public.plans is the catalog of available packages.
-- public.subscriptions is the current billing state.
-- public.profiles.package mirrors the active package for fast UI rendering.
-- public.entitlements stores the effective per-owner limits used by the app runtime.
-- public.usage_meters stores monthly consumption for AI, email, and automation counters.

insert into public.plans (
  code,
  name,
  price_monthly,
  currency,
  billing_period,
  features,
  active
)
values
  (
    'Starter',
    'Starter',
    39,
    'MYR',
    'monthly',
    '["1 user","1 workspace","1 main channel","core CRM","basic AI drafting"]'::jsonb,
    true
  ),
  (
    'Elite',
    'Elite',
    99,
    'MYR',
    'monthly',
    '["up to 5 users","up to 3 channels","unified inbox","accounting reports","higher AI quota"]'::jsonb,
    true
  ),
  (
    'Enterprise',
    'Enterprise',
    0,
    'MYR',
    'monthly',
    '["custom workflow","custom permissions","dedicated onboarding","sla","integrations"]'::jsonb,
    true
  )
on conflict (code) do update set
  name = excluded.name,
  price_monthly = excluded.price_monthly,
  currency = excluded.currency,
  billing_period = excluded.billing_period,
  features = excluded.features,
  active = excluded.active,
  updated_at = now();

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

alter table public.subscriptions enable row level security;

drop trigger if exists set_subscriptions_updated_at on public.subscriptions;
create trigger set_subscriptions_updated_at
before update on public.subscriptions
for each row
execute procedure public.set_updated_at();

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

alter table public.entitlements enable row level security;

drop trigger if exists set_entitlements_updated_at on public.entitlements;
create trigger set_entitlements_updated_at
before update on public.entitlements
for each row
execute procedure public.set_updated_at();

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

alter table public.usage_meters enable row level security;

drop trigger if exists set_usage_meters_updated_at on public.usage_meters;
create trigger set_usage_meters_updated_at
before update on public.usage_meters
for each row
execute procedure public.set_updated_at();

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

alter table public.billing_events enable row level security;

drop trigger if exists set_billing_events_updated_at on public.billing_events;
create trigger set_billing_events_updated_at
before update on public.billing_events
for each row
execute procedure public.set_updated_at();

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

-- ============================================================
-- SOURCE: docs/work2u-mvp-schema.sql
-- ============================================================
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

-- ============================================================
-- SOURCE: docs/work2u-expense-step-00-storage.sql
-- ============================================================
-- Work2U expense reporting step 00
-- Supabase Storage bucket and RLS for receipt uploads

create extension if not exists pgcrypto;

create or replace function public.safe_uuid(input text)
returns uuid
language plpgsql
immutable
as $$
begin
  return input::uuid;
exception
  when others then
    return null;
end;
$$;

insert into storage.buckets (id, name, public)
values ('expense-receipts', 'expense-receipts', false)
on conflict (id) do nothing;

drop policy if exists expense_receipts_storage_select_owner on storage.objects;
drop policy if exists expense_receipts_storage_insert_owner on storage.objects;
drop policy if exists expense_receipts_storage_update_owner on storage.objects;
drop policy if exists expense_receipts_storage_delete_owner on storage.objects;
drop policy if exists expense_receipts_storage_select_super_admin on storage.objects;
drop policy if exists expense_receipts_storage_insert_super_admin on storage.objects;
drop policy if exists expense_receipts_storage_update_super_admin on storage.objects;
drop policy if exists expense_receipts_storage_delete_super_admin on storage.objects;

create policy expense_receipts_storage_select_owner
on storage.objects
for select
to authenticated
using (
  bucket_id = 'expense-receipts'
  and public.workspace_has_access(public.safe_uuid((storage.foldername(name))[1]))
);

create policy expense_receipts_storage_insert_owner
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'expense-receipts'
  and public.workspace_has_access(public.safe_uuid((storage.foldername(name))[1]))
);

create policy expense_receipts_storage_update_owner
on storage.objects
for update
to authenticated
using (
  bucket_id = 'expense-receipts'
  and public.workspace_has_access(public.safe_uuid((storage.foldername(name))[1]))
)
with check (
  bucket_id = 'expense-receipts'
  and public.workspace_has_access(public.safe_uuid((storage.foldername(name))[1]))
);

create policy expense_receipts_storage_delete_owner
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'expense-receipts'
  and public.workspace_has_access(public.safe_uuid((storage.foldername(name))[1]))
);

create policy expense_receipts_storage_select_super_admin
on storage.objects
for select
to authenticated
using (
  bucket_id = 'expense-receipts'
  and public.is_super_admin()
);

create policy expense_receipts_storage_insert_super_admin
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'expense-receipts'
  and public.is_super_admin()
);

create policy expense_receipts_storage_update_super_admin
on storage.objects
for update
to authenticated
using (
  bucket_id = 'expense-receipts'
  and public.is_super_admin()
)
with check (
  bucket_id = 'expense-receipts'
  and public.is_super_admin()
);

create policy expense_receipts_storage_delete_super_admin
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'expense-receipts'
  and public.is_super_admin()
);

-- ============================================================
-- SOURCE: docs/work2u-expense-step-01-categories.sql
-- ============================================================
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

-- ============================================================
-- SOURCE: docs/work2u-expense-step-02-receipts.sql
-- ============================================================
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

-- ============================================================
-- SOURCE: docs/work2u-expense-step-03-summary.sql
-- ============================================================
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

