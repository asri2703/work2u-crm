# Work2U Expense Migration Steps

_Laluan granular untuk expense receipt, OCR, dan monthly summary._

## Goal

Pecahkan expense reporting kepada 3 phase supaya migration lebih mudah, lebih selamat, dan senang debug.

## When To Use

Guna laluan ini kalau anda mahu:

- deploy secara bertahap
- semak setiap layer sebelum pergi layer seterusnya
- elak satu fail SQL yang terlalu besar

Kalau anda nak rollout cepat, anda masih boleh guna [work2u-expense-schema.sql](./work2u-expense-schema.sql) sebagai monolith.
Kalau anda mahu satu file expense sahaja untuk paste/run, gunakan [work2u-expense-deploy-bundle.sql](./work2u-expense-deploy-bundle.sql) selepas base schema siap.

## Phase 0 - Storage Bucket And RLS

Run:

- [work2u-expense-step-00-storage.sql](./work2u-expense-step-00-storage.sql)

Creates:

- `storage.buckets` entry for `expense-receipts`
- RLS policies for receipt uploads and signed download access

Purpose:

- sediakan tempat simpan file resit
- pastikan storage access ikut workspace dan super admin

## Phase 1 - Categories And Core Capture

Run:

- [work2u-expense-step-01-categories.sql](./work2u-expense-step-01-categories.sql)

Creates:

- `expense_categories`

Purpose:

- sediakan kategori expense
- beri struktur untuk overhead, tools, travel, marketing, dan subscription

## Phase 2 - Receipts And OCR

Run:

- [work2u-expense-step-02-receipts.sql](./work2u-expense-step-02-receipts.sql)

Creates:

- `expense_receipts`
- `expense_receipt_extractions`
- `expense_receipt_events`

Purpose:

- simpan upload resit
- simpan hasil OCR
- simpan review status dan confidence score
- simpan audit timeline untuk upload, OCR, dan review

## Phase 3 - Monthly Rollup

Run:

- [work2u-expense-step-03-summary.sql](./work2u-expense-step-03-summary.sql)

Creates:

- `monthly_expense_snapshots`

Purpose:

- kumpulkan monthly summary
- jadi source of truth untuk dashboard dan P&L

## Recommended Order

1. create storage bucket and storage policies
2. create categories
3. create receipts, OCR, and audit timeline tables
4. create monthly summary table
5. seed demo rows
6. test dashboard queries

## Notes

- semua table ikut `workspace_id`
- owner access ikut `workspace_has_access(workspace_id)`
- super admin boleh audit semua row
- step files ini bertujuan memudahkan rollout, bukan mengubah model data akhir
