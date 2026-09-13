import { lazy, type ComponentType, type LazyExoticComponent } from 'react';
import type { VisualKey } from '@/data/projects';
import type { LiveVisualProps } from './types';

export interface VisualEntry {
  Component: LazyExoticComponent<ComponentType<LiveVisualProps>>;
  /** Skip mounting when the browser has no WebGL (poster stays). */
  requiresWebGL: boolean;
  /** Minimum viewport width; below it only the poster is shown. */
  minWidth: number;
}

// Created once at module scope so React.lazy identities are stable across renders.
export const visuals: Record<VisualKey, VisualEntry> = {
  cartostar: { Component: lazy(() => import('./CartostarVisual')), requiresWebGL: false, minWidth: 0 },
  halohome: { Component: lazy(() => import('./HaloHomeVisual')), requiresWebGL: false, minWidth: 1200 },
  zyllion: { Component: lazy(() => import('./ZyllionOctahedron')), requiresWebGL: false, minWidth: 0 },
  priceguru: { Component: lazy(() => import('./PriceGuruPopup')), requiresWebGL: false, minWidth: 0 },
};
