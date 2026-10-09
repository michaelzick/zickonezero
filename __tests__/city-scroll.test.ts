import { createScrollJumper, easeInOutCubic, getJumpDuration } from '../src/lib/city/scroll';
import { REDUCED_MOTION_QUERY, mockMatchMedia, restoreMatchMedia } from '../src/test/matchMedia';

const scrollTo = window.scrollTo as jest.Mock;

/** The last y the jumper scrolled the window to. */
const lastScrollY = () => scrollTo.mock.calls[scrollTo.mock.calls.length - 1]?.[1] as number | undefined;

describe('easeInOutCubic', () => {
  it('starts, turns, and ends where an ease should', () => {
    expect(easeInOutCubic(0)).toBe(0);
    expect(easeInOutCubic(0.5)).toBe(0.5);
    expect(easeInOutCubic(1)).toBe(1);
  });

  it('is symmetric and always moving forward', () => {
    let previous = 0;
    for (let t = 0; t <= 1; t += 0.05) {
      expect(easeInOutCubic(t) + easeInOutCubic(1 - t)).toBeCloseTo(1);
      expect(easeInOutCubic(t)).toBeGreaterThanOrEqual(previous);
      previous = easeInOutCubic(t);
    }
  });
});

describe('getJumpDuration', () => {
  it.each([
    [0, 900],
    [1000, 900],
    [2000, 1400],
    [-2000, 1400],
    [10000, 1800],
  ])('takes %p pixels in %p ms', (distance, duration) => {
    expect(getJumpDuration(distance)).toBe(duration);
  });
});

describe('createScrollJumper', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    scrollTo.mockClear();
    Object.defineProperty(window, 'scrollY', { configurable: true, writable: true, value: 0 });
    // Frames carry the same clock the jumper reads.
    jest.spyOn(window, 'requestAnimationFrame').mockImplementation((callback) => (
      window.setTimeout(() => callback(performance.now()), 16)
    ));
    jest.spyOn(window, 'cancelAnimationFrame').mockImplementation((frame) => window.clearTimeout(frame));
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.restoreAllMocks();
    restoreMatchMedia();
  });

  it('eases to the target and stays busy until the page settles', () => {
    const jumper = createScrollJumper();

    expect(jumper.jumpTo(2000)).toBe(1400);
    expect(jumper.isJumping()).toBe(true);

    jest.advanceTimersByTime(700);
    expect(lastScrollY()).toBeGreaterThan(800);
    expect(lastScrollY()).toBeLessThan(1200);

    jest.advanceTimersByTime(720);
    expect(lastScrollY()).toBe(2000);
    // A beat past the last frame, so scroll-spy ignores the final scroll event.
    expect(jumper.isJumping()).toBe(true);

    jest.advanceTimersByTime(60);
    expect(jumper.isJumping()).toBe(false);
  });

  it('jumps at once under reduced motion', () => {
    mockMatchMedia(REDUCED_MOTION_QUERY);
    const jumper = createScrollJumper();

    expect(jumper.jumpTo(2000)).toBe(0);
    expect(scrollTo).toHaveBeenCalledWith({ top: 2000, behavior: 'auto' });
    expect(jumper.isJumping()).toBe(false);
  });

  it('does nothing when already there', () => {
    window.scrollY = 500;
    const jumper = createScrollJumper();

    expect(jumper.jumpTo(500.4)).toBe(0);
    expect(scrollTo).not.toHaveBeenCalled();
    expect(jumper.isJumping()).toBe(false);
  });

  it.each([
    ['a wheel', () => new Event('wheel')],
    ['a touch', () => new Event('touchstart')],
    ['a scrolling key', () => new KeyboardEvent('keydown', { key: 'PageDown' })],
  ])('lets %s take over mid-jump', (_, createEvent) => {
    const jumper = createScrollJumper();
    jumper.jumpTo(2000);
    jest.advanceTimersByTime(300);

    window.dispatchEvent(createEvent());
    const stoppedAt = scrollTo.mock.calls.length;
    jest.advanceTimersByTime(2000);

    expect(jumper.isJumping()).toBe(false);
    expect(scrollTo).toHaveBeenCalledTimes(stoppedAt);
  });

  it('ignores keys that do not scroll', () => {
    const jumper = createScrollJumper();
    jumper.jumpTo(2000);

    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'a' }));

    expect(jumper.isJumping()).toBe(true);
  });

  it('retargets a running jump', () => {
    const jumper = createScrollJumper();
    jumper.jumpTo(2000);
    jest.advanceTimersByTime(300);

    jumper.jumpTo(100);
    jest.advanceTimersByTime(2000);

    expect(lastScrollY()).toBe(100);
  });

  it('stops listening once cancelled', () => {
    const removeListener = jest.spyOn(window, 'removeEventListener');
    const jumper = createScrollJumper();
    jumper.jumpTo(2000);

    jumper.cancel();

    expect(jumper.isJumping()).toBe(false);
    expect(removeListener).toHaveBeenCalledWith('wheel', expect.any(Function));
    expect(removeListener).toHaveBeenCalledWith('keydown', expect.any(Function));
  });
});
