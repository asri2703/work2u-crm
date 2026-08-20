# Work2U Schema & RLS Plan

_Panduan ringkas untuk bina schema Supabase dan policy RLS tanpa bercanggah dengan flow produk._

## 1. Source Of Truth

- `public.profiles` ialah profil pengguna, onboarding state, package mirror, dan region
- `public.subscriptions` ialah status billing aktif dan provider semasa
- `public.entitlements` ialah limits yang dibaca runtime
- `public.usage_meters` ialah counter usage sebenar
- `public.workspace_members` ialah akses staf dan scope member
- data CRM dan accounting perlu kekal workspace-scoped

## 2. Table Groups

### Identity and control

- `profiles`
- `workspace_members`
- `plans`
- `subscriptions`
- `entitlements`
- `usage_meters`
- `billing_events`
- `audit_logs`

### CRM core

- `workspaces`
- `leads`
- `clients`
- `tasks`
- `cases`
- `services`
- `notes`

### Communication

- `channels`
- `channel_connections`
- `threads`
- `messages`
- `templates`

### Accounting

- `invoices`
- `invoice_items`
- `receipts`
- `payments`
- `ledger_entries`
- `document_links`

### Automation, AI, and operations

- `automation_rules`
- `automation_runs`
- `scheduled_jobs`
- `ai_sessions`
- `ai_usage`
- `ai_credits`
- `notifications`
- `attachments`
- `settings`
- `integrations`

## 3. Ownership Model

- every workspace-scoped table should carry `workspace_id`
- tables that belong directly to a user can use `owner_id`
- if a table may need both, prefer `workspace_id` for row-level filtering and `owner_id` for billing or personal ownership metadata
- client-facing app code should treat `profiles.package` as a mirror only, not as billing truth

## 4. RLS Pattern

### Profiles

- owner can `select` and `update` own row
- super admin can `select` and `update` any row

### Workspace members

- owner can manage own member rows
- super admin can audit all member rows
- insert/update/delete should stay server-controlled for anything beyond the owner record

### Plans

- authenticated users can read active plan catalog
- only super admin can create, update, or delete plan records

### Subscriptions, entitlements, usage, billing events

- owner can read own billing state
- webhook handlers or server routes can write
- super admin can inspect and override
- writes should be idempotent where events may replay

### Workspace tables

- leads, clients, tasks, cases, services, notes, channels, connections, threads, messages, templates, invoices, receipts, payments, ledger entries, document links, automation records, notifications, attachments, settings, and integrations should all require workspace access
- use a helper such as `workspace_has_access(workspace_id)` for every select/insert/update/delete policy
- super admin override must be explicit

## 5. Helper Functions

- `is_super_admin()`
- `workspace_has_access(workspace_id)`
- `set_updated_at()`
- auth trigger for new user profile creation
- auth trigger for new workspace member seed row

## 6. Migration Order

1. create identity/control tables
2. create workspace tables
3. add `workspace_id` and `owner_id` to every relevant table
4. backfill existing data
5. enable RLS
6. add select/insert/update/delete policies
7. add triggers for timestamps and auth seeding
8. test owner path, super admin path, and blocked cross-workspace path

## 7. Suggested Testing Matrix

- owner can read own profile
- owner can edit own workspace records
- user cannot read another workspace row
- super admin can inspect any record
- webhook writes can upsert subscriptions and billing events
- billing update changes entitlement without granting unrelated access
- usage meter writes do not bypass ownership checks

## 8. Launch Rules

- do not open public billing until webhook handlers and RLS are both proven
- do not rely on frontend guards for access control
- do not merge new tables until their ownership column and policy pattern are decided
- keep the schema boring and predictable before adding advanced automation tables
