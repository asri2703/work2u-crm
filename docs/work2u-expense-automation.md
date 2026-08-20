# Work2U Expense Automation

_Dokumen rujukan untuk receipt upload, OCR, monthly rollup, dan expense close automation._

## Goal

Automation ini bantu user:

- simpan resit terus selepas upload
- extract data secara automatik
- semak resit yang meragukan
- auto kira monthly expense summary
- refresh P&L tanpa tunggu kerja manual

## Receipt Upload Flow

1. user upload image atau PDF
2. file disimpan ke storage
3. `expense_receipts` dicipta sebagai primary record
4. OCR job dihantar ke queue
5. extraction hasil AI disimpan ke `expense_receipt_extractions`
6. record ditandakan `pending`, `flagged`, atau `approved`

## Automation Triggers

### On Upload

- trigger OCR extraction
- detect vendor, date, amount, tax, and receipt text
- suggest category dan overhead flag

### On Manual Review

- update approved values
- overwrite AI guess dengan user correction
- recalculate month snapshot for that workspace

### On Receipt Approval

- include receipt in current month rollup
- update dashboard summary
- refresh P&L totals

### Nightly Rollup

- recalc monthly snapshot for active months
- keep last generated timestamp
- prepare summary for dashboard next visit

## Monthly Close Behavior

Recommended behavior:

- before month close, keep snapshot editable
- after close, generate a versioned snapshot
- if user edits an old receipt, recompute only affected month

## Notification Ideas

- remind user if pending receipts remain at end of month
- remind user if OCR confidence is low
- remind user if no receipts uploaded for a long period

## Why This Matters

Without automation, user still ends up doing:

- manual typing
- manual month-end checking
- manual P&L correction
- manual receipt hunting

Work2U should reduce that load by making receipt capture and monthly reporting feel automatic.

