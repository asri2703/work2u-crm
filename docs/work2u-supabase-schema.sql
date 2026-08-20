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
