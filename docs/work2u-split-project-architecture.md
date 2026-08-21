# Work2U Split Project Architecture

_Rujukan untuk pemisahan deployment Work2U supaya landing, CRM, dan backend dapat bergerak dengan lebih jelas._

## Tujuan

Work2U dibina sebagai platform all-in-one untuk:

- task system
- leads dan clients
- services
- cases dan reports
- accounting, invoicing, receipt, dan document delivery
- calendar dan reminder
- email, WhatsApp, dan Telegram follow-up
- AI assistant
- social media management

Supaya scaling lebih kemas, projek ini dipisahkan kepada beberapa deployment.

## Cadangan Struktur

| Project | Domain | Fungsi |
| --- | --- | --- |
| Landing / marketing site | `work2u.io` | homepage, pricing, company profile, policies, signup/login entry, docs public |
| CRM app | `crm.work2u.io` | dashboard pengguna, lead, client, task, billing, calendar, AI, messaging |
| API / backend service | `api.work2u.io` | webhook, automation, sync job, messaging bridge, scheduled processing |

## Vercel Project Role

### 1. Landing Site

Kegunaan:

- tarik traffic
- explain value proposition
- bantu conversion ke signup
- paparkan privacy policy, service policy, terms, dan pricing

Cadangan kandungan:

- hero section
- social proof
- feature blocks
- package pricing
- FAQ
- CTA ke login/register

### 2. CRM App

Kegunaan:

- dashboard utama selepas login
- survey onboarding
- task staging dan progress
- lead-to-client flow
- invoice, receipt, report, dan account tools
- internal calendar
- AI helper untuk draft dan suggestion

### 3. Backend Service

Kegunaan:

- payment webhook
- reminder processor
- email queue
- Telegram bot event handler
- WhatsApp companion integration
- background sync

## Domain Notes

- `work2u.io` sudah sesuai sebagai domain utama public.
- `crm.work2u.io` ialah pilihan terbaik untuk app selepas login.
- Jika `crm.work2u.io` masih conflict, gunakan sementara `app.work2u.io` atau `dashboard.work2u.io`.
- Bila alias sudah bebas, pindahkan kembali ke `crm.work2u.io`.

## Final Rollout Plan

1. `work2u.io` kekal sebagai landing page rasmi untuk marketing, trust, pricing, dan policy pages.
2. `crm.work2u.io` menjadi domain utama untuk dashboard pengguna, onboarding, CRM, billing, dan reporting.
3. `api.work2u.io` digunakan nanti untuk webhook, bot bridge, sync jobs, dan automation backend.
4. Jika `crm.work2u.io` masih locked, sementara gunakan `app.work2u.io` supaya CRM boleh hidup tanpa menunggu transfer alias.
5. Backup production URL Vercel kekal sebagai fallback semasa development dan debugging.

## Current Status

- landing site dan CRM app sudah berada dalam satu codebase reference set
- CRM Vercel project sudah dibuat untuk deployment berasingan
- percubaan attach `crm.work2u.io` menunjukkan `alias_conflict`, jadi domain itu perlu disahkan semula sebelum live

## Environment Split

Gunakan env berasingan ikut region dan tujuan:

- `.env.local` untuk local development
- `.env.production.my` untuk Malaysia
- `.env.production.global` untuk global

Cadangan naming yang konsisten:

- `APP_BASE_URL`
- `CRM_BASE_URL`
- `API_BASE_URL`
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `RESEND_API_KEY`
- `RESEND_FROM_EMAIL`
- `STRIPE_SECRET_KEY`
- `BILLPLZ_SECRET_KEY`

## Deployment Order

1. lock landing site identity on `work2u.io`
2. deploy CRM app on separate Vercel project
3. keep backend routes isolated for webhook and automation work
4. only add Google connectors after brand verification is complete
5. keep internal calendar active even before Google sync is enabled

## Company Details

- Nama: Saga X Ventures (NS0246319-H)
- Website: https://sagaxventures.com
- Alamat: 136-1, Jalan Komersial Senawang, Taipan 1, 70450 Seremban, Negeri Sembilan
- Telefon: +6013-773 2703

## Practical Rule

Kalau sesuatu feature memerlukan scale, webhook, atau isolation security yang lebih tinggi, letak dalam backend service. Kalau feature itu user-facing dan perlu cepat diakses, letak dalam CRM app. Kalau feature itu public-facing, letak di landing site.
