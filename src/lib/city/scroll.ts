/**
 * Eased in-page jumps, such as the homepage HUD's fast travel between
 * districts. While a jump runs, the jumper reports itself busy so scroll-spy
 * code can ignore the frames it causes. A wheel, a touch, or a scrolling key
 * from the visitor stops the jump instead of fighting it.
 */

const MIN_DURATION_MS = 900;
const MAX_DURATION_MS = 1800;
const MS_PER_PIXEL = 0.7;
// Keeps the lock a beat past the last frame, so the final scroll event is ignored too.
const SETTLE_MS = 50;

const INTERRUPT_EVENTS = ['wheel', 'touchstart'] as const;
const SCROLL_KEYS = new Set(['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End', ' ']);

export const easeInOutCubic = (t: number): number => (
  t < 0.5
    ? 4 * t * t * t
    : 1 - Math.pow(-2 * t + 2, 3) / 2
);

export const getJumpDuration = (distance: number): number => (
  Math.min(MAX_DURATION_MS, Math.max(MIN_DURATION_MS, Math.abs(distance) * MS_PER_PIXEL))
);

export type ScrollJumper = {
  /**
   * Scrolls the window to targetY, eased, or instantly under reduced motion.
   * Returns how long the jump takes in milliseconds (0 when instant).
   */
  jumpTo: (targetY: number) => number;
  /** True while a jump is moving the page. */
  isJumping: () => boolean;
  /** Stops a running jump where it is. */
  cancel: () => void;
};

export const createScrollJumper = (): ScrollJumper => {
  let frame: number | null = null;
  let settleTimeout: number | null = null;
  let jumping = false;

  const handleKey = (event: KeyboardEvent) => {
    if (SCROLL_KEYS.has(event.key)) {
      cancel();
    }
  };

  const startListening = () => {
    INTERRUPT_EVENTS.forEach((type) => window.addEventListener(type, cancel, { passive: true }));
    window.addEventListener('keydown', handleKey);
  };

  const stopListening = () => {
    INTERRUPT_EVENTS.forEach((type) => window.removeEventListener(type, cancel));
    window.removeEventListener('keydown', handleKey);
  };

  function cancel() {
    if (frame !== null) {
      window.cancelAnimationFrame(frame);
      frame = null;
    }

    if (settleTimeout !== null) {
      window.clearTimeout(settleTimeout);
      settleTimeout = null;
    }

    jumping = false;
    stopListening();
  }

  const jumpTo = (targetY: number): number => {
    cancel();

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      window.scrollTo({ top: targetY, behavior: 'auto' });
      return 0;
    }

    const startY = window.scrollY;
    const delta = targetY - startY;
    if (Math.abs(delta) < 1) {
      return 0;
    }

    const durationMs = getJumpDuration(delta);
    const startTime = performance.now();
    jumping = true;

    const tick = (now: number) => {
      const progress = Math.min(Math.max((now - startTime) / durationMs, 0), 1);
      window.scrollTo(0, startY + delta * easeInOutCubic(progress));

      if (progress < 1) {
        frame = window.requestAnimationFrame(tick);
        return;
      }

      frame = null;
      stopListening();
      settleTimeout = window.setTimeout(() => {
        settleTimeout = null;
        jumping = false;
      }, SETTLE_MS);
    };

    frame = window.requestAnimationFrame(tick);
    startListening();
    return durationMs;
  };

  return {
    jumpTo,
    isJumping: () => jumping,
    cancel,
  };
};
