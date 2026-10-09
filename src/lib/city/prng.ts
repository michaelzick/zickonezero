/**
 * Seeded pseudo-random numbers for the procedural city.
 *
 * Every layout decision (building widths, lit windows, sign positions) comes
 * from a fixed seed so the statically exported HTML and the hydrated client
 * render identical markup. Math.random is reserved for post-mount visuals.
 */

export type Random = {
  /** Next float in [0, 1). */
  next: () => number;
  /** Float in [min, max). */
  range: (min: number, max: number) => number;
  /** Integer in [min, max], inclusive. */
  int: (min: number, max: number) => number;
  /** True with the given probability. */
  chance: (probability: number) => boolean;
  /** One element of a non-empty list. */
  pick: <T>(items: readonly T[]) => T;
};

/** mulberry32: tiny, fast, and good enough for art. */
export const mulberry32 = (seed: number): (() => number) => {
  let state = seed >>> 0;

  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};

export const createRandom = (seed: number): Random => {
  const next = mulberry32(seed);

  const range = (min: number, max: number) => min + (max - min) * next();
  const int = (min: number, max: number) => Math.floor(range(min, max + 1));

  return {
    next,
    range,
    int,
    chance: (probability) => next() < probability,
    pick: (items) => {
      if (items.length === 0) {
        throw new Error('pick() needs at least one item');
      }

      return items[Math.min(items.length - 1, Math.floor(next() * items.length))];
    },
  };
};
