# vendor/cartostar

Lifted from `harshasoftware/cartostar` @ `92cbd8b0` — the cartostar.app hero orrery.

| Here | Source |
|---|---|
| `OrreryTile.tsx` | `src/components/landing/OrbitingPlanets.tsx` (5 planets on CSS orbits, hover glow) + the `Hero` in `src/pages/Landing.tsx` (lines 309–445): `HERO_HEADLINES` / `HERO_SUBHEADLINES`, GSAP blur-in/out rotator, "New · Available on iPhone, iPad & Mac" pill |
| `orrery-tile.css` | `src/pages/Landing.css` 775–981 (orbiting planets system), `.text-gradient` (157), `.hero-title` / `.hero-subtitle` (392–425), nested under `.cs-tile` with `cs-` prefixed keyframes |
| `public/images/cartostar/*.png` | `public/{venus-planet,mars-planet,jupiter-planet}-96.png`, `saturn-96.png`, `neptune-96.png` |

Edits vs. the source:
- Takes `{ active }` from `LiveTile`; the GSAP timeline and the CSS orbit animations pause while off-screen.
- Three orbits instead of five (venus / jupiter / saturn) and radii multiplied by `--orbit-scale` so the orrery fits the 646px band (the source hero is 100vh); the tile clips overflow like the original section crop. The headline is one line from the tablet breakpoint up.
- The band is visual-only: the portfolio overlays just a "Cartostar" wordmark at the bottom (no separate heading/CTA).
- `LandingHeroSearch` (Radar autocomplete + router + analytics) → decorative "Where were you born?" pill; the iOS `Link` pill is a static badge.
- `requestIdleCallback` deferral kept; the prerender-boot special case is dropped (no prerender here).
