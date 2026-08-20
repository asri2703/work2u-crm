# Work2U Product Brainstorm

_Ringkasan pantas untuk arah produk, positioning, dan keputusan asas sebelum coding._

## One-Liner

Work2U ialah all-in-one business CRM dengan AI assistant untuk bantu user urus prospek, task, komunikasi, billing, reminder, dan reporting dalam satu platform.

## Siapa Sasaran

- ejen property
- ejen insurance
- freelancer
- small business owner
- corporate team
- collaborative teams yang bekerja pada task yang sama

## Masalah Utama Yang Diselesaikan

- terlalu banyak app untuk urusan harian
- follow-up prospek mudah tertinggal
- task, calendar, email, WhatsApp, dan invoice berpecah
- user perlu ingat terlalu banyak benda
- tools sedia ada terlalu mahal untuk ramai pengguna

## Janji Produk

- less to remember
- less manual follow-up
- less app switching
- more focus on priority work
- AI sebagai assistant, bukan pengganti manusia

## Core Flow

1. User buka landing page
2. Sistem buat survey ringkas untuk faham industri, use case, dan fungsi yang diperlukan
3. User login guna email atau Google
4. User setup channel komunikasi yang dipilih
5. Task, reminder, dan follow-up sync ke calendar serta notification
6. AI bantu suggest ayat, susun flow, dan automate follow-up tertentu
7. User tengok reports, invoice, client activity, dan revenue dalam satu dashboard

## Core Modules

- Task system
- Leads
- Clients
- Cases
- Services
- Reports
- Accounting
- Calendar sync
- Share link
- Mailing system
- AI assistant
- WhatsApp web client login
- Telegram bot support
- Social media management

## Communication Strategy

- Email
  - user boleh guna email sendiri atau domain Work2U
- WhatsApp
  - login melalui device/session scan
- Telegram
  - guna `work2u_bot` untuk direct message automation

## AI Direction

- suggest ayat sebelum hantar mesej
- bantu follow up client secara automatik
- bantu user susun idea dan implement flow business
- guna connection akaun AI sendiri bila perlu
- track quota dan guardrail supaya kos terkawal

## Login & Onboarding

- survey popup sebelum login untuk align produk ikut user
- login options:
  - email
  - Google OAuth
- onboarding perlu cepat, ringkas, dan terus tunjuk value

## Monetization Direction

- starter plan cadangan: `RM39`
- pricing mesti low-friction supaya sesuai untuk freelancer dan small business
- support regional payment:
  - Malaysia: `Billplz`
  - global: `Stripe`
- ada super admin untuk kawal package, akses, dan limit

## Roles

- Super Admin
- Admin
- User

## Tech Direction

- base stack:
  - Cloudflare
  - Supabase
  - Resend
  - optional Vercel
  - GitHub

## Product Positioning

Work2U bukan sekadar CRM.

Ia ialah business operating system yang bantu user:

- simpan semua kerja penting di satu tempat
- follow up lebih cepat
- automate rutin yang membazir masa
- kurangkan stress ingat benda kecil
- bantu user fokus pada kerja bernilai tinggi

## Next Documents To Follow

- [Product spec v1](./work2u-product-spec-v1.md)
- [Communication hub](./work2u-communication-hub.md)
- [Pricing & packaging](./work2u-pricing-packaging.md)
- [Entitlement map](./work2u-entitlement-map.md)
- [Integration checklist](./work2u-integration-checklist.md)
- [Backend architecture](./work2u-backend-architecture.md)
- [Billing, revenue & PnL](./work2u-billing-revenue-pnl.md)
- [UX & onboarding](./work2u-ux-onboarding.md)
- [AI strategy](./work2u-ai-strategy.md)

## Working Note

Dokumen ini kekal sebagai ringkasan idea. Bila scope dah stabil, keputusan detail akan dipindahkan ke dokumen spec dan backlog yang lebih teknikal.
