# Work2U Roles & Permissions

_Dokumen rujukan untuk access control, scopes, dan client portal separation._

## Objective

Bina access control yang:

- mudah difahami
- selamat untuk multi-tenant SaaS
- cukup fleksibel untuk team kecil dan enterprise
- tidak terlalu banyak role awal

## Scope

Dokumen ini fokus pada:

- top-level roles
- permission presets
- data scopes
- client portal access
- AI access level

## Role Model

### 1. Super Admin

Untuk owner sistem dan team core.

Boleh:

- manage semua workspace
- manage pricing dan plans
- manage feature flags
- view audit log penuh
- override limit
- manage integrations global

### 2. Admin

Untuk staff dalaman awak.

Boleh:

- manage users dalam workspace
- manage leads, clients, tasks, cases, services
- manage communication hub
- manage invoice dan receipt
- view reports workspace
- manage templates dan reminders

### 3. User

Untuk end-user biasa.

Boleh:

- view dan edit item yang assigned
- guna AI yang dibenarkan
- hantar mesej ikut permission
- update task dan client record yang diberi akses

## Permission Presets

Preset dicadangkan:

- sales
- finance
- operations
- manager
- viewer

## Scope Rules

Scope access yang dicadangkan:

- own only
- assigned only
- workspace
- all workspaces

## Client Portal

Client portal tidak dianggap role internal.

Ia patut menjadi:

- external limited access
- view invoice
- download document
- approve quotation
- upload file
- check status

## AI Access Levels

- draft only
- suggest + draft
- semi-auto
- auto-send on approved rules

## Non-goals

- terlalu banyak top-level role
- custom ACL yang terlalu kompleks di v1

## Open Questions

- adakah perlu manager role sebagai top-level atau cukup preset
- AI permission by module atau by plan
- scope assignment untuk shared team data

## Decision Status

- top-level roles: `Super Admin`, `Admin`, `User`
- client portal: separate external access
- permission design: role + preset + scope
