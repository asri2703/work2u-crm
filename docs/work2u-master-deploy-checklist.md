# Work2U Master Deploy Checklist

_Checklist utama untuk pasang platform V1 secara penuh dengan satu laluan yang jelas._

## 1. Run This Bundle

1. Run [docs/work2u-master-deploy-bundle.sql](./work2u-master-deploy-bundle.sql)
2. Do not run the individual base, expense, or calendar files again after the master bundle
3. Keep the individual step files only for debugging or smaller partial rollouts

## 2. What The Master Bundle Includes

1. `profiles` and auth profile helpers
2. `workspaces` and the MVP core schema
3. `expense_receipts`, `expense_receipt_extractions`, `expense_receipt_events`
4. `expense_categories`
5. `monthly_expense_snapshots`
6. `calendar_events`, `calendar_reminders`, `calendar_connections`

## 3. Smoke Test After Apply

1. Create a test user
2. Confirm the profile row auto-creates
3. Create one workspace
4. Insert one lead, one client, one task, and one case
5. Upload one receipt and open the preview modal
6. Verify the status timeline is visible
7. Create one calendar event and one reminder
8. Confirm select/update access is blocked across workspaces

## 4. Done When

- master bundle runs cleanly in Supabase SQL editor
- core tables exist with RLS enabled
- receipt audit timeline works in the UI
- calendar tables exist with RLS enabled
- smoke test passes without manual schema edits
