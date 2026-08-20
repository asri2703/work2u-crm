# Work2U Implementation Backlog

_Senarai task implementasi yang lebih teknikal untuk execute MVP secara berperingkat._

## Milestone 0 - Foundation

- confirm Supabase schema for profiles, members, and workspace-owned tables
- define RLS policy pattern for all workspace data
- finalize auth providers and redirect URLs
- finalize public config flow from server to client
- define role capability helper and view guard
- define storage key strategy for local and synced data

## Milestone 1 - Auth and Onboarding

- survey before login popup
- auth method selector
- email magic link flow
- Google OAuth flow
- profile create or load on session
- onboarding wizard per persona
- save profile draft locally
- sync profile to Supabase

## Milestone 2 - Workspace Core

- member list
- member create/update/delete
- access management guard
- leads list
- client list
- tasks with stage and progress
- service list
- basic cases
- overview cards and workspace summary

## Milestone 3 - Communication

- unified inbox view
- thread list
- thread detail
- draft composer
- send via email
- WhatsApp connect flow
- Telegram bot flow
- message status state
- reminder and follow-up hints

## Milestone 4 - Accounting

- invoice create
- invoice edit
- invoice document render
- receipt generate
- downloadable document links
- send document by channel
- revenue report
- expense capture
- PnL summary

## Milestone 5 - Automation and Calendar

- Google Calendar sync
- task sync to calendar
- due date reminder
- scheduled send
- automation rules
- retry handling
- overdue escalation

## Milestone 6 - AI and Billing

- AI draft endpoint
- AI summary endpoint
- AI workflow suggestion endpoint
- AI assistant quota tracking
- BYO AI key support
- Starter / Elite / Enterprise entitlement checks
- Malaysia billing route
- global billing route
- webhook handling

## Milestone 7 - Hardening

- audit logs
- connector health
- idempotency keys
- soft delete for important records
- report exports
- admin console
- support tooling

## Implementation Order

1. foundation
2. auth and onboarding
3. workspace core
4. communication
5. accounting
6. automation and calendar
7. AI and billing
8. hardening

## Done Criteria Per Milestone

- each milestone ships with a visible user outcome
- no milestone should depend on future work for its core use case
- database access must remain workspace-safe
- feature flags or guardrails should exist before risky automation is enabled
