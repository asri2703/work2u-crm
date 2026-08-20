# Work2U Expense React Scaffold

_Scaffold props dan component shape untuk dashboard expense if/when frontend dipindahkan ke React._

## Intent

Dokumen ini bukan implementation penuh. Ia define:

- props utama untuk page dashboard
- props untuk subcomponent
- event handlers yang perlu ada
- loading dan empty state behavior

## Suggested File Structure

- `ExpenseDashboardPage.tsx`
- `ExpenseSummaryCards.tsx`
- `ExpenseBreakdownPanel.tsx`
- `ExpenseReviewQueue.tsx`
- `ExpensePnlPanel.tsx`
- `ExpenseDashboardSkeleton.tsx`

## Shared Types

```ts
export type ExpenseDashboardProps = {
  monthKey: string
  loading?: boolean
  error?: string | null
  data?: ExpenseDashboardData | null
  onMonthChange?: (monthKey: string) => void
  onRefresh?: () => void
  onUploadReceipt?: (files: FileList) => void
}

export type ExpenseDashboardData = {
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

## Summary Card Props

```ts
export type ExpenseSummaryCardsProps = {
  summary: ExpenseSummary
  onMonthChange?: (monthKey: string) => void
  onRefresh?: () => void
}
```

## Breakdown Panel Props

```ts
export type ExpenseBreakdownPanelProps = {
  vendorBreakdown: ExpenseVendorBreakdownItem[]
  categoryBreakdown: ExpenseCategoryBreakdownItem[]
  loading?: boolean
}
```

## Review Queue Props

```ts
export type ExpenseReviewQueueProps = {
  items: ExpenseReceiptItem[]
  loading?: boolean
  onOpenReceipt?: (receiptId: string) => void
  onApproveReceipt?: (receiptId: string) => void
  onFlagReceipt?: (receiptId: string, note?: string) => void
}
```

## P&L Props

```ts
export type ExpensePnlPanelProps = {
  rows: ExpensePnlRow[]
  currency: string
  loading?: boolean
}
```

## Skeleton Props

```ts
export type ExpenseDashboardSkeletonProps = {
  showSummary?: boolean
  showCharts?: boolean
  showQueue?: boolean
}
```

## Page Skeleton

```tsx
export function ExpenseDashboardPage({
  monthKey,
  loading = false,
  error = null,
  data = null,
  onMonthChange,
  onRefresh,
  onUploadReceipt
}: ExpenseDashboardProps) {
  if (loading) return <ExpenseDashboardSkeleton />

  if (error) {
    return <div className="dashboard-error">{error}</div>
  }

  if (!data) {
    return <div className="dashboard-empty">No expense data for {monthKey}</div>
  }

  return (
    <main>
      <ExpenseSummaryCards
        summary={data.summary}
        onMonthChange={onMonthChange}
        onRefresh={onRefresh}
      />
      <ExpenseBreakdownPanel
        vendorBreakdown={data.vendorBreakdown}
        categoryBreakdown={data.categoryBreakdown}
      />
      <ExpenseReviewQueue
        items={data.reviewQueue}
      />
      <ExpensePnlPanel
        rows={data.pnlRows}
        currency={data.summary.currency}
      />
      {onUploadReceipt ? (
        <button type="button" onClick={() => {}}>
          Upload receipt
        </button>
      ) : null}
    </main>
  )
}
```

## Component Rules

- page-level component should not reshape backend keys in many places
- one view-model layer is enough for formatting
- loading state should use skeleton, not blank white space
- mobile layout should stack summary, charts, and queue vertically

