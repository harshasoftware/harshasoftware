import { useId, useState, type CSSProperties, type ReactNode } from 'react';
import { Pause, Play } from 'lucide-react';
import { cn } from '@/lib/cn';

interface InfiniteMovingCardsProps<T> {
  items: T[];
  getKey: (item: T) => string;
  renderItem: (item: T) => ReactNode;
  direction?: 'left' | 'right';
  speed?: 'fast' | 'normal' | 'slow';
  pauseOnHover?: boolean;
  className?: string;
  label?: string;
}

const DURATION = { fast: '30s', normal: '60s', slow: '110s' } as const;

/**
 * Seamless horizontal marquee (ported from the Aceternity "infinite moving cards"
 * pattern). The list is rendered twice so the CSS keyframe can translate by exactly
 * half its width; the duplicate is aria-hidden. Pauses on hover, keyboard focus,
 * the explicit pause button, and entirely under prefers-reduced-motion.
 */
export function InfiniteMovingCards<T>({
  items,
  getKey,
  renderItem,
  direction = 'left',
  speed = 'normal',
  pauseOnHover = true,
  className,
  label = 'Scrolling cards',
}: InfiniteMovingCardsProps<T>) {
  const [paused, setPaused] = useState(false);
  const id = useId();
  const style = {
    '--animation-duration': DURATION[speed],
    '--animation-direction': direction === 'left' ? 'forwards' : 'reverse',
  } as CSSProperties;

  return (
    <div className={cn('relative', className)}>
      <div
        id={id}
        role="region"
        aria-label={label}
        style={style}
        className="relative w-full overflow-x-auto overflow-y-hidden [mask-image:linear-gradient(to_right,transparent,white_8%,white_92%,transparent)] motion-safe:overflow-x-hidden"
      >
        <ul
          className={cn(
            'flex w-max min-w-full shrink-0 flex-nowrap gap-4 py-6 motion-safe:animate-scroll motion-reduce:animate-none',
            pauseOnHover && 'hover:[animation-play-state:paused] focus-within:[animation-play-state:paused]',
            paused && '[animation-play-state:paused]',
          )}
        >
          {items.map((item) => (
            <li key={getKey(item)} className="shrink-0">
              {renderItem(item)}
            </li>
          ))}
          {items.map((item) => (
            <li key={`dup-${getKey(item)}`} className="shrink-0" aria-hidden="true">
              {renderItem(item)}
            </li>
          ))}
        </ul>
      </div>
      <button
        type="button"
        onClick={() => setPaused((p) => !p)}
        aria-pressed={paused}
        aria-controls={id}
        aria-label={paused ? 'Play scrolling reviews' : 'Pause scrolling reviews'}
        className="absolute -bottom-2 right-4 hidden items-center gap-1.5 rounded-full border border-neutral-200 bg-white px-3 py-1.5 text-[12px] font-bold text-body shadow-sm transition hover:border-neutral-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky motion-safe:inline-flex"
      >
        {paused ? <Play className="size-3.5" aria-hidden="true" /> : <Pause className="size-3.5" aria-hidden="true" />}
        {paused ? 'Play' : 'Pause'}
      </button>
    </div>
  );
}
