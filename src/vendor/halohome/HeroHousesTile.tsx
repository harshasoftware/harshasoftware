/**
 * HeroHousesTile — the halohome.app hero as a portfolio tile: rotating GSAP
 * headline + the isometric houses with hover "Vastu Analysis" score tooltips.
 * See README.md for provenance and edits.
 */
import { memo, useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { MapPin } from 'lucide-react';
import type { LiveVisualProps } from '@/components/projects/visuals/types';
import { img } from '@/lib/images';

gsap.registerPlugin(useGSAP);

const HERO_HEADLINES = ['Start Living\nin Harmony.', 'Find Your\nPerfect Home.', 'Scout Any\nZIP Code.', 'Balance Your\nSpace.'];

const HERO_SUBHEADLINES = [
  'Apply ancient sciences of creating harmonious spaces.',
  'AI-powered Vastu analysis for every ZIP code.',
  'Get harmony scores and actionable remedies instantly.',
  "Discover properties aligned with nature's energy.",
];

function HeroHousesTile({ active }: LiveVisualProps) {
  const [index, setIndex] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  const subTextRef = useRef<HTMLParagraphElement>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);

  useGSAP(
    () => {
      if (!textRef.current || !subTextRef.current) return;
      const targets = [textRef.current, subTextRef.current];

      // Clear existing tweens to prevent conflicts
      gsap.killTweensOf(targets);

      const tl = gsap.timeline({ paused: !active });
      tlRef.current = tl;

      // Initial state set
      gsap.set(targets, { opacity: 0, y: 20, filter: 'blur(10px)' });

      // Animate both elements in synchronization
      tl.to(targets, { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.8, ease: 'power3.out', stagger: 0.1 }).to(targets, {
        opacity: 0,
        y: -20,
        filter: 'blur(10px)',
        duration: 0.8,
        ease: 'power3.in',
        delay: 3,
        onComplete: () => setIndex((prev) => (prev + 1) % HERO_HEADLINES.length),
      });
    },
    { dependencies: [index], scope: rootRef },
  );

  // Freeze the rotator while the tile is scrolled out of view
  useEffect(() => {
    tlRef.current?.paused(!active);
  }, [active]);

  return (
    <div ref={rootRef} className="hh-tile" aria-hidden="true">
      <div className="hh-tile-text">
        <p className="hero-title">
          <span ref={textRef} className="block whitespace-pre-wrap">
            {HERO_HEADLINES[index]}
          </span>
        </p>
        <p ref={subTextRef} className="hero-subtitle text-gradient">
          {HERO_SUBHEADLINES[index]}
        </p>
        <div className="hh-search">
          <MapPin className="hh-search-icon" />
          <span>Enter address or ZIP…</span>
        </div>
      </div>

      <div className="hero-image-wrapper">
        <picture>
          <source type="image/webp" srcSet={`${img('halohome/hero-houses.webp', { w: 600 })} 600w, ${img('halohome/hero-houses.webp', { w: 900 })} 900w`} sizes="(min-width: 1200px) 560px, 90vw" />
          <img src="/images/halohome/hero-houses.png" alt="" className="hero-houses-image" width={910} height={800} loading="lazy" decoding="async" />
        </picture>

        {/* Desktop micro-interactions: hover hotspots for left/right houses */}
        <div className="hero-house-hotspots">
          <div className="hero-house-hotspot hero-house-hotspot--left">
            <button type="button" className="hero-house-hit" aria-label="Left home Vastu score" tabIndex={-1} />
            <div className="hero-house-tooltip">
              <div className="hero-house-tooltip-card hero-house-tooltip-card--tall">
                <div className="hero-house-tooltip-header">
                  <span className="hero-house-tooltip-title">Vastu Analysis</span>
                  <span className="hero-house-tooltip-score-pill hero-house-tooltip-score-pill--good">87</span>
                </div>
                <div className="hero-house-tooltip-sub">Strong entrance alignment • Great flow</div>
              </div>
            </div>
          </div>

          <div className="hero-house-hotspot hero-house-hotspot--right">
            <button type="button" className="hero-house-hit" aria-label="Right home Vastu score" tabIndex={-1} />
            <div className="hero-house-tooltip">
              <div className="hero-house-tooltip-card">
                <div className="hero-house-tooltip-header">
                  <span className="hero-house-tooltip-title">Vastu Analysis</span>
                  <span className="hero-house-tooltip-score-pill hero-house-tooltip-score-pill--mid">72</span>
                </div>
                <div className="hero-house-tooltip-sub">Good balance • Minor fixes recommended</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default memo(HeroHousesTile);
