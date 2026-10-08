import { RefObject, useEffect } from 'react';

import {
  between,
  FOLLOW_CHANCE,
  FOLLOW_DELAY_MS,
  pickWindow,
  RECENT_LIMIT,
  SWITCH_DELAY_MS,
} from '../lib/city/windowLights';
import usePrefersReducedMotion from './usePrefersReducedMotion';

/**
 * Switches the odd window light off or on inside a scene by toggling
 * `is-off` on its `.flicker-window` covers (see src/lib/city/windowLights.ts).
 * Night only: it rests in hidden tabs, by day, under reduced motion, and while
 * the scene's data-scene-motion (from useSceneMotion) is anything but running.
 * Purely visual, so it changes classes instead of React state.
 */
const useWindowLights = (ref: RefObject<Element | null>): void => {
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const root = ref.current;
    if (!root || reducedMotion) {
      return undefined;
    }

    const windows = Array.from(root.querySelectorAll('.flicker-window'));
    if (windows.length === 0) {
      return undefined;
    }

    const timers = new Set<number>();
    const recent: number[] = [];

    const later = (callback: () => void, delay: number) => {
      const id = window.setTimeout(() => {
        timers.delete(id);
        callback();
      }, delay);
      timers.add(id);
    };

    const canSwitch = () => (
      !document.hidden
      && document.documentElement.getAttribute('data-theme') !== 'light'
      && (root.getAttribute('data-scene-motion') ?? 'running') === 'running'
    );

    const switchOne = () => {
      const index = pickWindow(windows.length, recent);
      if (index < 0) {
        return;
      }

      windows[index].classList.toggle('is-off');
      recent.push(index);
      if (recent.length > Math.min(RECENT_LIMIT, windows.length - 1)) {
        recent.shift();
      }
    };

    const tick = () => {
      if (canSwitch()) {
        switchOne();
        if (Math.random() < FOLLOW_CHANCE) {
          later(() => {
            if (canSwitch()) {
              switchOne();
            }
          }, between(FOLLOW_DELAY_MS));
        }
      }
      later(tick, between(SWITCH_DELAY_MS));
    };

    later(tick, between(SWITCH_DELAY_MS));

    return () => {
      timers.forEach((id) => window.clearTimeout(id));
      timers.clear();
    };
  }, [ref, reducedMotion]);
};

export default useWindowLights;
