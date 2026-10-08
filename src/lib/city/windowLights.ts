/**
 * Timing and selection for the city's window lights (src/hooks/useWindowLights.ts).
 *
 * A scene draws a cover over a few single lit windows (`.flicker-window`).
 * Every few seconds one cover is switched, so a light goes out or comes back
 * on; now and then a second window follows shortly after. One window changes
 * at a time with no buzz, so it reads as people switching lights, not as a
 * rendering glitch, and stays far inside WCAG 2.3.1's flash limits.
 */

/**
 * Delay between one light switching and the next, per scene. The skyline and
 * the hero alley each run their own, so on the homepage a light changes about
 * every two or three seconds somewhere on screen.
 */
export const SWITCH_DELAY_MS = { min: 2400, max: 7200 } as const;
/** How often a second window follows, and how soon. */
export const FOLLOW_CHANCE = 0.2;
export const FOLLOW_DELAY_MS = { min: 350, max: 900 } as const;
/** Windows switched this recently are left alone, so none blinks back. */
export const RECENT_LIMIT = 4;

/**
 * Every third cover starts drawn, so some windows begin dark and can come on.
 * Deterministic, so the static HTML matches hydration.
 */
export const startsOff = (index: number): boolean => index % 3 === 0;

export const between = (range: { min: number; max: number }, random: () => number = Math.random): number => (
  range.min + random() * (range.max - range.min)
);

/**
 * Picks a window to switch, skipping the ones in `recent`. Returns -1 when
 * every window is recent (a scene with fewer windows than RECENT_LIMIT + 1).
 */
export const pickWindow = (count: number, recent: readonly number[], random: () => number = Math.random): number => {
  const candidates: number[] = [];
  for (let index = 0; index < count; index += 1) {
    if (!recent.includes(index)) {
      candidates.push(index);
    }
  }

  return candidates.length === 0 ? -1 : candidates[Math.floor(random() * candidates.length)];
};
