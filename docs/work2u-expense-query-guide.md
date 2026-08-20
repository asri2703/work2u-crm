# Work2U Expense Query Guide

_Rujukan untuk query layer expense dashboard V1. Gunakan helper names ini supaya backend dan frontend bercakap bahasa yang sama._

Kalau nak versi ringkas untuk service layer, buka [Work2U Expense Query Helpers](./work2u-expense-query-helpers.md).
Kalau nak shape JSON frontend, buka [Work2U Expense Data Contract](./work2u-expense-data-contract.md).

## What This File Solves

Dokumen ini bukan sekadar SQL snippet. Ia memetakan:

- nama helper yang developer akan panggil
- input yang helper perlukan
- output yang frontend expect
- query source utama untuk dashboard

## Source Of Truth

Untuk V1:

- `monthly_expense_snapshots` ialah source utama untuk summary dan P&L
- `expense_receipts` ialah fallback live jika snapshot belum ada
- breakdown chart dan review queue boleh terus baca dari receipts

## Query Helper Map

### 1. `getExpenseDashboardMonthSummary`

Purpose:

- ambil ringkasan bulanan untuk card utama dashboard

Input:

- `workspaceId`
- `monthKey`

Output:

- `month_key`
- `gross_revenue`
- `total_expenses`
- `total_overhead`
- `net_profit`
- `receipt_count`
- `approved_receipt_count`
- `unreviewed_receipt_count`

SQL source:

```sql
select
  month_key,
  gross_revenue,
  total_expenses,
  total_overhead,
  net_profit,
  receipt_count,
  approved_receipt_count,
  unreviewed_receipt_count
from public.monthly_expense_snapshots
where workspace_id = $1
  and month_key = date_trunc('month', $2::date)::date
limit 1;
```

### 2. `getExpenseDashboardLiveSummary`

Purpose:

- kira summary live jika snapshot bulan itu belum siap

Input:

- `workspaceId`
- `monthKey`

Output:

- `month_key`
- `total_expenses`
- `total_overhead`
- `approved_total`
- `receipt_count`
- `unreviewed_receipt_count`

SQL source:

```sql
select
  date_trunc('month', er.expense_month)::date as month_key,
  coalesce(sum(er.total_amount), 0) as total_expenses,
  coalesce(sum(case when ec.is_overhead then er.total_amount else 0 end), 0) as total_overhead,
  coalesce(sum(case when er.review_status = 'approved' then er.total_amount else 0 end), 0) as approved_total,
  count(*) as receipt_count,
  count(*) filter (where er.review_status <> 'approved') as unreviewed_receipt_count
from public.expense_receipts er
left join public.expense_categories ec on ec.id = er.category_id
where er.workspace_id = $1
  and er.expense_month >= date_trunc('month', $2::date)::date
  and er.expense_month < (date_trunc('month', $2::date) + interval '1 month')::date
group by 1;
```

### 3. `getExpenseVendorBreakdown`

Purpose:

- tunjuk vendor paling tinggi spend untuk bulan dipilih

Input:

- `workspaceId`
- `monthKey`

Output:

- `vendor_name`
- `total_amount`
- `receipt_count`

SQL source:

```sql
select
  coalesce(nullif(er.vendor_name, ''), 'Unknown') as vendor_name,
  sum(er.total_amount) as total_amount,
  count(*) as receipt_count
from public.expense_receipts er
where er.workspace_id = $1
  and er.expense_month >= date_trunc('month', $2::date)::date
  and er.expense_month < (date_trunc('month', $2::date) + interval '1 month')::date
group by 1
order by total_amount desc
limit 10;
```

### 4. `getExpenseCategoryBreakdown`

Purpose:

- tunjuk spend ikut category dan overhead flag

Input:

- `workspaceId`
- `monthKey`

Output:

- `category_name`
- `is_overhead`
- `total_amount`
- `receipt_count`

SQL source:

```sql
select
  coalesce(ec.name, 'Uncategorized') as category_name,
  coalesce(ec.is_overhead, false) as is_overhead,
  sum(er.total_amount) as total_amount,
  count(*) as receipt_count
from public.expense_receipts er
left join public.expense_categories ec on ec.id = er.category_id
where er.workspace_id = $1
  and er.expense_month >= date_trunc('month', $2::date)::date
  and er.expense_month < (date_trunc('month', $2::date) + interval '1 month')::date
group by 1, 2
order by total_amount desc;
```

### 5. `getExpenseReviewQueue`

Purpose:

- ambil resit yang perlu semakan manual atau flagged

Input:

- `workspaceId`
- `limit` optional

Output:

- `id`
- `receipt_date`
- `vendor_name`
- `total_amount`
- `review_status`
- `ocr_status`
- `ocr_confidence`
- `file_url`

SQL source:

```sql
select
  id,
  receipt_date,
  vendor_name,
  total_amount,
  review_status,
  ocr_status,
  ocr_confidence,
  file_url
from public.expense_receipts
where workspace_id = $1
  and review_status in ('pending', 'flagged')
order by receipt_date desc nulls last, created_at desc;
```

### 6. `getExpensePnlRows`

Purpose:

- tunjuk trend profit bulanan

Input:

- `workspaceId`

Output:

- `month_key`
- `gross_revenue`
- `total_expenses`
- `total_overhead`
- `net_profit`
- `profit_margin_pct`

SQL source:

```sql
select
  month_key,
  gross_revenue,
  total_expenses,
  total_overhead,
  net_profit,
  case
    when gross_revenue > 0 then round((net_profit / gross_revenue) * 100, 2)
    else 0
  end as profit_margin_pct
from public.monthly_expense_snapshots
where workspace_id = $1
order by month_key desc;
```

## Recommended Helper Flow

Backend handler untuk dashboard boleh ikut flow ini:

1. call `getExpenseDashboardMonthSummary`
2. kalau kosong, fallback ke `getExpenseDashboardLiveSummary`
3. call `getExpenseVendorBreakdown`
4. call `getExpenseCategoryBreakdown`
5. call `getExpenseReviewQueue`
6. call `getExpensePnlRows`

## Frontend Mapping

Frontend component boleh expect props berikut:

- `monthKey`
- `summary`
- `vendorBreakdown`
- `categoryBreakdown`
- `reviewQueue`
- `pnlRows`

## Stability Rule

- jangan tukar nama field tanpa versioning
- keep `month_key` dan `workspace_id` konsisten
- jika tambah metric baru, extend response object bukan rename field lama
