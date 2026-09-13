import { useEffect, useState, type RefObject } from 'react';

export interface NearViewport {
  /** Latches true the first time the element comes within `rootMargin` of the viewport. */
  near: boolean;
  /** Live: whether the element currently intersects the viewport. */
  inView: boolean;
}

const hasIO = typeof IntersectionObserver !== 'undefined';

export function useNearViewport(ref: RefObject<Element | null>, rootMargin = '400px 0px'): NearViewport {
  const [near, setNear] = useState(false);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || !hasIO) return;
    const nearObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setNear(true);
          nearObserver.disconnect();
        }
      },
      { rootMargin },
    );
    const viewObserver = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0.05 });
    nearObserver.observe(el);
    viewObserver.observe(el);
    return () => {
      nearObserver.disconnect();
      viewObserver.disconnect();
    };
  }, [ref, rootMargin]);

  // Without IntersectionObserver (very old browsers) just treat the tile as visible.
  return hasIO ? { near, inView } : { near: true, inView: true };
}
