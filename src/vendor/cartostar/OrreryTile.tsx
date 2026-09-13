/**
 * OrreryTile — cartostar.app's hero as a portfolio tile: five planets on CSS
 * orbits around the GSAP-rotated headline. See README.md for provenance/edits.
 */
import { memo, useEffect, useRef, useState, type CSSProperties } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ArrowRight, Search } from 'lucide-react';
import type { LiveVisualProps } from '@/components/projects/visuals/types';

gsap.registerPlugin(useGSAP);

const HERO_HEADLINES = ['Precision\nAstrocartography', 'Find Where\nYou Belong', 'Map Your\nLife Path', 'Discover Your\nPower Places'];

const HERO_SUBHEADLINES = [
  'Discover where you belong in the universe.',
  'Map your planetary lines for love and career.',
  'Find your power places with astrocartography.',
  'Real-time astrocartography for your life path.',
];

// Orbital planet configuration - planets orbit AROUND the hero text (outer orbits)
const ORBITAL_PLANETS = [
  { src: '/images/cartostar/venus-planet-96.png', orbitRadius: 320, duration: 50, size: 42, startAngle: 0 },
  { src: '/images/cartostar/mars-planet-96.png', orbitRadius: 380, duration: 65, size: 50, startAngle: 72 },
  { src: '/images/cartostar/jupiter-planet-96.png', orbitRadius: 440, duration: 85, size: 58, startAngle: 144 },
  { src: '/images/cartostar/saturn-96.png', orbitRadius: 500, duration: 105, size: 54, startAngle: 216 },
  { src: '/images/cartostar/neptune-96.png', orbitRadius: 560, duration: 125, size: 46, startAngle: 288 },
];

const OrbitingPlanets = memo(() => {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Defer planet rendering until after first paint for performance
    const idle = typeof requestIdleCallback === 'function';
    const id = idle ? requestIdleCallback(() => setIsReady(true)) : window.setTimeout(() => setIsReady(true), 150);
    return () => {
      if (idle) cancelIdleCallback(id);
      else window.clearTimeout(id);
    };
  }, []);

  if (!isReady) return null;

  return (
    <div className="orbiting-planets-container">
      {ORBITAL_PLANETS.map((planet, i) => (
        <div
          key={i}
          className="orbit-group"
          style={
            {
              '--orbit-radius': `${planet.orbitRadius}px`,
              '--orbit-duration': `${planet.duration}s`,
              '--start-angle': `${planet.startAngle}deg`,
              '--planet-size': `${planet.size}px`,
            } as CSSProperties
          }
        >
          <div className="orbit-path" />
          <div className="orbiting-planet">
            <img src={planet.src} loading="lazy" decoding="async" alt="" className="orbiting-planet-img" />
          </div>
        </div>
      ))}
    </div>
  );
});

function OrreryTile({ active }: LiveVisualProps) {
  const [index, setIndex] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  const subTextRef = useRef<HTMLParagraphElement>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);

  useGSAP(
    () => {
      if (!textRef.current || !subTextRef.current) return;
      const targets = [textRef.current, subTextRef.current];
      gsap.killTweensOf(targets);

      const tl = gsap.timeline({ paused: !active });
      tlRef.current = tl;
      gsap.set(targets, { opacity: 0, y: 20, filter: 'blur(10px)' });
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

  useEffect(() => {
    tlRef.current?.paused(!active);
  }, [active]);

  return (
    <div ref={rootRef} className={`cs-tile${active ? '' : ' is-paused'}`} aria-hidden="true">
      <div className="cs-orbits">
        <div className="cs-glow cs-glow--purple" />
        <div className="cs-glow cs-glow--blue" />
        <OrbitingPlanets />
      </div>

      <div className="hero-content-stack">
        <div className="cs-pill">
          <span className="cs-pill-new">New</span>
          <span className="cs-pill-text">Available on iPhone, iPad &amp; Mac</span>
          <ArrowRight size={12} className="cs-pill-arrow" />
        </div>
        <p className="hero-title">
          <span ref={textRef} className="block text-center whitespace-pre-wrap">
            {HERO_HEADLINES[index]}
          </span>
        </p>
        <p ref={subTextRef} className="hero-subtitle text-gradient">
          {HERO_SUBHEADLINES[index]}
        </p>
        <div className="cs-search">
          <Search size={18} className="cs-search-icon" />
          <span>Where were you born?</span>
        </div>
      </div>
    </div>
  );
}

export default memo(OrreryTile);
