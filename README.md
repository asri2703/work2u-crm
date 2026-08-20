# Work2U

Work2U is an all-in-one business operating system built to help teams follow up faster, stay organized, and run daily operations from one calm dashboard.

This repository contains the public landing page, the CRM dashboard, and the docs and schema references that support the V1 build.

It is designed for people who want a cleaner operating rhythm without paying for a heavy suite they do not fully use.

## What Work2U Does

Work2U brings the core daily flow into one place:

- leads and clients
- tasks and reminders
- invoices and receipts
- email and messaging
- calendar and follow-up
- AI-assisted writing and workflow help

## Why It Exists

Most teams do not need another large enterprise stack. They need something simpler that still feels powerful.

Work2U is built to help users:

1. follow up faster
2. reduce forgotten tasks and missed replies
3. keep billing, communication, and calendar work in one place

## Best For

Work2U is designed for:

- property agents
- insurance agents
- freelancers
- small teams
- corporate workspaces

## What Makes It Different

- survey-first onboarding so the dashboard adapts to the user
- internal calendar so tasks can become reminders automatically
- Resend + Work2U domain email for cleaner communication
- regional billing support for Malaysia and global customers
- AI assist that suggests, drafts, and helps shape workflows
- role-based access for super admin, admin, and user

## Platform Snapshot

- CRM core for leads, clients, tasks, cases, and services
- internal calendar and reminders
- billing flow for Malaysia and global
- Resend-powered email sending
- WhatsApp and Telegram direction for follow-up
- AI assistance for drafts and workflow suggestions

## Pricing Snapshot

- Starter: RM39
- Elite: RM99
- Enterprise: custom

The pricing approach is meant to stay lighter than common all-in-one business suites, especially for freelancers and small teams.

## Current Focus

- email-first login and onboarding
- survey-driven workspace setup
- internal calendar and reminder flow
- billing, invoice, and receipt support
- AI help for drafting and follow-up
- Malaysia and global payment routing

## Status

Work2U V1 is being built as a practical product-first release.

- Google connectors are optional later
- internal calendar is the default scheduling layer
- email sending uses Work2U domain plus Resend
- WhatsApp and Telegram are part of the communication strategy
- release notes live in the docs hub changelog

## Why Buyers Care

- less app switching
- fewer missed follow-ups
- faster response to leads
- clearer billing and document handling
- a calmer daily workflow with less manual remembering
- one system that can grow from solo use into team use

## Quick View

- affordable enough to start quickly
- clear enough to understand immediately
- practical enough to use every day
- scalable enough to grow with the business

## For GitHub Visitors

If you are visiting this repo for the first time, start here:

1. [Docs Index](./docs/index.html)
2. [Work2U Product Spec v1](./docs/work2u-product-spec-v1.md)
3. [Work2U V1 Build Order](./docs/work2u-v1-build-order.md)
4. [Work2U Pricing & Packaging](./docs/work2u-pricing-packaging.md)
5. [Work2U Changelog](./docs/changelog.md)

## Quick Start

1. Install Node.js 18 or newer.
2. Create your local env file:

```bash
Copy-Item .env.local.template .env.local
```

3. Fill in the values you need in `.env.local`.
4. Start the app:

```bash
node server.js
```

5. Open:

- `http://localhost:3000/`
- `http://localhost:3000/crm`
- `http://localhost:3000/work2u`

## Company

- Saga X Ventures (NS0246319-H)
- Website: https://sagaxventures.com
- Work2U: https://work2u.io
- Address: 136-1, Jalan Komersial Senawang, Taipan 1, 70450 Seremban, Negeri Sembilan
- Phone: +6013-773 2703

## Recommended Setup

### Local Env

Start with [`.env.local.template`](./.env.local.template) or one of the example env files.

Key values usually include:

- `APP_BASE_URL=http://localhost:3000`
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `SUPABASE_REDIRECT_TO=http://localhost:3000/work2u`
- `RESEND_API_KEY`
- `RESEND_FROM_EMAIL`
- `RESEND_FROM_NAME`
- `STRIPE_SECRET_KEY`
- `STRIPE_PUBLISHABLE_KEY`
- `BILLPLZ_SECRET_KEY`
- `GROQ_API_KEY`
- `WHATSAPP_WEBHOOK_SECRET`

If you use region-specific production env files:

- [`.env.production.my`](./.env.production.my)
- [`.env.production.global`](./.env.production.global)

### Auth And Data

Work2U V1 focuses on email login through Supabase Auth.

You will need:

1. Supabase project URL
2. anon key
3. service role key for server-side routes
4. redirect URL for `http://localhost:3000/work2u`

### Core Services

- Supabase for auth and data
- Resend for email
- Stripe for global billing
- Billplz for Malaysia billing
- optional Vercel for deployment support

## Documentation

Use the main docs hub here:

- [Docs Index](./docs/index.html)
- [Work2U Changelog](./docs/changelog.md)

Most useful references:

- [Work2U Product Spec v1](./docs/work2u-product-spec-v1.md)
- [Work2U V1 Build Order](./docs/work2u-v1-build-order.md)
- [Work2U Supabase Execution Checklist](./docs/work2u-supabase-execution-checklist.md)
- [Work2U Supabase Deploy Checklist](./docs/work2u-supabase-deploy-checklist.md)
- [Work2U Internal Calendar](./docs/work2u-internal-calendar.md)
- [Work2U Email Routes](./docs/work2u-email-routes.md)
- [Work2U Billing, Revenue & PnL](./docs/work2u-billing-revenue-pnl.md)
- [Work2U Backend Architecture](./docs/work2u-backend-architecture.md)

## Notes

- Keep raw secrets in `.env.local` or a secret manager, not in chat or committed files.
- Google connectors are optional for V1.
- AI assistant uses `POST /api/ai/groq`.
- WhatsApp integration expects a companion service URL and API key.
