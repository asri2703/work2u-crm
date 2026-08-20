# Work2U Expense Dashboard API Contract

_Kontrak endpoint untuk dashboard expense supaya frontend, backend, dan reporting layer guna shape yang sama._

## Primary Endpoint

`GET /api/expense-dashboard?month=YYYY-MM-01`

### Query Params

- `month` required
- `workspaceId` optional jika workspace sudah datang dari auth context
- `includeInsights` optional, default `true`
- `includeLiveFallback` optional, default `true`

## Success Response

```json
{
  "success": true,
  "data": {
    "workspaceId": "uuid",
    "monthKey": "2026-08-01",
    "summary": {
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
    },
    "vendorBreakdown": [],
    "categoryBreakdown": [],
    "reviewQueue": [],
    "pnlRows": [],
    "aiInsights": [],
    "meta": {
      "generatedAt": "2026-08-19T08:00:00.000Z",
      "snapshotUsed": true,
      "liveFallbackUsed": false,
      "currency": "MYR",
      "timezone": "Asia/Kuala_Lumpur"
    }
  }
}
```

## Response Rules

- `summary.source` should be `snapshot` when data comes from `monthly_expense_snapshots`
- `summary.source` should be `live` when data comes from fallback aggregation
- `vendorBreakdown`, `categoryBreakdown`, `reviewQueue`, and `pnlRows` should always be arrays
- empty state should return empty arrays, not `null`

## Suggested HTTP Status Codes

- `200` success
- `400` invalid or missing month
- `401` missing auth
- `403` workspace access denied
- `500` unexpected backend error

## Error Response

```json
{
  "success": false,
  "error": {
    "code": "INVALID_MONTH",
    "message": "month must be in YYYY-MM-01 format"
  }
}
```

## Optional Supporting Endpoints

If the frontend later wants smaller fetches, these can reuse the same contract shape:

- `GET /api/expense-dashboard/summary?month=YYYY-MM-01`
- `GET /api/expense-dashboard/vendors?month=YYYY-MM-01`
- `GET /api/expense-dashboard/categories?month=YYYY-MM-01`
- `GET /api/expense-dashboard/review-queue?month=YYYY-MM-01`
- `GET /api/expense-dashboard/pnl?month=YYYY-MM-01`

## Backend Flow

1. validate auth and workspace
2. validate `month`
3. fetch snapshot summary
4. if missing and fallback enabled, fetch live summary
5. fetch breakdowns and review queue
6. build response using the shared data contract

