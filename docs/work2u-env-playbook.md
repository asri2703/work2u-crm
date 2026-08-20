# Work2U Env Playbook

_Rujukan praktikal untuk semak `.env.local`, pecahan production, dan checklist launch._

## 1. Verification Notes

Saya semak susunan env yang ada sekarang. Struktur asas sudah lengkap untuk development.

### Current local status

- Core: complete
- Supabase: complete
- Optional Google connectors: `GOOGLE_CLIENT_SECRET` masih kosong
- Resend: siap selepas `RESEND_API_KEY` diisi
- AI: complete
- WhatsApp: complete
- Billplz: complete
- Stripe: `STRIPE_WEBHOOK_SECRET` masih kosong

### Already in place

- core app URL
- Supabase config
- Resend sender config
- AI key
- Billplz config
- Stripe config
- WhatsApp connector secret placeholder

### Still intentionally pending

- `RESEND_API_KEY`
  - isi bila email sending dan verification hendak diaktifkan
- `GOOGLE_CLIENT_SECRET`
  - boleh dibiarkan kosong sampai optional Google connector memang diperlukan
- `STRIPE_WEBHOOK_SECRET`
  - isi bila endpoint webhook Stripe memang akan digunakan

### Notes from current check

- user has already filled all other required sections in `.env.local`
- Resend secret should be added before email sending goes live
- Google secret can stay empty until optional connector pages are ready
- Stripe webhook secret must be filled before live Stripe billing is enabled

### Important note

Kalau ada key yang pernah dikongsi di luar file env, anggap ia sudah exposed dan rotate bila perlu.

## 2. Production Split

Cadangan saya, asingkan production ikut region supaya lebih kemas.

### Shared values for all regions

- `APP_BASE_URL`
- `SUPABASE_URL`
- `SUPABASE_PROJECT_ID`
- `SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `SUPABASE_REDIRECT_TO`
- `RESEND_API_KEY`
- `RESEND_FROM_EMAIL`
- `RESEND_FROM_NAME`
- `RESEND_REPLY_TO`
- `GROQ_API_KEY`

### Malaysia production

Use `.env.production.my` for the live file and `.env.production.my.example` as the template if you want one.

- `BILLPLZ_API_BASE_URL`
- `BILLPLZ_SECRET_KEY`
- `BILLPLZ_COLLECTION_ID`
- `BILLPLZ_X_SIGNATURE_KEY`
- `WHATSAPP_WEBHOOK_SECRET` if WhatsApp live routing is enabled

### Global production

Use `.env.production.global` for the live file and `.env.production.global.example` as the template if you want one.

- `STRIPE_PUBLISHABLE_KEY`
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `WHATSAPP_WEBHOOK_SECRET` if WhatsApp live routing is enabled

### Recommended rule

- Malaysia users route billing to Billplz
- global users route billing to Stripe
- keep only one billing provider active for a workspace unless you really need both

## 3. Launch V1 Checklist

### Must have for launch

- app base URL works in local and production
- Supabase auth works
- public anon key is set
- service role key is stored server-side only
- optional Google connector can stay disabled for V1
- later enable it only if the connector is truly needed
- one billing provider is active for the chosen region
- AI feature has quota or is explicitly optional
- WhatsApp connector secret is set if connector is part of v1

### Must have before public billing

- payment callback validation
- invoice or receipt generation flow
- subscription or package update flow
- entitlement update flow after payment
- admin override path for support

### Safe to delay

- Telegram bot automation
- advanced social media management
- deep AI automation
- multi-region billing in the same workspace
- optional Google connector setup

## 4. Checklist By Function

### Login and onboarding

- email login
- survey popup before first login
- workspace creation after survey

### CRM core

- leads
- clients
- tasks
- cases
- services
- reminder sync

### Accounting

- invoice creation
- receipt generation
- downloadable document
- email or WhatsApp send
- package-based access control

### Calendar

- internal calendar
- task reminder sync
- phone notification reminder

### Messaging

- email sending
- WhatsApp QR/session connector
- Telegram bot via `work2u_bot`

### AI

- draft suggestions before sending
- workflow assistant chat
- optional BYO AI account
- usage limit per package

### Billing and package control

- Starter
- Elite
- Enterprise
- super admin access
- plan limit enforcement
- regional billing routing

## 5. Recommended Next Step

Build around this order:

1. auth
2. Supabase profile and workspace data
3. one billing region
4. one messaging channel
5. AI draft assist
6. calendar sync
7. expand to the rest
