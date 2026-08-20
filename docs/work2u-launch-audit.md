# Work2U Env, Database & RLS Audit

_Satu rujukan ringkas untuk semak environment, database, RLS, dan webhook sebelum launch._

## 1. Environment Audit

### Current local status

- semua key yang wujud dalam `.env.local.template` juga ada dalam `.env.local`
- satu extra local-only key wujud: `PORT`
- `GOOGLE_CLIENT_SECRET` boleh kekal kosong sampai privacy policy, service policy, dan OAuth consent screen siap
- kalau ada raw secret yang pernah dikongsi di luar repo, anggap ia sudah exposed dan rotate

### Production env review

- `env.production.my` ada semua key template yang diperlukan
- `env.production.global` ada semua key template yang diperlukan
- kedua-duanya masih kosong untuk live values, jadi belum sesuai untuk production deploy
- `PORT` juga wujud sebagai extra runtime key dalam kedua-dua fail

### Core runtime

- `APP_BASE_URL`
- `SUPABASE_URL`
- `SUPABASE_PROJECT_ID`
- `SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `SUPABASE_REDIRECT_TO`

### Login and auth

- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `GOOGLE_REDIRECT_URI`

### Billing

- `BILLPLZ_API_BASE_URL`
- `BILLPLZ_COLLECTION_ID`
- `BILLPLZ_SECRET_KEY`
- `BILLPLZ_X_SIGNATURE_KEY`
- `STRIPE_PUBLISHABLE_KEY`
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`

### Messaging and AI

- `WHATSAPP_WEBHOOK_SECRET`
- `GROQ_API_KEY`
- `Resend` sender settings

### Audit rules

- keep public/browser-safe values separate from server-only secrets
- rotate any key that was ever pasted outside the repo
- never ship service role keys to the client bundle
- store live values in `.env.local` or a secret manager only

## 2. Database Audit

### Must exist for v1

- `profiles`
- `workspace_members`
- `plans`
- `subscriptions`
- `entitlements`
- `usage_meters`
- `billing_events`
- `leads`
- `clients`
- `tasks`
- `cases`
- `services`
- `threads`
- `messages`
- `invoices`
- `receipts`
- `payments`
- `ledger_entries`
- `document_links`
- `notifications`
- `attachments`
- `settings`
- `integrations`

### Strongly recommended for MVP

- `notes`
- `channels`
- `channel_connections`
- `templates`
- `automation_rules`
- `automation_runs`
- `scheduled_jobs`
- `ai_sessions`
- `ai_usage`
- `ai_credits`
- `audit_logs`

### Database rules

- every workspace-owned table should include `workspace_id` or `owner_id`
- billing state should live in `subscriptions`, with `profiles.package` as a UI mirror
- usage counters should be separate from plan definitions
- reporting should read from stored billing and accounting rows, not from UI totals alone
- keep idempotent writes where webhooks or retries may happen

## 3. RLS Audit

### Required patterns

- `profiles`: owner can read and update own row, super admin can inspect and override
- `workspace_members`: workspace owner or allowed admin can manage members, super admin can audit all
- `subscriptions`: owner can read own billing state, server-side webhook writes should be controlled
- `entitlements`: readable by owner and super admin, writable only by trusted backend paths
- `usage_meters`: owner can read; writes should happen from trusted server logic
- `billing_events`: insert from webhook or admin path only, read by owner and super admin
- workspace tables such as leads, clients, tasks, cases, services, threads, messages, invoices, receipts, payments, notes, attachments, and settings should be protected by workspace ownership checks

### RLS rules

- do not rely on frontend guards alone
- service role access stays server-side only
- super admin access should be explicit, not implicit
- every new table should define insert, select, update, and delete behaviour before launch

## 4. Webhook Audit

- Stripe webhook endpoint should verify signature and be idempotent
- Billplz callback and redirect should both reconcile the same billing state
- WhatsApp webhook should verify the shared secret before processing
- webhook handlers should log failed signature checks
- successful billing events should update subscription and entitlement records together

## 5. Launch Order

1. confirm env values
2. confirm policy pages
3. confirm database tables
4. confirm RLS policies
5. confirm webhook delivery
6. confirm entitlement sync
7. run a full mobile smoke test

## 6. Done When

- the app can start without missing required env values
- auth, billing, and messaging keys are separated correctly
- database tables have workspace ownership rules
- RLS blocks cross-workspace access
- webhook events update the right billing state
- launch checklist passes on mobile and desktop
