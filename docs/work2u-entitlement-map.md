# Work2U Entitlement Map

_Rujukan untuk backend membaca package, limit, dan usage secara konsisten._

## Source Of Truth

Urutan data yang perlu diikuti:

1. `public.plans`
2. `public.subscriptions`
3. `public.entitlements`
4. `public.usage_meters`
5. `public.profiles.package` only for fast UI mirror

## Plan Codes

- `Starter`
- `Elite`
- `Enterprise`

## Runtime Rules

- `public.plans` menyimpan katalog package dan harga rasmi
- `public.subscriptions` menyimpan status billing semasa
- `public.entitlements` menyimpan limit efektif untuk runtime
- `public.usage_meters` menyimpan consumption per tempoh
- `public.profiles.package` hanya digunakan untuk paparan cepat di UI
- jika entitlement belum wujud, backend guna default seed dari plan
- jika entitlement Enterprise di-custom, backend ikut nilai yang diprovision untuk owner itu

## Entitlement Keys

| Feature key | Unit | Starter | Elite | Enterprise |
| --- | --- | ---: | ---: | --- |
| `max_users` | count | 1 | 5 | custom |
| `max_workspaces` | count | 1 | 1 | custom |
| `max_main_channels` | count | 1 | 3 | custom |
| `max_leads_active` | count | 150 | 1000 | custom |
| `max_clients_active` | count | 100 | 1000 | custom |
| `max_tasks_active` | count | 500 | 5000 | custom |
| `max_ai_actions_month` | monthly_count | 60 | 300 | custom |
| `max_automation_rules` | count | 3 | 15 | custom |
| `max_connectors` | count | 1 | 3 | custom |
| `max_storage_gb` | gb | 1 | 10 | custom |
| `max_email_sends_month` | monthly_count | 500 | 5000 | custom |
| `max_shared_templates` | count | 5 | 50 | custom |
| `allow_custom_branding` | flag | 0 | 0 | 1 |
| `allow_custom_permissions` | flag | 0 | 0 | 1 |
| `allow_custom_workflow` | flag | 0 | 0 | 1 |
| `allow_audit_log` | flag | 0 | 0 | 1 |
| `allow_priority_sla_support` | flag | 0 | 0 | 1 |
| `allow_byo_ai_key` | flag | 1 | 1 | 1 |

## Meter Keys

- `ai_actions_month`
- `email_sends_month`
- `connector_sessions`
- `storage_gb_used`
- `automation_runs_month`
- `whatsapp_messages_month`
- `telegram_messages_month`

## Enforcement Flow

1. backend loads active subscription by owner
2. backend resolves plan code
3. backend loads entitlement rows for that owner and plan
4. backend loads monthly usage meters
5. backend checks requested action against limit
6. backend allows, blocks, or degrades action based on plan rule

## Enforcement Modes

- `allow`
- `warn`
- `block`
- `downgrade`

## Examples

### Starter

- allow 1 user
- allow 1 main channel
- block extra automation rules above 3
- block extra seats
- warn when AI usage is near monthly cap

### Elite

- allow up to 5 users
- allow up to 3 channels
- allow more automation and more AI usage
- warn before storage or email cap is reached

### Enterprise

- entitlement values are customer-specific
- plan can carry custom workflow, branding, and SLA flags
- usage limits may be negotiated per account

## Admin Override

- Super Admin can override entitlement values for support or sales cases
- override should be audit logged
- override should have expiry if it is temporary

## Notes

- keep the key names stable before implementation
- do not derive limits from UI copy
- UI should always read the effective entitlement row, not hardcoded text
