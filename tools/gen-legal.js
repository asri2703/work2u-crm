/* Jana muka undang-undang yang direka semula daripada yang asal.
 * Kandungan dipindahkan perkataan-demi-perkataan: kita hanya menukar
 * bekasnya. Satu-satunya benda yang dibuang ialah blok jenama dan footer
 * lama, kerana cangkerang baru menyediakannya.
 */
const fs = require('fs');
const path = require('path');

const PAGES = [
  { src: 'privacy-policy.html',   out: 'privacy-policy.html',
    title: 'Privacy Policy — Work2U',
    desc: 'How Work2U collects, uses, and protects your data.' },
  { src: 'terms-of-service.html', out: 'terms-of-service.html',
    title: 'Terms of Service — Work2U',
    desc: 'The terms governing your use of Work2U.' },
  { src: 'service-policy.html',   out: 'service-policy.html',
    title: 'Service Policy — Work2U',
    desc: 'Scope, availability, billing, and support commitments for Work2U.' },
];

const MARK = `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true" style="color:var(--w2u-accent)">
        <rect width="24" height="24" rx="6" fill="currentColor"/>
        <path d="M5.9 8.2 L9.1 16.2 L12 10.4 L14.9 16.2 L18.1 8.2" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>`;

function shellTop(p) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${p.title}</title>
<meta name="description" content="${p.desc}">
<meta name="theme-color" content="#ffffff" media="(prefers-color-scheme: light)">
<meta name="theme-color" content="#020617" media="(prefers-color-scheme: dark)">
<link rel="icon" type="image/svg+xml" href="/assets/w2u-favicon.svg">

<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">

<link rel="stylesheet" href="/assets/w2u.css">
<link rel="stylesheet" href="/assets/w2u-legal.css">

<script>
  (function () {
    try {
      var t = localStorage.getItem('w2u-theme');
      if (t === 'dark' || t === 'light') document.documentElement.setAttribute('data-theme', t);
    } catch (e) {}
  })();
</script>
</head>
<body>

<a class="w2u-skip" href="#main">Skip to content</a>

<nav class="w2u-nav" id="site-nav">
  <div class="w2u-nav-inner">
    <a href="/" class="w2u-brand" aria-label="Work2U home">
      ${MARK}
      <span>Work2U</span>
    </a>
    <div class="w2u-nav-links" id="nav-links">
      <a href="/privacy-policy.html" class="w2u-nav-link">Privacy</a>
      <a href="/terms-of-service.html" class="w2u-nav-link">Terms</a>
      <a href="/service-policy.html" class="w2u-nav-link">Service policy</a>
      <a href="/docs" class="w2u-nav-link">Docs</a>
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
      <a href="/" class="w2u-btn w2u-btn-secondary w2u-btn-sm">Back to site</a>
    </div>
  </div>
</nav>

<main id="main" class="legal-body">
  <div class="w2u-container">
    <article class="w2u-prose">
`;
}

const SHELL_BOTTOM = `
    </article>
  </div>
</main>

<footer class="w2u-footer">
  <div class="w2u-container">
    <div class="w2u-footer-bottom" style="margin-top:0;padding-top:0;border-top:none;">
      <span>&copy; 2026 Work2U — a product by Saga X Ventures (NS0246319-H)</span>
      <span>
        <a href="/privacy-policy.html">Privacy</a> ·
        <a href="/terms-of-service.html">Terms</a> ·
        <a href="/service-policy.html">Service policy</a>
      </span>
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
      try { localStorage.setItem('w2u-theme', next); } catch (e) {}
    });
  })();
</script>

</body>
</html>
`;

let failures = 0;

for (const p of PAGES) {
  const raw = fs.readFileSync(p.src, 'utf8');

  const bodyMatch = raw.match(/<body[^>]*>([\s\S]*)<\/body>/i);
  if (!bodyMatch) { console.log(`RALAT ${p.src}: <body> tak dijumpai`); failures++; continue; }
  let inner = bodyMatch[1];

  /* Pengawal: selepas promosi, sumber ialah output. */
  if (inner.includes('w2u-prose')) {
    console.error('SUDAH DITRANSFORMASI: ' + p.src + ' sudah menggunakan cangkerang baru.');
    console.error('Skrip ini sekali-jalan dan telah pun digunakan.');
    console.error('Untuk menjalankannya semula, dapatkan semula yang asal dahulu:');
    console.error('  git show 1747ebd:' + p.src + ' > ' + p.src);
    failures++;
    continue;
  }

  const before = inner.length;

  // Blok jenama lama (logo gradien ungu/merah jambu) - cangkerang baru
  // sudah ada jenama dalam nav.
  inner = inner.replace(/<div class="brand">[\s\S]*?<\/div>\s*<\/div>/i, (m) =>
    m.includes('brand-name') ? '' : m);
  inner = inner.replace(/<div class="brand">[\s\S]*?brand-name[^<]*<\/span>\s*<\/div>/i, '');

  // Footer lama - cangkerang baru menyediakan satu
  inner = inner.replace(/<footer>[\s\S]*?<\/footer>/i, '');

  const out = shellTop(p) + inner.trim() + SHELL_BOTTOM;
  fs.writeFileSync(p.out, out);

  // Kiraan teks mesti kekal - inilah cek bahawa tiada ayat undang-undang hilang
  const strip = (s) => s.replace(/<script[\s\S]*?<\/script>/gi, '')
                        .replace(/<style[\s\S]*?<\/style>/gi, '')
                        .replace(/<[^>]+>/g, ' ')
                        .replace(/\s+/g, ' ').trim();
  const srcText = strip(bodyMatch[1]);
  const outText = strip(inner);
  const srcWords = srcText.split(' ').length;
  const outWords = outText.split(' ').length;

  console.log(`${p.out}`);
  console.log(`  markup dibuang : ${before - inner.length} aksara (jenama + footer lama)`);
  console.log(`  perkataan      : ${srcWords} -> ${outWords} (beza ${srcWords - outWords})`);
}

process.exit(failures ? 1 : 0);
