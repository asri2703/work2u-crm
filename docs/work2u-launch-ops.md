# Work2U Launch Operations

_Runbook praktikal untuk hari launch dan 72 jam pertama selepas go-live._

## 1. Before Launch

- rotate every exposed secret
- confirm `.env.local` and production env files are complete
- verify `Privacy Policy` and `Service Policy` are public
- confirm Google OAuth consent screen is ready
- confirm billing provider routing:
  - Malaysia -> Billplz
  - Global -> Stripe
- confirm trial 7 hari flow dengan card requirement jika Stripe aktif
- confirm Supabase auth redirect URL
- confirm webhook endpoints are live and signed

## 2. Database And Access

- for a full environment setup, run [Work2U Master Deploy Bundle](./work2u-master-deploy-bundle.sql) first
- confirm `profiles`, `subscriptions`, `entitlements`, and `workspace_members` are seeded or auto-created correctly
- confirm every workspace table has `workspace_id` or `owner_id`
- confirm RLS blocks cross-workspace reads and writes
- confirm super admin can still audit and override
- confirm admin and user roles only see the scope they should see

## 3. Billing Flow

- make one successful Billplz test payment for Malaysia
- make one successful Stripe test payment for global
- confirm webhook updates `subscriptions`
- confirm entitlement recalculates after payment
- confirm failed payment does not unlock access
- confirm cancel and unsubscribe flow still leaves the user able to return later

## 4. Messaging And Automation

- test email sending
- test WhatsApp session flow
- test Telegram bot send flow
- test calendar sync
- test AI draft suggestion
- test reminder creation from task and client actions

## 5. Mobile Smoke Test

- open survey on mobile width
- complete survey
- log in with email or Google
- open dashboard
- open module detail overlay
- tap a shortcut and confirm it jumps to the right subview
- verify the layout stacks cleanly and buttons stay tappable

## 6. First 72 Hours

- watch billing events
- watch auth sign-ins
- watch failed webhook signatures
- watch AI usage growth
- watch support tickets for onboarding friction
- check whether the starter price and limits feel too tight or too loose
- confirm super admin review path works when a user needs help

## 7. Launch Stop Conditions

- stop the launch if a webhook is failing signature validation
- stop the launch if RLS is leaking cross-workspace data
- stop the launch if payment success does not unlock access correctly
- stop the launch if auth redirects break on mobile
- stop the launch if the legal pages are still missing
