# Work2U Internal Calendar

_Rujukan untuk calendar layer Work2U yang menjadi source of truth bagi task reminder, meeting, dan due date tanpa bergantung pada Google._

## Goal

Internal calendar Work2U bertujuan untuk:

- simpan jadual kerja dalam satu tempat
- convert task menjadi reminder yang boleh dipantau
- elak user perlu bergantung pada Google Calendar untuk V1
- kekalkan sync ringan untuk phone reminder dan dashboard

## Core Principle

- internal calendar is the default scheduling layer
- Google Calendar sync adalah optional later connector
- task, reminder, dan event mesti berkongsi satu data model yang konsisten
- setiap event perlu ada owner dan workspace scope

## SQL Starter

Gunakan schema starter ini sebagai titik mula Supabase:

- [Work2U Internal Calendar Schema](./work2u-internal-calendar-schema.sql)
- [Work2U Internal Calendar SQL Companion](./work2u-internal-calendar-sql-companion.md)

Schema ini sudah sediakan:

- `calendar_events`
- `calendar_reminders`
- `calendar_connections`
- RLS asas untuk owner dan super admin

Kalau nak buat secara berperingkat, ikut urutan ini:

1. `work2u-supabase-schema.sql`
2. `work2u-internal-calendar-step-01-events.sql`
3. `work2u-internal-calendar-step-02-reminders.sql`
4. `work2u-internal-calendar-step-03-connections.sql`

## Recommended Data Model

### `calendar_events`

Field cadangan:

- `id`
- `workspace_id`
- `owner_id`
- `title`
- `description`
- `event_type` seperti `task`, `meeting`, `reminder`, `deadline`
- `status` seperti `draft`, `scheduled`, `completed`, `canceled`
- `starts_at`
- `ends_at`
- `all_day`
- `timezone`
- `location`
- `source_type` seperti `task`, `lead`, `client`, `invoice`
- `source_id`
- `priority`
- `remind_before_minutes`
- `created_by`
- `updated_by`
- `created_at`
- `updated_at`

### `calendar_reminders`

Field cadangan:

- `id`
- `workspace_id`
- `calendar_event_id`
- `channel`
- `scheduled_at`
- `sent_at`
- `status`
- `retry_count`
- `last_error`

### Optional future table

- `calendar_connections`
  - simpan Google Calendar atau external calendar token bila feature optional itu diaktifkan

## Flow

1. user create task atau meeting
2. system generate internal event
3. due date atau remind_before_minutes disimpan
4. scheduler create reminder job
5. dashboard tunjuk event pada internal calendar
6. reminder dihantar melalui notification, email, WhatsApp, atau Telegram ikut setting
7. status event dikemaskini apabila user complete atau reschedule

## Task To Calendar Rule

- setiap task penting boleh spawn event
- setiap event boleh linked balik ke task asal
- task stage update tidak boleh memecahkan calendar history
- reminder retry mesti idempotent

## User Experience

- calendar perlu rasa ringan, bukan macam extra admin work
- user boleh nampak hari ini, minggu ini, overdue, dan upcoming
- dari calendar view, user boleh terus buka lead, client, atau invoice berkaitan

## Optional Later Connector

Kalau later nak sambung Google:

- simpan connector state berasingan
- jangan jadikan Google sebagai source of truth utama
- sync dari internal calendar ke external calendar hanya bila user enable connector
