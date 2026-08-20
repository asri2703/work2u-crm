# Work2U Final Launch Checklist

_Satu checklist akhir untuk go/no-go sebelum Work2U dibuka kepada user atau pelanggan berbayar._

_Public companion: [launch-checklist.html](/D:/vscode/work2u/work2u-crm/launch-checklist.html)_

## 1. Legal And Public Pages

- [ ] Privacy Policy boleh dibuka public di `/privacy-policy.html`
- [ ] Service Policy boleh dibuka public di `/service-policy.html`
- [ ] Contact email aktif
- [ ] Footer landing page ada link ke policy pages
- [ ] Footer dashboard `work2u` ada link ke policy pages
- [ ] Policy pages sudah disemak oleh lawyer atau advisor yang sesuai

## 2. Email Login Readiness

- [ ] Email login berfungsi tanpa Google dependency
- [ ] Magic link atau password flow telah diuji
- [ ] Verification email berfungsi melalui Resend
- [ ] Support email untuk login dan recovery aktif
- [ ] Google integration kekal optional untuk V1

## 3. Billing Readiness

### Malaysia

- [ ] Billplz collection ID sudah siap
- [ ] Billplz secret key disimpan dengan selamat
- [ ] Billplz X Signature key diaktifkan
- [ ] Callback URL berfungsi
- [ ] Redirect URL berfungsi

### Global

- [ ] Stripe publishable key sudah siap
- [ ] Stripe secret key disimpan dengan selamat
- [ ] Stripe webhook secret diisi
- [ ] Stripe webhook endpoint sudah didaftarkan
- [ ] Stripe checkout flow sudah diuji
- [ ] Stripe checkout bermula dengan trial 7 hari dan require card

## 4. Webhook And Callback

- [ ] Stripe webhook endpoint aktif di `/api/billing/webhook`
- [ ] Alias `/api/billing/stripe/webhook` masih boleh diterima
- [ ] Billplz callback endpoint aktif di `/api/billing/billplz/callback`
- [ ] Billplz redirect endpoint aktif di `/api/billing/billplz/redirect`
- [ ] WhatsApp webhook endpoint aktif di `/api/whatsapp/webhook`
- [ ] Signature verification lulus untuk Stripe
- [ ] X Signature verification lulus untuk Billplz
- [ ] Failed signature request ditolak dengan betul

## 5. App And Product

- [ ] `.env.local` complete kecuali secret yang sengaja ditangguh
- [ ] `.env.production.my` dan `.env.production.global` siap
- [ ] Public config tidak expose secret server-side
- [ ] Survey before login berfungsi
- [ ] Email login disediakan ikut readiness
- [ ] Dashboard boleh buka tanpa error utama
- [ ] Task, leads, clients, accounting, reports, calendar, dan AI panel boleh dibuka

## 6. Billing To Entitlement Flow

- [ ] Payment success mengubah subscription status
- [ ] Subscription status mengubah package / entitlement
- [ ] Access limit dikira ikut plan
- [ ] Failed payment tidak unlock plan
- [ ] Admin override boleh digunakan oleh staff
- [ ] User boleh continue atau unsubscribe dari billing portal tanpa bantuan manual

## 7. Smoke Test

- [ ] Create user baru
- [ ] Selesaikan survey
- [ ] Login berjaya
- [ ] Pilih plan berjaya
- [ ] Payment flow berjaya
- [ ] Webhook masuk dan update status
- [ ] Entitlement unlock berlaku
- [ ] User boleh hantar satu test message
- [ ] User boleh create satu task, satu lead, dan satu invoice

## 8. Go / No-Go Rule

- Go only if legal pages, email login readiness, billing flow, and webhook flow are all green.
- No-go if any secret is still missing for a live provider that is already exposed to users.
- No-go if payment success does not update entitlement correctly.

## 9. Current Known Gaps

- `RESEND_API_KEY` perlu diisi sebelum email sending live diaktifkan
- `STRIPE_WEBHOOK_SECRET` perlu diisi sebelum Stripe live webhook diaktifkan
- Google connector boleh ditambah semula nanti jika optional integration diperlukan
