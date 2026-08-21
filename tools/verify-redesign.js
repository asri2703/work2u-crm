/* Pemeriksaan akhir merentas setiap fail yang direka semula. */
const fs = require('fs');

const PAGES = [
  'index.html', 'login.html', 'register.html',
  'privacy-policy.html', 'terms-of-service.html', 'service-policy.html',
  'docs/index.html', 'work2u/index.html', 'crm/dashboard.html',
];
const SHEETS = [
  'assets/w2u.css', 'assets/w2u-auth.css', 'assets/w2u-legal.css', 'work2u/styles.css',
];

const VOID = new Set(['area','base','br','col','embed','hr','img','input','link','meta',
  'source','track','wbr','path','rect','circle','polyline','line','ellipse','polygon',
  'use','stop','feColorMatrix','image']);

let problems = 0;
const flag = (m) => { console.log('    !! ' + m); problems++; };

console.log('HALAMAN\n');
for (const f of PAGES) {
  const h = fs.readFileSync(f, 'utf8');
  console.log('  ' + f + '  (' + (h.length / 1024).toFixed(1) + 'KB)');

  // Tag seimbang. Blok skrip dikecualikan: JS dashboard menjana HTML
  // sebagai rentetan, jadi pengira tag naif akan masuk ke dalamnya dan
  // melaporkan ketakseimbangan yang tidak wujud dalam markup sebenar.
  const markup = h.replace(/<script[\s\S]*?<\/script>/g, '');
  const stack = []; let tagErr = null;
  const re = /<(\/?)([a-zA-Z][a-zA-Z0-9-]*)([^>]*?)(\/?)>/g; let m;
  while ((m = re.exec(markup))) {
    const n = m[2];
    if (VOID.has(n) || VOID.has(n.toLowerCase()) || m[4] === '/') continue;
    if (!m[1]) stack.push(n);
    else { const t = stack.pop(); if (t !== n && !tagErr) tagErr = 'jangka </' + t + '> dapat </' + n + '>'; }
  }
  if (tagErr) flag('tag: ' + tagErr);
  if (stack.length) flag('tag belum ditutup: ' + stack.join(', '));

  // Sintaks setiap blok skrip
  const blocks = [...h.matchAll(/<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/g)].map(x => x[1]);
  blocks.forEach((b, i) => {
    try { new Function(b); } catch (e) { flag('skrip ' + (i + 1) + ': ' + e.message); }
  });

  // Setiap getElementById mesti ada id sepadan
  const need = [...new Set([...h.matchAll(/getElementById\(['"]([^'"]+)['"]\)/g)].map(x => x[1]))];
  const have = new Set([...h.matchAll(/\sid="([^"]+)"/g)].map(x => x[1]));
  const miss = need.filter(id => !have.has(id));
  if (miss.length) flag('id hilang: ' + miss.join(', '));

  // Aset 396KB lama
  if (/work2u-(logo|favicon)\.svg/.test(h)) flag('masih merujuk aset 396KB lama');

  // Kunci tema konsisten
  if (/'w2u-theme'/.test(h)) flag("masih guna kunci lama 'w2u-theme'");

  // Sauh dalaman mesti wujud
  const anchors = [...new Set([...h.matchAll(/href="#([^"]+)"/g)].map(x => x[1]))];
  const dead = anchors.filter(a => a !== '' && !have.has(a));
  if (dead.length) flag('sauh mati: ' + dead.join(', '));

  console.log('     tag ok · ' + blocks.length + ' blok skrip ok · ' +
              need.length + ' id ok · ' + anchors.length + ' sauh ok');
}

console.log('\nHELAIAN GAYA\n');
for (const f of SHEETS) {
  const s = fs.readFileSync(f, 'utf8');
  let o = 0, c = 0;
  for (const ch of s) { if (ch === '{') o++; if (ch === '}') c++; }
  if (o !== c) flag(f + ': kurungan tidak seimbang ' + o + '/' + c);
  console.log('  ' + f.padEnd(26) + (s.length / 1024).toFixed(1) + 'KB  ' +
              o + ' peraturan  ' + (o === c ? 'seimbang' : 'TIDAK SEIMBANG'));
}

// Setiap token w2u yang dirujuk oleh lapisan mesti wujud dalam w2u.css
console.log('\nTOKEN\n');
const core = fs.readFileSync('assets/w2u.css', 'utf8');
const declared = new Set([...core.matchAll(/^\s*(--w2u-[a-z0-9-]+)\s*:/gm)].map(m => m[1]));
for (const f of [...SHEETS.slice(1), ...PAGES]) {
  const s = fs.readFileSync(f, 'utf8');
  const used = [...new Set([...s.matchAll(/var\((--w2u-[a-z0-9-]+)/g)].map(m => m[1]))];
  const undef = used.filter(v => !declared.has(v));
  if (undef.length) flag(f + ': token tak wujud -> ' + undef.join(', '));
}
console.log('  ' + declared.size + ' token diisytihar dalam w2u.css');
console.log('  setiap token yang dirujuk merentas semua fail wujud');

console.log('\n' + (problems ? problems + ' MASALAH DIJUMPAI' : 'SEMUA PEMERIKSAAN LULUS'));
process.exit(problems ? 1 : 0);
