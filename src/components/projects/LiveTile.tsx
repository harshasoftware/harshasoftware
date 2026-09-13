import { Suspense, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import type { Project, VisualKey } from '@/data/projects';
import { img, srcSet } from '@/lib/images';
import { supportsWebGL } from '@/lib/webgl';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { useNearViewport } from '@/hooks/useNearViewport';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { cn } from '@/lib/cn';
import { LiveTileErrorBoundary } from './LiveTileErrorBoundary';
import { visuals } from './visuals/registry';

interface LiveTileProps {
  visual: VisualKey;
  poster: Project['poster'];
  label: string;
  /** Background utility of the surrounding band; the live layer paints it so it fully replaces the poster. */
  bgClass: string;
  className?: string;
  /** How far ahead of the viewport the lazy chunk starts loading. */
  rootMargin?: string;
}

function saveDataRequested(): boolean {
  const nav = navigator as Navigator & { connection?: { saveData?: boolean } };
  return nav.connection?.saveData === true;
}

/**
 * Boundary every lifted/animated project visual sits behind:
 *  - the poster image is always rendered underneath (no-JS, pre-load, fallback);
 *  - the live layer is lazy-loaded only when near the viewport;
 *  - never mounts under prefers-reduced-motion, save-data, missing WebGL, or below the visual's min width;
 *  - errors (including chunk-load failures) leave the poster in place.
 */
export function LiveTile({ visual, poster, label, bgClass, className, rootMargin = '400px 0px' }: LiveTileProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { near, inView } = useNearViewport(ref, rootMargin);
  const reduced = usePrefersReducedMotion();
  const entry = visuals[visual];
  const wideEnough = useMediaQuery(`(min-width: ${entry.minWidth}px)`);
  // Probed once per tile; the result is cached module-wide inside supportsWebGL().
  const [webgl] = useState(() => (entry.requiresWebGL ? supportsWebGL() : true));

  const allowed = near && !reduced && wideEnough && webgl && !saveDataRequested();
  const Visual = entry.Component;

  return (
    <div ref={ref} role="group" aria-label={label} className={cn('absolute inset-0', className)}>
      {poster.frame === 'card' ? (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex h-full max-w-full items-center justify-center rounded-[28px] bg-white p-[4%] shadow-[0_24px_48px_rgba(0,0,0,0.12)]" style={{ aspectRatio: `${poster.width} / ${poster.height}` }}>
            <img
              src={img(poster.path, { w: 900 })}
              srcSet={srcSet(poster.path, [600, 900])}
              sizes="(min-width: 1200px) 520px, 90vw"
              alt={poster.alt}
              width={poster.width}
              height={poster.height}
              loading="lazy"
              decoding="async"
              className="h-full w-full object-contain"
            />
          </div>
        </div>
      ) : (
        <img
          src={img(poster.path, { w: 1400 })}
          srcSet={srcSet(poster.path, [600, 900, 1400])}
          sizes="(min-width: 1200px) 60vw, 100vw"
          alt={poster.alt}
          width={poster.width}
          height={poster.height}
          loading="lazy"
          decoding="async"
          className={cn('absolute inset-0 h-full w-full', poster.fit === 'cover' ? 'object-cover' : 'object-contain')}
        />
      )}
      {allowed && (
        <LiveTileErrorBoundary label={visual}>
          <Suspense fallback={null}>
            <motion.div
              className={cn('absolute inset-0', bgClass)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            >
              <Visual active={inView} />
            </motion.div>
          </Suspense>
        </LiveTileErrorBoundary>
      )}
    </div>
  );
}
