# Work2U Communication Hub

_Dokumen rujukan untuk email, WhatsApp, Telegram, inbox unification, dan message routing._

## Objective

Bina communication hub yang:

- kumpulkan semua mesej dalam satu tempat
- kurangkan follow-up manual
- sesuai untuk automation
- kekal jelas ikut channel

## Scope

Dokumen ini fokus pada:

- channel strategy
- inbox structure
- outbound drafting
- message status
- channel routing
- connect and health state

## Channel Principles

- WhatsApp untuk conversational follow-up
- Email untuk formal dan dokumentasi
- Telegram untuk reminder dan bot-driven updates

## Inbox Structure

- all inbox
- WhatsApp
- Email
- Telegram
- drafts
- scheduled
- failed / retry
- hot leads
- awaiting reply

## Routing Rules

- hot leads masuk ke priority queue dulu
- overdue follow-up naik ke top of inbox
- invoice, receipt, dan quotation ikut channel paling sesuai untuk client
- scheduled messages perlu jelas status dan masa dihantar
- AI boleh cadang reply, tetapi user tetap boleh approve sebelum send

## Message Flow

1. message masuk
2. sistem kenal client
3. AI baca context
4. AI cadang reply
5. user edit atau approve
6. message dihantar
7. timeline client dikemaskini
8. reminder atau task boleh dicipta jika perlu

## Setup Sequence

1. user pilih channel yang nak aktif semasa onboarding
2. user connect email, WhatsApp, atau Telegram ikut keutamaan
3. sistem semak health setiap connector
4. inbox utama dipapar ikut channel dan priority
5. user simpan template dan reply draft
6. automation hanya hidup selepas connector lulus health check

## Health and Escalation

- connector status mesti sentiasa jelas
- failed send perlu ada retry path
- retry terlalu banyak perlu ditandai sebagai issue
- failed message tidak boleh hilang tanpa audit trail
- auto-send hanya untuk rule dan plan yang sesuai

## AI Assist Pattern

- suggest reply
- rewrite tone
- summarize thread
- extract action items
- propose next follow-up time
- create follow-up task from message

## Telegram Strategy

- guna `work2u_bot`
- bot sebagai opt-in channel
- simpan `chat_id` dan `user_id`
- username hanya metadata

## WhatsApp Strategy

- connection ikut device/session
- QR or link-device flow
- connector health wajib jelas

## Email Strategy

- support own domain
- support Work2U managed sending jika perlu
- sesuai untuk invoice, receipt, quotation, report

## Message Status

- draft
- scheduled
- sent
- delivered
- read
- replied
- failed
- retrying

## Non-goals

- membina channel sendiri tanpa integration
- manual inbox berasingan untuk setiap channel

## Decision Status

- unified inbox: yes
- channel support: WhatsApp, email, Telegram
- Telegram: bot-led flow
- WhatsApp: session/device-led flow
- AI assist: suggestion-first with approval option
- routing: priority-first, not channel-first
