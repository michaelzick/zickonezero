import { isRevealable } from '../src/hooks/useAnimatedSections';

describe('isRevealable', () => {
  it('reveals a section once 22% of its height is on screen', () => {
    expect(isRevealable(130, 600, 900)).toBe(false);
    expect(isRevealable(132, 600, 900)).toBe(true);
  });

  it('reveals a section taller than four screens once it fills a quarter of the viewport', () => {
    // 22% of 4000px is more than the screen can show at once.
    expect(isRevealable(760, 4000, 760)).toBe(true);
    expect(isRevealable(180, 4000, 760)).toBe(false);
    expect(isRevealable(190, 4000, 760)).toBe(true);
  });

  it('never reveals a section with nothing on screen', () => {
    expect(isRevealable(0, 0, 760)).toBe(false);
    expect(isRevealable(0, 600, 760)).toBe(false);
  });
});
