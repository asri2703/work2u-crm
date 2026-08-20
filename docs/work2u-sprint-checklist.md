# Work2U Sprint Checklist

_Bagi backlog kepada sprint yang lebih senang di-execute._

## Sprint 0 - Foundation

- confirm Supabase schema draft
- confirm auth providers and redirect URLs
- confirm role and entitlement helpers
- confirm public config endpoint
- confirm launch spec
- confirm docs index

### Done when

- auth and app bootstrap can load cleanly
- role and package limits have a single source of truth
- MVP tables are defined

## Sprint 1 - Auth and Onboarding

- survey before login popup
- email login
- Google OAuth login
- persona wizard
- profile sync
- member sync

### Done when

- user can sign in and resume the right workspace setup
- survey data persists
- profile data syncs correctly

## Sprint 2 - Workspace Core

- leads list
- clients list
- tasks stage and progress
- cases module
- services module
- access guard
- overview summary

### Done when

- user can manage core CRM objects
- role-based access works for workspace views
- dashboard shows useful summary cards

## Sprint 3 - Communication and Accounting

- unified inbox
- email draft and send
- WhatsApp connect flow
- Telegram bot flow
- invoice create
- receipt generate
- downloadable docs
- basic PnL

### Done when

- user can communicate across channels from one place
- invoice and receipt flow works end-to-end
- basic revenue and expense reporting is visible

## Sprint 4 - Automation, AI, and Billing

- calendar sync
- reminder automation
- scheduled send
- AI draft and summary
- AI workflow assist
- BYO AI key support
- plan limit enforcement
- Billplz routing
- Stripe routing

### Done when

- reminders and calendar sync reduce manual follow-up
- AI helps draft and suggest next steps
- billing stack can route by region

## Sprint 5 - Hardening

- audit logs
- idempotency keys
- connector health
- admin console
- support tooling
- report exports

### Done when

- system is safer to operate in production
- retries and duplicate sends are controlled
- admin can troubleshoot workspace issues

## Sprint 6 - Launch Readiness

- pricing page final pass
- landing page final copy pass
- onboarding microcopy final pass
- package limits review
- support contact and FAQ final check
- production smoke test

### Done when

- landing, CRM, and docs feel consistent
- package and onboarding flow are ready to sell
- core scenarios pass a smoke test
