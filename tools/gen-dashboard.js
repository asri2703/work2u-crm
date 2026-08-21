/* Bina crm/dashboard.new.html daripada dashboard.html sedia ada.
 *
 * Dua perkara berlaku di sini:
 *
 * 1. Palet dipetakan ke token w2u supaya dashboard sepadan dengan tapak awam.
 * 2. Satu bug sebenar dibetulkan. :root[data-theme="light"] dan
 *    :root[data-theme="dark"] ialah pemilih adik-beradik, jadi tiada satu
 *    pun mengalir ke dalam yang lain. Blok gelap tidak pernah
 *    mengisytiharkan --primary, --accent, --green, --red, atau --amber,
 *    jadi 78 pengisytiharan yang merujuknya kehilangan nilai sebaik
 *    pengguna bertukar ke dark mode. Warna jenama dan status kini duduk
 *    pada :root kosong, di mana kedua-dua tema boleh melihatnya.
 */
const fs = require('fs');

const SRC = 'crm/dashboard.html';
const OUT = 'crm/dashboard.html';

let h = fs.readFileSync(SRC, 'utf8');

/* Pengawal: sumber dan output kini fail yang sama, jadi menjalankan semula
 * terhadap output yang sudah ditransformasi akan merosakkannya. */
if (h.includes('var(--w2u-accent)')) {
  console.error('SUDAH DITRANSFORMASI: ' + SRC + ' sudah menggunakan token w2u.');
  console.error('Skrip ini sekali-jalan dan telah pun digunakan.');
  console.error('Untuk menjalankannya semula, dapatkan semula yang asal dahulu:');
  console.error('  git show 1747ebd:' + SRC + ' > ' + SRC);
  process.exit(1);
}

/* ---- 1. Muat design system sebelum gaya inline ------------------------- */
const styleOpen = '<style>';
const head = `<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
<link rel="icon" type="image/svg+xml" href="/assets/w2u-favicon.svg">
<link rel="stylesheet" href="/assets/w2u.css">
<style>`;
if (h.indexOf(styleOpen) === -1) { console.error('RALAT: <style> tak dijumpai'); process.exit(1); }
h = h.replace(styleOpen, head);

/* ---- 2. Ganti kedua-dua blok tema ------------------------------------- */
const NEW_VARS = `/* --------------------------------------------------------------------------
   Palet dipetakan ke design system dikongsi (/assets/w2u.css).
   Nama pembolehubah dashboard dikekalkan, jadi 219 rujukan var() di bawah
   terus berfungsi tanpa diubah.

   BAIKI: warna jenama dan status dahulunya hidup HANYA di dalam blok
   [data-theme="light"]. Kedua-dua blok tema ialah adik-beradik, jadi
   bertukar ke gelap meninggalkan --primary, --accent, --green, --red, dan
   --amber tidak tertakrif - 78 pengisytiharan kehilangan nilainya. Ia kini
   duduk pada :root kosong, di mana kedua-dua tema mewarisinya.
   -------------------------------------------------------------------------- */

:root {
  --primary:      var(--w2u-accent);
  --primary-dark: var(--w2u-accent-600);
  --accent:       var(--w2u-accent);
  --green:        var(--w2u-success);
  --red:          var(--w2u-danger);
  --amber:        var(--w2u-warning);
}

:root[data-theme="light"] {
  --bg:            var(--w2u-bg-subtle);
  --bg-2:          var(--w2u-bg);
  --surface:       var(--w2u-bg-muted);
  --surface-2:     var(--w2u-n200);
  --border:        var(--w2u-border);
  --border-bright: var(--w2u-border-strong);
  --ink:           var(--w2u-text);
  --ink-2:         var(--w2u-text-muted);
  --ink-3:         var(--w2u-text-subtle);
  --shadow:        var(--w2u-shadow-md);
  --shadow-sm:     var(--w2u-shadow-sm);
}

:root[data-theme="dark"] {
  --bg:            var(--w2u-bg);
  --bg-2:          var(--w2u-bg-subtle);
  --surface:       var(--w2u-surface);
  --surface-2:     var(--w2u-surface-hover);
  --border:        var(--w2u-border);
  --border-bright: var(--w2u-border-strong);
  --ink:           var(--w2u-text);
  --ink-2:         var(--w2u-text-muted);
  --ink-3:         var(--w2u-text-subtle);
  --shadow:        var(--w2u-shadow-md);
  --shadow-sm:     var(--w2u-shadow-sm);
  /* Aksen dicerahkan supaya ia lulus kontras pada permukaan gelap */
  --primary:       var(--w2u-accent-400);
  --primary-dark:  var(--w2u-accent);
}`;

const varRe = /:root\[data-theme="light"\]\s*\{[\s\S]*?\}\s*:root\[data-theme="dark"\]\s*\{[\s\S]*?\}/;
if (!varRe.test(h)) { console.error('RALAT: blok tema tak dijumpai'); process.exit(1); }
h = h.replace(varRe, NEW_VARS);

/* ---- 3. Selaraskan kunci storan tema dengan seluruh tapak -------------- */
const keyBefore = (h.match(/theme:\s*'work2u-theme'/g) || []).length;

/* ---- 4. Lapisan penindih ---------------------------------------------- */
const OVERRIDES = `

/* ==========================================================================
   Lapisan penindih - menjajarkan dashboard dengan tapak awam
   ========================================================================== */

body {
  font-family: var(--w2u-font);
  font-size: var(--w2u-text-base);
  line-height: var(--w2u-leading-normal);
  letter-spacing: var(--w2u-track-normal);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

h1, h2, h3, h4 {
  font-weight: var(--w2u-weight-semi);
  line-height: var(--w2u-leading-tight);
}
h1 { letter-spacing: var(--w2u-track-tight); }
h2, h3 { letter-spacing: var(--w2u-track-snug); }

/* Fokus mesti boleh nampak di setiap kawalan dashboard */
:focus-visible {
  outline: 2px solid var(--primary);
  outline-offset: 2px;
}

/* Angka sejajar merentas jadual, invois, dan kad KPI */
table, .amount, .metric, .stat, .kpi, .num, td { font-variant-numeric: tabular-nums; }

/* Jadual lebar skrol sendiri dan bukan menolak susun atur melebar */
.table-wrap, .table-scroll, .table-container {
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
}

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
`;

h = h.replace('</style>', OVERRIDES + '\n</style>');

fs.writeFileSync(OUT, h);

const before = fs.statSync(SRC).size;
console.log(OUT + ' dijana');
console.log('  ' + (before / 1024).toFixed(1) + 'KB -> ' + (h.length / 1024).toFixed(1) + 'KB');
console.log('  kunci storan tema sedia ada dikekalkan:', keyBefore ? "'work2u-theme'" : 'TIDAK DIJUMPAI');

let o = 0, c = 0; for (const ch of h.match(/<style>([\s\S]*?)<\/style>/)[1]) { if (ch === '{') o++; if (ch === '}') c++; }
console.log('  kurungan CSS:', o, '/', c, o === c ? 'SEIMBANG' : 'TIDAK SEIMBANG');

/* Cek: setiap pembolehubah yang dirujuk kini ditakrif dalam kedua-dua tema */
const css = h.match(/<style>([\s\S]*?)<\/style>/)[1];
const used = [...new Set([...css.matchAll(/var\((--[a-z0-9-]+)\)/g)].map(m => m[1]))]
  .filter(v => !v.startsWith('--w2u-'));
const block = (sel) => (css.match(new RegExp(sel.replace(/[[\]"]/g, '\\$&') + '\\s*\\{([^}]*)\\}'))||[])[1] || '';
const rootV  = block(':root');
const lightV = block(':root\\[data-theme="light"\\]');
const darkV  = block(':root\\[data-theme="dark"\\]');
const defined = (v, b) => new RegExp('\\' + v + '\\s*:').test(b);

const brokenLight = used.filter(v => !defined(v, rootV) && !defined(v, lightV));
const brokenDark  = used.filter(v => !defined(v, rootV) && !defined(v, darkV));
console.log('  pembolehubah dirujuk:', used.length);
console.log('  tak tertakrif dalam LIGHT:', brokenLight.length ? brokenLight.join(', ') : 'tiada');
console.log('  tak tertakrif dalam DARK :', brokenDark.length ? brokenDark.join(', ') : 'tiada');
