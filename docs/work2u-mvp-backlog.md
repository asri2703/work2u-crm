# Work2U MVP Backlog

_Senarai kerja untuk build v1 dengan urutan yang paling selamat dan paling cepat memberi value._

## Phase 0 - Foundation

- finalise schema
- finalise auth provider setup
- finalise role model
- finalise billing abstraction
- finalise onboarding survey flow

## Phase 1 - Core Workspace

- auth login with email and Google
- survey before login
- workspace profile sync
- member management
- role-based navigation
- leads list
- clients list
- tasks with stage and progress
- basic cases module
- base dashboard cards

## Phase 2 - Communication

- unified inbox UI
- email draft and send flow
- WhatsApp session-based connect flow
- Telegram bot connect flow
- thread timeline
- message status tracking
- reminder notifications

## Phase 3 - Accounting

- invoice create
- receipt generate
- document download
- send document via supported channel
- basic revenue report
- expense capture
- PnL summary

## Phase 4 - Automation and Calendar

- Google Calendar sync
- task to calendar sync
- follow-up reminders
- scheduled send
- rule-based reminder engine
- auto-escalation for overdue items

## Phase 5 - AI

- AI draft reply
- AI tone rewrite
- AI summary
- AI next-step suggestion
- AI workflow assistant
- BYO AI key support
- AI quota tracking

## Phase 6 - Billing and Packaging

- Starter / Elite / Enterprise entitlement checks
- Billplz routing for Malaysia
- Stripe routing for global
- subscription status sync
- add-on billing
- grace period logic

## Phase 7 - Enterprise Readiness

- audit log
- custom onboarding
- custom branding
- advanced reports
- admin console
- support tooling

## Build Order Recommendation

1. foundation
2. core workspace
3. communication
4. accounting
5. automation
6. AI
7. billing
8. enterprise readiness

## Roadmap Notes

- Foundation must finish before any heavy UI polish
- Core workspace should be shippable even if communication is still partial
- Communication can launch with one strong path first, then expand to the others
- Accounting should stay lightweight before a full ledger is attempted
- AI should begin in suggest-only mode before auto-send is enabled
- Billing must stay region-aware and usage-limited

## Milestone Checkpoints

### Milestone A

- user completes survey
- user logs in
- profile and workspace load correctly

### Milestone B

- user creates lead, client, and task
- user can move task stage
- user can see dashboard summary

### Milestone C

- user can send or draft communication
- reminders appear in calendar or notification flow
- channel setup is clear and manageable

### Milestone D

- invoice and receipt can be created
- downloadable document works
- basic report can be reviewed

### Milestone E

- AI draft assist works
- automation rules can be limited by plan
- billing sync and plan lock are visible

## Definition of Done For MVP

- user can onboard from survey to dashboard
- user can manage leads, clients, and tasks
- user can send and track basic communications
- user can issue invoice and receipt
- user can see basic reports and PnL
- user can understand plan limits clearly
- user can upgrade package without breaking flow
- launch can be executed in phases without redoing the base architecture
