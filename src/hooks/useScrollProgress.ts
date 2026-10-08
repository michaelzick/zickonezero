import { RefObject, useEffect } from 'react';

import { getScrollSnapshot, subscribeToScroll } from '../lib/city/scrollSignal';
import usePrefersReducedMotion from './usePrefersReducedMotion';

type ScrollProgressOptions = {
  /** Sets data-scrolled-past on the element once progress reaches this value. */
  pastAt?: number;
  /**
   * 'through' (the default) runs over the element's height minus one
   * viewport, for sticky scenes. 'enter' runs from the element's top reaching
   * the bottom of the viewport to its top reaching the top, for a scene the
   * visitor scrolls into.
   */
  track?: 'through' | 'enter';
};

/**
 * Writes --p (0 to 1) onto a scroll-driven scene: how far the visitor has
 * scrolled along its track (see ScrollProgressOptions). Geometry is measured
 * on mount and on resize, never per frame, so a scroll frame costs one style
 * write. Reduced motion leaves --p unset, so CSS falls back to a still frame.
 */
const useScrollProgress = (
  ref: RefObject<HTMLElement | null>,
  { pastAt, track = 'through' }: ScrollProgressOptions = {},
): void => {
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const node = ref.current;
    if (!node || prefersReducedMotion) {
      return undefined;
    }

    let top = 0;
    let distance = 1;
    let written = '';

    const measure = () => {
      const pageTop = node.getBoundingClientRect().top + window.scrollY;
      if (track === 'enter') {
        top = pageTop - window.innerHeight;
        distance = Math.max(window.innerHeight, 1);
      } else {
        top = pageTop;
        distance = Math.max(node.offsetHeight - window.innerHeight, 1);
      }
    };

    const write = (y: number) => {
      const progress = Math.min(Math.max((y - top) / distance, 0), 1);
      const next = progress.toFixed(4);
      if (next === written) {
        return;
      }

      written = next;
      node.style.setProperty('--p', next);
      if (pastAt !== undefined) {
        node.toggleAttribute('data-scrolled-past', progress >= pastAt);
      }
    };

    const remeasure = () => {
      measure();
      write(getScrollSnapshot().y);
    };

    measure();
    const unsubscribe = subscribeToScroll((snapshot) => write(snapshot.y));
    const resizeObserver = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(remeasure);
    resizeObserver?.observe(node);
    window.addEventListener('resize', remeasure);

    return () => {
      unsubscribe();
      resizeObserver?.disconnect();
      window.removeEventListener('resize', remeasure);
      node.style.removeProperty('--p');
      node.removeAttribute('data-scrolled-past');
    };
  }, [ref, pastAt, track, prefersReducedMotion]);
};

export default useScrollProgress;
