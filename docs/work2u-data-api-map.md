# Work2U Data & API Map

_Peta data model dan endpoint cadangan untuk MVP Work2U._

## Design Rules

- every workspace-owned table should carry `workspace_id` or `owner_id`
- every write path should be idempotent where possible
- RLS should enforce ownership, not frontend checks alone
- API should be thin and delegate to service logic

## Identity & Access

| Table | Status | Purpose | Suggested API |
| --- | --- | --- | --- |
| `profiles` | existing | user profile, onboarding, package | `GET /api/me`, `PATCH /api/me` |
| `workspace_members` | existing | team member access | `GET /api/members`, `POST /api/members`, `PATCH /api/members/:id`, `DELETE /api/members/:id` |
| `workspaces` | planned | workspace container | `GET /api/workspace`, `PATCH /api/workspace` |
| `roles` | planned | role definitions | `GET /api/roles` |
| `permissions` | planned | permission catalog | `GET /api/permissions` |

## CRM Core

| Table | Status | Purpose | Suggested API |
| --- | --- | --- | --- |
| `leads` | planned | prospect tracking | `GET /api/leads`, `POST /api/leads`, `PATCH /api/leads/:id`, `DELETE /api/leads/:id` |
| `clients` | planned | converted clients | `GET /api/clients`, `POST /api/clients`, `PATCH /api/clients/:id`, `DELETE /api/clients/:id` |
| `tasks` | planned | task stage and progress | `GET /api/tasks`, `POST /api/tasks`, `PATCH /api/tasks/:id` |
| `cases` | planned | issue or service case | `GET /api/cases`, `POST /api/cases`, `PATCH /api/cases/:id` |
| `services` | planned | service catalog and scope | `GET /api/services`, `POST /api/services`, `PATCH /api/services/:id` |
| `notes` | planned | timeline notes | `POST /api/notes`, `GET /api/notes?entity=` |

## Communication

| Table | Status | Purpose | Suggested API |
| --- | --- | --- | --- |
| `channels` | planned | channel definitions | `GET /api/channels` |
| `channel_connections` | planned | connected account state | `POST /api/channels/connect`, `DELETE /api/channels/connect/:id` |
| `threads` | planned | conversation thread | `GET /api/threads`, `GET /api/threads/:id` |
| `messages` | planned | inbound/outbound messages | `POST /api/messages`, `GET /api/messages?thread=` |
| `message_status` | planned | send/delivery state | internal write only or webhook callback |
| `templates` | planned | reusable message templates | `GET /api/templates`, `POST /api/templates` |

## Accounting

| Table | Status | Purpose | Suggested API |
| --- | --- | --- | --- |
| `invoices` | planned | invoice header | `GET /api/invoices`, `POST /api/invoices`, `PATCH /api/invoices/:id` |
| `invoice_items` | planned | line items | nested under invoice endpoints |
| `receipts` | planned | payment receipt | `GET /api/receipts`, `POST /api/receipts` |
| `expense_receipts` | planned | uploaded expense receipt | `GET /api/expense-receipts`, `POST /api/expense-receipts`, `PATCH /api/expense-receipts/:id` |
| `expense_receipt_extractions` | planned | OCR / AI extraction results | internal write + review endpoint |
| `expense_categories` | planned | spend categorization | `GET /api/expense-categories`, `POST /api/expense-categories` |
| `monthly_expense_snapshots` | planned | monthly spend rollup | `GET /api/expense-dashboard/summary` |
| `payments` | planned | payment events | webhook or manual mark paid |
| `ledger_entries` | planned | accounting ledger | internal service write |
| `document_links` | planned | PDF and file references | `GET /api/documents/:id` |

## Automation and AI

| Table | Status | Purpose | Suggested API |
| --- | --- | --- | --- |
| `automation_rules` | planned | follow-up rules | `GET /api/automation/rules`, `POST /api/automation/rules` |
| `automation_runs` | planned | execution history | `GET /api/automation/runs` |
| `scheduled_jobs` | planned | queued reminders and send jobs | internal scheduler endpoint |
| `ai_sessions` | planned | AI conversation sessions | `GET /api/ai/sessions`, `POST /api/ai/sessions` |
| `ai_usage` | planned | AI usage meter | internal meter write |
| `ai_credits` | planned | plan quota balance | internal billing write |

## Billing

| Table | Status | Purpose | Suggested API |
| --- | --- | --- | --- |
| `plans` | planned | package definitions | `GET /api/plans` |
| `subscriptions` | planned | user subscription state | `GET /api/subscription`, `PATCH /api/subscription` |
| `entitlements` | planned | per-plan limits | internal read on auth / app boot |
| `usage_meters` | planned | usage counters | internal write |
| `billing_events` | planned | webhook and billing audit | `POST /api/billing/webhook` |

## Operational Tables

| Table | Status | Purpose | Suggested API |
| --- | --- | --- | --- |
| `audit_logs` | planned | audit trail | internal write and admin read |
| `notifications` | planned | user notifications | `GET /api/notifications` |
| `attachments` | planned | file uploads | `POST /api/attachments`, `GET /api/attachments/:id` |
| `settings` | planned | workspace settings | `GET /api/settings`, `PATCH /api/settings` |
| `integrations` | planned | connector config registry | `GET /api/integrations`, `PATCH /api/integrations/:id` |

## Suggested Endpoint Groups

### Public / auth

- `GET /api/public-config`
- `GET /api/me`
- `PATCH /api/me`

### Workspace

- `GET /api/workspace`
- `PATCH /api/workspace`
- `GET /api/members`
- `POST /api/members`

### CRM

- `GET /api/leads`
- `GET /api/clients`
- `GET /api/tasks`
- `GET /api/cases`
- `GET /api/services`

### Communication

- `GET /api/threads`
- `POST /api/messages`
- `POST /api/channels/connect`

### Accounting

- `GET /api/invoices`
- `POST /api/invoices`
- `GET /api/receipts`
- `POST /api/receipts`
- `GET /api/expense-receipts`
- `POST /api/expense-receipts`
- `PATCH /api/expense-receipts/:id`
- `GET /api/expense-dashboard/summary`
- `GET /api/expense-dashboard/categories`
- `GET /api/expense-dashboard/vendors`
- `GET /api/expense-dashboard/pnl`

### Automation / AI

- `GET /api/automation/rules`
- `POST /api/automation/rules`
- `POST /api/ai/draft`
- `POST /api/ai/summary`
- `POST /api/ai/workflow`

### Billing

- `GET /api/plans`
- `GET /api/subscription`
- `POST /api/billing/webhook`

### Prototype core workspace

- `GET /api/work2u/core/leads`
- `POST /api/work2u/core/leads`
- `PATCH /api/work2u/core/leads/:id`
- `DELETE /api/work2u/core/leads/:id`
- `GET /api/work2u/core/clients`
- `POST /api/work2u/core/clients`
- `PATCH /api/work2u/core/clients/:id`
- `DELETE /api/work2u/core/clients/:id`
- `GET /api/work2u/core/tasks`
- `POST /api/work2u/core/tasks`
- `PATCH /api/work2u/core/tasks/:id`
- `DELETE /api/work2u/core/tasks/:id`
- `GET /api/work2u/core/cases`
- `POST /api/work2u/core/cases`
- `PATCH /api/work2u/core/cases/:id`
- `DELETE /api/work2u/core/cases/:id`
- `GET /api/work2u/core/services`
- `POST /api/work2u/core/services`
- `PATCH /api/work2u/core/services/:id`
- `DELETE /api/work2u/core/services/:id`

## Primary Ownership Keys

- `id`
- `workspace_id`
- `owner_id`
- `created_by`
- `updated_by`
- `status`
- `channel`
- `provider`

## MVP Mapping Rule

If a table or endpoint does not help survey, auth, core CRM, communication, accounting, automation, AI, or billing, it should wait for a later phase.
