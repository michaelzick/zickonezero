/**
 * One shared, rAF-throttled window scroll listener for the city layers.
 *
 * Subscribers get the scroll position, a smoothed velocity that eases back to
 * zero after scrolling stops, and the page progress. Nothing here touches
 * React state, so scrolling never re-renders a component.
 */

export type ScrollSnapshot = {
  /** window.scrollY in CSS pixels. */
  y: number;
  /** Pixels scrolled since the previous frame; 0 for jumps such as navigation. */
  delta: number;
  /** Smoothed pixels per frame, positive when scrolling down. */
  velocity: number;
  /** Position within the scrollable height, from 0 to 1. */
  progress: number;
};

type ScrollListener = (snapshot: ScrollSnapshot) => void;

const SMOOTHING = 0.2;
const REST_VELOCITY = 0.05;
const MAX_FRAME_DELTA = 160;

const listeners = new Set<ScrollListener>();
let snapshot: ScrollSnapshot = { y: 0, delta: 0, velocity: 0, progress: 0 };
let lastY = 0;
let frame: number | null = null;

const measure = () => {
  frame = null;

  const y = window.scrollY;
  const rawDelta = y - lastY;
  lastY = y;

  // A jump of more than a viewport (route change, anchor link) is a teleport,
  // not motion.
  const delta = Math.abs(rawDelta) > window.innerHeight ? 0 : rawDelta;
  const frameDelta = Math.max(-MAX_FRAME_DELTA, Math.min(MAX_FRAME_DELTA, delta));
  let velocity = snapshot.velocity + (frameDelta - snapshot.velocity) * SMOOTHING;
  if (delta === 0 && Math.abs(velocity) < REST_VELOCITY) {
    velocity = 0;
  }

  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  const progress = maxScroll > 0 ? Math.min(Math.max(y / maxScroll, 0), 1) : 0;

  snapshot = { y, delta, velocity, progress };
  listeners.forEach((listener) => listener(snapshot));

  // Keep easing the velocity to rest after the last scroll event.
  if (velocity !== 0) {
    schedule();
  }
};

function schedule() {
  if (frame === null) {
    frame = window.requestAnimationFrame(measure);
  }
}

export const subscribeToScroll = (listener: ScrollListener): (() => void) => {
  listeners.add(listener);

  if (listeners.size === 1) {
    lastY = window.scrollY;
    snapshot = { ...snapshot, y: lastY, delta: 0, velocity: 0 };
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
  }

  schedule();

  return () => {
    listeners.delete(listener);

    if (listeners.size === 0) {
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      if (frame !== null) {
        window.cancelAnimationFrame(frame);
        frame = null;
      }
    }
  };
};

export const getScrollSnapshot = (): ScrollSnapshot => snapshot;
