# Work2U Email Routes

_Rujukan ringkas untuk built-in email endpoints Work2U._

## Routes

### `POST /api/work2u/email/magic-link`

Gunakan untuk hantar sign-in magic link melalui Work2U mailer.

Payload biasa:

- `email`
- `name`
- `workspaceName`
- `redirectTo`
- `shouldCreateUser`
- `expiresInMinutes`

### `POST /api/work2u/email/invoice-sent`

Gunakan bila invoice sudah dijana dan perlu dihantar kepada client.

Payload biasa:

- `email`
- `clientName`
- `invoiceNumber`
- `amount`
- `currency`
- `dueDate`
- `documentUrl`
- `paymentUrl`

### `POST /api/work2u/email/payment-reminder`

Gunakan untuk reminder invoice hampir due atau overdue.

Payload biasa:

- `email`
- `clientName`
- `invoiceNumber`
- `amount`
- `currency`
- `dueDate`
- `overdueDays`
- `paymentUrl`

## Behavior

- semua route direka untuk mobile-friendly HTML
- kalau `RESEND_API_KEY` belum ada, server akan skip hantar email dengan selamat
- bila perlu, backend boleh fallback kepada flow auth rasmi Supabase

## Suggested Usage

- magic link untuk login
- invoice sent untuk billing follow-up
- payment reminder untuk collections
- semua email patut guna footer brand yang sama
