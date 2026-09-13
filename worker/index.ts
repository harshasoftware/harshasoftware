/**
 * harsha.software edge Worker.
 *
 * Only `/img/*` reaches this script (see `run_worker_first` in wrangler.jsonc);
 * everything else is served directly from the static asset store.
 *
 *   GET /img/<path under public/images>?w=<width>&q=<quality>&f=<auto|avif|webp|jpeg|png>
 *
 * The original is read from the asset store, transformed with the Cloudflare
 * Images binding, cached at the edge (Cache API) and returned with immutable
 * cache headers. `f=auto` negotiates AVIF → WebP → original via the Accept header.
 */

const ALLOWED_WIDTHS = new Set([160, 320, 480, 600, 800, 900, 1200, 1400, 1600]);
const MAX_AGE = 60 * 60 * 24 * 365;

type Format = 'avif' | 'webp' | 'jpeg' | 'png';
type OutputFormat = `image/${Format}`;

/** Output format when the request didn't force one: keep the stored asset's own type. */
function sourceFormat(contentType: string | null): OutputFormat {
  const type = (contentType ?? '').split(';')[0].trim();
  if (type === 'image/avif' || type === 'image/webp' || type === 'image/png') return type;
  return 'image/jpeg';
}

function negotiateFormat(request: Request, requested: string | null, sourcePath: string): Format | undefined {
  if (requested && requested !== 'auto') {
    return (['avif', 'webp', 'jpeg', 'png'] as const).find((f) => f === requested);
  }
  const accept = request.headers.get('Accept') ?? '';
  if (accept.includes('image/avif')) return 'avif';
  if (accept.includes('image/webp')) return 'webp';
  if (/\.(jpe?g)$/i.test(sourcePath)) return 'jpeg';
  if (/\.png$/i.test(sourcePath)) return 'png';
  return undefined; // keep source format (e.g. webp source on a legacy browser → webp)
}

function cacheKeyFor(request: Request, format: Format | undefined): Request {
  // Vary the edge cache by negotiated format, not by the raw Accept header.
  const url = new URL(request.url);
  url.searchParams.set('f', format ?? 'source');
  url.searchParams.sort();
  return new Request(url.toString(), { method: 'GET' });
}

async function transform(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
  const url = new URL(request.url);
  const sourcePath = url.pathname.replace(/^\/img\//, '/images/');
  if (sourcePath === '/images/' || sourcePath.includes('..')) return new Response('Bad request', { status: 400 });

  const width = Number(url.searchParams.get('w') ?? '');
  const quality = Math.min(95, Math.max(40, Number(url.searchParams.get('q') ?? '82') || 82));
  const format = negotiateFormat(request, url.searchParams.get('f'), sourcePath);

  const cache = caches.default;
  const cacheKey = cacheKeyFor(request, format);
  const cached = await cache.match(cacheKey);
  if (cached) return cached;

  const original = await env.ASSETS.fetch(new URL(sourcePath, url.origin).toString());
  if (!original.ok || !original.body) return new Response('Not found', { status: 404 });

  // Nothing to do → pass the stored asset through (still cacheable).
  const wantsResize = ALLOWED_WIDTHS.has(width);
  if (!wantsResize && !format) return withHeaders(original, format);

  let response: Response;
  try {
    const outputFormat: OutputFormat = format ? `image/${format}` : sourceFormat(original.headers.get('Content-Type'));
    const out = await env.IMAGES.input(original.body)
      .transform({ ...(wantsResize ? { width, fit: 'scale-down' } : {}) })
      .output({ format: outputFormat, quality });
    response = withHeaders(out.response(), format);
  } catch (err) {
    // Images binding unavailable (local dev without the service, quota, bad source):
    // degrade gracefully to the untransformed asset instead of a broken image.
    console.warn('IMAGES transform failed, serving original', String(err));
    const fallback = await env.ASSETS.fetch(new URL(sourcePath, url.origin).toString());
    return withHeaders(fallback, undefined, 'no-store');
  }

  ctx.waitUntil(cache.put(cacheKey, response.clone()));
  return response;
}

function withHeaders(res: Response, format: Format | undefined, cacheControl = `public, max-age=${MAX_AGE}, immutable`): Response {
  const headers = new Headers(res.headers);
  headers.set('Cache-Control', cacheControl);
  headers.set('Vary', 'Accept');
  headers.set('X-Content-Type-Options', 'nosniff');
  if (format) headers.set('Content-Type', `image/${format}`);
  return new Response(res.body, { status: res.status, headers });
}

export default {
  async fetch(request, env, ctx): Promise<Response> {
    if (request.method !== 'GET' && request.method !== 'HEAD') {
      return new Response('Method not allowed', { status: 405, headers: { Allow: 'GET, HEAD' } });
    }
    const { pathname } = new URL(request.url);
    if (pathname.startsWith('/img/')) return transform(request, env, ctx);
    return env.ASSETS.fetch(request);
  },
} satisfies ExportedHandler<Env>;
