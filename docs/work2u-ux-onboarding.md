# Work2U UX & Onboarding

_Dokumen rujukan untuk survey, login flow, dashboard experience, dan client portal._

## Objective

Reka onboarding dan dashboard yang:

- cepat difahami
- personal ikut persona user
- tidak terlalu banyak klik
- memberi value seawal login pertama

## Scope

Dokumen ini fokus pada:

- survey sebelum login
- login options
- dashboard principle
- communication hub UX
- client timeline UX
- client portal UX
- AI UX

## Non-goals

Dokumen ini tidak bincang:

- database design
- pricing
- billing provider
- technical API implementation

## Onboarding Concept

Sebelum login, user akan nampak survey popup untuk kenal:

- kerja dia
- industry dia
- channel komunikasi utama
- tahap automasi yang dia mahu
- persona dashboard yang sesuai

Survey ini patut rasa ringan, bukan macam form panjang. Matlamat utama:

- align dashboard ikut jenis kerja
- cadang package yang sesuai
- tentukan channel yang perlu diaktifkan dulu
- kurangkan setup yang tak perlu
- bantu user nampak value sebelum login penuh

## Survey Goals

- personalisasi dashboard
- kurangkan feature overload
- set expectation awal
- tentukan template dan automation yang sesuai
- bina recommendation engine untuk package dan setup

## Cadangan Soalan Survey

- kerja dalam bidang apa
- guna Work2U untuk apa
- kerja seorang atau team
- channel utama: WhatsApp, email, Telegram
- nak AI bantu sampai tahap mana
- nak reminder manual, suggest, semi-auto, atau auto-send

## Survey Scoring

Tujuan scoring ialah bagi cadangan package yang cepat dan konsisten.

### Scoring Inputs

| Signal | Starter | Elite | Enterprise |
| --- | ---: | ---: | ---: |
| Solo user | 0 | 0 | 0 |
| Team size 2-5 | 0 | 2 | 0 |
| Team size 6+ | 0 | 0 | 3 |
| 1 main channel | 1 | 0 | 0 |
| 2-3 channels | 0 | 2 | 0 |
| 4+ channels | 0 | 0 | 2 |
| Manual follow-up mostly | 1 | 0 | 0 |
| Semi-auto or auto-send needed | 0 | 2 | 0 |
| Custom workflow or approval flow | 0 | 0 | 3 |
| Custom permission / SLA / branding | 0 | 0 | 3 |
| AI mostly draft only | 1 | 0 | 0 |
| AI summary, routing, workflow assist | 0 | 2 | 0 |

### Scoring Rule

- 0-4 points: Starter
- 5-8 points: Elite
- 9 points ke atas, atau ada custom workflow / permission / SLA: Enterprise

### Recommendation Logic

- jika ada `custom workflow`, `approval flow`, `custom permission`, atau `SLA`, terus cadang `Enterprise`
- jika team size 2-5 dan user perlukan lebih daripada 1 channel, cadang `Elite`
- jika user solo dan banyak kerja masih manual, cadang `Starter`
- jika score tie, pilih plan yang lebih tinggi hanya bila ia memang selesaikan bottleneck sebenar

### Recommendation Output

Selepas survey, sistem patut tunjuk:

- recommended plan
- kenapa plan itu dicadangkan
- fungsi utama yang akan aktif
- connector yang patut dihidupkan dulu
- apa yang boleh di-upgrade kemudian
- estimated monthly range based on usage
- first 3 actions after login

## Onboarding Flow Steps

### Step 1 - Survey Entry

- user nampak modal atau pop-up ringkas sebelum login
- user pilih role, industry, team size, channel utama, dan AI mode
- sistem simpan jawapan awal untuk scoring package

### Step 2 - Login

- user login guna email atau Google
- selepas auth berjaya, sistem bawa user ke setup yang sudah dipersonalisasi

### Step 3 - Package Recommendation

- sistem tunjuk plan yang dicadangkan
- sistem terangkan sebab plan itu dipilih
- user boleh terus terima atau naikkan plan

### Step 4 - Channel Setup

- user aktifkan channel yang relevan sahaja dahulu
- user boleh skip connector lain untuk setup kemudian

### Step 5 - First Value Moment

- dashboard tunjuk task priority, leads, reminder, dan draft AI pertama
- user nampak value dalam beberapa minit, bukan selepas setup panjang

### Step 6 - Expand Later

- user boleh tambah automation, more channels, dan accounting features bila perlu
- upgrade path kekal jelas dari Starter ke Elite ke Enterprise

## Decision Engine Outline

### Inputs Stored

- role
- industry
- team size
- main channel
- secondary channels
- AI mode
- reminder mode
- workflow complexity
- permission needs
- SLA needs

### Output Stored

- recommended package
- confidence score
- first activated channel
- first enabled automation set
- suggested onboarding path

### Pseudo Rule Order

1. if `permission needs` or `SLA needs` or `workflow complexity = high`, recommend `Enterprise`
2. else if `team size >= 2` and `channel count >= 2`, recommend `Elite`
3. else recommend `Starter`
4. if score is near threshold, show 2 plan options with the reason for upgrade

### Data Behaviour

- score should be saved in user profile metadata
- recommendation should be editable by admin for edge cases
- survey answers should remain useful even if user skips some optional questions
- confidence should be lower when user leaves too many fields blank

### Persistence Map

- `public.profiles` stores survey answers, persona, language, region, and onboarding step
- `public.subscriptions` stores the active package code and billing provider state
- `public.entitlements` stores the effective limits used by the app runtime
- `public.usage_meters` stores monthly counters for AI, email, and connector usage
- the UI should read the recommendation from profile metadata until billing is confirmed
- once payment is active, server-side entitlement resolution becomes the source of truth

## Login Options

- email
- Google OAuth

### Login Rule

- user boleh guna email sendiri
- user juga boleh guna domain Work2U untuk email sending jika tidak ada domain sendiri
- login tidak patut paksa connector aktif serentak; user boleh pilih apa yang dia mahu aktifkan dulu

## Auth Flow

- email login dihantar sebagai magic link
- Google guna OAuth redirect
- selepas session sah, profile akan disimpan ke `public.profiles`
- jika profile belum lengkap, user akan terus dibawa ke onboarding setup
- role semasa akan menentukan menu yang boleh dibuka
- AI assistant setup perlu minta pengguna sambung akaun AI sendiri jika mahu guna mode penuh
- kalau user tidak sambung akaun AI sendiri, Work2U masih boleh beri assist mode terhad atau suggestion-only

## First Login Behaviour

- row profile akan diwujudkan untuk user baru
- onboarding step bermula pada `survey`
- selepas setup disimpan, `setup_complete` akan bertukar kepada `true`
- super admin boleh ditetapkan melalui data trusted server-side, bukan dari client

## Persona Wizard

Setup screen sekarang perlu tunjuk playbook ikut persona supaya user nampak flow yang akan dibina untuk dia.

### Property Agent

- lead capture
- viewing schedule
- quotation follow-up
- reminder ke client

### Insurance Agent

- renewal tracking
- document checklist
- policy follow-up
- compliance-friendly draft

### Freelancer

- brief capture
- quotation
- milestone reminder
- invoice follow-up

### Corporate Team

- assignment by department
- approval flow
- internal reminder
- reporting

## Member Management

- member editor perlu sync ke Supabase
- owner atau role yang dibenarkan sahaja boleh tambah dan edit member
- member list patut ikut workspace semasa
- role `User` tidak boleh buka access management

## Dashboard Principle

Dashboard kena `priority-first`, bukan widget-first.

### Yang patut nampak awal

- task paling penting hari ini
- lead yang perlu reply
- invoice overdue
- meeting next
- AI suggestions
- connector status

### Priority Layers

1. hari ini perlu buat apa
2. siapa perlu follow-up
3. apa yang pending payment / approval
4. tindakan mana boleh diserahkan kepada AI atau automation

## Communication Hub UX

Semua channel masuk satu tempat:

- email
- WhatsApp
- Telegram
- drafts
- scheduled
- failed / retry

### Layout cadangan

- left panel: inbox dan filter
- center panel: thread / conversation
- right panel: client info + AI assist + next action

## Client Timeline UX

Setiap client perlu ada timeline yang gabungkan:

- lead source
- message history
- task history
- service progress
- invoice / receipt
- document history
- AI summary
- next follow-up

## Client Portal UX

Client portal perlu berasingan daripada internal workspace.

### Fungsi portal

- view invoice
- download document
- view service status
- approve quotation
- pay bill
- upload file
- lihat update ringkas

## Channel Strategy UX

- `WhatsApp` untuk follow-up laju
- `Email` untuk formal dan dokumen
- `Telegram` untuk reminder dan status update murah

## AI UX

AI panel patut bantu:

- suggest reply
- rewrite tone
- summarize chat
- create action items

## Implementation Companion

- Onboarding and package routing flow: [Work2U Onboarding And Package Routing](./work2u-onboarding-package-routing.md)
- Post-deploy verification: [Work2U Smoke Test Checklist](./work2u-smoke-test-checklist.md)
- suggest next step
- build workflow dari idea user

### AI Modes

- `suggest-only` untuk user yang mahu semak manual sebelum hantar
- `semi-auto` untuk auto prepare tetapi perlukan approval
- `auto-send` untuk rules yang dibenarkan plan dan user setuju
- `bring-your-own-key` untuk user yang ada akaun AI sendiri dan mahu kawal kos

## UX Rules

- kurang klik
- kurang modal panjang
- satu tempat untuk priority
- jangan paksa semua connector masa onboarding
- ada pilihan `skip for now`

## Decision Status

- survey before login: yes
- login options: email, Google OAuth
- dashboard style: priority-first
- client portal: separate from internal workspace
