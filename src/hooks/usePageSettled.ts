import { useEffect, useState } from 'react';

/**
 * Turns true `delayMs` after the window's load event, for work that should
 * wait until the visitor has the page to themselves. It is always false on
 * the server and during hydration, so the static HTML is the same either way.
 */
const usePageSettled = (delayMs: number): boolean => {
  const [isSettled, setIsSettled] = useState(false);

  useEffect(() => {
    let timer: number | undefined;
    const startTimer = () => {
      timer = window.setTimeout(() => setIsSettled(true), delayMs);
    };

    if (document.readyState === 'complete') {
      startTimer();
    } else {
      window.addEventListener('load', startTimer, { once: true });
    }

    return () => {
      window.removeEventListener('load', startTimer);
      window.clearTimeout(timer);
    };
  }, [delayMs]);

  return isSettled;
};

export default usePageSettled;
