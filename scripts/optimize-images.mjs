/**
 * Image pipeline: turns the staged originals in scripts/originals/ (gitignored)
 * into the optimized files committed under public/. Run with `bun run images`.
 */
import sharp from 'sharp';
import { mkdir, readdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const src = path.join(root, 'scripts', 'originals');
const pub = path.join(root, 'public');

const ensure = (dir) => mkdir(dir, { recursive: true });

async function heroPhotos() {
  const dir = path.join(src, 'hero');
  const out = path.join(pub, 'images', 'hero');
  await ensure(out);
  for (const file of (await readdir(dir)).sort()) {
    const name = path.parse(file).name; // harsha-1 … harsha-4
    const input = sharp(path.join(dir, file)).rotate();
    // One 1200w master per photo; the edge Worker (/img/*) derives smaller widths + AVIF on demand.
    await input.clone().resize({ width: 1200, withoutEnlargement: true }).webp({ quality: 80 }).toFile(path.join(out, `${name}.webp`));
    await input.clone().resize({ width: 1200, withoutEnlargement: true }).jpeg({ quality: 82, mozjpeg: true }).toFile(path.join(out, `${name}.jpg`));
    const meta = await sharp(path.join(out, `${name}.webp`)).metadata();
    console.log(`hero ${name}: ${meta.width}×${meta.height}`);
  }
}

async function avatars() {
  const dir = path.join(src, 'reviews');
  const out = path.join(pub, 'images', 'reviews');
  await ensure(out);
  for (const file of await readdir(dir)) {
    const name = path.parse(file).name;
    await sharp(path.join(dir, file)).resize(160, 160, { fit: 'cover' }).webp({ quality: 82 }).toFile(path.join(out, `${name}.webp`));
  }
  console.log('avatars done');
}

async function posters() {
  const dir = path.join(src, 'projects');
  const out = path.join(pub, 'images', 'projects');
  await ensure(out);
  await sharp(path.join(dir, 'cartostar-poster.png')).resize({ width: 1400, withoutEnlargement: true }).webp({ quality: 80 }).toFile(path.join(out, 'cartostar-poster.webp'));
  await sharp(path.join(dir, 'halohome-poster.png')).resize({ width: 1400, withoutEnlargement: true }).webp({ quality: 80 }).toFile(path.join(out, 'halohome-poster.webp'));
  await sharp(path.join(dir, 'priceguru-avatar.webp')).resize(800, 800, { fit: 'inside' }).webp({ quality: 84 }).toFile(path.join(out, 'priceguru-avatar.webp'));
  console.log('posters done');
}

async function icons() {
  await sharp(path.join(src, 'apple-touch-icon.png')).resize(180, 180).png().toFile(path.join(pub, 'apple-touch-icon.png'));
  console.log('icons done');
}

await heroPhotos();
await avatars();
await posters();
await icons();
