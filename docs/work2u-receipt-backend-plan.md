# Work2U Receipt Backend Plan

_Dokumen rujukan untuk aliran backend resit expense, OCR, AI extraction, dan monthly summary._

## Objective

Bina flow resit yang:

- bantu user simpan resit dengan cepat
- auto baca vendor, tarikh, amount, dan tax bila boleh
- asingkan expense receipt daripada payment receipt invoice
- feed terus ke monthly expense dashboard dan P&L

## Important Model Split

Work2U perlu bezakan dua jenis resit:

- `receipts` = payment receipt untuk invoice customer
- `expense_receipts` = resit perbelanjaan user seperti petrol, subs, tools, travel, dan overhead

Ini penting supaya accounting flow tidak bercampur antara income collection dan business spend.

## Proposed Tables

### `expense_receipts`

Cadangan field:

- `id`
- `workspace_id`
- `created_by`
- `vendor_name`
- `vendor_normalized_name`
- `receipt_number`
- `receipt_date`
- `currency`
- `subtotal_amount`
- `tax_amount`
- `total_amount`
- `category_id`
- `payment_method`
- `expense_type`
- `file_name`
- `file_url`
- `mime_type`
- `ocr_status`
- `ocr_provider`
- `ocr_confidence`
- `source_channel`
- `status`
- `notes`
- `created_at`
- `updated_at`

### `expense_receipt_extractions`

Simpan hasil OCR dan AI extraction versi demi versi.

Cadangan field:

- `id`
- `expense_receipt_id`
- `model_provider`
- `model_name`
- `model_version`
- `raw_text`
- `extracted_json`
- `confidence_score`
- `review_status`
- `reviewed_by`
- `reviewed_at`
- `created_at`

### `expense_categories`

Cadangan field:

- `id`
- `workspace_id`
- `name`
- `parent_id`
- `is_overhead`
- `sort_order`
- `created_at`
- `updated_at`

### `monthly_expense_snapshots`

Cadangan field:

- `id`
- `workspace_id`
- `month_key`
- `gross_revenue`
- `total_expenses`
- `total_overhead`
- `net_profit`
- `receipt_count`
- `unreviewed_count`
- `generated_at`

## Backend Flow

### 1. Upload

- user upload image atau PDF dari mobile atau desktop
- file disimpan ke storage
- metadata resit disimpan ke `expense_receipts`
- job OCR masuk queue

### 2. OCR and Extraction

- OCR baca teks dari fail
- AI extract vendor, date, amount, tax, dan kemungkinan category
- sistem simpan extraction versi pertama
- confidence score digunakan untuk decide sama ada auto-approve atau manual review

### 3. Review

- jika confidence rendah, user semak semula
- user boleh betulkan vendor, amount, date, atau category
- manual override sentiasa menang

### 4. Categorization

- resit boleh ditandakan sebagai overhead, operating expense, travel, tools, marketing, atau custom category
- category ini dipakai untuk monthly summary

### 5. Monthly Rollup

- data approved digabungkan ke monthly snapshot
- summary digunakan untuk dashboard, reports, dan P&L
- if needed, create ledger entry from approved expense

Lihat juga [Work2U Expense Automation](./work2u-expense-automation.md) untuk trigger upload, review, nightly rollup, dan monthly close behavior.

## Suggested API Endpoints

- `POST /api/expense-receipts`
- `GET /api/expense-receipts`
- `GET /api/expense-receipts/:id`
- `PATCH /api/expense-receipts/:id`
- `POST /api/expense-receipts/:id/extract`
- `POST /api/expense-receipts/:id/approve`
- `GET /api/expense-dashboard/summary?month=YYYY-MM`
- `GET /api/expense-dashboard/vendors?month=YYYY-MM`
- `GET /api/expense-dashboard/categories?month=YYYY-MM`
- `GET /api/expense-dashboard/pnl?month=YYYY-MM`

## Suggested Validation Rules

- file type must be image or PDF
- file size should have a limit per plan
- `total_amount` must be numeric
- `receipt_date` cannot be future-dated unless user explicitly marks it
- OCR extraction should be idempotent
- duplicate detection should compare vendor, date, amount, and file hash

## Dashboard Inputs

The dashboard should read from:

- approved `expense_receipts`
- `monthly_expense_snapshots`
- `ledger_entries` if accounting ledger is enabled

The UI should not calculate monthly truth only from visible cards. It should read from saved summary records or approved source data.

## V1 Decision

For V1, start with:

- manual upload
- AI OCR extraction
- manual review
- monthly summary
- basic P&L rollup

Leave advanced features like auto bank reconciliation, receipt matching, and vendor intelligence for later.
