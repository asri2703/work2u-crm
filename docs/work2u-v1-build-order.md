# Work2U V1 Build Order

_Susunan binaan untuk V1 supaya kita bina foundation yang betul dulu, bukan terus lompat ke feature besar._

Untuk database, gunakan [Work2U Master Deploy Bundle](./work2u-master-deploy-bundle.sql) sebagai laluan paling cepat untuk pasang foundation penuh.
Untuk onboarding review selepas deploy, rujuk [Work2U Onboarding And Package Routing](./work2u-onboarding-package-routing.md) dan [Work2U Smoke Test Checklist](./work2u-smoke-test-checklist.md).

## P0 - Must Build First

### 0. Identity And Entry

- survey before login
- email login flow
- login state dan profile sync
- workspace bootstrap
- role model asas: Super Admin, Admin, User

### 1. Core Data Foundation

- leads
- clients
- tasks
- services
- cases
- entitlement engine
- package routing untuk Starter, Elite, Enterprise

### 2. Internal Calendar Foundation

- internal calendar schema
- task-to-calendar sync
- reminder queue
- notification status tracking
- calendar view pada dashboard

### 3. Messaging Foundation

- Resend mailing helper
- email sending domain Work2U
- base email template
- reply-to handling
- email verification / login mail path

### 4. Billing Foundation

- Billplz routing untuk Malaysia
- Stripe routing untuk global
- 7-day trial with card requirement on Stripe
- subscription sync
- entitlement update after payment success

## P1 - Build Immediately After

- invoices
- receipts
- downloadable documents
- WhatsApp companion flow
- Telegram bot flow
- unified inbox timeline
- reminder jobs
- internal notes and activity trail

## P2 - Add After Core Stability

- reports
- revenue dashboard
- PnL summary
- AI draft assist
- AI suggestion assist
- automation rules
- audit log
- connector health

## P3 - Optional Later

- Google login
- Google Calendar sync
- Gmail integration
- enterprise Google connector
- advanced social media management
- multilingual expansion beyond BM + English

## P0 Exit Criteria

- survey, auth, and workspace bootstrap boleh berjalan tanpa error utama
- user boleh buka dashboard dengan role yang betul
- core CRM data boleh disimpan dan dibaca
- internal calendar boleh simpan event dan reminder
- email send melalui Resend boleh berfungsi
- billing route mengikut region
- payment success boleh unlock entitlement

## Suggested Build Sequence

1. survey and auth
2. workspace and roles
3. core CRM tables
4. internal calendar schema
5. Resend template and sending flow
6. billing routing and webhook
7. dashboards and smoke test
