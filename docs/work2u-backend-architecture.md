# Work2U Backend Architecture

_Dokumen rujukan untuk struktur backend, tenancy, automation, AI, dan integrations._

## Objective

Bina backend yang:

- multi-tenant dan selamat
- mudah skala
- sesuai untuk automation-heavy SaaS
- mengawal kos AI dan messaging
- menyokong billing dan entitlement dengan kemas

## Scope

Dokumen ini fokus pada:

- service layers
- data groups
- permission logic
- automation engine
- AI and billing backbone
- observability

## Non-goals

Dokumen ini tidak bincang:

- UI layout
- package pricing
- marketing messaging
- landing page copy

## Core Backend Principles

- multi-tenant isolation
- permission and scope control
- queue-based automation
- AI quota and usage tracking
- connector health monitoring
- audit logging

## Suggested Layers

### 1. App Core

- auth
- workspace
- roles
- leads
- clients
- tasks
- cases
- services
- invoices
- receipts
- reports

### 2. Communication Layer

- email connector
- WhatsApp connector
- Telegram connector
- unified inbox
- thread/message store

### 3. Automation Layer

- rules engine
- scheduler
- reminder engine
- escalation engine
- retry engine

### 4. AI Layer

- draft reply
- summary
- follow-up suggestion
- business copilot
- AI memory
- usage quota

### 5. Billing Layer

- plans
- subscriptions
- entitlements
- usage meters
- payment provider routing
- grace period logic

### 6. Storage & Observability

- database
- file storage
- audit logs
- backups
- logs
- error tracking
- connector health

## Suggested Service Boundaries

### 1. Identity Service

- auth
- workspace
- roles
- members
- permissions

### 2. CRM Service

- leads
- clients
- notes
- cases
- pipelines
- services

### 3. Communication Service

- unified inbox
- WhatsApp adapter
- Telegram bot adapter
- email adapter
- templates
- thread history

### 4. Accounting Service

- invoices
- invoice items
- receipts
- expense receipts
- OCR extraction
- monthly expense summaries
- payments
- document generation
- downloadable files

### 5. Automation Service

- rules
- scheduler
- reminder engine
- escalation engine
- retry / dedupe

### 6. AI Service

- draft generation
- summary
- recommendation
- workflow suggestion
- usage tracking
- provider routing

### 7. Billing Service

- plans
- subscriptions
- entitlements
- usage meter
- renewal state
- grace period

## Key Data Model Groups

### Identity & Access

- users
- workspaces
- workspace_members
- roles
- permissions
- role_permissions
- scopes

### Business Core

- contacts
- leads
- clients
- tasks
- cases
- services
- pipelines
- notes

### Communication

- channels
- channel_connections
- threads
- messages
- message_status
- templates

### Automation & AI

- automation_rules
- automation_runs
- scheduled_jobs
- ai_sessions
- ai_usage
- ai_credits

### Accounting

- invoices
- invoice_items
- receipts
- expense_receipts
- expense_receipt_extractions
- expense_categories
- monthly_expense_snapshots
- payments
- ledger_entries
- document_links

## Accounting Flow

### Invoice lifecycle

1. user create invoice
2. system validate client data
3. system generate invoice number
4. system render PDF / downloadable document
5. system store document link
6. system send via email / WhatsApp / Telegram if allowed
7. system mark sent status
8. payment received
9. receipt generated
10. ledger entry updated

### Receipt lifecycle

1. payment webhook or manual mark as paid
2. system generate receipt
3. system attach receipt document
4. system update invoice state
5. system log audit trail

### Expense receipt lifecycle

1. user upload vendor receipt
2. system store file and metadata
3. OCR extract vendor, date, amount, and tax
4. AI suggest category if confidence is low
5. user review or approve
6. system write monthly summary
7. system feed report and PnL

### PnL flow

- revenue comes from paid invoices and subscription income
- cost bucket should track AI, messaging, storage, receipts, and platform spend
- PnL report should read from ledger and cost tables, not from UI totals only

### Operations

- calendar_events
- notifications
- audit_logs
- attachments
- settings
- integrations

### Billing

- plans
- subscriptions
- entitlements
- usage_meters
- billing_events

## Billing and Entitlement Flow

### Subscription event flow

1. payment succeeds
2. billing provider webhook hits backend
3. subscription status updated
4. entitlements recalculated
5. plan limits applied in UI
6. over-limit actions are blocked or downgraded

### Entitlement examples

- max users
- max workspaces
- max AI credits
- max automation rules
- max connected channels
- max storage
- max reports

### Region routing

- Malaysia: Billplz
- Global: Stripe
- entitlement logic should be provider-agnostic

## Deployment Topology

### Edge and App

- Cloudflare handles edge, DNS, and security controls
- Vercel can host frontend or serverless pieces when needed
- GitHub stores source and change history

### Core Data

- Supabase stores auth, workspace data, billing mirrors, and audit records
- file storage should be bucketed by workspace and document type

### Integration Adapters

- Resend for mailing
- internal calendar engine first, Google Calendar optional later
- WhatsApp session adapter for QR-based connection
- Telegram bot adapter for `work2u_bot`
- billing adapters for Billplz and Stripe

### Worker and Queue

- long-running sends should move into queue jobs
- reminder jobs should be retryable and idempotent
- webhook processing should write first, fan out second

## Request Lifecycle

### Inbound user action

1. user clicks save or send
2. backend validates tenant and role
3. backend writes core record
4. backend emits job or webhook side effect
5. worker processes connector or AI call
6. result is stored as status and audit trail

### Webhook action

1. provider posts webhook
2. backend checks signature and idempotency key
3. backend updates billing or message state
4. backend recalculates entitlements if needed
5. backend syncs any mirrored admin view

### AI action

1. UI sends prompt with context and mode
2. backend checks quota and plan
3. backend stores prompt trace and template version
4. backend calls provider or BYO key route
5. backend returns draft or suggested next step

## MVP Build Priority

### Phase 1

- auth
- workspace
- roles and permissions
- leads / clients / tasks
- invoices / receipts basic
- audit logs
- notifications
- billing entitlements
- profile sync
- member sync

### Phase 2

- WhatsApp
- Telegram
- email connector
- calendar sync
- AI draft and summary
- automation rules
- document generation
- payment webhook handling

### Phase 3

- advanced reports
- PnL
- client portal
- multilingual
- enterprise controls
- connector health dashboard
- AI usage dashboard

## Backend Risks To Control

- duplicate jobs
- connector failure
- AI cost leak
- tenant data leakage
- webhook duplication
- permission bypass
- bad billing entitlements
- race condition on document send
- stale member state

## Operational Guardrails

- queue any long-running send / sync task
- store an idempotency key for each message or billing event
- enforce workspace_id or owner_id on every query
- log provider response and send status
- use soft delete for audit-sensitive records
- keep AI output traceable to a prompt version or template
- separate draft generation from auto-send approval

## Decision Status

- architecture style: core app + modular services
- tenancy: strict workspace isolation
- automation: queue-based
- AI: quota-controlled
- billing: entitlement-driven
