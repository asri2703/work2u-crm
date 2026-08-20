# Work2U Expense Dashboard Wireframe

_Wireframe teks untuk dashboard bulanan resit, expense, overhead, dan profit._

## Objective

Bina dashboard yang cepat dibaca di mobile, mudah di-scan di desktop, dan fokus pada monthly close tanpa spreadsheet.

## Design Principles

- mobile first
- summary cards harus nampak dulu
- upload receipt mesti satu tap sahaja
- AI insight perlu ringkas, bukan mengganggu
- review queue perlu jelas supaya user tak lupa semak

## Desktop Layout

### Top Bar

- brand name
- month selector
- search receipt
- upload receipt button
- refresh button

### Summary Row

- gross revenue
- total expenses
- total overhead
- net profit
- receipt count
- unreviewed receipts

### Analytics Zone

- monthly trend chart
- category breakdown chart
- vendor concentration chart
- AI insight card

### Receipt Table

Columns:

- receipt date
- vendor
- category
- total amount
- tax
- review status
- OCR confidence
- file link

### Monthly Footer

- revenue
- expenses
- overhead
- profit
- export PDF
- export CSV

## Mobile Layout

### Header

- expense dashboard title
- month selector
- search icon or compact search bar
- upload receipt button

### Priority Cards

The first mobile block should always show:

- gross revenue
- total expenses
- total overhead
- net profit
- receipt count

### Filter Chips

- month
- category
- vendor
- review status
- payment method

### Analytics Cards

Stack vertically on mobile:

- trend chart card
- vendor card
- category card
- AI insight card

### Receipt List

Replace dense table with card list on mobile:

- vendor name
- amount
- category
- review status
- OCR confidence
- tap to open detail

### Sticky Mobile Action

Recommended sticky action:

- `Upload Receipt`

Optional secondary action:

- `Open Review Queue`

## Mobile Flow

1. user opens dashboard
2. current month summary appears immediately
3. user taps upload if they have a new receipt
4. OCR result appears in a review card
5. user edits vendor, amount, or category
6. user approves the receipt
7. summary and P&L refresh automatically

## Empty State

If there is no data yet, show:

- upload first receipt
- add manual expense
- see sample monthly summary

## AI Panel Content

AI should only show compact, useful hints such as:

- missing vendor name
- unusual amount
- suggested category
- pending receipts to review
- month-end summary reminder

## Interaction Notes

- receipt upload must work from phone camera or file picker
- OCR result must be editable before save
- summary cards should update immediately after approval
- table rows should open detail view without leaving the page
- mobile filters should open as bottom sheet or modal

## V1 Scope

For V1, keep the dashboard focused on:

- receipt capture
- OCR extraction
- manual review
- monthly summary
- direct expense vs overhead visibility
- profit visibility

Later versions can add:

- bank reconciliation
- vendor ranking
- budget alerts
- smarter anomaly detection
- automation rule builder

