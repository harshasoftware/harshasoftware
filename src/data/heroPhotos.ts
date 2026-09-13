export interface HeroPhoto {
  /** Path under public/images (a 1200w master; the edge Worker derives smaller sizes). */
  path: string;
  /** JPEG master for browsers without WebP/AVIF, served untouched by the asset store. */
  fallback: string;
  alt: string;
  width: number;
  height: number;
}

export const heroPhotos: HeroPhoto[] = [
  { path: 'hero/harsha-1.webp', fallback: '/images/hero/harsha-1.jpg', alt: 'Harsha in front of the Bill Gates and Steve Jobs mural in East Nashville', width: 1168, height: 1558 },
  { path: 'hero/harsha-2.webp', fallback: '/images/hero/harsha-2.jpg', alt: 'Harsha at a networking event', width: 1200, height: 1496 },
  { path: 'hero/harsha-3.webp', fallback: '/images/hero/harsha-3.jpg', alt: 'Harsha standing in front of a colorful wall installation', width: 1200, height: 1187 },
  { path: 'hero/harsha-4.webp', fallback: '/images/hero/harsha-4.jpg', alt: 'Harsha presenting at a podium', width: 1200, height: 900 },
];
