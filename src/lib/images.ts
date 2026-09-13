/**
 * Image URL helper.
 *
 * Production traffic goes through the edge Worker (`/img/<path>?w=&q=&f=auto`), which
 * resizes with the Cloudflare Images binding, negotiates AVIF/WebP and caches at the edge.
 * `vite dev` has no Worker, so it serves the stored master from `/images/<path>` directly.
 */
export type ImageFormat = 'auto' | 'avif' | 'webp' | 'jpeg' | 'png';

export interface ImageOptions {
  /** Target width — must be one of the Worker's allowed widths. */
  w?: 160 | 320 | 480 | 600 | 800 | 900 | 1200 | 1400 | 1600;
  q?: number;
  f?: ImageFormat;
}

const USE_CDN = !import.meta.env.DEV;

export function img(path: string, opts: ImageOptions = {}): string {
  const clean = path.replace(/^\/?images\//, '').replace(/^\//, '');
  if (!USE_CDN) return `/images/${clean}`;
  const params = new URLSearchParams();
  if (opts.w) params.set('w', String(opts.w));
  if (opts.q) params.set('q', String(opts.q));
  params.set('f', opts.f ?? 'auto');
  return `/img/${clean}?${params.toString()}`;
}

export function srcSet(path: string, widths: NonNullable<ImageOptions['w']>[], opts: Omit<ImageOptions, 'w'> = {}): string {
  return widths.map((w) => `${img(path, { ...opts, w })} ${w}w`).join(', ');
}
