# Work2U Pricing & Packaging

_Dokumen rujukan untuk struktur pakej, limits, dan pricing strategy._

## Objective

Tentukan package yang:

- mampu milik untuk freelancer dan small business
- masih sihat dari segi margin
- jelas beza antara Starter, Elite, dan Enterprise
- mudah dijual dan mudah difahami

## Scope

Dokumen ini fokus pada:

- nama plan
- sasaran user
- feature limit
- add-on idea
- pricing rules

## Non-goals

Dokumen ini tidak bincang:

- detail billing provider
- implementation backend
- UI onboarding
- full revenue projection

## Cadangan Plan

- `Starter` - RM39
- `Elite` - RM99
- `Enterprise` - custom, recommended starting point from RM499 / month + setup fee

## Cost Model v1

Tujuan bahagian ini ialah bantu kita kira sama ada harga plan masih sihat selepas AI, messaging, storage, dan support diambil kira.

### Fixed Monthly Cost

| Item | Cadangan kos | Nota |
| --- | ---: | --- |
| Cloudflare | low / tier-based | DNS, security, edge rules |
| Supabase | low / tier-based | auth, database, storage |
| Resend | usage-based | mailing system |
| Vercel | optional | hanya jika perlu deploy frontend tambahan |
| Monitoring / logs | low | error tracking, audit, observability |
| GitHub | low | source control |

### Variable Cost Drivers

| Driver | Apa yang naikkan kos | Cara kawal |
| --- | --- | --- |
| AI | prompt, reply draft, summarization | quota per plan, BYO AI key, caching |
| Messaging | WhatsApp / email / Telegram usage | limit connector dan automation rules |
| Storage | documents, receipts, attachments | cap file size, archive, tier-based storage |
| Billing fees | payment gateway fees | route ikut region, pilih provider yang sesuai |

### Simple Formula

- `Gross Revenue = subscription revenue + add-ons + setup fees`
- `Gross Profit = Gross Revenue - variable costs`
- `Net Profit = Gross Profit - fixed monthly cost`

## Recommended Package Matrix

_Angka di bawah ialah cadangan v1 untuk control cost dan bagi ruang margin. Ia boleh dilaras bila usage sebenar dah ada._

| Plan | Target user | Users | Workspace | Channels | AI usage | Automation | Reports | Accounting |
| --- | --- | ---: | --- | --- | --- | --- | --- | --- |
| Starter | Freelancer, solo operator | 1 | 1 | 1 main channel | Basic draft assist, BYO AI key optional | 3 rules | Basic | Basic invoice + receipt |
| Elite | Small team, agency | up to 5 | 1 | up to 3 channels | Higher quota, managed or BYO AI | 15 rules | Revenue + basic PnL | Invoicing, receipt, downloadable docs |
| Enterprise | Corporate, multi-team | custom | custom | custom | custom | custom | custom analytics | custom accounting flow |

## Feature / Limit Table

| Feature | Starter | Elite | Enterprise |
| --- | --- | --- | --- |
| Active users | 1 | up to 5 | custom |
| Workspaces | 1 | 1 | custom |
| Leads | usable, limited quota | higher quota | custom |
| Clients | usable, limited quota | higher quota | custom |
| Tasks | yes | yes | yes |
| Cases | basic | full | full |
| Services | basic | full | custom |
| WhatsApp connector | 1 | up to 3 | custom |
| Email mailbox | 1 | up to 3 | custom |
| Telegram bot | 1 | 1 + team usage | custom |
| Calendar sync | yes | yes | yes |
| AI drafts | yes, low quota | yes, higher quota | custom |
| AI workflow assist | limited | yes | yes |
| Invoices | basic | full | full |
| Receipts | basic | full | full |
| Downloadable docs | limited | yes | yes |
| Reports | basic dashboard | revenue + simple PnL | advanced analytics |
| Automation rules | 3 | 15 | custom |
| Branding | no | limited | yes |
| Support | standard | priority standard | priority / SLA |

## Recommended Usage Caps v1

_Caps ini bantu control cost tanpa bunuh core workflow._

| Cap | Starter | Elite | Enterprise |
| --- | --- | --- | --- |
| Seats | 1 | up to 5 | custom |
| Workspaces | 1 | 1 | custom |
| Active leads | 150 | 1,000 | custom |
| Active clients | 100 | 1,000 | custom |
| Active tasks | 500 | 5,000 | custom |
| AI actions / month | 60 | 300 | custom |
| Automation rules | 3 | 15 | custom |
| Connectors | 1 | 3 | custom |
| Storage | 1 GB | 10 GB | custom |
| Monthly email sends | 500 | 5,000 | custom |
| Shared templates | 5 | 50 | custom |

### Limit Notes

- Starter must still solve a real daily workflow
- Elite must feel like the best value upgrade
- Enterprise should unlock governance, customization, and support
- limits should control cost, not remove core usefulness

### Starter Design Goal

Starter kena kekal murah tetapi masih usable. Maksudnya:

- boleh simpan leads, clients, tasks, dan reminders
- boleh hantar email/inbox asas
- boleh buat invoice dan receipt asas
- boleh guna AI untuk draft, bukan heavy automation
- boleh sync calendar
- boleh aktifkan 1 channel utama sahaja
- boleh simpan history penting tanpa rasa sempit
- fokus pada satu pipeline atau satu business line pada satu masa
- sesuai untuk user yang kerja sendiri dan nak bergerak laju tanpa setup berat

### Elite Design Goal

Elite kena jadi plan yang paling sedap untuk upgrade. Fokus dia:

- lebih banyak seat
- lebih banyak automation
- lebih banyak channel
- lebih banyak AI assist
- lebih banyak accounting dan reporting
- paling sesuai untuk team kecil yang nak scale tanpa lompat terus ke Enterprise
- sesuai untuk team yang mahu collaboration, automation, dan visibility yang lebih stabil
- cukup kuat untuk jadi plan utama yang paling mudah dijual

### Enterprise Design Goal

Enterprise bukan semata-mata “lebih besar”. Ia untuk:

- custom workflow
- custom permission
- audit log
- onboarding khas
- branded experience
- support lebih dekat
- approval flow dan governance yang lebih serius
- sesuai untuk operasi yang perlukan control, structure, dan custom delivery
- biasanya datang dengan setup dan onboarding berbayar

## Kenapa RM39 untuk Starter

RM39 sesuai untuk:

- freelancer
- solo user
- small business

Ia masih murah untuk jadi entry point, tapi memberi ruang margin yang lebih selamat jika AI, storage, dan messaging ikut quota.

Untuk model kos Work2U, RM39 boleh kekal viable kalau:

- AI default ikut quota kecil atau BYO key
- messaging dan storage ada limit
- email sending disokong oleh usage rules
- core CRM tidak ditahan di belakang paywall

## Packaging Goal

- keep core value accessible
- lock limits, not usefulness
- let `Elite` jadi plan paling menarik
- jadikan `Enterprise` custom untuk sales-led deals

## Launch Offer

- free onboarding for founding users
- priority setup for early Elite and Enterprise customers
- launch pricing stays locked for a limited time while account remains active
- use this offer to reduce friction, not to hide the real pricing

## Starter

### Sasaran

- freelancer
- solo operator
- business kecil

### Limit cadangan

- 1 user
- 1 workspace
- 150 active leads
- 100 active clients
- 500 active tasks
- 60 AI actions / month
- 3 automation rules
- 1 connector utama
- 1 GB storage
- 500 monthly email sends

### Feature minimum

- leads
- clients
- tasks
- basic reminders
- basic AI draft
- basic invoicing
- calendar sync
- basic reports

## Elite

### Sasaran

- growing team
- agency
- small company

### Limit cadangan

- 3-5 users
- 1 workspace
- 1,000 active leads
- 1,000 active clients
- 5,000 active tasks
- 300 AI actions / month
- 15 automation rules
- up to 3 connectors
- 10 GB storage
- 5,000 monthly email sends

### Feature tambahan

- full communication hub
- team collaboration
- AI summary dan routing
- automation rules lebih luas
- reports lebih lengkap
- approval flow asas

## Enterprise

### Sasaran

- corporate
- multi-team
- custom workflow

### Feature utama

- custom permissions
- custom onboarding
- audit log penuh
- SLA / priority support
- custom branding
- custom workflow
- advanced analytics
- custom limits
- custom channel strategy

## Add-on Idea

Untuk bantu affordability, revenue tambahan boleh datang dari:

- extra AI credits
- extra seat
- extra storage
- extra automation pack
- setup / migration fee
- custom domain / branding
- premium support
- template pack untuk property, insurance, dan freelancer

## Suggested Add-on Pricing

_Cadangan awal untuk kira-kira revenue, bukan harga final._

- extra seat: RM15-RM25 / seat / month
- extra AI pack: RM10-RM30 / month
- extra storage pack: RM10-RM20 / month
- extra automation pack: RM10-RM40 / month
- setup fee for Enterprise: RM300-RM1,500 one-off

## Pricing Rules

- jangan lock core CRM di plan mahal
- gunakan quota untuk control cost
- pastikan Starter tetap benar-benar boleh digunakan
- Elite mesti nampak jauh lebih berbaloi
- Enterprise kena jual sebagai control and custom service
- BYO AI key patut disokong supaya customer yang ada akaun AI sendiri boleh jimat kos
- managed AI patut dijadikan addon atau higher-tier feature

## Price Sensitivity Guide

Kalau kita nak jaga affordability, ada tiga arah yang boleh kita pilih:

| Model | Starter | Elite | Kesan |
| --- | --- | --- | --- |
| Value-first | RM39 | RM89 | Mudah masuk, margin Elite lebih ketat |
| Balanced | RM39 | RM99 | Seimbang antara affordability dan margin |
| Premium-lite | RM39 | RM129 | Lebih selamat untuk kos, tapi kurang mesra freelancer |

Cadangan semasa:

- pilih `Balanced`
- kekalkan `Starter RM39`
- jadikan `Elite RM99` sebagai plan paling menarik
- biarkan `Enterprise` custom

## Revenue Projection Template

Contoh di bawah boleh dipakai untuk kira MRR awal. Angka enterprise hanya assumption.

| Scenario | Starter users | Elite users | Enterprise deals | Formula | Sample MRR |
| --- | ---: | ---: | ---: | --- | ---: |
| Conservative | 40 | 10 | 0 | `(40 x 39) + (10 x 99)` | RM2,550 |
| Base | 100 | 25 | 0 | `(100 x 39) + (25 x 99)` | RM6,375 |
| Growth | 150 | 40 | 2 | `(150 x 39) + (40 x 99) + (2 x 1,500)` | RM12,810 |

> Enterprise di atas guna assumption RM1,500 per deal sebagai contoh awal sahaja.

## PnL Checkpoint

Sebelum kita kunci harga akhir, kita kena monitor:

- conversion Starter ke Elite
- AI cost per active user
- messaging volume per workspace
- support load per package
- churn rate setiap plan

Kalau Elite jadi plan paling ramai upgrade, RM99 biasanya lebih sihat untuk cover AI, support, dan integrasi berbanding plan yang terlalu murah.

## Open Questions

- Starter contacts limit
- Starter AI credits limit
- Elite AI credits limit
- automation limit per plan
- storage limit per plan
- connector limit per plan

## Decision Status

- Starter base price: `RM39`
- Elite base price: `RM99`
- Enterprise: custom with setup / retainer
- pricing style: lock limits, not usefulness
- AI strategy: quota-based + BYO key support
