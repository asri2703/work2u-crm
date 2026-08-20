# Work2U Resend Email Template

_Template asas untuk email Work2U supaya semua mesej nampak konsisten, mobile-friendly, dan ada identiti company yang jelas._

## Where It Lives

- `server.js` sekarang ada helper `buildResendEmailShell()`
- helper itu dipakai oleh flow billing checkout, dan boleh digunakan semula untuk magic link, invoice sent, payment reminder, dan notification lain

## Built-In Templates

### 1. Billing Checkout

- helper: `notifyBillingCheckoutEmail()`
- guna untuk hantar link checkout bil atau subscription
- sesuai untuk payment flow Billplz dan Stripe

### 2. Magic Link Login

- helper: `notifyMagicLinkEmail()`
- guna untuk email sign-in / verification
- perlu ada `loginLink`, `email`, dan `workspaceName`

### 3. Invoice Sent

- helper: `notifyInvoiceSentEmail()`
- guna bila invoice sudah dijana dan perlu dihantar ke client
- perlu ada `invoiceNumber`, `amount`, `dueDate`, dan `documentUrl` jika ada

### 4. Payment Reminder

- helper: `notifyPaymentReminderEmail()`
- guna untuk reminder invoice yang hampir due atau overdue
- boleh sertakan `paymentUrl` supaya client terus bayar

## Template Structure

### Inputs

- `preheader`
- `title`
- `bodyHtml`
- `footerNote`

### Output

- email HTML yang responsive secara ringkas
- fallback style yang selamat untuk kebanyakan client email
- footer company yang tunjuk identiti Work2U dan Saga X Ventures

## Suggested Use Cases

- verification email
- magic link login
- billing checkout email
- payment reminder
- task reminder
- invoice sent notice

## Quick Copy Rules

- subject line mesti ringkas dan jelas
- preheader patut jelaskan tindakan utama
- button label perlu verb first, contoh `Sign in now`, `View invoice`, `Pay now`
- footer patut kekal sama supaya brand consistency terjaga

## Example Layout

```html
<div style="background:#f8fafc">
  <div style="display:none">Preheader text</div>
  <div style="max-width:640px;margin:0 auto">
    <div style="background:#fff;border-radius:24px;padding:28px">
      <div style="font-size:12px;letter-spacing:.12em;text-transform:uppercase;">Work2U</div>
      <h1>Title goes here</h1>
      <div>
        Body content goes here.
      </div>
      <p>Optional footer note.</p>
    </div>
    <div style="font-size:13px;line-height:1.7">
      Saga X Ventures (NS0246319-H)<br />
      work2u.io<br />
      sagaxventures.com<br />
      enquiry@work2u.io<br />
      +6013-773 2703
    </div>
  </div>
</div>
```

## Text Version

Setiap email juga patut ada text fallback:

- salam ringkas
- ringkasan tujuan email
- call to action
- company contact

## Recommended Copy Tone

- friendly
- direct
- low friction
- mobile-first
- clear next step

## Suggested Default Footer

- Work2U
- Saga X Ventures (NS0246319-H)
- 136-1, Jalan Komersial Senawang, Taipan 1, 70450 Seremban, Negeri Sembilan
- +6013-773 2703
- enquiry@work2u.io

## Suggested Subjects

- `Your Work2U sign-in link`
- `Invoice 000123 from Work2U`
- `Payment reminder for invoice 000123`
- `Your Work2U checkout link is ready`
