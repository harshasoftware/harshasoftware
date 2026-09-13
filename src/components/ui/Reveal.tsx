import type { ReactNode } from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';

interface RevealProps extends Omit<HTMLMotionProps<'div'>, 'children'> {
  children?: ReactNode;
  delay?: number;
  y?: number;
}

/** Fade + slide in when scrolled into view; a plain div under prefers-reduced-motion. */
export function Reveal({ delay = 0, y = 24, children, ...rest }: RevealProps) {
  const reduced = usePrefersReducedMotion();
  if (reduced) return <div className={rest.className}>{children}</div>;
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px 0px' }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
      {...rest}
    >
      {children}
    </motion.div>
  );
}
