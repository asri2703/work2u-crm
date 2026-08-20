# Work2U Supabase Deploy Checklist

_Checklist ringkas untuk deploy schema satu blok pada satu masa._

## Block 1. Core Auth And Profile

Run:

1. [docs/work2u-supabase-schema.sql](./work2u-supabase-schema.sql)

Verify:

- `profiles` wujud
- auth trigger seed berfungsi
- owner row boleh dibuat selepas signup

## Block 2. CRM And Business Core

Run:

1. [docs/work2u-mvp-schema.sql](./work2u-mvp-schema.sql)

Verify:

- leads, clients, tasks, cases, services, dan notes boleh dibuat
- accounting tables asas wujud
- automation dan ops tables wujud
- calendar tables dalam schema utama tidak conflict dengan companion step file jika anda hanya guna satu laluan migration

## Block 3. Calendar Companion

Run:

1. [docs/work2u-internal-calendar-step-01-events.sql](./work2u-internal-calendar-step-01-events.sql)
2. [docs/work2u-internal-calendar-step-02-reminders.sql](./work2u-internal-calendar-step-02-reminders.sql)
3. [docs/work2u-internal-calendar-step-03-connections.sql](./work2u-internal-calendar-step-03-connections.sql)

Verify:

- internal calendar event table available
- reminder queue available
- connector table available
- RLS helper `calendar_can_access_workspace()` exists

## Block 4. Expense Reporting

Run:

1. [docs/work2u-expense-schema.sql](./work2u-expense-schema.sql)
2. Optional granular path:
   - [docs/work2u-expense-step-01-categories.sql](./work2u-expense-step-01-categories.sql)
   - [docs/work2u-expense-step-02-receipts.sql](./work2u-expense-step-02-receipts.sql)
   - [docs/work2u-expense-step-03-summary.sql](./work2u-expense-step-03-summary.sql)

Verify:

- `expense_categories` wujud
- `expense_receipts` wujud
- OCR extraction table wujud
- monthly summary table wujud
- expense dashboard spec matches the schema fields

Seed:

1. [docs/work2u-expense-demo-seed.sql](./work2u-expense-demo-seed.sql)

## Block 5. Email Routes Support

Read:

1. [docs/work2u-email-routes.md](./work2u-email-routes.md)
2. [docs/work2u-resend-email-template.md](./work2u-resend-email-template.md)

Verify:

- magic link endpoint flow is understood
- invoice sent route is clear
- payment reminder route is clear
- footer branding matches company details

## Block 6. Smoke Test

1. create one workspace
2. create one lead
3. create one client
4. create one task
5. create one calendar event
6. create one reminder
7. simulate one email send
8. confirm cross-workspace access is blocked

## Notes

- kalau anda hanya nak satu migration path, gunakan `work2u-mvp-schema.sql` sahaja untuk CRM + calendar tables
- kalau anda nak step-by-step lebih selamat, guna core schema dulu kemudian companion calendar files
- jangan run dua path serentak pada environment yang sama jika table calendar sudah wujud
