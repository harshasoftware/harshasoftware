import { memo } from 'react';
import type { CSSProperties } from 'react';
import type { LiveVisualProps } from './types';
import { cn } from '@/lib/cn';

/**
 * A real CSS-3D octahedron (two square pyramids, eight equilateral faces) that
 * slowly turns — the Zyllion mark rebuilt as live geometry instead of a PNG.
 *
 * Face math: for base edge S the slant height is S·√3/2 and each face tilts
 * inward by atan(√2/2) ≈ 35.264° about its base edge, meeting at the apex.
 */
const S = 200; // base edge, px
const L = (S * Math.sqrt(3)) / 2; // face (slant) height
const TILT = 35.264; // degrees
const SHADES = ['#2b8fe8', '#0d5fb8', '#1a75d6', '#0a4d99'];

const FaceGlyph = () => (
  <svg viewBox="0 0 100 100" className="absolute left-1/2 top-[38%] w-[34%] -translate-x-1/2 -translate-y-1/2 opacity-95" aria-hidden="true">
    <path d="M22 18h56L34 70h44v12H22L66 30H22z" fill="#fff" fillOpacity="0.9" />
  </svg>
);

function Face({ k, upper }: { k: number; upper: boolean }) {
  const style: CSSProperties = {
    width: S,
    height: L,
    left: -S / 2,
    top: upper ? -L : 0,
    transformOrigin: upper ? '50% 100%' : '50% 0%',
    transform: `rotateY(${k * 90}deg) translateZ(${S / 2}px) rotateX(${upper ? TILT : -TILT}deg)`,
    clipPath: upper ? 'polygon(50% 0, 100% 100%, 0 100%)' : 'polygon(0 0, 100% 0, 50% 100%)',
    background: `linear-gradient(${upper ? 180 : 0}deg, ${SHADES[k]} 0%, ${SHADES[(k + 1) % 4]} 100%)`,
    backfaceVisibility: 'hidden',
  };
  return (
    <div className="absolute" style={style}>
      {upper && <FaceGlyph />}
    </div>
  );
}

function ZyllionOctahedron({ active }: LiveVisualProps) {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-white" aria-hidden="true">
      <div className="relative" style={{ perspective: 1100, width: S * 1.6, height: S * 1.9 }}>
        {/* floating wrapper */}
        <div
          className={cn('absolute inset-0 flex items-center justify-center motion-safe:animate-float', !active && '[animation-play-state:paused]')}
        >
          {/* viewing tilt */}
          <div style={{ transformStyle: 'preserve-3d', transform: 'rotateX(-18deg)' }}>
            {/* spinning solid */}
            <div
              className={cn('relative motion-safe:animate-spin-y', !active && '[animation-play-state:paused]')}
              style={{ transformStyle: 'preserve-3d', width: 0, height: 0 }}
            >
              {[0, 1, 2, 3].map((k) => (
                <Face key={`u${k}`} k={k} upper />
              ))}
              {[0, 1, 2, 3].map((k) => (
                <Face key={`l${k}`} k={k} upper={false} />
              ))}
            </div>
          </div>
        </div>
        {/* contact shadow */}
        <div
          className={cn('absolute bottom-[6%] left-1/2 h-[26px] w-[190px] -translate-x-1/2 rounded-[50%] bg-[#0b3f7a]/25 blur-md motion-safe:animate-shadow-pulse', !active && '[animation-play-state:paused]')}
        />
      </div>
    </div>
  );
}

export default memo(ZyllionOctahedron);
