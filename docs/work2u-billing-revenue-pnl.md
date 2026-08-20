# Work2U Billing, Revenue & PnL

_Dokumen rujukan untuk kos, revenue, payment stack, dan model PnL._

## Objective

Pastikan pricing, billing, dan PnL model:

- sesuai untuk Malaysia dan global
- mampu cover kos fixed dan variable
- boleh sustain plan RM39
- cukup fleksibel untuk Enterprise sales

## Scope

Dokumen ini fokus pada:

- payment stack
- cost buckets
- revenue streams
- PnL thinking
- charity idea

## Non-goals

Dokumen ini tidak bincang:

- detailed tax compliance
- payment SDK implementation
- technical checkout flow
- finance bookkeeping depth

## Payment Stack

### Malaysia

- Billplz
- sesuai untuk FPX dan local payment flow

### Global

- Stripe
- sesuai untuk recurring SaaS subscription

### Principle

- satu billing abstraction layer
- region tentukan provider
- entitlement unlock ikut payment status

## Stack Cadangan

- Cloudflare
- Supabase
- Resend
- optional Vercel
- GitHub

## Reference Pricing Basis

_Angka di bawah ialah planning estimate berdasarkan halaman harga rasmi yang semak pada 18 Ogos 2026. Ia bukan komitmen final dan perlu disemak semula sebelum launch._

- Supabase Pro bermula sekitar USD 25 / month
- Cloudflare Workers Paid bermula sekitar USD 5 / month
- Resend ada free tier, kemudian billing ikut usage / overage
- Billplz ada Basic plan percuma dan Standard plan berbayar dengan kadar transaksi lebih rendah
- Stripe ialah option global dengan transaction fee ikut region / card mix

Rujukan rasmi:

- https://supabase.com/pricing
- https://developers.cloudflare.com/workers/platform/pricing/
- https://resend.com/pricing
- https://main.billplz.com/pricing
- https://stripe.com/pricing

## Cost Buckets

### Fixed cost

- hosting
- database
- monitoring
- backups
- support tools
- domain
- email warm-up / sending reputation buffer

### Planning estimate for launch

_Ini ialah budget planning untuk kira margin, bukan official quote._

- infra core: RM150-RM250 / month
- monitoring and logs: RM0-RM30 / month
- email baseline: RM0-RM30 / month
- storage buffer: RM0-RM20 / month
- support reserve: RM50-RM150 / month

Angka ini boleh turun kalau:

- penggunaan masih kecil
- banyak user guna BYO AI key
- banyak komunikasi dikawal oleh quota
- WhatsApp/Telegram guna flow yang ringan

### Variable cost

- AI usage
- payment fees
- messaging
- storage growth
- support load

### Variable cost rules

- AI paling cepat makan margin kalau tiada quota
- messaging perlu ada guardrail supaya automation tak spam
- payment fee perlu dibaca ikut region
- support load meningkat bila onboarding tak jelas

## Pricing Targets

- `Starter` - RM39
- `Elite` - RM99
- `Enterprise` - custom, with setup / retainer

## Revenue Streams

- subscription
- add-ons
- extra seats
- extra AI credits
- setup fee for enterprise

## Core Revenue Assumptions

### Starter

- price: RM39
- target: solo user dan freelancer
- margin target selepas variable cost: RM20-RM24 per active workspace

### Elite

- price: RM99
- target: small team / agency
- margin target selepas variable cost: RM65-RM80 per active workspace

### Enterprise

- price: custom
- target: corporate and multi-team
- margin target: tinggi kerana ada setup fee, custom scope, dan support premium

## Cost Control Rules

Kalau harga mahu kekal murah, backend dan packaging kena ada:

- AI credit limit
- storage limit
- connector limit
- automation limit
- retry cap
- usage tracking

## PnL Thinking

### Revenue

- subscription MRR
- add-on MRR
- enterprise setup fee

### COGS

- infra
- AI
- payment fees
- messaging
- storage
- support reserve

### Example monthly PnL formula

`Gross Profit = MRR + add-on revenue - direct COGS`

`Net Profit = Gross Profit - admin - marketing - salaries - legal - tax reserve`

### Break-even guide

Jika fixed cost launch berada sekitar RM200 sebulan dan average net contribution per active Starter user sekitar RM29, maka break-even kasar ialah:

`RM200 / RM29 = 7 active Starter users`

Kalau campur Elite, break-even akan turun kerana Elite bawa contribution lebih tinggi.

## Scenario Projection

### Scenario A: Lean launch

- 20 Starter
- 5 Elite
- 0 Enterprise recurring

Estimated MRR:

- Starter: `20 x RM39 = RM780`
- Elite: `5 x RM99 = RM495`
- Total: `RM1,275`

Planning direct costs:

- fixed infra and ops: `RM180-RM250`
- variable AI/messaging/payment reserve: `RM120-RM250`

Estimated gross contribution:

- about `RM575-RM775`

### Scenario B: Balanced growth

- 50 Starter
- 15 Elite
- 1 Enterprise retainer / setup equivalent

Estimated MRR before Enterprise:

- Starter: `50 x RM39 = RM1,950`
- Elite: `15 x RM99 = RM1,485`
- Total: `RM3,435`

Planning direct costs:

- fixed infra and ops: `RM180-RM250`
- variable reserve: `RM250-RM500`

Estimated gross contribution:

- about `RM2,185-RM2,505`

### Scenario C: Strong product-market fit

- 120 Starter
- 30 Elite
- 3 Enterprise customers

Estimated MRR before Enterprise:

- Starter: `120 x RM39 = RM4,680`
- Elite: `30 x RM99 = RM2,970`
- Total: `RM7,650`

At this point, Enterprise setup and custom retainer can become a serious profit driver rather than only recurring MRR.

### Net

Revenue tolak COGS tolak marketing/admin/legal/salaries

## Business Strategy

- Starter harus sangat affordable
- Elite harus jadi plan paling menarik
- Enterprise harus jadi custom sales plan
- AI usage mesti dikawal dengan quota
- payment flow mesti ikut region
- BYO AI key sepatutnya disokong untuk jaga kos
- managed AI sepatutnya ada quota dan add-on pricing
- charity contribution boleh dibuat sebagai peratusan kecil daripada net profit, bukan daripada revenue kasar

## Charity Idea

- sebahagian keuntungan disalurkan kepada yang memerlukan
- dibuat telus
- pastikan sustainable

## Decision Status

- Malaysia provider: Billplz
- global provider: Stripe
- base starter price: RM39
- revenue strategy: subscription + add-ons + enterprise setup
- planning gross margin target: 70%+
