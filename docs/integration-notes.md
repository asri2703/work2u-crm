# Work2U Integration Notes

_Rujukan ringkas untuk simpanan secrets, env vars, dan access yang diperlukan semasa integration._

## Where To Put What

- `.env.local` untuk local development
- production secret manager untuk live deployment
- docs ini untuk rujukan nama env var, bukan nilai secret

## Local Template

Gunakan [`.env.local.template`](/D:/vscode/work2u/work2u-crm/.env.local.template) sebagai starting point untuk local setup.
Kalau nak versi yang lebih kemas ikut scope, boleh terus guna [`.env.local.scoped.example`](/D:/vscode/work2u/work2u-crm/.env.local.scoped.example).

## Env Vars By Service

### Core

- `APP_BASE_URL`

### Supabase

- `SUPABASE_URL`
- `SUPABASE_PROJECT_ID`
- `SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `SUPABASE_REDIRECT_TO`

### Google

- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `GOOGLE_REDIRECT_URI`

### AI

- `GROQ_API_KEY`

### WhatsApp

- `WHATSAPP_WEBHOOK_SECRET`

### Billplz

- `BILLPLZ_API_BASE_URL`
- `BILLPLZ_SECRET_KEY`
- `BILLPLZ_COLLECTION_ID`
- `BILLPLZ_X_SIGNATURE_KEY`

### Stripe

- `STRIPE_SECRET_KEY`
- `STRIPE_PUBLISHABLE_KEY`
- `STRIPE_WEBHOOK_SECRET`

## Frontend Vs Backend

### Frontend-safe

Nilai ini boleh dibaca oleh client atau dipakai sebagai app config:

- `APP_BASE_URL`
- `SUPABASE_URL`
- `SUPABASE_PROJECT_ID`
- `SUPABASE_ANON_KEY`
- `SUPABASE_REDIRECT_TO`
- `GOOGLE_CLIENT_ID`
- `GOOGLE_REDIRECT_URI`
- `BILLPLZ_API_BASE_URL`
- `BILLPLZ_COLLECTION_ID`
- `STRIPE_PUBLISHABLE_KEY`

### Backend-only

Nilai ini mesti kekal server-side sahaja:

- `SUPABASE_SERVICE_ROLE_KEY`
- `GOOGLE_CLIENT_SECRET`
- `GROQ_API_KEY`
- `WHATSAPP_WEBHOOK_SECRET`
- `BILLPLZ_SECRET_KEY`
- `BILLPLZ_X_SIGNATURE_KEY`
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`

### Feature-gated

Nilai ini boleh dihidupkan hanya bila feature berkaitan sudah siap:

- `GOOGLE_CLIENT_SECRET`
- `BILLPLZ_SECRET_KEY`
- `BILLPLZ_COLLECTION_ID`
- `BILLPLZ_X_SIGNATURE_KEY`
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `GROQ_API_KEY`
- `WHATSAPP_WEBHOOK_SECRET`

## File And Route Map

Gunakan jadual ini bila nak tahu env mana dibaca oleh fail mana.

| Env var | Used by files / routes | Notes |
| --- | --- | --- |
| `APP_BASE_URL` | `server.js`, `api/auth/google/login.js`, `api/auth/google/callback.js` | Base URL untuk build callback, redirect, dan link app |
| `SUPABASE_URL` | `server.js`, `work2u/app.js` | URL projek Supabase |
| `SUPABASE_PROJECT_ID` | `server.js` | Fallback untuk bina Supabase URL bila `SUPABASE_URL` belum diisi |
| `SUPABASE_ANON_KEY` | `server.js`, `work2u/app.js` | Public key untuk client-side auth |
| `SUPABASE_SERVICE_ROLE_KEY` | `server.js` | Server-only, jangan hantar ke browser |
| `SUPABASE_REDIRECT_TO` | `server.js` | Redirect selepas auth / onboarding |
| `GOOGLE_CLIENT_ID` | `server.js`, `api/auth/google/login.js`, `api/auth/google/callback.js` | Digunakan untuk OAuth login dan calendar flow |
| `GOOGLE_CLIENT_SECRET` | `server.js`, `api/auth/google/callback.js` | Server-only OAuth exchange |
| `GOOGLE_REDIRECT_URI` | `server.js`, `api/auth/google/login.js`, `api/auth/google/callback.js` | Callback URL yang sama perlu konsisten |
| `GROQ_API_KEY` | `server.js`, `api/ai/groq.js` | Untuk AI assistant / drafting |
| `WHATSAPP_WEBHOOK_SECRET` | `server.js`, `api/whatsapp/webhook.js` | Validate webhook dan connector request |
| `BILLPLZ_API_BASE_URL` | `server.js` | Endpoint Billplz |
| `BILLPLZ_SECRET_KEY` | `server.js` | Server-only Billplz auth |
| `BILLPLZ_COLLECTION_ID` | `server.js` | Collection untuk payment flow |
| `BILLPLZ_X_SIGNATURE_KEY` | `server.js` | Validate signature callback |
| `STRIPE_PUBLISHABLE_KEY` | UI config / client billing setup | Safe for browser bila payment UI perlukan |
| `STRIPE_SECRET_KEY` | `server.js` | Server-only Stripe secret |
| `STRIPE_WEBHOOK_SECRET` | `server.js` | Validate Stripe webhook |

## Webhook URLs

### Stripe

- local: `http://localhost:3000/api/billing/webhook`
- production: `https://work2u.io/api/billing/webhook`
- alias: `https://work2u.io/api/billing/stripe/webhook`

### Billplz

- callback: `http://localhost:3000/api/billing/billplz/callback`
- redirect: `http://localhost:3000/api/billing/billplz/redirect`

### WhatsApp

- local and production endpoint: `http://localhost:3000/api/whatsapp/webhook`
- use `WHATSAPP_WEBHOOK_SECRET` to validate incoming requests

## Fill Order For Launch

### Must Fill First

1. `APP_BASE_URL`
2. `SUPABASE_URL`
3. `SUPABASE_PROJECT_ID`
4. `SUPABASE_ANON_KEY`
5. `SUPABASE_REDIRECT_TO`
6. `GOOGLE_CLIENT_ID`
7. `GOOGLE_REDIRECT_URI`
8. `SUPABASE_SERVICE_ROLE_KEY`

### Must Fill Before Public Launch

1. `GOOGLE_CLIENT_SECRET` once privacy policy, service policy, and OAuth consent screen are ready
2. `GROQ_API_KEY` if AI assistant is part of v1
3. `WHATSAPP_WEBHOOK_SECRET` if WhatsApp webhook is part of v1
4. `BILLPLZ_COLLECTION_ID` and `BILLPLZ_SECRET_KEY` if Malaysia payments are live
5. `BILLPLZ_X_SIGNATURE_KEY` if Billplz callbacks are live
6. `STRIPE_SECRET_KEY` and `STRIPE_WEBHOOK_SECRET` if global payments are live
7. `STRIPE_PUBLISHABLE_KEY` if Stripe client checkout UI is active

### Next For Beta

1. `GOOGLE_CLIENT_SECRET`
2. `BILLPLZ_COLLECTION_ID` or `STRIPE_PUBLISHABLE_KEY` depending region
3. `BILLPLZ_SECRET_KEY` or `STRIPE_SECRET_KEY` depending region
4. `BILLPLZ_X_SIGNATURE_KEY`
5. `STRIPE_WEBHOOK_SECRET`
6. `GROQ_API_KEY`
7. `WHATSAPP_WEBHOOK_SECRET`

### Later / Optional

- `BILLPLZ_API_BASE_URL`
- `Resend` sending settings in backend config
- any extra connector-specific secrets for Telegram or WhatsApp infrastructure

## Access Checklist

- GitHub repo owner or admin access
- Cloudflare zone access for `work2u.io`
- Supabase project owner or service role access
- Google Cloud project with OAuth and Calendar enabled
- Resend account with verified domain
- Billplz merchant access
- Stripe dashboard access
- Telegram bot token for `work2u_bot`

## Safety Rules

- do not paste raw secrets into chat
- rotate any secret that has already been exposed
- keep service role keys server-side only
- use public env vars only for browser-safe values

## Recommended Next Step

After the access list is ready, populate `.env.local`, then verify login, billing, mailing, and connector flows one service at a time.
