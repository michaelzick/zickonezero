import { useLayoutEffect, useState } from 'react';
import type { RefObject } from 'react';

import { isFirstCityLoad } from '../lib/city/powerOn';
import usePrefersReducedMotion from './usePrefersReducedMotion';

type Options = {
  /** The element whose arrival on screen powers the effect on; defaults to the root. */
  watch?: RefObject<Element | null>;
  /** Set on the root once it powers on, such as 'data-booted'. */
  poweredAttribute: string;
  /** Keep this stable (a module constant): a new object re-arms the effect. */
  observerOptions: IntersectionObserverInit;
};

const isOnScreen = (element: Element) => {
  const { top, bottom } = element.getBoundingClientRect();
  return bottom > 0 && top < window.innerHeight;
};

/**
 * Holds an element dark (data-standby) until it scrolls into view, then sets
 * poweredAttribute so its CSS power-on animation plays. It only arms on the
 * first page load (see src/lib/city/powerOn.ts), never under reduced motion,
 * and never for an element already on screen. It arms in a layout effect so
 * nothing paints visible and then blinks out.
 */
const usePowerOn = (
  root: RefObject<HTMLElement | null>,
  { watch = root, poweredAttribute, observerOptions }: Options,
): void => {
  const prefersReducedMotion = usePrefersReducedMotion();
  const [isFirstLoad] = useState(isFirstCityLoad);

  useLayoutEffect(() => {
    const node = root.current;
    const target = watch.current;
    if (
      !node
      || !target
      || !isFirstLoad
      || prefersReducedMotion
      || typeof IntersectionObserver === 'undefined'
      || isOnScreen(target)
    ) {
      return undefined;
    }

    node.setAttribute('data-standby', '');
    const observer = new IntersectionObserver((entries) => {
      if (!entries.some((entry) => entry.isIntersecting)) {
        return;
      }

      node.removeAttribute('data-standby');
      node.setAttribute(poweredAttribute, '');
      observer.disconnect();
    }, observerOptions);
    observer.observe(target);

    return () => {
      observer.disconnect();
      node.removeAttribute('data-standby');
    };
  }, [root, watch, isFirstLoad, prefersReducedMotion, poweredAttribute, observerOptions]);
};

export default usePowerOn;
