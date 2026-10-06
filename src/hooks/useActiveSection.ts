import { RefObject, useEffect, useState } from 'react';
import type { Dispatch, SetStateAction } from 'react';

import { subscribeToScroll } from '../lib/city/scrollSignal';

type Options = {
  /**
   * Distance from the viewport top, in pixels, where a section counts as
   * reached (below a fixed nav, say). Called on every check.
   */
  getOffset: () => number;
  /** While this returns true (an in-page jump is running), the active section holds. */
  isPaused?: () => boolean;
};

/**
 * Scroll-spy for a page's sections. The active key is the last section, in
 * page order, whose top has scrolled past the offset line; above the first
 * section it is null. The setter lets a click claim a section before the
 * jump to it lands. Pass stable arguments: changing them resubscribes.
 */
const useActiveSection = <K extends string>(
  sectionsRef: RefObject<Record<K, HTMLElement | null>>,
  order: readonly K[],
  { getOffset, isPaused }: Options,
): [K | null, Dispatch<SetStateAction<K | null>>] => {
  const [active, setActive] = useState<K | null>(null);

  useEffect(() => subscribeToScroll(() => {
    if (isPaused?.()) {
      return;
    }

    const line = getOffset();
    let next: K | null = null;
    for (const key of order) {
      const top = sectionsRef.current?.[key]?.getBoundingClientRect().top;
      if (top !== undefined && top - line <= 0) {
        next = key;
      }
    }

    setActive((previous) => (previous === next ? previous : next));
  }), [sectionsRef, order, getOffset, isPaused]);

  return [active, setActive];
};

export default useActiveSection;
