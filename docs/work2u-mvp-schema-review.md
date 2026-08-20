# Work2U MVP Schema Review

_Ringkasan table-by-table untuk semak `docs/work2u-mvp-schema.sql` sebelum migration dijalankan._

## 1. High-Level Order

1. identity and billing foundation
2. CRM core
3. communication
4. accounting
5. automation and AI
6. billing and ops
7. RLS and smoke test

## 2. Table Review By Area

### Identity and billing

- `workspaces`
- `profiles`
- `workspace_members`
- `plans`
- `subscriptions`
- `entitlements`
- `usage_meters`
- `billing_events`
- `audit_logs`

Review notes:

- `workspaces` should be the main parent for CRM data
- `profiles` should stay lightweight and mirror onboarding/package state
- `subscriptions`, `entitlements`, and `usage_meters` should remain server-trusted
- `billing_events` must be idempotent because webhooks can replay

### CRM core

- `leads`
- `clients`
- `tasks`
- `cases`
- `services`
- `notes`

Review notes:

- every row should carry `workspace_id`
- lead and client rows should support quick owner lookup
- task progress should stay simple and numeric
- cases should support support and exception handling
- services should be ready to attach to invoicing

### Communication

- `channels`
- `channel_connections`
- `threads`
- `messages`
- `templates`

Review notes:

- channel rows should describe the provider and status
- thread rows should group conversation context
- message rows should always link back to a thread and workspace
- templates should be reusable for AI-assisted drafting

### Accounting

- `invoices`
- `invoice_items`
- `receipts`
- `payments`
- `ledger_entries`
- `document_links`

Review notes:

- invoice and receipt records should be linkable to the same client
- payment rows should be webhook-friendly
- ledger entries should support reporting and PnL
- document links should support downloadable output and sharing

### Automation and AI

- `automation_rules`
- `automation_runs`
- `scheduled_jobs`
- `ai_sessions`
- `ai_usage`
- `ai_credits`

Review notes:

- automation rules should be safe to enable/disable per workspace
- automation runs should carry payload and status for audit
- AI usage should be meter-based, not inferred from UI
- AI credits should make package limits easy to enforce

### Operations

- `notifications`
- `attachments`
- `settings`
- `integrations`

Review notes:

- notifications should stay workspace scoped
- attachments should reference entity type and id
- settings should avoid storing secrets where possible
- integrations should keep connector state in one place

## 3. Launch Review Questions

Before migration, confirm:

- which tables need `owner_id` instead of `workspace_id`
- which rows are seeded automatically on signup
- which tables need unique constraints for webhook upsert
- which tables need indexes for search and reporting
- which writes are server-only

## 4. Practical Checks

- can a new owner sign up and get a profile row
- can the workspace seed member row be created safely
- can leads, clients, tasks, and invoices all share the same workspace
- can cross-workspace reads be blocked by RLS
- can webhook updates rewrite billing state without duplicates

## 5. Recommended Next Step

- use [Supabase Execution Checklist](./work2u-supabase-execution-checklist.md) as the action order
- use this file as the review companion when inspecting the SQL
