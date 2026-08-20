# Work2U Expense Data Contract

_Frontend contract untuk dashboard expense, receipt review, dan P&L._

## Contract Goal

Dokumen ini define shape JSON yang frontend akan consume supaya UI tidak perlu teka struktur data.

## Top Level Response

`GET /api/expense/dashboard?month=YYYY-MM-01`

```json
{
  "success": true,
  "data": {
    "workspaceId": "uuid",
    "monthKey": "2026-08-01",
    "summary": {},
    "vendorBreakdown": [],
    "categoryBreakdown": [],
    "reviewQueue": [],
    "pnlRows": [],
    "aiInsights": [],
    "meta": {}
  }
}
```

## `summary`

```json
{
  "monthKey": "2026-08-01",
  "grossRevenue": 12500,
  "totalExpenses": 3200,
  "totalOverhead": 900,
  "netProfit": 8400,
  "receiptCount": 48,
  "approvedReceiptCount": 41,
  "unreviewedReceiptCount": 7,
  "currency": "MYR",
  "source": "snapshot"
}
```

Fields:

- `grossRevenue`
- `totalExpenses`
- `totalOverhead`
- `netProfit`
- `receiptCount`
- `approvedReceiptCount`
- `unreviewedReceiptCount`
- `currency`
- `source`

## `vendorBreakdown[]`

```json
[
  {
    "vendorName": "Tesla Service Centre",
    "totalAmount": 1200,
    "receiptCount": 3,
    "currency": "MYR",
    "sharePct": 37.5
  }
]
```

Fields:

- `vendorName`
- `totalAmount`
- `receiptCount`
- `currency`
- `sharePct`

## `categoryBreakdown[]`

```json
[
  {
    "categoryName": "Travel",
    "isOverhead": false,
    "totalAmount": 1100,
    "receiptCount": 5,
    "currency": "MYR",
    "sharePct": 34.4
  }
]
```

Fields:

- `categoryName`
- `isOverhead`
- `totalAmount`
- `receiptCount`
- `currency`
- `sharePct`

## `reviewQueue[]`

```json
[
  {
    "id": "uuid",
    "receiptDate": "2026-08-18",
    "vendorName": "Grab",
    "categoryName": "Travel",
    "totalAmount": 26.5,
    "taxAmount": 0,
    "reviewStatus": "pending",
    "ocrStatus": "completed",
    "ocrConfidence": 0.92,
    "fileUrl": "https://...",
    "fileName": "grab-ride.pdf",
    "currency": "MYR",
    "notes": "",
    "createdAt": "2026-08-18T04:15:10.000Z"
  }
]
```

Fields:

- `id`
- `receiptDate`
- `vendorName`
- `categoryName`
- `totalAmount`
- `taxAmount`
- `reviewStatus`
- `ocrStatus`
- `ocrConfidence`
- `fileUrl`
- `fileName`
- `currency`
- `notes`
- `createdAt`

## `pnlRows[]`

```json
[
  {
    "monthKey": "2026-08-01",
    "grossRevenue": 12500,
    "totalExpenses": 3200,
    "totalOverhead": 900,
    "netProfit": 8400,
    "profitMarginPct": 67.2,
    "currency": "MYR"
  }
]
```

Fields:

- `monthKey`
- `grossRevenue`
- `totalExpenses`
- `totalOverhead`
- `netProfit`
- `profitMarginPct`
- `currency`

## `aiInsights[]`

```json
[
  {
    "type": "warning",
    "title": "Unusual spending spike",
    "message": "Travel expenses increased 28 percent compared to last month.",
    "severity": "medium",
    "suggestedAction": "Check the flagged Grab and fuel receipts."
  }
]
```

Fields:

- `type`
- `title`
- `message`
- `severity`
- `suggestedAction`

## `meta`

```json
{
  "generatedAt": "2026-08-19T08:00:00.000Z",
  "snapshotUsed": true,
  "liveFallbackUsed": false,
  "currency": "MYR",
  "timezone": "Asia/Kuala_Lumpur"
}
```

Fields:

- `generatedAt`
- `snapshotUsed`
- `liveFallbackUsed`
- `currency`
- `timezone`

## Suggested Type Names

```ts
type ExpenseDashboardResponse = {
  success: boolean
  data: ExpenseDashboardData
}

type ExpenseDashboardData = {
  workspaceId: string
  monthKey: string
  summary: ExpenseSummary
  vendorBreakdown: ExpenseVendorBreakdownItem[]
  categoryBreakdown: ExpenseCategoryBreakdownItem[]
  reviewQueue: ExpenseReceiptItem[]
  pnlRows: ExpensePnlRow[]
  aiInsights: ExpenseAiInsight[]
  meta: ExpenseDashboardMeta
}
```

## Frontend Rule

- frontend should render directly from these keys
- avoid reshaping backend keys in multiple places
- if a chart needs a different label, map it in a single view model file

