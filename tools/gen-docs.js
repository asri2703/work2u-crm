/* Jana hab docs daripada direktori docs/ itu sendiri.
 * Index lama ditulis tangan dan hanya menyenaraikan 24 daripada 70 fail.
 * Menjana daripada cakera bermakna ia tidak boleh jadi basi lagi.
 */
const fs = require('fs');
const path = require('path');

const DOCS = 'docs';

/* Kumpulan dipadankan mengikut urutan - padanan pertama menang, jadi
 * corak yang lebih khusus mesti didahulukan. */
const GROUPS = [
  { id: 'start',    title: 'Start here',
    blurb: 'The three documents that explain what Work2U is and what gets built next.',
    match: /^(index\.md|changelog\.md|work2u-product-spec-v1|work2u-v1-build-order|work2u-launch-spec-v1)/ },

  { id: 'product',  title: 'Product & strategy',
    blurb: 'Positioning, pricing, packaging, and the backlog behind the roadmap.',
    match: /^work2u-(product-brainstorm|ai-strategy|pricing-packaging|mvp-backlog|implementation-backlog|ux-onboarding|client-portal|communication-hub|onboarding-package-routing|entitlement-map|roles-permissions|v1-google-free-plan|billing-onepager|billing-revenue-pnl)/ },

  { id: 'arch',     title: 'Architecture & API',
    blurb: 'How the pieces fit: services, routes, contracts, and integrations.',
    match: /^(work2u-(backend-architecture|split-project-architecture|data-api-map|email-routes|internal-calendar|messaging-setup|webhook-setup|expense-api-contract|expense-data-contract|expense-automation)|integration-notes|product-patterns)/ },

  { id: 'expense',  title: 'Expenses & receipts',
    blurb: 'The receipt vault and expense dashboard, from schema to wireframe.',
    match: /^work2u-expense-/ },

  { id: 'calendar', title: 'Internal calendar',
    blurb: 'Events, reminders, and connection tables for the scheduling layer.',
    match: /^work2u-internal-calendar/ },

  { id: 'db',       title: 'Database & migrations',
    blurb: 'Schema, row-level security, and deploy bundles. Run steps in order.',
    match: /\.sql$|^work2u-(mvp-schema|supabase-schema|schema-rls-plan|mvp-schema-review)/ },

  { id: 'ops',      title: 'Setup, deploy & launch',
    blurb: 'Environment values, deploy checklists, and pre-launch verification.',
    match: /^work2u-(env-|supabase-|master-deploy|launch-|smoke-test|sprint-checklist|integration-checklist|google-oauth-checklist|final-launch)/ },
];

const FALLBACK = { id: 'other', title: 'Other references', blurb: 'Everything else in the docs folder.' };

/* Baca tajuk dan satu baris ringkasan dari setiap fail. */
function describe(file) {
  const full = path.join(DOCS, file);
  const ext = path.extname(file).toLowerCase();
  let title = null, blurb = null;

  let text = '';
  try { text = fs.readFileSync(full, 'utf8'); } catch (e) { return { title: file, blurb: '' }; }

  if (ext === '.md') {
    const h = text.match(/^#\s+(.+)$/m);
    if (h) title = h[1].trim();
    /* Perenggan pertama selepas tajuk, melangkau baris kosong dan tajuk lain */
    const afterHeading = h ? text.slice(text.indexOf(h[0]) + h[0].length) : text;
    const para = afterHeading.split('\n').map(l => l.trim())
      .find(l => l && !l.startsWith('#') && !l.startsWith('|') && !l.startsWith('---')
                 && !l.startsWith('```') && !l.startsWith('- ') && !l.startsWith('* '));
    if (para) blurb = para.replace(/[*_`\[\]]/g, '').slice(0, 150);
  } else if (ext === '.sql') {
    const c = text.match(/^--\s*(.+)$/m);
    if (c) blurb = c[1].trim().slice(0, 150);
  }

  if (!title) {
    title = file.replace(/^work2u-/, '').replace(/\.(md|sql)$/, '')
                .replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  }
  return { title, blurb: blurb || '' };
}

const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;')
                          .replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const files = fs.readdirSync(DOCS)
  .filter(f => /\.(md|sql)$/i.test(f))
  .sort();

/* Tugaskan setiap fail kepada tepat satu kumpulan */
const buckets = new Map(GROUPS.map(g => [g.id, []]));
buckets.set(FALLBACK.id, []);
for (const f of files) {
  const g = GROUPS.find(g => g.match.test(f));
  buckets.get(g ? g.id : FALLBACK.id).push(f);
}

const allGroups = [...GROUPS, FALLBACK].filter(g => buckets.get(g.id).length);

const MARK = `<svg class="w2u-logo" viewBox="0 0 212 46" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="work2u — Manage, Collaborate, Grow"><polygon points="8,7 33,20 8,20" fill="#2b6bf0"/><polygon points="8,20 33,20 8,33" fill="#14b8a6"/><polygon points="8,7 16.5,12.4 16.5,27.6 8,33" fill="#ff7a1b"/><text x="45" y="26" font-family="Inter,-apple-system,BlinkMacSystemFont,Segoe UI,sans-serif" font-size="22" font-weight="800" letter-spacing="-0.6" fill="currentColor">work2u</text><text x="46" y="40" font-family="Inter,-apple-system,BlinkMacSystemFont,Segoe UI,sans-serif" font-size="8.2" font-weight="600" letter-spacing="0.4" fill="currentColor" opacity="0.72">Manage<tspan fill="#2b6bf0"> • </tspan>Collaborate<tspan fill="#ff7a1b"> • </tspan>Grow</text></svg>`;

function card(f) {
  const { title, blurb } = describe(f);
  const kb = (fs.statSync(path.join(DOCS, f)).size / 1024).toFixed(1);
  const isSql = f.toLowerCase().endsWith('.sql');
  return `        <a class="docs-item" href="./${esc(f)}">
          <span class="docs-item-top">
            <span class="docs-item-title">${esc(title)}</span>
            <span class="w2u-badge${isSql ? '' : ' w2u-badge-accent'}">${isSql ? 'SQL' : 'MD'}</span>
          </span>
          ${blurb ? `<span class="docs-item-blurb">${esc(blurb)}</span>` : ''}
          <span class="docs-item-file">${esc(f)} · ${kb} KB</span>
        </a>`;
}

const nav = allGroups.map(g =>
  `        <a href="#${g.id}" class="docs-toc-link">${esc(g.title)} <span>${buckets.get(g.id).length}</span></a>`
).join('\n');

const sections = allGroups.map(g => `
      <section class="docs-group" id="${g.id}">
        <div class="docs-group-head">
          <h2 class="w2u-h2">${esc(g.title)}</h2>
          <p class="w2u-small">${esc(g.blurb)}</p>
        </div>
        <div class="docs-list">
${buckets.get(g.id).map(card).join('\n')}
        </div>
      </section>`).join('\n');

const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Documentation — Work2U</title>
<meta name="description" content="Every Work2U reference document: product spec, architecture, schema, deploy checklists, and launch notes.">
<meta name="theme-color" content="#ffffff" media="(prefers-color-scheme: light)">
<meta name="theme-color" content="#020617" media="(prefers-color-scheme: dark)">
<link rel="icon" type="image/svg+xml" href="../assets/w2u-favicon.svg">

<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">

<link rel="stylesheet" href="../assets/w2u.css">

<script>
  (function () {
    try {
      var t = localStorage.getItem('work2u-theme');
      if (t === 'dark' || t === 'light') document.documentElement.setAttribute('data-theme', t);
    } catch (e) {}
  })();
</script>

<style>
.docs-layout {
  display: grid;
  grid-template-columns: 220px minmax(0, 1fr);
  gap: var(--w2u-s12);
  align-items: start;
  padding-block: var(--w2u-s12) var(--w2u-s20);
}
@media (max-width: 900px) {
  .docs-layout { grid-template-columns: minmax(0, 1fr); gap: var(--w2u-s8); }
  .docs-toc { position: static; }
}

.docs-toc { position: sticky; top: calc(var(--w2u-nav-h) + var(--w2u-s6)); }
.docs-toc h4 {
  margin-bottom: var(--w2u-s3);
  font-size: var(--w2u-text-sm);
  font-weight: var(--w2u-weight-semi);
  letter-spacing: var(--w2u-track-wide);
  text-transform: uppercase;
  color: var(--w2u-text-subtle);
}
.docs-toc-link {
  display: flex; align-items: center; justify-content: space-between; gap: var(--w2u-s2);
  padding: var(--w2u-s2) var(--w2u-s3);
  border-radius: var(--w2u-r-md);
  font-size: var(--w2u-text-md);
  color: var(--w2u-text-muted);
}
.docs-toc-link:hover { background: var(--w2u-bg-muted); color: var(--w2u-text); text-decoration: none; }
.docs-toc-link span {
  font-size: var(--w2u-text-xs);
  font-variant-numeric: tabular-nums;
  color: var(--w2u-text-subtle);
}

.docs-group + .docs-group { margin-top: var(--w2u-s16); }
.docs-group-head { margin-bottom: var(--w2u-s6); }
.docs-group-head p { margin-top: var(--w2u-s2); max-width: 62ch; }

.docs-list {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--w2u-s3);
}
@media (max-width: 700px) { .docs-list { grid-template-columns: minmax(0, 1fr); } }

.docs-item {
  display: flex; flex-direction: column; gap: var(--w2u-s2);
  padding: var(--w2u-s4);
  border: 1px solid var(--w2u-border);
  border-radius: var(--w2u-r-md);
  background: var(--w2u-surface);
  color: inherit;
  transition: border-color var(--w2u-dur-fast) var(--w2u-ease),
              box-shadow var(--w2u-dur-fast) var(--w2u-ease);
}
.docs-item:hover {
  border-color: var(--w2u-border-strong);
  box-shadow: var(--w2u-shadow-md);
  text-decoration: none;
}
.docs-item-top { display: flex; align-items: flex-start; justify-content: space-between; gap: var(--w2u-s3); }
.docs-item-title {
  font-size: var(--w2u-text-md);
  font-weight: var(--w2u-weight-semi);
  color: var(--w2u-text);
  line-height: var(--w2u-leading-snug);
}
.docs-item-blurb {
  font-size: var(--w2u-text-md);
  color: var(--w2u-text-muted);
  line-height: var(--w2u-leading-snug);
  display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;
}
.docs-item-file {
  font-family: var(--w2u-font-mono);
  font-size: var(--w2u-text-xs);
  color: var(--w2u-text-subtle);
  word-break: break-all;
}
</style>
</head>
<body>

<a class="w2u-skip" href="#main">Skip to content</a>

<nav class="w2u-nav">
  <div class="w2u-nav-inner">
    <a href="../" class="w2u-brand" aria-label="Work2U home">
      ${MARK}
    </a>
    <div class="w2u-nav-links">
      <a href="../#features" class="w2u-nav-link">Features</a>
      <a href="../#pricing" class="w2u-nav-link">Pricing</a>
      <a href="./index.html" class="w2u-nav-link is-active">Docs</a>
    </div>
    <div class="w2u-nav-actions">
      <button type="button" class="w2u-theme-toggle" id="theme-toggle" aria-label="Toggle colour theme">
        <svg class="w2u-icon-sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true">
          <circle cx="12" cy="12" r="4"/>
          <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>
        </svg>
        <svg class="w2u-icon-moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/>
        </svg>
      </button>
      <a href="../crm" class="w2u-btn w2u-btn-primary w2u-btn-sm">Open CRM</a>
    </div>
  </div>
</nav>

<header class="w2u-section-tight" style="background:var(--w2u-bg-subtle);border-bottom:1px solid var(--w2u-border);">
  <div class="w2u-container">
    <span class="w2u-eyebrow">Documentation</span>
    <h1 class="w2u-h1 w2u-mt-2">Product direction, build order, and launch readiness</h1>
    <p class="w2u-lead w2u-mt-4" style="max-width:60ch;">Every reference in one place — ${files.length} documents across ${allGroups.length} areas. This index is generated from the docs folder, so a new file appears here as soon as it is added.</p>
  </div>
</header>

<main id="main">
  <div class="w2u-container docs-layout">

    <aside class="docs-toc">
      <h4>Sections</h4>
      <nav>
${nav}
      </nav>
    </aside>

    <div>
${sections}
    </div>

  </div>
</main>

<footer class="w2u-footer">
  <div class="w2u-container">
    <div class="w2u-footer-bottom" style="margin-top:0;padding-top:0;border-top:none;">
      <span>&copy; 2026 Work2U — a product by Saga X Ventures (NS0246319-H)</span>
      <span><a href="../">Back to work2u.io</a></span>
    </div>
  </div>
</footer>

<script>
  (function () {
    var root = document.documentElement;
    var toggle = document.getElementById('theme-toggle');
    if (!toggle) return;
    toggle.addEventListener('click', function () {
      var explicit = root.getAttribute('data-theme');
      var current = explicit || (window.matchMedia &&
        window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
      var next = current === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      try { localStorage.setItem('work2u-theme', next); } catch (e) {}
    });
  })();
</script>

</body>
</html>
`;

fs.writeFileSync(path.join(DOCS, 'index.html'), html);

console.log('docs/index.html dijana');
console.log('  fail disenaraikan :', files.length, '(index lama: 24)');
allGroups.forEach(g => console.log('    ' + g.title.padEnd(28) + buckets.get(g.id).length));
