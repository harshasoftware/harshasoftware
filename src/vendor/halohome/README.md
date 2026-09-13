# vendor/halohome

Lifted from `harshasoftware/halohome` (`HaloHome/Web/halohome`) @ `e4241a7` — the halohome.app hero.

| Here | Source |
|---|---|
| `HeroHousesTile.tsx` | `src/pages/Landing.tsx` `Hero` (lines 404–570): `HERO_HEADLINES` / `HERO_SUBHEADLINES`, the GSAP blur-in/out headline rotator, the houses image and the two hover hotspots with Vastu-score tooltips |
| `hero-tile.css` | `src/pages/Landing.css` 586–760 (`.hero-house-*`), `.text-gradient` (113), `.hero-title` (1179), `.hero-subtitle` (1195), nested under `.hh-tile` |
| `public/images/halohome/hero-houses.{webp,png}` | `public/images/hero-houses.{webp,png}` |

Edits vs. the source:
- Takes `{ active }` from `LiveTile`; the GSAP timeline is paused while the tile is off-screen.
- `LandingHeroSearch` (Google Places autocomplete + router + analytics) is replaced by a static, decorative search pill.
- The 90vh `.hero-wrapper` / split layout is replaced by a two-column grid that fills the 646px project band (stacked below 1200px); the mobile background image is dropped. The band is visual-only: the portfolio overlays just a "Halo Home" wordmark (linking to halohome.app) at the bottom.
- The houses sit on a white rounded card: the artwork has an opaque white platform baked in that only reads correctly on white.
- Colors adapted to the green band (stone ink instead of white background); hotspots hide on touch devices via `(hover: none)` and are `tabIndex=-1` as in the source.
