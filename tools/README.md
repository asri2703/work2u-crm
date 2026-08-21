# Redesign tools

Run all of these from the repository root, not from this folder:

```bash
node tools/verify-redesign.js
```

## Ongoing

**`gen-docs.js`** — regenerates `docs/index.new.html` from the contents of
`docs/`. Titles and one-line summaries are read out of each file, and entries
are sorted into seven groups by filename pattern.

Run it whenever a document is added, removed, or renamed. The hand-maintained
index it replaces had drifted to listing 24 of 70 files, and the point of
generating it is that it cannot drift again.

**`verify-redesign.js`** — checks every redesigned page and stylesheet:

- HTML tags balance (script blocks are excluded, because the dashboard's JS
  builds markup as strings and a naive tag counter walks straight into it)
- every inline `<script>` parses
- every `getElementById` in a page has a matching element
- no page still references the old 396KB raster logo or favicon
- every page uses the shared `work2u-theme` storage key
- internal `#anchor` links point at ids that exist
- CSS braces balance
- every `--w2u-*` token referenced anywhere is declared in `assets/w2u.css`

Run it after editing any redesigned file. Exits non-zero on failure, so it
works as a pre-commit or CI step.

## One-shot

These produced the redesigned files from the originals. They are kept so the
transform is reviewable, and so it can be re-run if an original changes before
the `.new` files are promoted.

**`gen-legal.js`** — rebuilds the three legal pages. Copies body content
verbatim and swaps only the shell, dropping the old brand lockup and footer.
Reports a word count before and after so nothing can silently disappear.

**`gen-app-css.js`** — rebuilds `work2u/styles.new.css`. Remaps the app's own
palette variables onto the shared tokens and converts the leftover
glassmorphism `rgba()` values by context, since the same colour means
different things in a `border` than in a `background`.

**`gen-dashboard.js`** — rebuilds `crm/dashboard.new.html`. Remaps the palette
and moves brand and status colours onto a plain `:root`, fixing the case where
switching to dark mode left `--primary`, `--accent`, `--green`, `--red`, and
`--amber` undefined.

Re-running a one-shot script overwrites its `.new` file and discards any edits
made to it by hand.
