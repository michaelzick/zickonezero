import { act, render } from '@testing-library/react';
import { useRef } from 'react';

import useReleaseOffscreen from '../src/hooks/useReleaseOffscreen';

const Scene = () => {
  const ref = useRef<HTMLElement>(null);
  useReleaseOffscreen(ref);
  return <section ref={ref} data-testid='scene' />;
};

const originalObserver = window.IntersectionObserver;
let intersect: IntersectionObserverCallback;
let options: IntersectionObserverInit | undefined;
const disconnect = jest.fn();
const observe = jest.fn();

class ManualObserver {
  constructor(callback: IntersectionObserverCallback, init?: IntersectionObserverInit) {
    intersect = callback;
    options = init;
  }
  observe = observe;
  disconnect = disconnect;
}

const setNear = (near: boolean) => act(() => {
  intersect([{ isIntersecting: near } as IntersectionObserverEntry], {} as IntersectionObserver);
});

describe('releasing an offscreen scene', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    window.IntersectionObserver = ManualObserver as unknown as typeof IntersectionObserver;
  });

  afterEach(() => {
    window.IntersectionObserver = originalObserver;
  });

  it('marks the scene offscreen only while it is more than a screen away', () => {
    const { getByTestId } = render(<Scene />);
    const scene = getByTestId('scene');
    expect(observe).toHaveBeenCalledWith(scene);
    expect(options).toEqual({ rootMargin: '100% 0px' });
    expect(scene).not.toHaveAttribute('data-offscreen');
    setNear(false);
    expect(scene).toHaveAttribute('data-offscreen');
    setNear(true);
    expect(scene).not.toHaveAttribute('data-offscreen');
  });

  it('disconnects and clears the mark on unmount', () => {
    const { getByTestId, unmount } = render(<Scene />);
    const scene = getByTestId('scene');
    setNear(false);
    unmount();
    expect(disconnect).toHaveBeenCalledTimes(1);
    expect(scene).not.toHaveAttribute('data-offscreen');
  });

  it('keeps the scene in browsers without IntersectionObserver', () => {
    window.IntersectionObserver = undefined as unknown as typeof IntersectionObserver;
    const { getByTestId } = render(<Scene />);
    expect(getByTestId('scene')).not.toHaveAttribute('data-offscreen');
  });
});
