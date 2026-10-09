import { RefObject, useEffect } from 'react';

import usePrefersReducedMotion from './usePrefersReducedMotion';

const FINE_POINTER = '(hover: hover) and (pointer: fine)';
// Share of the remaining distance covered each frame: a soft, trailing follow.
const EASE = 0.08;
const SETTLED = 0.002;

const clampUnit = (value: number) => Math.min(Math.max(value, -1), 1);

/**
 * Head-tracking parallax for a scene. While a mouse or trackpad moves over
 * the element, it writes eased --px and --py (-1 to 1 from the center).
 * Touch screens and reduced motion get none of it, so the scene rests centered.
 */
const usePointerParallax = (ref: RefObject<HTMLElement | null>): void => {
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const node = ref.current;
    if (!node || prefersReducedMotion || !window.matchMedia(FINE_POINTER).matches) {
      return undefined;
    }

    let frame: number | null = null;
    let inside = false;
    let clientX = 0;
    let clientY = 0;
    const target = { x: 0, y: 0 };
    const current = { x: 0, y: 0 };

    const step = () => {
      frame = null;

      if (inside) {
        const rect = node.getBoundingClientRect();
        const x = clientX - rect.left;
        const y = clientY - rect.top;
        target.x = clampUnit((x / Math.max(rect.width, 1)) * 2 - 1);
        target.y = clampUnit((y / Math.max(rect.height, 1)) * 2 - 1);
      }

      current.x += (target.x - current.x) * EASE;
      current.y += (target.y - current.y) * EASE;
      const settled = Math.abs(target.x - current.x) < SETTLED && Math.abs(target.y - current.y) < SETTLED;
      if (settled) {
        current.x = target.x;
        current.y = target.y;
      }

      node.style.setProperty('--px', current.x.toFixed(3));
      node.style.setProperty('--py', current.y.toFixed(3));

      if (!settled) {
        schedule();
      }
    };

    function schedule() {
      if (frame === null) {
        frame = window.requestAnimationFrame(step);
      }
    }

    const handleMove = (event: PointerEvent) => {
      if (event.pointerType === 'touch') {
        return;
      }

      clientX = event.clientX;
      clientY = event.clientY;
      inside = true;
      schedule();
    };

    const handleLeave = () => {
      inside = false;
      target.x = 0;
      target.y = 0;
      schedule();
    };

    node.addEventListener('pointermove', handleMove);
    node.addEventListener('pointerleave', handleLeave);

    return () => {
      node.removeEventListener('pointermove', handleMove);
      node.removeEventListener('pointerleave', handleLeave);
      if (frame !== null) {
        window.cancelAnimationFrame(frame);
      }
      ['--px', '--py'].forEach((property) => node.style.removeProperty(property));
    };
  }, [ref, prefersReducedMotion]);
};

export default usePointerParallax;
