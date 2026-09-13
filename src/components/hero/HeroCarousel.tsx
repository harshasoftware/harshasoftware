import { useCallback, useEffect, useRef, useState, type KeyboardEvent } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import type { HeroPhoto } from '@/data/heroPhotos';
import { img, srcSet } from '@/lib/images';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { cn } from '@/lib/cn';

interface HeroCarouselProps {
  photos: HeroPhoto[];
  /** Auto-advance interval; 0 disables (default). */
  autoplayMs?: number;
}

const arrowBtn =
  'absolute top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/35 p-1 text-white backdrop-blur-sm transition hover:bg-black/55 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white';

export function HeroCarousel({ photos, autoplayMs = 0 }: HeroCarouselProps) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const reduced = usePrefersReducedMotion();
  const regionRef = useRef<HTMLDivElement>(null);
  const count = photos.length;

  const go = useCallback((next: number) => setIndex(((next % count) + count) % count), [count]);

  useEffect(() => {
    if (!autoplayMs || paused || reduced || count < 2) return;
    const id = window.setInterval(() => setIndex((i) => (i + 1) % count), autoplayMs);
    return () => window.clearInterval(id);
  }, [autoplayMs, paused, reduced, count]);

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'ArrowLeft') { e.preventDefault(); go(index - 1); }
    else if (e.key === 'ArrowRight') { e.preventDefault(); go(index + 1); }
    else if (e.key === 'Home') { e.preventDefault(); go(0); }
    else if (e.key === 'End') { e.preventDefault(); go(count - 1); }
  };

  const photo = photos[index];

  return (
    <div
      ref={regionRef}
      role="region"
      aria-roledescription="carousel"
      aria-label="Photos of Harsha"
      tabIndex={0}
      onKeyDown={onKeyDown}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      className="relative aspect-[4/5] w-full overflow-hidden bg-neutral-200 focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-sky md:aspect-[4/3] xl:aspect-auto xl:h-full xl:min-h-[640px]"
    >
      <AnimatePresence initial={false} mode="sync">
        <motion.picture
          key={photo.path}
          role="group"
          aria-roledescription="slide"
          aria-label={`${index + 1} of ${count}`}
          className="absolute inset-0"
          initial={reduced ? false : { opacity: 0, scale: 1.02 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={reduced ? { opacity: 0 } : { opacity: 0 }}
          transition={{ duration: reduced ? 0 : 0.45, ease: 'easeOut' }}
        >
          <source type="image/webp" srcSet={srcSet(photo.path, [600, 900, 1200])} sizes="(min-width: 1200px) 60vw, 100vw" />
          <img
            src={photo.fallback}
            alt={photo.alt}
            width={photo.width}
            height={photo.height}
            loading={index === 0 ? 'eager' : 'lazy'}
            decoding="async"
            fetchPriority={index === 0 ? 'high' : 'auto'}
            className="h-full w-full object-cover"
          />
        </motion.picture>
      </AnimatePresence>

      {/* Preload neighbours so arrows feel instant. */}
      <div hidden aria-hidden="true">
        {photos.map((p, i) => i !== index && <link key={p.path} rel="prefetch" as="image" href={img(p.path, { w: 1200 })} />)}
      </div>

      <button type="button" aria-label="Previous photo" onClick={() => go(index - 1)} className={cn(arrowBtn, 'left-3')}>
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none" aria-hidden="true">
          <path d="M22.5 12.5 15 20l7.5 7.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      <button type="button" aria-label="Next photo" onClick={() => go(index + 1)} className={cn(arrowBtn, 'right-3')}>
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none" aria-hidden="true">
          <path d="M17.5 12.5 25 20l-7.5 7.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      <div role="tablist" aria-label="Choose photo" className="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 gap-2">
        {photos.map((p, i) => (
          <button
            key={p.path}
            type="button"
            role="tab"
            aria-selected={i === index}
            aria-label={`Photo ${i + 1} of ${count}`}
            onClick={() => go(i)}
            className={cn(
              'size-2.5 rounded-full border border-white/70 transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white',
              i === index ? 'bg-white' : 'bg-white/30 hover:bg-white/60',
            )}
          />
        ))}
      </div>
      <p aria-live="polite" className="sr-only">
        Photo {index + 1} of {count}: {photo.alt}
      </p>
    </div>
  );
}
