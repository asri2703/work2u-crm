# Work2U Launch Spec v1

_Spesifikasi launch-ready untuk Work2U. Dokumen ini jadi garis keputusan utama sebelum binaan v1 dikunci._

## Launch Goal

Launch Work2U sebagai platform CRM ringan tetapi lengkap untuk:

- follow-up prospek
- urus client dan service
- hantar invoice dan receipt
- sync task dan reminder
- bantu user dengan AI assistant

## Target Users

- Property Agent
- Insurance Agent
- Freelancer
- Corporate Team
- General Business

## Launch Positioning

- affordable first
- AI as assistant, not replacement
- unify WhatsApp, email, dan Telegram
- accounting ringan tetapi berguna
- suitable untuk Malaysia dan global

## Launch Scope

### Must Have

- survey sebelum login
- email login atau magic link
- profile sync ke Supabase
- member management asas
- leads, clients, tasks, cases, services
- inbox asas untuk komunikasi
- invoicing dan receipt asas
- report asas revenue dan PnL
- internal calendar asas
- AI draft assist
- package entitlement check

## Launch Roadmap

### Phase 0 - Foundation

- survey before login
- auth with email and magic link
- profile sync to Supabase
- role model and workspace ownership
- billing abstraction for Billplz and Stripe
- follow the integration sequence in [Work2U Integration Checklist](./work2u-integration-checklist.md)

### Phase 1 - Core Workspace

- leads
- clients
- tasks
- cases
- services
- base dashboard cards
- member management

### Phase 2 - Communication and Follow-up

- unified inbox
- WhatsApp session flow
- email send and organize flow
- Telegram bot flow
- reminder notifications
- thread timeline

### Phase 3 - Accounting and Reporting

- invoice and receipt generation
- downloadable documents
- basic revenue and PnL reports
- document sharing through supported channel
- subscription state sync

### Phase 4 - AI and Automation

- AI draft assist
- AI workflow assistant
- BYO AI key support
- rule-based automation
- internal calendar and task reminders

### Phase 5 - Enterprise Readiness

- audit log
- custom branding
- advanced analytics
- admin console
- support tooling

### Reference Docs

- Internal calendar model and flow: [Work2U Internal Calendar](./work2u-internal-calendar.md)
- Implementation order checklist: [Work2U V1 Build Order](./work2u-v1-build-order.md)

### Should Have

- downloadable document
- reminder automation
- Telegram bot flow
- WhatsApp session-based flow
- basic audit trail
- role-based navigation

### Could Have

- advanced workflow templates
- more detailed analytics
- client portal expansion
- advanced automation packs
- multilingual expansion beyond BM + English

## Hard Decisions

- Starter price: RM39
- Elite price: RM99
- Enterprise: custom, with setup / retainer if needed
- billing providers: Billplz for Malaysia, Stripe for global
- email provider: Resend
- storage and core app: Supabase
- edge/hosting: Cloudflare with optional Vercel

## Roles

- Super Admin
- Admin
- User

## Launch Acceptance Criteria

- user can onboard from survey to dashboard without friction
- plan limits are visible and enforced
- core CRM data is isolated by workspace
- communication channels can be configured per workspace
- invoice and receipt flows work end-to-end
- AI usage is quota-controlled
- onboarding persona changes dashboard guidance
- launch roadmap is visible and can be executed in phases

## Launch Checklist v1

For the final go/no-go review, see [Work2U Final Launch Checklist](./work2u-final-launch-checklist.md).

### Before public beta

- privacy policy is published
- service policy is published
- email login is working without Google dependency
- `.env.local` is complete except intentionally deferred secrets
- one payment provider is selected per region
- webhook endpoint is live and tested
- entitlement sync works after successful payment
- AI assistant is gated by quota or optional BYO key

### Before paid launch

- Stripe or Billplz callback is verified in sandbox
- invoice / receipt generation is tested end-to-end
- subscription status updates the user package correctly
- failed payment path does not accidentally grant access
- admin can override package for support cases

## Out of Scope For Launch

- full ERP complexity
- enterprise SSO
- native mobile app
- full accounting ledger engine
- advanced social media automation suite

## Launch Decision Rules

- keep the core CRM usable even on Starter
- do not block launch on advanced automation polish
- prioritize follow-up, payment collection, and clarity
- features that are too expensive to run should be quota-limited instead of removed completely

## Launch Rule

If a feature does not help user follow up faster, organize better, or collect payment faster, it should not block launch.
