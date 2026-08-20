# Work2U Integration Checklist

_Step-by-step checklist untuk masuk fasa integration tanpa tersasar._

## Goal

Pastikan semua integration masuk dalam urutan yang selamat:

- auth dulu
- data model dulu
- billing dulu
- email dan calendar
- chat connectors
- AI
- monitoring
- final smoke test

## Phase 0 - Access And Hygiene

- confirm owner access to `GitHub`
- confirm access to `Cloudflare`
- confirm access to `Supabase`
- confirm access to `Resend`
- confirm access to `Billplz`
- confirm access to `Stripe`
- confirm access to `Google Cloud`
- confirm access to `Apple Developer`
- confirm access to domain DNS for `work2u.io`
- rotate any exposed secrets before launch
- store all live keys in environment variables only

## Phase 1 - Repo And Environment

- confirm repo branch strategy
- create `.env.local` from `.env.example`
- add all runtime secrets to environment config
- separate public keys from server-side secrets
- confirm local dev and production env names
- add secret scanning or at least a review checklist

## Phase 2 - Supabase Foundation

- for fastest setup, apply [Work2U Master Deploy Bundle](./work2u-master-deploy-bundle.sql) after the base auth/profile schema
- confirm `public.plans` seed data
- confirm `public.subscriptions` schema
- confirm `public.entitlements` schema
- confirm `public.usage_meters` schema
- confirm `public.profiles` sync path
- confirm RLS policies for owner and super admin
- confirm auth trigger for new user profile creation
- confirm workspace member ownership rules

## Phase 3 - Auth Providers

- configure email login and magic link
- configure Google OAuth
- configure Apple ID sign-in
- confirm redirect URLs for local and production
- confirm onboarding redirect after first login

## Phase 4 - Billing Providers

- configure Billplz collection and webhook flow
- configure Stripe product and price mapping
- confirm provider routing by region
- confirm webhook signature validation
- confirm subscription update flow
- confirm entitlement recalculation after payment events

## Phase 5 - Mailing

- verify domain in Resend
- configure sender name and reply-to
- set DKIM and SPF correctly
- create invoice and reminder templates
- confirm bounce and failed-send handling

## Phase 6 - Calendar And Productivity

- set up Google Calendar project
- enable Calendar API
- configure OAuth consent screen
- store calendar connection status per workspace
- confirm task-to-calendar sync
- confirm reminder schedule jobs

## Phase 7 - Messaging Connectors

### WhatsApp

- confirm Baileys session storage approach
- define QR login flow
- persist device/session state safely
- confirm reconnect and retry behavior
- define message send and status tracking

### Telegram

- create `work2u_bot`
- set bot token securely
- confirm username / handle capture in client records
- define send flow and retry handling

### Email Inbox

- define mailbox connect or send-only flow
- confirm own-domain email or Work2U domain email routing
- confirm thread mapping and reply tracking

## Phase 8 - AI

- choose managed AI or BYO AI key flow
- define quota counters for AI actions
- store prompt trace and versioning
- define suggest-only, semi-auto, and auto-send modes
- add safe fallback when user has no AI key connected

## Phase 9 - Final Runtime Checks

- confirm entitlement enforcement for Starter, Elite, and Enterprise
- confirm package limits are visible in UI
- confirm over-limit handling is graceful
- confirm admin override path is logged
- confirm audit log coverage for billing and connector changes
- confirm notification and retry flows are not duplicated

## Phase 10 - Launch Smoke Test

- create new user
- complete survey
- verify package recommendation
- login with one provider
- connect one email or messaging channel
- create lead, task, client, invoice, and reminder
- send one test message
- generate one report
- verify upgrade path from Starter to Elite

## Recommended Order

1. access and hygiene
2. repo and environment
3. Supabase foundation
4. auth providers
5. billing providers
6. mailing
7. calendar
8. messaging connectors
9. AI
10. final runtime checks
11. launch smoke test

## Done When

- every provider is connected through environment variables
- billing updates entitlements correctly
- messaging and AI are quota-aware
- setup can be completed without manual database edits
- smoke test passes from survey to first sent message
