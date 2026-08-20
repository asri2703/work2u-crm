# Work2U Launch Ops One-Pager

_Versi cepat untuk hari launch dan 72 jam pertama selepas go-live._

## Pre-Launch

- rotate exposed secrets
- confirm `.env.local`, `.env.production.my`, and `.env.production.global`
- verify `Privacy Policy` and `Service Policy`
- confirm Google OAuth consent screen
- confirm billing route:
  - Malaysia -> Billplz
  - Global -> Stripe
- confirm Stripe 7-day trial with card requirement if enabled
- confirm Supabase auth redirect URL
- confirm webhook signatures and endpoints

## Database

- confirm `profiles`, `subscriptions`, `entitlements`, and `workspace_members`
- confirm all workspace tables have `workspace_id` or `owner_id`
- confirm RLS blocks cross-workspace reads and writes
- confirm super admin override works

## Smoke Test

- survey first
- login with email or Google
- open dashboard
- open module detail overlay
- use a shortcut and confirm it lands in the correct view
- test at least one lead, task, client, invoice, and message flow

## Billing

- Billplz test payment for Malaysia
- Stripe test payment for global
- confirm webhook updates subscription and entitlement
- confirm failed payment does not unlock access
- confirm unsubscribe/cancel path works

## Messaging And AI

- test email send
- test WhatsApp session flow
- test Telegram bot flow
- test calendar sync
- test AI draft assist

## 72-Hour Watchlist

- auth sign-ins
- billing events
- failed webhook signatures
- AI usage
- onboarding drop-off
- support tickets
- entitlement mismatches

## Stop If

- RLS leaks data
- webhook signatures fail
- billing does not unlock access
- auth redirect breaks on mobile
- legal pages are missing
