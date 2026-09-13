# harsha.software

Source for [harsha.software](https://harsha.software) — a Vite + React 19 + Tailwind v4 rebuild of the
former Framer site, deployed to Cloudflare Workers.

Static assets are served straight from the Workers asset store. One route, `/img/*`, runs the Worker in
`worker/index.ts`: it reads the master image from the asset store, resizes it with the **Cloudflare Images**
binding (`w=` width, `q=` quality, `f=auto` negotiates AVIF → WebP via the `Accept` header) and caches the
result at the edge with immutable cache headers. `src/lib/images.ts` builds those URLs (`img()` / `srcSet()`);
in `vite dev` it falls back to the untransformed `/images/...` files.

The "Passion Projects" sections embed live UI lifted from the real project repos
(`src/vendor/cartostar`, `src/vendor/halohome`) instead of static screenshots. Each vendor folder has a
README recording the source commit and the edits made.

## Toolchain

- [Bun](https://bun.sh) 1.3+ for install/scripts, Node 22+ for Wrangler.
- On this Mac the zsh profile's lazy `nvm` hook shadows `node`/`npm`; if you see
  `_nvm_load: command not found`, run `unset -f node npm npx; export PATH="$HOME/.nvm/versions/node/v25.0.0/bin:$PATH"` first.

```bash
bun install
bun run dev        # http://localhost:5173
bun run build      # tsc + vite build + bundle guard → dist/
bun run preview    # serve dist/ on :4173
bun run lint
bun run images     # regenerate public/images from scripts/originals (gitignored)
bun run cf:dev     # wrangler dev on :8787 — serves dist/ + the /img/* Worker locally (build first)
bun run cf:types   # regenerate worker-configuration.d.ts after editing wrangler.jsonc
```

## Deploy

Local (Wrangler is already authenticated on this machine):

```bash
bun run deploy:dry   # validates without publishing
bun run deploy       # publishes to the workers.dev URL / custom domain
```

Live preview: https://harshasoftware.icy-lake-12be.workers.dev (until the custom domain is bound).

GitHub Actions (`.github/workflows/deploy.yml`): pull requests run lint + build + `wrangler deploy --dry-run`;
pushes to `main` deploy. The Cloudflare steps are skipped with a warning until the API token secret exists.
Repository secrets required:

| Secret | Where it comes from |
|---|---|
| `CLOUDFLARE_ACCOUNT_ID` | already set (`npx wrangler whoami`) |
| `CLOUDFLARE_API_TOKEN` | Cloudflare dashboard → My Profile → API Tokens → *Edit Cloudflare Workers* template, then `gh secret set CLOUDFLARE_API_TOKEN` |

### Custom domain cutover (manual, last step)

1. In the Cloudflare dashboard for the `harsha.software` zone, remove the DNS records that point at Framer.
2. Uncomment the `routes` block in `wrangler.jsonc` and run `bun run deploy`.
3. Verify `https://harsha.software` returns 200 with a valid certificate, then retire the Framer site.
