# Work2U Billing One-Pager

_Ringkasan paling cepat untuk pilih dan setup billing by region._

## Billing Decision

| Region | Primary provider | Why |
| --- | --- | --- |
| Malaysia | Billplz | lebih selari untuk FPX / local payment flow |
| Global | Stripe | lebih mudah untuk international billing and subscriptions |

## Shared Billing Rules

- satu workspace guna satu provider utama pada satu masa
- payment event mesti update subscription status
- billing webhook mesti jadi source of truth
- redirect page hanya untuk user feedback
- entitlement kena sync selepas payment berjaya
- failed payment tidak boleh unlock plan

## Billplz Flow

1. user pilih plan
2. backend create bill
3. Billplz hantar user ke payment page
4. Billplz POST callback ke backend
5. backend verify `x_signature`
6. backend simpan billing event
7. backend update subscription status
8. backend sync entitlement ke Supabase
9. UI refresh package dan unlock limit yang betul

## Stripe Flow

1. user pilih plan
2. backend create checkout session
3. Stripe hantar user ke checkout
4. Stripe POST webhook event ke backend
5. backend verify signing secret
6. backend simpan billing event
7. backend update subscription status
8. backend sync entitlement ke Supabase
9. UI refresh package dan unlock limit yang betul

## Important Secrets

### Billplz

- `BILLPLZ_SECRET_KEY`
- `BILLPLZ_COLLECTION_ID`
- `BILLPLZ_X_SIGNATURE_KEY`

### Stripe

- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `STRIPE_PUBLISHABLE_KEY`

## Recommended Event Handling

- `checkout.session.completed`
- `customer.subscription.created`
- `customer.subscription.updated`
- `customer.subscription.deleted`
- `invoice.paid`
- `invoice.payment_failed`
- Billplz callback success or pending state

## Notes

- gunakan alias `/api/billing/webhook` untuk Stripe
- gunakan `/api/billing/billplz/callback` untuk Billplz server callback
- simpan satu payment provider aktif ikut region
