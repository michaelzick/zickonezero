import { useSyncExternalStore } from 'react';

const QUERY = '(prefers-reduced-motion: reduce)';

const subscribe = (onChange: () => void) => {
  const mediaQuery = window.matchMedia(QUERY);

  if (typeof mediaQuery.addEventListener === 'function') {
    mediaQuery.addEventListener('change', onChange);
    return () => mediaQuery.removeEventListener('change', onChange);
  }

  // Safari before 14 only has the deprecated listener API.
  mediaQuery.addListener(onChange);
  return () => mediaQuery.removeListener(onChange);
};

const getSnapshot = () => window.matchMedia(QUERY).matches;

// The static HTML assumes full motion; the client corrects it after hydration.
const getServerSnapshot = () => false;

/** True when the visitor asked the OS to minimize motion. */
const usePrefersReducedMotion = (): boolean => useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

export default usePrefersReducedMotion;
