import { RefObject, useEffect } from 'react';

import usePrefersReducedMotion from './usePrefersReducedMotion';

// Network Information is optional and not part of TypeScript's DOM library.
type DataConnection = {
  saveData?: boolean;
  addEventListener?: (type: 'change', listener: () => void) => void;
  removeEventListener?: (type: 'change', listener: () => void) => void;
};

/** Controls ambient CSS animations without a React render or a frame loop. */
const useSceneMotion = (ref: RefObject<HTMLElement | null>): void => {
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const node = ref.current;
    if (!node) {
      return undefined;
    }

    const connection = (navigator as Navigator & { connection?: DataConnection }).connection;
    // Wait for the observer's first measurement before starting offscreen work.
    let visible = typeof IntersectionObserver === 'undefined';

    const sync = () => {
      const state = reducedMotion || connection?.saveData
        ? 'still'
        : visible && !document.hidden ? 'running' : 'paused';
      node.setAttribute('data-scene-motion', state);
    };

    const observer = typeof IntersectionObserver === 'undefined'
      ? null
      : new IntersectionObserver(([entry]) => {
        visible = entry.isIntersecting;
        sync();
      });
    observer?.observe(node);
    document.addEventListener('visibilitychange', sync);
    connection?.addEventListener?.('change', sync);
    sync();

    return () => {
      observer?.disconnect();
      document.removeEventListener('visibilitychange', sync);
      connection?.removeEventListener?.('change', sync);
      node.removeAttribute('data-scene-motion');
    };
  }, [ref, reducedMotion]);
};

export default useSceneMotion;
