# Work2U Messaging Setup

_Rujukan cepat untuk isi env dan sambungkan Telegram + WhatsApp relay._

## 1. Telegram Bot

### Env vars

- `TELEGRAM_BOT_TOKEN`
- `TELEGRAM_WEBHOOK_SECRET`

### Endpoint

- inbound webhook: `POST /api/telegram/webhook`
- generic webhook: `POST /api/work2u/channel/webhook`

### Flow ringkas

1. Cipta bot melalui `@BotFather`.
2. Simpan token ke `TELEGRAM_BOT_TOKEN`.
3. Set webhook URL ke endpoint production atau local tunnel.
4. Hantar mesej pertama dari client supaya `chat_id` dan `username` disimpan.
5. Outbound reply boleh guna `username` selepas mapping `chat_id` terbentuk.

### Notes

- bot perlu menerima mesej pertama daripada user sebelum outbound direct reply boleh dihantar
- gunakan `TELEGRAM_WEBHOOK_SECRET` untuk semak payload inbound
- `work2u_bot` sesuai sebagai bot nama operasi, sementara `chat_id` disimpan pada client record

## 2. WhatsApp Baileys Relay

### Env vars

- `WHATSAPP_BAILEYS_ENDPOINT`
- `WHATSAPP_BAILEYS_TOKEN`
- `WHATSAPP_WEBHOOK_SECRET`

### Endpoint

- inbound webhook: `POST /api/whatsapp/webhook`
- generic webhook: `POST /api/work2u/channel/webhook`

### Flow ringkas

1. Jalankan relay Baileys sendiri.
2. Simpan URL relay ke `WHATSAPP_BAILEYS_ENDPOINT`.
3. Jika relay perlukan auth header, isi `WHATSAPP_BAILEYS_TOKEN`.
4. Hantar inbound event ke webhook Work2U supaya timeline client terbina.
5. Outbound message akan dihantar ke relay melalui endpoint ini.

## 3. Client Mapping

Work2U akan simpan mapping berikut bila webhook masuk:

- `chat_id`
- `username`
- `phone`
- `contact name`
- `thread id`

Lepas mapping wujud, client timeline akan tunjuk:

- inbound message
- outbound message
- task berkaitan
- invoice berkaitan

## 4. Minimum Setup Checklist

1. isi `TELEGRAM_BOT_TOKEN`
2. isi `TELEGRAM_WEBHOOK_SECRET`
3. isi `WHATSAPP_BAILEYS_ENDPOINT`
4. isi `WHATSAPP_BAILEYS_TOKEN` jika perlu
5. isi `WHATSAPP_WEBHOOK_SECRET`
6. test inbound satu mesej Telegram
7. test inbound satu mesej WhatsApp relay

## 5. Example Payloads

### Telegram webhook update

```json
{
  "channel": "telegram",
  "event": "message",
  "update": {
    "update_id": 10001,
    "message": {
      "message_id": 17,
      "date": 1735065600,
      "chat": {
        "id": 123456789,
        "username": "clientname",
        "first_name": "Client",
        "type": "private"
      },
      "from": {
        "id": 123456789,
        "username": "clientname",
        "first_name": "Client"
      },
      "text": "Hello Work2U"
    }
  },
  "workspaceName": "Work2U"
}
```

### WhatsApp Baileys relay event

```json
{
  "channel": "whatsapp",
  "event": "message",
  "data": {
    "key": {
      "id": "ABCD1234",
      "remoteJid": "60123456789@s.whatsapp.net"
    },
    "pushName": "Client Name",
    "message": {
      "conversation": "Hello Work2U"
    }
  },
  "from": "60123456789",
  "name": "Client Name",
  "message": "Hello Work2U",
  "workspaceName": "Work2U"
}
```

## 6. Webhook Lab In CRM

- open `Webhook Lab` from the CRM admin area
- paste payload JSON
- send it to `/api/telegram/webhook`, `/api/whatsapp/webhook`, or `/api/work2u/channel/webhook`
- inspect the raw response and the client timeline after the request returns
