import { RefObject, useEffect } from 'react';

import usePrefersReducedMotion from './usePrefersReducedMotion';

const FINE_POINTER = '(hover: hover) and (pointer: fine)';

const clampUnit = (value: number) => Math.min(Math.max(value, -1), 1);

/**
 * Tilts a card toward a mouse or trackpad pointer. While the pointer is over
 * the element it writes --tx and --ty (-1 to 1 from the center) at most once
 * a frame, and clears them when the pointer leaves so CSS can ease the card
 * back. Touch screens and reduced motion never tilt.
 */
const usePointerTilt = (ref: RefObject<HTMLElement | null>): void => {
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const node = ref.current;
    if (!node || prefersReducedMotion || !window.matchMedia(FINE_POINTER).matches) {
      return undefined;
    }

    let frame: number | null = null;
    let rect: DOMRect | null = null;
    let measuredAtY = 0;
    let clientX = 0;
    let clientY = 0;

    // Measured on entry, while the card is level, and again only if the page
    // has scrolled under the pointer since.
    const measure = () => {
      rect = node.getBoundingClientRect();
      measuredAtY = window.scrollY;
    };

    const step = () => {
      frame = null;
      if (!rect) {
        return;
      }

      const x = clampUnit(((clientX - rect.left) / Math.max(rect.width, 1)) * 2 - 1);
      const y = clampUnit(((clientY - rect.top) / Math.max(rect.height, 1)) * 2 - 1);
      node.style.setProperty('--tx', x.toFixed(3));
      node.style.setProperty('--ty', y.toFixed(3));
    };

    const handleEnter = (event: PointerEvent) => {
      if (event.pointerType !== 'touch') {
        measure();
      }
    };

    const handleMove = (event: PointerEvent) => {
      if (event.pointerType === 'touch') {
        return;
      }

      if (!rect || measuredAtY !== window.scrollY) {
        measure();
      }

      clientX = event.clientX;
      clientY = event.clientY;
      if (frame === null) {
        frame = window.requestAnimationFrame(step);
      }
    };

    const reset = () => {
      rect = null;
      if (frame !== null) {
        window.cancelAnimationFrame(frame);
        frame = null;
      }
      node.style.removeProperty('--tx');
      node.style.removeProperty('--ty');
    };

    node.addEventListener('pointerenter', handleEnter);
    node.addEventListener('pointermove', handleMove);
    node.addEventListener('pointerleave', reset);

    return () => {
      node.removeEventListener('pointerenter', handleEnter);
      node.removeEventListener('pointermove', handleMove);
      node.removeEventListener('pointerleave', reset);
      reset();
    };
  }, [ref, prefersReducedMotion]);
};

export default usePointerTilt;
