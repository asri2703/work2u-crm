# Work2U Env Fill Guide

_Panduan cepat untuk isi env local dan production ikut region._

## 1. Core Values

| Key | Local | Malaysia prod | Global prod | Note |
| --- | --- | --- | --- | --- |
| `APP_BASE_URL` | `http://localhost:3000` | `https://work2u.io` | `https://work2u.io` | Base app URL |
| `PORT` | `3000` | `3000` | `3000` | Local/runtime only |
| `SUPABASE_URL` | fill | fill | fill | Supabase project URL |
| `SUPABASE_PROJECT_ID` | fill | fill | fill | Optional fallback / reference |
| `SUPABASE_ANON_KEY` | fill | fill | fill | Browser-safe |
| `SUPABASE_SERVICE_ROLE_KEY` | fill | fill | fill | Server-side only |
| `SUPABASE_REDIRECT_TO` | `http://localhost:3000/work2u` | `https://work2u.io/work2u` | `https://work2u.io/work2u` | Auth redirect |

## 2. Email Login

| Key | Local | Malaysia prod | Global prod | Note |
| --- | --- | --- | --- | --- |
| `RESEND_API_KEY` | fill | fill | fill | Required for email sending / verification |
| `RESEND_FROM_EMAIL` | `noreply@work2u.io` | `noreply@work2u.io` | `noreply@work2u.io` | Must match verified sender domain |
| `RESEND_FROM_NAME` | `Work2U` | `Work2U` | `Work2U` | Sender name shown to users |
| `RESEND_REPLY_TO` | `enquiry@work2u.io` | `enquiry@work2u.io` | `enquiry@work2u.io` | Reply handling address |

### Google note

- Google login and Google Calendar are optional later connectors, not required for V1.
- If you add them later, keep the Google vars in a separate section and only fill them when needed.

## 3. AI

| Key | Local | Malaysia prod | Global prod | Note |
| --- | --- | --- | --- | --- |
| `GROQ_API_KEY` | fill if used | fill if used | fill if used | Optional AI provider |

## 4. Messaging

| Key | Local | Malaysia prod | Global prod | Note |
| --- | --- | --- | --- | --- |
| `WHATSAPP_WEBHOOK_SECRET` | fill | fill | fill | Shared secret for WhatsApp companion flow |

## 5. Malaysia Billing

| Key | Local | Malaysia prod | Global prod | Note |
| --- | --- | --- | --- | --- |
| `BILLPLZ_API_BASE_URL` | default | `https://www.billplz.com/api` | comment only | Billplz endpoint |
| `BILLPLZ_COLLECTION_ID` | fill if testing | fill | comment only | Collection ID |
| `BILLPLZ_SECRET_KEY` | fill if testing | fill | comment only | Server-side only |
| `BILLPLZ_X_SIGNATURE_KEY` | fill if testing | fill | comment only | Callback validation |

## 6. Global Billing

| Key | Local | Malaysia prod | Global prod | Note |
| --- | --- | --- | --- | --- |
| `STRIPE_PUBLISHABLE_KEY` | fill if testing | comment only | fill | Browser-safe |
| `STRIPE_SECRET_KEY` | fill if testing | comment only | fill | Server-side only |
| `STRIPE_WEBHOOK_SECRET` | fill if testing | comment only | fill | Webhook validation |

## 7. Recommended Fill Order

1. Supabase keys
2. Resend keys
3. region billing keys
4. WhatsApp secret
5. AI key
6. verify public policy pages
7. test one login and one billing flow per region

## 8. Safety Rules

- never paste live secrets into chat
- keep server-only keys out of the client bundle
- rotate any key that was shared publicly
- use separate files for local, Malaysia production, and global production
