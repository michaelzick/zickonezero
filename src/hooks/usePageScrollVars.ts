import { RefObject, useEffect } from 'react';

import { subscribeToScroll } from '../lib/city/scrollSignal';

/** Velocity (px per frame) that maps to a --scroll-velocity of 1. */
const FULL_SPEED = 40;

/**
 * Writes --page-progress (0 to 1) and --scroll-velocity (-1 to 1) onto one
 * element as the page scrolls. Scoping the variables to that element keeps the
 * per-frame style work out of the rest of the document.
 */
const usePageScrollVars = (ref: RefObject<HTMLElement | null>): void => {
  useEffect(() => {
    const node = ref.current;
    if (!node) {
      return undefined;
    }

    let progress = '';
    let velocity = '';

    return subscribeToScroll((snapshot) => {
      const nextProgress = snapshot.progress.toFixed(4);
      const nextVelocity = Math.max(-1, Math.min(1, snapshot.velocity / FULL_SPEED)).toFixed(3);

      if (nextProgress !== progress) {
        progress = nextProgress;
        node.style.setProperty('--page-progress', progress);
      }

      if (nextVelocity !== velocity) {
        velocity = nextVelocity;
        node.style.setProperty('--scroll-velocity', velocity);
      }
    });
  }, [ref]);
};

export default usePageScrollVars;
