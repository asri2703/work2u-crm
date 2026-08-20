# Work2U Expense Query Helpers

_Ringkasan helper names untuk backend service layer._

## Helper List

- `getExpenseDashboardMonthSummary(workspaceId, monthKey)`
- `getExpenseDashboardLiveSummary(workspaceId, monthKey)`
- `getExpenseVendorBreakdown(workspaceId, monthKey)`
- `getExpenseCategoryBreakdown(workspaceId, monthKey)`
- `getExpenseReviewQueue(workspaceId, limit?)`
- `getExpensePnlRows(workspaceId)`

## Suggested Execution Order

1. try snapshot summary first
2. fallback to live summary if snapshot missing
3. load breakdowns
4. load review queue
5. load P&L rows

## Output Contract Reminder

All helpers should return stable field names that match the frontend contract:

- `summary`
- `vendorBreakdown`
- `categoryBreakdown`
- `reviewQueue`
- `pnlRows`
- `aiInsights`
- `meta`

