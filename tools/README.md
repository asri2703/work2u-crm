# Redesign tools

Run all of these from the repository root, not from this folder:

```bash
node tools/verify-redesign.js
```

The redesign has been promoted: the rebuilt pages now live at their real
filenames, and the `.new` copies are gone. The pre-redesign originals are in
git at commit `1747ebd`.

```bash
git show 1747ebd:index.html > /tmp/index-before.html   # recover any original
```

## Ongoing

**`gen-docs.js`** — regenerates `docs/index.html` from the contents of `docs/`.
Titles and one-line summaries are read out of each file, and entries are sorted
into seven groups by filename pattern.

Run it whenever a document is added, removed, or renamed. The hand-maintained
index it replaced had drifted to listing 24 of 70 files, and the point of
generating it is that it cannot drift again.

Edit the generator, never `docs/index.html` — an edit to the output is silently
discarded the next time this runs. That has already happened once, to a theme
storage key.

**`verify-redesign.js`** — checks every page and stylesheet:

- HTML tags balance (script blocks are excluded, because the dashboard's JS
  builds markup as strings and a naive tag counter walks straight into it)
- every inline `<script>` parses
- every `getElementById` in a page has a matching element
- no page references the old 396KB raster logo or favicon
- every page uses the shared `work2u-theme` storage key
- internal `#anchor` links point at ids that exist
- CSS braces balance
- every `--w2u-*` token referenced anywhere is declared in `assets/w2u.css`

Run it after editing any redesigned file. It exits non-zero on failure, so it
works as a pre-commit or CI step.

## One-shot — already applied

These converted the original files. Each now refuses to run, because after
promotion the source and the output are the same file, and transforming an
already-transformed file corrupts it: radii get mapped twice, `rgba()` values
get converted twice, the palette block gets replaced with itself.

Each prints the exact `git show` command to recover its original first.

**`gen-legal.js`** — rebuilt the three legal pages. Copies body content verbatim
and swaps only the shell, dropping the old brand lockup and footer. Reports a
word count before and after so nothing can silently disappear.

**`gen-app-css.js`** — rebuilt `work2u/styles.css`. Remapped the app's own
palette variables onto the shared tokens and converted the leftover
glassmorphism `rgba()` values by context, since the same colour means different
things in a `border` than in a `background`.

**`gen-dashboard.js`** — rebuilt `crm/dashboard.html`. Remapped the palette and
moved brand and status colours onto a plain `:root`, fixing the case where
switching to dark mode left `--primary`, `--accent`, `--green`, `--red`, and
`--amber` undefined across 78 declarations.

They are kept so the conversion stays reviewable rather than being a pile of
generated files nobody can check.

## Known loose ends

- `assets/work2u-logo.svg` and `assets/work2u-favicon.svg` are 396KB each and
  no longer referenced by anything. They still ship on deploy. Safe to remove
  once you are sure the original artwork is not needed elsewhere.
- `openWork2USurvey()` in `index.html` redirects straight to `/crm` and never
  opens the survey overlay, so that modal is dead code. Its markup and ids are
  intact, so re-enabling it is a one-function change.
- `terms-of-service.html` gives the company address as 50470 Kuala Lumpur and
  uses `@sagaxventures.com` contacts, while every other page says 70450
  Seremban and `@work2u.io`.
## Fixed, but worth knowing about

`server.js` used to serve any file in the project root. `GET /.env.local`
returned the file with live Supabase, Stripe, Billplz, and Resend keys in it,
and `/.git/HEAD` was readable too. Dot-segments are now refused, with
`.well-known` excepted.

Production was never exposed — Vercel does not run this server and
`.vercelignore` keeps env files out of the deployment — and `.env.local` has
never been committed. But the server binds to `0.0.0.0`, so anyone on the same
network could have read those keys while `node server.js` was running.

**If that server was ever run on a shared or untrusted network — a coworking
space, a café, a shared office — rotate these:**

- `SUPABASE_SERVICE_ROLE_KEY` (this one bypasses row-level security)
- `STRIPE_SECRET_KEY`
- `BILLPLZ_SECRET_KEY` and `BILLPLZ_X_SIGNATURE_KEY`
- `RESEND_API_KEY`

On a home network you alone use, the risk is low.

The bind address was left as-is rather than narrowed to localhost, since
testing the mobile layout from a phone on the same network is a normal thing
to want and the leak is closed either way.
