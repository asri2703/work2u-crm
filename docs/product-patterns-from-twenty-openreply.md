# Product patterns to borrow

This note captures the product and architecture ideas we should adapt for Work2U without copying the projects directly.

## From Twenty

- Treat CRM data as explicit objects instead of one big generic table.
- Keep objects, views, and workflows versionable so the product can evolve safely.
- Expose a strong API and developer-facing surface so automations stay maintainable.
- Make the CRM feel like a buildable platform, not only a static app.

## From OpenReply

- Separate the web app from the long-running worker.
- Use queues for outgoing jobs, retries, and rate-limited sends.
- Log every send, skip, and failure so support and debugging stay easy.
- Keep the dashboard mobile-friendly because operators will use it on phones.
- Use templates and presets so users can start fast instead of building every flow from zero.

## Work2U direction

- Landing stays on `work2u.io`.
- CRM and onboarding stay on `crm.work2u.io`.
- Registration happens inside the CRM, not on the public landing.
- Internal calendar stays the default scheduling layer for V1.
- Messaging, reminders, and future automation should follow a queue + log pattern.
- Lead, client, task, case, and service records should behave like product objects that can be extended later.

