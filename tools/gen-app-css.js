/* Bina work2u/styles.new.css daripada styles.css sedia ada.
 *
 * App CSS hampir sepenuhnya dipacu pembolehubah (103 rujukan var(), satu
 * hex berkod-keras), jadi memetakan semula paletnya ke token w2u sudah
 * menukar hampir keseluruhan rupa tanpa menyentuh 2,069 baris susun atur.
 *
 * Yang berbaki ialah 77 nilai rgba() glassmorphism. Nilai-nilai itu
 * ditukar mengikut konteks - warna sempadan menjadi sempadan, latar
 * menjadi permukaan, tint aksen menjadi salah satu daripada empat tint
 * berperingkat - supaya niat asal dikekalkan sementara rupanya rata.
 */
const fs = require('fs');

const SRC = 'work2u/styles.css';
const OUT = 'work2u/styles.new.css';

let css = fs.readFileSync(SRC, 'utf8');
const stats = {};
const bump = (k, n = 1) => (stats[k] = (stats[k] || 0) + n);

/* ---- 1. Buang import fon. Inter datang dari halaman. ------------------- */
css = css.replace(/@import url\([^)]*\);\s*/g, () => { bump('import fon dibuang'); return ''; });

/* ---- 2. Ganti blok :root dan [data-theme="dark"] ----------------------- */
const NEW_ROOT = `/* ==========================================================================
   Work2U app - dipetakan ke design system dikongsi.
   Muat /assets/w2u.css SEBELUM fail ini.

   Nama pembolehubah app dikekalkan (--bg, --ink, --surface, --line, ...)
   supaya 201 pemilih di bawah terus berfungsi tanpa diubah. Hanya nilai
   di belakangnya yang berubah.
   ========================================================================== */

:root {
  --bg:             var(--w2u-bg);
  --bg-2:           var(--w2u-bg-subtle);
  --surface:        var(--w2u-surface);
  --surface-strong: var(--w2u-bg-subtle);
  --line:           var(--w2u-border);
  --ink:            var(--w2u-text);
  --muted:          var(--w2u-text-muted);
  --accent:         var(--w2u-accent);
  /* Aksen kedua dan ketiga dahulunya teal dan ambar. Palet terhad
     bermakna satu aksen sahaja; kedua-duanya kini menunjuk kepadanya. */
  --accent-2:       var(--w2u-accent);
  --accent-3:       var(--w2u-accent);
  --good:           var(--w2u-success);
  --warn:           var(--w2u-warning);
  --bad:            var(--w2u-danger);
  --shadow:         var(--w2u-shadow-lg);

  /* Jejari dikecilkan dari 28/20/14px. Sudut besar itulah yang buat app
     nampak seperti aplikasi mudah alih dan bukan alat kerja. */
  --radius-lg:      var(--w2u-r-xl);
  --radius-md:      var(--w2u-r-lg);
  --radius-sm:      var(--w2u-r-md);

  /* Tint aksen berperingkat, menggantikan rgba(21,101,216,a) bertaburan */
  --tint-1: rgba(37, 99, 235, 0.05);
  --tint-2: rgba(37, 99, 235, 0.09);
  --tint-3: rgba(37, 99, 235, 0.15);
  --tint-4: rgba(37, 99, 235, 0.26);
}

[data-theme="dark"] {
  --tint-1: rgba(96, 165, 250, 0.07);
  --tint-2: rgba(96, 165, 250, 0.12);
  --tint-3: rgba(96, 165, 250, 0.18);
  --tint-4: rgba(96, 165, 250, 0.30);
}
`;

const rootRe = /:root\s*\{[\s\S]*?\}\s*\[data-theme="dark"\]\s*\{[\s\S]*?\}/;
if (!rootRe.test(css)) { console.error('RALAT: blok :root/[data-theme] tak dijumpai'); process.exit(1); }
css = css.replace(rootRe, NEW_ROOT);
bump('blok palet ditulis semula');

/* ---- 3. Fon ------------------------------------------------------------ */
css = css.replace(/font-family:\s*'Space Grotesk'[^;]*;/g, () => {
  bump('font-family dipetakan'); return 'font-family: var(--w2u-font);';
});

/* ---- 4. Latar badan: buang dua orb radial dan kecerunan krim ---------- */
css = css.replace(
  /background:\s*\n?\s*radial-gradient\(circle at top left[^;]*;/m,
  () => { bump('kecerunan orb badan dibuang'); return 'background: var(--w2u-bg);'; }
);

/* ---- 5. Nilai rgba() mengikut konteks ---------------------------------
   Diproses baris demi baris supaya sifat pengapit diketahui: warna yang
   sama bermaksud perkara berbeza dalam `border` berbanding `background`.
   ---------------------------------------------------------------------- */

const INK   = /rgba\(23,\s*32,\s*51,\s*([\d.]+)\)/g;   // ink lama
const ACC   = /rgba\(21,\s*101,\s*216,\s*([\d.]+)\)/g; // aksen biru lama
const TEAL  = /rgba\(15,\s*118,\s*110,\s*([\d.]+)\)/g; // aksen teal lama
const AMBER = /rgba\(180,\s*83,\s*9,\s*([\d.]+)\)/g;   // aksen ambar lama
const WHITE = /rgba\(255,\s*255,\s*255,\s*([\d.]+)\)/g;
const DARK  = /rgba\(2,\s*6,\s*23,\s*([\d.]+)\)/g;

function tintFor(alpha) {
  const a = parseFloat(alpha);
  if (a <= 0.10) return 'var(--tint-1)';
  if (a <= 0.15) return 'var(--tint-2)';
  if (a <= 0.25) return 'var(--tint-3)';
  return 'var(--tint-4)';
}

css = css.split('\n').map((line) => {
  const prop = (line.match(/^\s*([a-z-]+)\s*:/) || [])[1] || '';
  const isBorder = /border/.test(prop);
  const isShadow = /shadow/.test(prop);
  const isBg     = /^background/.test(prop);
  const isText   = prop === 'color';

  let out = line;

  out = out.replace(ACC,   (m, a) => { bump('tint aksen'); return isBorder ? tintFor(a) : tintFor(a); });
  out = out.replace(TEAL,  (m, a) => { bump('tint teal -> aksen'); return tintFor(a); });
  out = out.replace(AMBER, (m, a) => { bump('tint ambar -> aksen'); return tintFor(a); });

  out = out.replace(INK, (m, a) => {
    if (isBorder) { bump('ink -> sempadan'); return 'var(--w2u-border)'; }
    if (isShadow) { bump('ink -> bayang'); return `rgba(15, 23, 42, ${Math.min(parseFloat(a), 0.10)})`; }
    if (isBg)     { bump('ink -> latar bisu'); return 'var(--w2u-bg-muted)'; }
    if (isText)   { bump('ink -> teks'); return 'var(--w2u-text-muted)'; }
    bump('ink -> sempadan'); return 'var(--w2u-border)';
  });

  out = out.replace(WHITE, (m, a) => {
    if (parseFloat(a) >= 0.95) return m;                     // putih pekat sengaja
    if (isBorder) { bump('kaca -> sempadan'); return 'var(--w2u-border)'; }
    if (isBg)     { bump('kaca -> permukaan'); return 'var(--w2u-surface)'; }
    bump('kaca -> permukaan'); return 'var(--w2u-surface)';
  });

  out = out.replace(DARK, (m, a) => {
    if (isShadow) { bump('bayang gelap dilembutkan'); return `rgba(2, 6, 23, ${Math.min(parseFloat(a), 0.34)})`; }
    return m;
  });

  return out;
}).join('\n');

/* ---- 6. Buang kesan kaca yang tinggal --------------------------------- */
css = css.replace(/\s*-webkit-backdrop-filter:[^;]*;/g, () => { bump('backdrop-filter dibuang'); return ''; });
css = css.replace(/\s*backdrop-filter:[^;]*;/g,        () => { bump('backdrop-filter dibuang'); return ''; });

/* ---- 7. Lapisan penindih untuk perkara yang pembolehubah tak capai ----- */
const OVERRIDES = `

/* ==========================================================================
   Lapisan penindih
   Perkara yang pemetaan pembolehubah tidak boleh capai kerana ia dikodkan
   terus dalam peraturan susun atur asal.
   ========================================================================== */

body {
  font-family: var(--w2u-font);
  font-size: var(--w2u-text-base);
  line-height: var(--w2u-leading-normal);
  letter-spacing: var(--w2u-track-normal);
  background: var(--w2u-bg);
  color: var(--w2u-text);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* Tajuk mengetat apabila membesar - sama seperti tapak awam */
h1, h2, h3, h4 {
  font-weight: var(--w2u-weight-semi);
  line-height: var(--w2u-leading-tight);
  color: var(--w2u-text);
}
h1 { letter-spacing: var(--w2u-track-tight); }
h2, h3 { letter-spacing: var(--w2u-track-snug); }

/* Fokus mesti kekal boleh nampak di seluruh app */
:focus-visible {
  outline: 2px solid var(--w2u-accent);
  outline-offset: 2px;
}

/* Permukaan menjadi legap. Kad lut sinar bertindih di atas satu sama lain
   dan menjadikan teks tidak boleh diramal untuk dibaca. */
.card, .panel, .surface, .modal, .sheet, .popover, .dropdown {
  background: var(--w2u-surface);
  border-color: var(--w2u-border);
}

/* Bayang berbilang lapisan besar digantikan dengan satu yang halus */
.card, .panel { box-shadow: var(--w2u-shadow-sm); }

/* Butang sepadan dengan tapak awam */
.primary-btn, .soft-btn, .ghost-btn {
  font-family: var(--w2u-font);
  font-size: var(--w2u-text-md);
  font-weight: var(--w2u-weight-medium);
  letter-spacing: var(--w2u-track-normal);
  border-radius: var(--w2u-r-md);
  transition: background-color var(--w2u-dur-fast) var(--w2u-ease),
              border-color var(--w2u-dur-fast) var(--w2u-ease);
}
.primary-btn { background: var(--w2u-accent); color: #fff; border: 1px solid var(--w2u-accent); }
.primary-btn:hover { background: var(--w2u-accent-600); border-color: var(--w2u-accent-600); }
.soft-btn {
  background: var(--w2u-surface);
  color: var(--w2u-text);
  border: 1px solid var(--w2u-border-strong);
}
.soft-btn:hover { background: var(--w2u-surface-hover); }
.ghost-btn { background: transparent; color: var(--w2u-text-muted); border: 1px solid transparent; }
.ghost-btn:hover { background: var(--w2u-bg-muted); color: var(--w2u-text); }

/* Input sepadan dengan borang tapak awam */
input[type="text"], input[type="email"], input[type="password"], input[type="number"],
input[type="search"], input[type="tel"], input[type="url"], input[type="date"],
input[type="time"], input[type="datetime-local"], select, textarea {
  font-family: var(--w2u-font);
  font-size: var(--w2u-text-md);
  color: var(--w2u-text);
  background: var(--w2u-surface);
  border: 1px solid var(--w2u-border-strong);
  border-radius: var(--w2u-r-md);
}
input:focus, select:focus, textarea:focus {
  outline: none;
  border-color: var(--w2u-accent);
  box-shadow: 0 0 0 3px var(--w2u-accent-100);
}
[data-theme="dark"] input:focus,
[data-theme="dark"] select:focus,
[data-theme="dark"] textarea:focus {
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.28);
}

/* Angka sejajar dalam jadual dan kad kewangan */
table, .amount, .metric, .stat, .kpi { font-variant-numeric: tabular-nums; }

/* Jadual lebar mesti skrol sendiri, bukan menolak susun atur app melebar */
.table-wrap, .table-scroll { overflow-x: auto; -webkit-overflow-scrolling: touch; }

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
`;

css = css.trimEnd() + '\n' + OVERRIDES;

fs.writeFileSync(OUT, css);

console.log(OUT + ' dijana');
console.log('  ' + (fs.statSync(SRC).size / 1024).toFixed(1) + 'KB -> ' + (css.length / 1024).toFixed(1) + 'KB');
console.log('\n  penukaran:');
Object.entries(stats).sort((a, b) => b[1] - a[1])
  .forEach(([k, v]) => console.log('    ' + String(v).padStart(4) + '  ' + k));

/* Cek: tiada warna lama yang terlepas */
const leftover = (css.match(/rgba\((?:23,\s*32,\s*51|21,\s*101,\s*216|15,\s*118,\s*110)/g) || []).length;
console.log('\n  warna palet lama tertinggal:', leftover);
let o = 0, c = 0; for (const ch of css) { if (ch === '{') o++; if (ch === '}') c++; }
console.log('  kurungan:', o, '/', c, o === c ? 'SEIMBANG' : 'TIDAK SEIMBANG');
