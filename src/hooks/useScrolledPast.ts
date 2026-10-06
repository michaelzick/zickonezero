import { useEffect, useState } from 'react';

import { subscribeToScroll } from '../lib/city/scrollSignal';

/**
 * True once the page has scrolled more than `threshold` pixels. It re-renders
 * only when the answer flips, not on every scroll frame.
 */
const useScrolledPast = (threshold: number): boolean => {
  const [isPast, setIsPast] = useState(false);

  useEffect(() => subscribeToScroll(({ y }) => setIsPast(y > threshold)), [threshold]);

  return isPast;
};

export default useScrolledPast;
