# Work2U AI Strategy

_Dokumen rujukan untuk peranan AI, guardrails, memory, dan usage control._

## Objective

Jadikan AI sebagai lapisan utama yang:

- bantu draft mesej
- bantu follow-up
- bantu user buat keputusan
- bantu user terjemah idea jadi workflow
- kekal terkawal dari segi kos dan risiko

## Scope

Dokumen ini fokus pada:

- AI roles
- AI modes
- guardrails
- AI memory
- quota and cost control
- AI use cases

## AI Roles

### AI Assistant

Fokus:

- draft reply
- summarize thread
- rewrite tone
- translate language

### AI Agent

Fokus:

- follow-up automation
- reminder suggestion
- channel routing
- task creation suggestion

### AI Business Copilot

Fokus:

- pecahkan idea jadi workflow
- bantu susun process
- cadang langkah implementasi
- bantu user bina flow bisnes

## AI Modes

- suggest only
- draft only
- semi-auto
- auto-send for approved rules

## Guardrails

- default bukan auto-send
- log semua AI action
- hadkan usage ikut plan
- user boleh set tone dan language
- auto-send hanya untuk rules yang user approve

## AI Memory

AI patut simpan context per client:

- last conversation summary
- preferred tone
- preferred channel
- next action
- urgency
- history notes

## Cost Control

Backend AI perlu track:

- workspace usage
- user usage
- number of calls
- model used
- monthly credits

## AI Use Cases

- reply draft untuk WhatsApp
- formal email draft
- follow-up suggestion
- daily digest
- lead classification
- sentiment detection
- workflow planning

## Non-goals

- fully autonomous AI tanpa approval
- heavy multi-agent system di v1
- AI usage dalam Starter tetap quota-based

## Decision Status

- AI positioning: assistant first, automation second
- AI control: quota-based
- AI default: suggest/draft before send
