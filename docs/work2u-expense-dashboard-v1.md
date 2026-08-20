# Work2U Expense Dashboard V1

_Spec rujukan untuk dashboard bulanan resit, expense, overhead, dan profit._

## Objective

Bina dashboard yang:

- tunjuk monthly expense dengan cepat
- bantu user simpan dan semak resit
- bezakan overhead dan direct expense
- beri view profit yang mudah difahami

## V1 Product Goal

User biasa ada masalah:

- resit hilang
- expense tak dikumpul ikut bulan
- data masuk spreadsheet lambat
- susah nak tahu profit sebenar bulanan

Dashboard ini bertujuan jadikan Work2U sebagai tempat utama untuk simpan resit dan semak performance bulanan.

## Primary Metrics

Kad utama yang dicadangkan:

- `Gross Revenue`
- `Total Expenses`
- `Total Overhead`
- `Net Profit`
- `Receipt Count`
- `Unreviewed Receipts`

## Formula Rules

- `Gross Revenue = paid invoice revenue + subscription revenue`
- `Total Expenses = approved direct expense receipts`
- `Total Overhead = approved overhead-tagged expenses`
- `Net Profit = Gross Revenue - Total Expenses - Total Overhead`

Jika user mahu formula yang lebih ringkas dalam UI, boleh papar:

- `Profit = Revenue - Direct Expenses - Overhead`

## Core Filters

Dashboard V1 patut ada filter berikut:

- month selector
- category selector
- vendor selector
- review status
- payment method

## Recommended UI Blocks

### 1. Summary Row

Tunjuk angka utama dalam card ringkas:

- revenue
- expenses
- overhead
- profit

### 2. Receipt Activity

Papar:

- jumlah resit diterima bulan ini
- jumlah yang belum review
- jumlah yang approved
- jumlah yang flagged untuk semakan

### 3. Category Breakdown

Tunjuk spend ikut category:

- marketing
- travel
- tools
- subscriptions
- ops
- custom overhead

### 4. Vendor Breakdown

Tunjuk vendor paling besar bulanan supaya user boleh nampak ke mana duit keluar.

### 5. Profit View

Bahagian ini perlu ringkas dan terus kepada point:

- gross revenue
- total expense
- total overhead
- net profit

## Table View

Table V1 cadangan field:

- receipt date
- vendor
- category
- amount
- tax
- status
- file link
- review note

## AI Assist in Dashboard

AI boleh bantu:

- flag missing vendor
- flag amount yang pelik
- cadangkan kategori
- ringkaskan monthly spend
- highlight perubahan besar berbanding bulan lepas

## Empty State

Kalau data masih sedikit, dashboard perlu tunjuk:

- upload resit pertama
- import expense secara manual
- lihat contoh monthly summary

## V1 Scope

Untuk V1, fokus pada:

- upload resit
- OCR extraction
- manual review
- monthly summary
- P&L view

Untuk later phase:

- bank reconciliation
- auto matching invoice to expense
- receipt reminders
- vendor insights
- smart budget alerts

## Query Guide

Lihat [Work2U Expense Query Guide](./work2u-expense-query-guide.md) untuk SQL summary, vendor breakdown, review queue, dan P&L mapping.

Lihat juga [Work2U Expense Data Contract](./work2u-expense-data-contract.md) untuk JSON shape yang frontend akan consume.

Untuk endpoint behavior, rujuk [Work2U Expense Dashboard API Contract](./work2u-expense-api-contract.md).

Untuk scaffold React props, rujuk [Work2U Expense React Scaffold](./work2u-expense-react-scaffold.md).

Untuk receipt upload dan monthly rollup automation, rujuk [Work2U Expense Automation](./work2u-expense-automation.md).
