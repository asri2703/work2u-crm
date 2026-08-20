# Work2U Internal Calendar SQL Companion

_Panduan ringkas untuk pasang internal calendar secara berperingkat tanpa perlu buka satu fail besar._

## Order Of Execution

1. Run `docs/work2u-supabase-schema.sql`
2. Run `docs/work2u-internal-calendar-step-01-events.sql`
3. Run `docs/work2u-internal-calendar-step-02-reminders.sql`
4. Run `docs/work2u-internal-calendar-step-03-connections.sql`

If you prefer one file instead of three steps, use `docs/work2u-internal-calendar-deploy-bundle.sql` after the base schemas are in place.

## Why Split The Calendar

- lebih mudah debug bila satu bahagian gagal
- senang review perubahan oleh team atau super admin
- boleh aktifkan event, reminder, dan connector ikut keutamaan V1
- sesuai untuk deploy bertahap tanpa ganggu core CRM

## Notes

- semua step assume `public.workspaces`, `public.set_updated_at()`, dan `public.is_super_admin()` sudah wujud
- semua file bawah ini idempotent, jadi selamat untuk run semula bila perlu
- kalau anda nak versi full starter, guna juga `work2u-internal-calendar-schema.sql` sebagai rujukan lengkap
- jangan gabungkan companion steps ini dengan schema yang sudah ada `calendar_events`, `calendar_reminders`, dan `calendar_connections` jika anda tak mahu duplicate migration
