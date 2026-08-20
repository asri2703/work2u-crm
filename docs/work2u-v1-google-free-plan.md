# Work2U V1 Google-Free Plan

_Rujukan build V1 Work2U yang tidak bergantung pada Google untuk login, calendar, atau mailing._

## 1. V1 Feature Scope

Work2U V1 akan fokus pada core flow yang boleh jalan sendiri tanpa Google:

- survey before login
- email-based login
- internal calendar
- CRM core: leads, clients, tasks, cases, services
- communication: WhatsApp, Telegram, Resend email
- accounting: invoices, receipts, downloadable documents, basic revenue and PnL
- AI assist: drafts, suggestions, and workflow help
- roles and packages
- billing for Malaysia and global

## 2. Login Flow Diagram

```text
Visitor
  -> Landing Page
  -> Survey Popup
  -> Email Signup / Login
  -> Email Verification or Magic Link
  -> Workspace Setup
  -> Dashboard
  -> Optional Connectors
       - WhatsApp
       - Telegram
       - Resend sending
       - Billing
       - Internal Calendar
       - AI account
```

## 3. Priority Module List

### P0 - Must Build First

- authentication with email
- survey onboarding
- workspace and role model
- leads
- clients
- tasks
- internal calendar
- Resend mailing
- billing entitlements

### P1 - Build Immediately After

- cases
- services
- invoices
- receipts
- downloadable documents
- WhatsApp companion flow
- Telegram bot flow
- reminders

### P2 - Add After Core Stability

- reports
- revenue and PnL
- AI suggestions
- AI draft assist
- automation rules
- document sharing

### P3 - Optional Later

- Google login
- Google Calendar sync
- Gmail integration
- enterprise Google connector

## 4. V1 Decisions

- Google is optional, not required
- internal calendar is the default scheduling layer
- Resend is the default mailing layer
- user can run the system without connecting a Google account
- Google verification can still be pursued later for optional integrations

## 5. Why This Works

- lower onboarding friction
- faster public launch
- less Google verification dependency
- easier support for Malaysia and global users
- cleaner V1 scope for solo operator and small team use cases

