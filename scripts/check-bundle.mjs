/**
 * Build guard: the entry chunk must stay small and must not statically import
 * the three.js / globe.gl vendor chunks (they are only allowed behind React.lazy).
 */
import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(root, 'dist');
const manifest = JSON.parse(await readFile(path.join(dist, '.vite', 'manifest.json'), 'utf8'));

const entry = Object.values(manifest).find((m) => m.isEntry);
if (!entry) throw new Error('check-bundle: no entry chunk in manifest');

// Budget for everything loaded before any scrolling: entry + all statically imported chunks.
// React 19 + react-dom + framer-motion alone are ~330 KB minified; keep the rest lean.
const STATIC_LIMIT = 480 * 1024;

const seen = new Set();
const staticImports = (m) => {
  for (const key of m.imports ?? []) {
    if (seen.has(key)) continue;
    seen.add(key);
    staticImports(manifest[key]);
  }
};
staticImports(entry);

const staticFiles = [entry.file, ...[...seen].map((k) => manifest[k].file)].filter((f) => f.endsWith('.js'));
let staticSize = 0;
for (const f of staticFiles) staticSize += (await stat(path.join(dist, f))).size;

// Heavy WebGL code (three.js / globe.gl) must never be reachable statically from the entry: scan every static chunk for its markers.
const banned = [];
for (const f of staticFiles) {
  const code = await readFile(path.join(dist, f), 'utf8');
  if (/WebGLRenderer|three-globe|globe\.gl/.test(code)) banned.push(f);
}
const problems = [];
if (staticSize > STATIC_LIMIT) problems.push(`static JS is ${(staticSize / 1024).toFixed(0)} KB across ${staticFiles.length} chunk(s) (limit ${STATIC_LIMIT / 1024} KB)`);
if (banned.length) problems.push(`three.js/globe.gl code found in static chunk(s) ${banned.join(', ')} — must stay behind React.lazy`);

if (problems.length) {
  console.error('check-bundle FAILED:\n - ' + problems.join('\n - '));
  process.exit(1);
}
console.log(`check-bundle OK: ${(staticSize / 1024).toFixed(0)} KB static JS across ${staticFiles.length} chunk(s); no WebGL vendor code in static chunks`);
