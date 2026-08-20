# Work2U Product Spec v1

_Dokumen rujukan untuk keputusan produk yang sudah cukup matang untuk mula build v1._

## Product Summary

Work2U ialah `AI-powered business operating system` untuk bantu user urus:

- leads
- clients
- tasks
- cases
- communication
- accounting
- reminders
- basic automation
- AI assisted follow-up

## Primary Personas

- Property Agent
- Insurance Agent
- Freelancer
- Corporate Team
- General Business

## Core Promise

- less to remember
- less manual follow-up
- less app switching
- more priority focus
- AI as assistant, not replacement

## Product Principles

- survey first, login second
- prioritize action over dashboard noise
- keep Starter affordable and useful
- lock limits, not the core workflow
- support Malaysia and global from day one
- make AI helpful even when user has their own AI account

## Product Layers

### Experience Layer

- landing page
- onboarding survey
- login and setup
- dashboard and navigation

### Workspace Layer

- leads
- clients
- tasks
- cases
- services

### Communication Layer

- email
- WhatsApp
- Telegram
- drafts
- reminders

### Financial Layer

- invoices
- receipts
- downloadable documents
- revenue and PnL

### Intelligence Layer

- AI drafts
- AI suggestion
- workflow assist
- idea-to-flow guidance

### Control Layer

- roles
- packages
- audit trail
- admin console

## Product Flow

### Before Login

- user jumpa survey popup
- survey kenal persona, team size, region, language, channels, dan AI mode
- sistem cadang package awal berdasarkan jawapan survey

### Login

- email magic link
- email password login

### After Login

- profile auto-sync ke Supabase
- user dibawa ke onboarding jika setup belum lengkap
- dashboard berubah ikut persona dan package

### Setup Flow Detail

1. user buka survey popup
2. user pilih role, goal, channel, team size, dan AI mode
3. system cadang package
4. user login
5. profile sync ke Supabase
6. user terus masuk dashboard yang sudah disesuaikan

### Package Resolution Flow

- `public.plans` simpan katalog package dan price rasmi
- `public.subscriptions` simpan status billing aktif
- `public.profiles.package` simpan package semasa untuk render cepat di UI
- `public.entitlements` simpan limit per owner dan plan
- `public.usage_meters` simpan usage sebenar semasa berjalan
- server baca package dari subscription aktif, kemudian resolve entitlement yang sepadan
- jika entitlements belum ada, plan default digunakan sebagai fallback
- super admin boleh override entitlement untuk kes khas
- entitlement key detail ada dalam [Work2U Entitlement Map](./work2u-entitlement-map.md)
- integration order ada dalam [Work2U Integration Checklist](./work2u-integration-checklist.md)

## Core Modules

### CRM Core

- leads
- clients
- cases
- services
- tasks

### Communication Core

- email inbox
- WhatsApp inbox
- Telegram bot flow
- drafts
- scheduled send
- retry handling

### Accounting Core

- invoices
- receipts
- downloadable documents
- send via email / WhatsApp / Telegram
- basic revenue and PnL

### Automation Core

- reminders
- follow-up rules
- calendar sync
- escalation rules

### AI Core

- reply draft
- follow-up suggestion
- summary
- workflow suggestion
- idea-to-flow assistant

## Integration Strategy

### Billing

- Malaysia: Billplz
- Global: Stripe

### Mail

- Work2U domain email sebagai default sending layer
- Resend sebagai mailing layer
- user email sendiri boleh disambung kemudian jika feature memerlukan reply sync

### Calendar

- internal calendar first
- task sync to internal calendar
- Google Calendar sync optional later

### WhatsApp

- session/device based flow
- QR scan to connect
- no WhatsApp API dependency for v1 concept

### Telegram

- `work2u_bot` untuk direct send
- simpan Telegram username / handle dalam client record

### AI

- BYO AI key support
- managed AI optional ikut plan
- suggest-only mode untuk kawalan kos

## Roles

- Super Admin
- Admin
- User

## Region Strategy

- Malaysia: Billplz
- Global: Stripe

## Email Strategy

- user boleh guna email sendiri
- user boleh guna Work2U domain email jika dibenarkan plan
- Resend jadi mailing system asas

## WhatsApp Strategy

- device/session based flow
- QR scan to connect
- no WhatsApp API dependency for v1 concept

## Telegram Strategy

- gunakan `work2u_bot`
- user simpan Telegram username atau handle dalam client detail

## Pricing Summary

- Starter: RM39
- Elite: RM99
- Enterprise: custom, with setup / retainer for sales-led deals

## Package Behavior

### Starter

- solo user
- core CRM
- reminder asas
- AI draft assist terhad
- automation rendah

### Elite

- small team
- lebih banyak channel
- lebih banyak automation
- lebih banyak AI quota
- accounting dan reporting lebih kuat

### Enterprise

- custom permissions
- custom onboarding
- advanced analytics
- admin tooling
- SLA / custom onboarding

## V1 Success Criteria

- user boleh sign up and complete survey
- user boleh login dengan 3 method
- profile tersimpan dan sync
- member management berfungsi ikut role
- invoicing basic tersedia
- reminders and calendar sync active
- AI draft assist available
- package limit enforced
- survey-to-dashboard flow feels natural and fast

## Out of Scope For V1

- full ERP depth
- advanced inventory
- complex accounting ledger engine
- enterprise SSO
- native mobile app

## Locked Decisions

- survey before login: yes
- AI strategy: assistant first
- communication strategy: unify channels
- accounting strategy: light but useful
- pricing strategy: affordable first
- stack base: Cloudflare + Supabase + Resend + optional Vercel + GitHub
- product strategy: affordable first, scalable later
