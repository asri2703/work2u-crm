# Studying Twenty CRM — what to borrow for Work2U

A read of [twentyhq/twenty](https://github.com/twentyhq/twenty), mapped to what
Work2U already has. Twenty is an open-source CRM built at a very different scale
from Work2U, so this is about ideas, not wholesale adoption — copying its stack
would be the wrong move for a lean product. Each section says what Twenty does,
then what it means for **this** codebase.

## What Twenty actually is (verified)

- **Stack:** React (Jotai state, Linaria styling, Lingui i18n) frontend · NestJS
  backend · PostgreSQL · GraphQL API · BullMQ + Redis for job queues · Nx
  monorepo · Docker Compose for self-hosting.
- **Packages:** `twenty-front`, `twenty-server`, `twenty-ui` (shared components),
  `twenty-shared`, `twenty-emails`, `twenty-cli`, `twenty-sdk`, `twenty-apps`,
  `twenty-zapier`, `twenty-docker`, `twenty-website`, `twenty-docs`.
- **Data model:** metadata-driven. Standard objects are **Person, Company,
  Opportunity, Task**. Custom objects and fields are created both through the UI
  and in code via a TypeScript SDK (`defineObject`). Relations connect objects;
  many-to-many uses junction objects. Everything is scoped to a **workspace**
  for multi-tenant isolation.
- **Workflows:** a visual builder with triggers, actions, branching, iterators,
  and email sending, on a credit-based consumption model.
- **Apps/plugins:** a TypeScript package can bundle data models + server logic +
  UI + AI agents, with role-based permissions and OAuth.

## The one idea worth the most: metadata-driven objects

Twenty does not hand-write a screen per record type. An object is **described as
data** (its fields, types, and relations), and the UI, API, and database schema
are generated from that description.

Work2U is already 80% of the way to needing this, and doesn't know it. The
dashboard's `D` object holds twelve hand-maintained collections — `tasks`,
`leads`, `clients`, `services`, `cases`, `invoices`, `expenses`, `payments`,
`receipts`, `quotes`, `channels`, `calendarEvents` — and each gets its own
hand-written renderer. `renderKanban` (tasks) and `renderPipeline` (leads) are
already near-duplicates of each other. Adding a new record type today means
copying a renderer, a form, and an edit path by hand.

**What to borrow:** a small object registry — plain data, no framework — that
describes each collection once:

```js
const OBJECTS = {
  tasks: {
    label: 'Task',
    stages: ['todo', 'progress', 'review', 'done'],   // drives the kanban
    fields: [
      { key: 'name', type: 'text', required: true },
      { key: 'priority', type: 'select', options: ['low','med','high'] },
      { key: 'due', type: 'date' },
      { key: 'tag', type: 'select', options: ['sales','ops','marketing'] },
      { key: 'notes', type: 'textarea' }
    ]
  },
  leads: { label: 'Lead', stages: ['new','contacted','qualified','converted'], fields: [ ... ] },
  // ...
};
```

One generic kanban renderer, one generic form builder, and one generic
edit/save path then serve every object. `renderKanban` and `renderPipeline`
collapse into one. New record types become a registry entry, not new code. This
is the single highest-leverage change and it needs **no** new dependency.

## Workspace isolation — Work2U already does this

Twenty scopes every record to a workspace. Work2U already prefixes every storage
key with the workspace id (`wsKey('tasks')` → `work2u-<wsId>-tasks`), and the
Supabase schema in `docs/work2u-master-deploy-bundle.sql` enforces the same with
`workspace_has_access(workspace_id)` in row-level security. This concept is
sound and matches Twenty — keep it, and make sure any new object carries a
`workspace_id` and an RLS policy the same way.

## Queue + worker — keep going the way the docs already point

Twenty runs background work through BullMQ. Work2U already has the shape of this:
`server.js` exposes `/api/work2u/outbound/jobs` and `/jobs/process`, and
`docs/product-patterns-from-twenty-openreply.md` already says to use a queue +
log pattern for sends and reminders. The direction is right. The gap is that the
current dev server processes jobs in-process; a real deployment needs a durable
queue (Supabase table + a scheduled processor, or a hosted queue) so retries and
rate limits survive restarts.

## Migration path to Supabase — the model lines up

Twenty is Postgres with per-workspace isolation. Work2U plans Supabase (also
Postgres, also RLS). The registry above maps cleanly onto tables: each object =
a table, each field = a column, each relation = a foreign key — which is exactly
what the SQL bundle already defines. So the registry is not throwaway
client-side scaffolding; it is the same shape the backend already expects, which
makes the eventual move from localStorage to Supabase mechanical rather than a
rewrite.

## What NOT to copy

- **Nx / NestJS / GraphQL / a 15-package monorepo.** That is right for a team
  building an extensible platform with third-party apps. Work2U is a focused
  product; a single server plus static pages is the correct scale, and adopting
  Twenty's infrastructure would add cost without adding product.
- **The code-first app/plugin SDK.** Only worth it once external developers need
  to extend Work2U — far past V1.
- **A credit-metered visual workflow builder.** Work2U's "suggest → semi-auto →
  auto" reminder modes already cover the V1 need; a full builder is later.

## Concrete next steps, in order

1. Introduce the `OBJECTS` registry and route `renderKanban` + `renderPipeline`
   through one generic renderer. Immediate payoff: less duplicated code, and
   drag-and-drop (just added to tasks) becomes free for leads and any pipeline.
2. Drive the add/edit forms from the same registry instead of per-type form HTML.
3. When moving off localStorage, generate the Supabase reads/writes from the
   registry so the field list has one source of truth.
4. Harden the outbound queue for durability before relying on it in production.

## Sources

- Repository: https://github.com/twentyhq/twenty
- Docs index: https://docs.twenty.com/llms.txt
