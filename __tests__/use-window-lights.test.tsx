import { act, render } from '@testing-library/react';
import { useRef } from 'react';

import useWindowLights from '../src/hooks/useWindowLights';
import { pickWindow, startsOff, SWITCH_DELAY_MS } from '../src/lib/city/windowLights';
import { REDUCED_MOTION_QUERY, mockMatchMedia, restoreMatchMedia } from '../src/test/matchMedia';

const WINDOW_COUNT = 6;

const Scene = () => {
  const ref = useRef<HTMLDivElement>(null);
  useWindowLights(ref);
  return (
    <div ref={ref} data-testid='scene'>
      {Array.from({ length: WINDOW_COUNT }, (_, index) => (
        <span key={index} className={`flicker-window${startsOff(index) ? ' is-off' : ''}`} />
      ))}
    </div>
  );
};

const originalHidden = Object.getOwnPropertyDescriptor(document, 'hidden');

const offStates = (scene: HTMLElement) => Array.from(
  scene.querySelectorAll('.flicker-window'),
  (node) => node.classList.contains('is-off'),
);

const changedCount = (before: boolean[], after: boolean[]) => before.filter((state, index) => state !== after[index]).length;

// Long enough for at least one switch whatever the random delay.
const waitForSwitch = () => act(() => {
  jest.advanceTimersByTime(SWITCH_DELAY_MS.max);
});

describe('window lights', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    // No second window follows, so each tick switches exactly one.
    jest.spyOn(Math, 'random').mockReturnValue(0.5);
    Object.defineProperty(document, 'hidden', { configurable: true, value: false });
    document.documentElement.setAttribute('data-theme', 'dark');
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.restoreAllMocks();
    restoreMatchMedia();
    document.documentElement.removeAttribute('data-theme');
    if (originalHidden) {
      Object.defineProperty(document, 'hidden', originalHidden);
    } else {
      Reflect.deleteProperty(document, 'hidden');
    }
  });

  it('starts every third window dark, the same way on every render', () => {
    const { getByTestId } = render(<Scene />);

    expect(offStates(getByTestId('scene'))).toEqual([true, false, false, true, false, false]);
  });

  it('switches one light at a time about every two seconds at night', () => {
    const { getByTestId } = render(<Scene />);
    const scene = getByTestId('scene');
    const start = offStates(scene);

    act(() => {
      jest.advanceTimersByTime(SWITCH_DELAY_MS.min - 1);
    });
    expect(offStates(scene)).toEqual(start);

    waitForSwitch();
    expect(changedCount(start, offStates(scene))).toBe(1);
  });

  it('rests in a hidden tab', () => {
    Object.defineProperty(document, 'hidden', { configurable: true, value: true });
    const { getByTestId } = render(<Scene />);
    const start = offStates(getByTestId('scene'));

    waitForSwitch();
    waitForSwitch();

    expect(offStates(getByTestId('scene'))).toEqual(start);
  });

  it('rests by day, when the windows are reflections', () => {
    document.documentElement.setAttribute('data-theme', 'light');
    const { getByTestId } = render(<Scene />);
    const start = offStates(getByTestId('scene'));

    waitForSwitch();

    expect(offStates(getByTestId('scene'))).toEqual(start);
  });

  it('rests while the scene it belongs to is paused or still', () => {
    const { getByTestId } = render(<Scene />);
    const scene = getByTestId('scene');
    const start = offStates(scene);

    scene.setAttribute('data-scene-motion', 'paused');
    waitForSwitch();
    expect(offStates(scene)).toEqual(start);

    scene.setAttribute('data-scene-motion', 'still');
    waitForSwitch();
    expect(offStates(scene)).toEqual(start);

    scene.setAttribute('data-scene-motion', 'running');
    waitForSwitch();
    expect(changedCount(start, offStates(scene))).toBe(1);
  });

  it('never switches under reduced motion', () => {
    mockMatchMedia(REDUCED_MOTION_QUERY);
    const { getByTestId } = render(<Scene />);
    const start = offStates(getByTestId('scene'));

    waitForSwitch();

    expect(offStates(getByTestId('scene'))).toEqual(start);
    expect(jest.getTimerCount()).toBe(0);
  });

  it('clears its timers on unmount', () => {
    const { unmount } = render(<Scene />);
    expect(jest.getTimerCount()).toBeGreaterThan(0);

    unmount();

    expect(jest.getTimerCount()).toBe(0);
  });
});

describe('pickWindow', () => {
  it('never picks a window that switched recently', () => {
    const picks = Array.from({ length: 50 }, (_, step) => pickWindow(5, [0, 2, 4], () => step / 50));

    expect(new Set(picks)).toEqual(new Set([1, 3]));
  });

  it('gives up when every window is recent', () => {
    expect(pickWindow(2, [0, 1])).toBe(-1);
    expect(pickWindow(0, [])).toBe(-1);
  });
});
