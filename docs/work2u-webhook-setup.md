# Work2U Webhook Setup

_Rujukan cepat untuk billing webhook dan callback._

## 1. Stripe Webhook

### Endpoint

- local: `http://localhost:3000/api/billing/webhook`
- production: `https://work2u.io/api/billing/webhook`

`/api/billing/stripe/webhook` masih kekal sebagai alias supaya integrasi lama tidak rosak.

### Cadangan event

- `checkout.session.completed`
- `customer.subscription.created`
- `customer.subscription.updated`
- `customer.subscription.deleted`
- `invoice.paid`
- `invoice.payment_failed`

### Setup ringkas

1. Buka Stripe Dashboard.
2. Pergi ke Webhooks.
3. Tambah endpoint `https://work2u.io/api/billing/webhook`.
4. Pilih event di atas.
5. Salin signing secret webhook ke `STRIPE_WEBHOOK_SECRET`.

### Local test

```bash
stripe listen --forward-to http://localhost:3000/api/billing/webhook
stripe trigger checkout.session.completed
```

### Notes

- webhook secret bukan API key
- jangan simpan webhook secret dalam chat
- guna satu endpoint utama sahaja untuk production

### Stripe end-to-end billing flow

1. user pilih plan dalam CRM
2. backend create Stripe checkout session
3. Stripe redirect customer ke checkout
4. Stripe send `checkout.session.completed` ke webhook
5. backend simpan billing event
6. backend update subscription status
7. backend sync entitlement ke Supabase
8. UI refresh package state dan unlock limits ikut plan

## 2. Billplz Callback And Redirect

### Endpoint

- callback: `http://localhost:3000/api/billing/billplz/callback`
- redirect: `http://localhost:3000/api/billing/billplz/redirect`

### Setup ringkas

1. Set `callback_url` semasa create bill.
2. Set `redirect_url` untuk customer return page.
3. Pastikan `BILLPLZ_SECRET_KEY` dan `BILLPLZ_X_SIGNATURE_KEY` diisi.
4. Verify `x_signature` pada callback dan redirect.

### Important rule

- `callback_url` ialah source of truth
- `redirect_url` hanya untuk experience user
- server perlu reject request jika signature tidak sah

### Billplz end-to-end billing flow

1. user pilih plan dalam CRM
2. backend create Billplz bill
3. user bayar melalui Billplz page
4. Billplz POST ke `callback_url`
5. backend verify `x_signature`
6. backend update billing subscription
7. backend sync package ke Supabase
8. redirect page hanya tunjuk status kepada customer

## 3. Recommended Order

1. aktifkan Stripe webhook atau Billplz callback ikut region
2. test local dengan sandbox / CLI
3. simpan secret dalam `.env.local`
4. deploy production endpoint
5. semak billing event log selepas payment test
