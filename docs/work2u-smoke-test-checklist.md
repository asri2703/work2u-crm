# Work2U Smoke Test Checklist

_Checklist praktikal untuk verify platform selepas migration, sebelum kita anggap flow itu sedia untuk user sebenar._

## 1. Preflight

1. Confirm `Work2U Master Deploy Bundle` sudah run dengan clean
2. Confirm `.env.local` lengkap untuk Supabase, Resend, Billplz, dan Stripe
3. Confirm server start tanpa error
4. Confirm landing page, CRM page, dan docs page boleh dibuka
5. Confirm super admin account boleh akses dashboard admin path

## 2. Auth And Onboarding

1. Buka survey popup sebelum login
2. Pilih persona, industry, team size, main channel, dan AI mode
3. Verify package recommendation keluar
4. Verify `Starter`, `Elite`, atau `Enterprise` boleh dicadangkan ikut jawapan
5. Login guna email flow
6. Confirm profile row auto-created di Supabase
7. Confirm `setup_complete` masih `false` sebelum setup siap
8. Complete onboarding setup
9. Confirm `onboarding_step` berubah dengan betul

## 3. Package Routing

1. Confirm survey score dipetakan ke package yang betul
2. Confirm `public.profiles.package` mirror nilai cadangan awal
3. Confirm subscription aktif mengatasi mirror profile
4. Confirm entitlement yang dibaca runtime ikut plan aktif
5. Confirm admin override boleh ubah package jika perlu
6. Confirm `Enterprise` route tidak jatuh ke `Starter`

## 4. Core CRM

1. Create one lead
2. Move lead stage
3. Create one client
4. Create one task
5. Update task progress
6. Create one case
7. Create one service
8. Confirm list dan cards render dengan data workspace sebenar

## 5. Expense And Accounting

1. Upload one receipt image or PDF
2. Confirm receipt saved successfully
3. Open receipt preview modal
4. Confirm status timeline appears
5. Approve or flag receipt
6. Confirm review status update sticks
7. Confirm monthly summary can read receipts
8. Confirm invoice/receipt document download path works

## 6. Calendar And Reminders

1. Create one internal calendar event
2. Sync one task to calendar
3. Create one reminder
4. Confirm reminder status is stored
5. Confirm calendar views load on mobile width

## 7. Communication

1. Send one email through Resend
2. Confirm sender name and reply-to are correct
3. Send one Telegram bot message
4. Confirm WhatsApp session flow is reachable or stubbed
5. Confirm thread timeline or message history surfaces correctly

## 8. AI And Automation

1. Open AI assist panel
2. Request a reply draft suggestion
3. Confirm AI mode respects the selected plan
4. Confirm BYO AI key path is handled gracefully
5. Confirm automation rule limit is enforced

## 9. Pass Criteria

- no fatal error on login or onboarding
- package recommendation is visible and sensible
- core CRM data persists
- receipt timeline is visible
- calendar and reminder create flows work
- at least one outbound message path works
- runtime entitlement does not bypass plan limits
