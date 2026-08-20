# Work2U Supabase Execution Checklist

_Checklist pelaksanaan ikut fail sebenar supaya migration boleh dibuat step-by-step tanpa tersasar._

## 1. Run In This Order

If you want one file for the full platform, use [docs/work2u-master-deploy-bundle.sql](./work2u-master-deploy-bundle.sql).
If you want smaller scoped runs, use the expense bundle or calendar bundle after the base schemas are in place.

1. [docs/work2u-supabase-schema.sql](./work2u-supabase-schema.sql)
2. [docs/work2u-mvp-schema.sql](./work2u-mvp-schema.sql)
3. [docs/work2u-expense-step-00-storage.sql](./work2u-expense-step-00-storage.sql)
4. [docs/work2u-expense-step-01-categories.sql](./work2u-expense-step-01-categories.sql)
5. [docs/work2u-expense-step-02-receipts.sql](./work2u-expense-step-02-receipts.sql)
6. [docs/work2u-expense-step-03-summary.sql](./work2u-expense-step-03-summary.sql)
7. [docs/work2u-internal-calendar-step-01-events.sql](./work2u-internal-calendar-step-01-events.sql)
8. [docs/work2u-internal-calendar-step-02-reminders.sql](./work2u-internal-calendar-step-02-reminders.sql)
9. [docs/work2u-internal-calendar-step-03-connections.sql](./work2u-internal-calendar-step-03-connections.sql)

## 1A. Optional Expense Phases

If you want to deploy expense reporting in smaller phases instead of the monolith:

1. [docs/work2u-expense-step-00-storage.sql](./work2u-expense-step-00-storage.sql)
2. [docs/work2u-expense-step-01-categories.sql](./work2u-expense-step-01-categories.sql)
3. [docs/work2u-expense-step-02-receipts.sql](./work2u-expense-step-02-receipts.sql)
4. [docs/work2u-expense-step-03-summary.sql](./work2u-expense-step-03-summary.sql)
5. [docs/work2u-expense-demo-seed.sql](./work2u-expense-demo-seed.sql)

## 2. Foundation First

1. Enable required extensions
2. Create helper functions:
   - `set_updated_at()`
   - `is_super_admin()`
   - `workspace_is_owner()`
   - `workspace_has_access()`
3. Create auth-trigger helpers for:
   - `profiles`
   - `workspace_members`

## 3. Identity And Billing Core

1. Create `profiles`
2. Create `workspace_members`
3. Create `workspaces`
4. Create `plans`
5. Create `subscriptions`
6. Create `entitlements`
7. Create `usage_meters`
8. Create `billing_events`
9. Create `audit_logs`

## 4. CRM Core

1. Create `leads`
2. Create `clients`
3. Create `tasks`
4. Create `cases`
5. Create `services`
6. Create `notes`

## 5. Communication Layer

1. Create `channels`
2. Create `channel_connections`
3. Create `threads`
4. Create `messages`
5. Create `templates`

## 6. Accounting Layer

1. Create `invoices`
2. Create `invoice_items`
3. Create `receipts`
4. Create `expense_categories`
5. Create `expense_receipts`
6. Create `expense_receipt_extractions`
7. Create `expense_receipt_events`
8. Create `monthly_expense_snapshots`
9. Create `payments`
10. Create `ledger_entries`
11. Create `document_links`

## 6A. Expense Demo Seed

1. Insert demo categories
2. Insert 3 demo expense receipts
3. Insert extraction rows
4. Insert monthly summary snapshot
5. Verify dashboard queries return data

## 7. Automation, AI, And Operations

1. Create `automation_rules`
2. Create `automation_runs`
3. Create `scheduled_jobs`
4. Create `ai_sessions`
5. Create `ai_usage`
6. Create `ai_credits`
7. Create `notifications`
8. Create `attachments`
9. Create `settings`
10. Create `integrations`

## 8. Add Ownership Columns And Constraints

1. Ensure workspace tables have `workspace_id`
2. Ensure direct-user tables have `owner_id`
3. Add foreign keys for obvious references
4. Add unique constraints for idempotent webhook upserts
5. Add timestamps where missing

## 9. Enable RLS In This Order

1. `profiles`
2. `workspace_members`
3. `plans`
4. `subscriptions`
5. `entitlements`
6. `usage_meters`
7. `billing_events`
8. workspace-scoped CRM tables
9. communication tables
10. accounting tables
11. automation, AI, ops, and calendar tables

## 10. Policy Patterns

### Profiles

- owner read/write own row
- super admin read/write any row

### Workspace members

- owner manage own workspace members
- super admin audit all

### Plans

- authenticated users can read active plans
- super admin manages catalog

### Subscriptions, entitlements, usage, billing events

- owner can read own billing state
- server-side webhook or admin path writes
- super admin override allowed

### Workspace-scoped tables

- select/update/insert/delete only when `workspace_has_access(workspace_id)` is true
- super admin override stays explicit

### Calendar tables

- internal calendar stays workspace-scoped
- reminders should keep `calendar_event_id` as the main link
- connector rows should stay separate from event history

## 11. Seed And Smoke Test

1. Seed the plan catalog
2. Seed one owner row
3. Seed one workspace
4. Seed one member row
5. Insert sample leads, clients, tasks, invoices, receipt uploads, and calendar events
6. Simulate a webhook update for subscription
7. Verify entitlement changes
8. Verify receipt upload, OCR, review, and timeline audit
9. Verify cross-workspace access is blocked

## 12. Done When

- schema runs clean in Supabase SQL editor
- RLS is enabled on every relevant table
- owner and super admin paths both work
- webhook writes are idempotent
- UI can read the data model without extra patching
- calendar companion files run without duplicate migration errors
