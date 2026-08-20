# Work2U Google OAuth Checklist

_Checklist ringkas untuk siapkan Google login dengan betul sebelum public launch._

## Why This Exists

Google OAuth consent screen untuk app external biasanya perlukan branding yang betul, authorized domains yang sah, dan link policy yang jelas. Jika branding berubah selepas submit, Google boleh minta verification semula.

Rujukan Google rasmi:

- [Configure the OAuth consent screen and choose scopes](https://developers.google.com/workspace/guides/configure-oauth-consent)
- [Brand verification](https://developers.google.com/identity/protocols/oauth2/production-readiness/brand-verification)
- [Sensitive scope verification](https://developers.google.com/identity/protocols/oauth2/production-readiness/sensitive-scope-verification)

## 1. Before You Open Google Cloud Console

- pastikan domain utama sudah siap
- pastikan homepage boleh diakses public
- pastikan privacy policy public page sudah ada, contohnya `/privacy-policy.html`
- pastikan terms of service atau service policy public page sudah ada, contohnya `/service-policy.html`
- pastikan logo dan brand name Work2U sudah final

## 2. OAuth Consent Screen Setup

- pilih user type yang betul
- set app name sebagai `Work2U`
- upload logo jika perlu
- set support email
- isi app homepage
- isi privacy policy URL
- isi terms of service URL jika ada
- daftar authorized domains yang betul
- pastikan redirect URI yang digunakan memang berada dalam domain yang dibenarkan

### Suggested Consent Screen Copy

- **App name:** `Work2U`
- **User support email:** guna email yang aktif untuk support dan review contact
- **App homepage:** `https://work2u.io`
- **Privacy policy:** `https://work2u.io/privacy-policy.html`
- **Terms / service policy:** `https://work2u.io/service-policy.html`
- **App purpose summary:** `Work2U is an all-in-one CRM for follow-up, billing, messaging, reminders, and AI-assisted business operations.`

### Brand Consistency Rules

- gunakan nama `Work2U` secara konsisten pada homepage, footer, email, dan consent screen
- jangan tukar nama app kepada singkatan atau variasi lain semasa verification
- pastikan homepage above-the-fold menerangkan apa Work2U buat dalam satu ayat yang jelas
- pastikan logo dan visual brand tidak bercanggah dengan app name yang dihantar

## 3. Scopes Strategy

- guna scopes minimum yang cukup untuk login
- jangan request scopes yang tidak perlu
- jika tambah scopes sensitif, sediakan justification dan verification path
- jika scopes berubah, semak semula compliance dan token lifecycle

## 4. Test Mode Phase

- guna testing mode dulu untuk internal QA
- tambah test users yang diperlukan
- verify login flow di local dan production preview
- pastikan callback URL dan redirect URL sama seperti dalam app
- uji skrin consent pada browser sebenar sebelum submit production verification

## 5. Final Submission Checklist

Sebelum klik submit verification, semak perkara ini:

1. homepage public boleh dibuka tanpa login
2. homepage menyebut Work2U dan purpose app dengan jelas
3. privacy policy public page tersedia dan boleh diakses
4. service policy public page tersedia dan boleh diakses
5. app name pada Google consent screen ialah `Work2U`
6. support email aktif dan boleh menerima reply
7. authorized domains sudah betul
8. scopes yang diminta adalah minimum yang diperlukan
9. redirect URI sepadan dengan yang digunakan oleh app
10. test login Google berjaya sebelum submission
11. tiada perubahan brand besar selepas submit kecuali benar-benar perlu

## 6. Verification Readiness

- homepage public dan jelas kaitannya dengan Work2U
- privacy policy boleh dilihat user di `/privacy-policy.html`
- terms of service atau service policy tersedia di `/service-policy.html`
- domain ownership telah disahkan jika Google minta
- app branding pada consent screen konsisten dengan laman utama
- support email aktif dan boleh dihubungi

## 7. Launch Rule

- jangan hidupkan Google login public sebelum privacy policy dan service policy siap
- jangan ubah brand detail selepas submit tanpa semak semula verification impact
- kalau internal-only dulu, hadkan akses kepada test users sahaja

## 8. Current Work2U Status

- `GOOGLE_CLIENT_ID` sudah ada
- `GOOGLE_CLIENT_SECRET` sengaja belum diisi
- ini selari dengan keputusan untuk tunggu policy pages siap
- selepas policy siap, isi secret dan publish consent screen
