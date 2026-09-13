export type VisualKey = 'cartostar' | 'halohome' | 'zyllion' | 'priceguru';

export interface Project {
  id: VisualKey;
  title: string;
  subtitle?: string;
  description?: string;
  /** 'stacked' = heading above the visual (default); 'overlay' = the visual fills the band with only the title as a wordmark at the bottom. */
  layout?: 'stacked' | 'overlay';
  /** Overlay bands default to the Framer band height (646px); a Tailwind min-height utility overrides it. */
  bandHeight?: string;
  theme: {
    /** Tailwind background utility for the full-bleed band */
    bg: string;
    /** Tailwind text color utility for headings/body */
    fg: string;
    /** Muted text color utility for subtitles */
    muted: string;
    titleFont: 'grotesk' | 'sans';
    /** Optional CTA pill classes (default: the Framer site's light chip) */
    cta?: string;
  };
  cta?: { label: string; href: string };
  /** Static image shown before/without the live visual (path under public/images) */
  poster: {
    path: string;
    alt: string;
    width: number;
    height: number;
    fit: 'cover' | 'contain';
    /** 'card' renders the image on a white rounded card (artwork with baked-in white areas). */
    frame?: 'card';
  };
}

export const projects: Project[] = [
  {
    id: 'cartostar',
    title: 'Cartostar',
    // The live hero carries its own copy (pill, headline, subtitle, search), so this band is visual-only + wordmark.
    layout: 'overlay',
    theme: { bg: 'bg-navy', fg: 'text-white', muted: 'text-white/80', titleFont: 'grotesk' },
    cta: { label: 'Launch App', href: 'https://cartostar.app' }, // overlay layout: the wordmark links here
    poster: { path: 'projects/cartostar-poster.webp', alt: 'Cartostar showing planetary lines over a dark star map', width: 1400, height: 674, fit: 'cover' },
  },
  {
    id: 'halohome',
    title: 'Halo Home',
    // The live hero carries its own copy (headline, subtitle, search, houses), so this band is visual-only + wordmark.
    layout: 'overlay',
    // halohome.app's own scheme: beige section, charcoal type
    theme: { bg: 'bg-beige', fg: 'text-charcoal', muted: 'text-charcoal-muted', titleFont: 'sans' },
    cta: { label: 'Learn More', href: 'https://halohome.app' }, // overlay layout: the wordmark links here
    poster: { path: 'halohome/hero-houses.webp', alt: 'Isometric 3D illustration of a modern and a traditional house', width: 910, height: 800, fit: 'contain', frame: 'card' },
  },
  {
    id: 'zyllion',
    title: 'Zyllion',
    subtitle: 'Secure SOC2 platform for 1099, W2 onboarding',
    theme: { bg: 'bg-white', fg: 'text-body', muted: 'text-body/85', titleFont: 'sans' },
    poster: { path: 'projects/zyllion-logo.png', alt: 'Zyllion blue octahedron logo', width: 779, height: 620, fit: 'contain' },
  },
  {
    id: 'priceguru',
    title: 'Price Guru',
    // Visual-only band (extension popup + mascot) with a wordmark; the wordmark links to price.guru.
    layout: 'overlay',
    bandHeight: 'min-h-[540px]',
    theme: { bg: 'bg-sand', fg: 'text-body', muted: 'text-body/85', titleFont: 'sans' },
    cta: { label: 'Learn More', href: 'https://price.guru' },
    poster: { path: 'projects/priceguru-avatar.webp', alt: 'Price Guru mascot wearing an orange turban', width: 800, height: 800, fit: 'contain' },
  },
];
