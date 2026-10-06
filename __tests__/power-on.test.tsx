import { act, render, screen } from '@testing-library/react';
import { useRef } from 'react';

import NeonSign from '../src/components/city/NeonSign';
import usePowerOn from '../src/hooks/usePowerOn';
import { markCityStarted } from '../src/lib/city/powerOn';
import { REDUCED_MOTION_QUERY, mockMatchMedia, restoreMatchMedia } from '../src/test/matchMedia';

const OBSERVER: IntersectionObserverInit = { threshold: 0.5 };

let observerCallback: IntersectionObserverCallback | null = null;
const setupIntersectionObserver = window.IntersectionObserver;

class ManualIntersectionObserver {
  constructor(callback: IntersectionObserverCallback) {
    observerCallback = callback;
  }

  observe = jest.fn();
  disconnect = jest.fn();
  unobserve = jest.fn();
  takeRecords = jest.fn(() => []);
}

const intersect = () => act(() => {
  observerCallback?.([{ isIntersecting: true } as IntersectionObserverEntry], {} as IntersectionObserver);
});

const placeOnPage = (top: number) => {
  jest.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockReturnValue({
    top,
    bottom: top + 400,
  } as DOMRect);
};

const Screen = () => {
  const ref = useRef<HTMLDivElement>(null);
  usePowerOn(ref, { poweredAttribute: 'data-powered', observerOptions: OBSERVER });
  return <div ref={ref} data-testid='screen' />;
};

// The "city started" flag is module state, so the first-page cases run first
// and the later-page cases after markCityStarted.
describe('power-on effects', () => {
  beforeEach(() => {
    Object.defineProperty(window, 'innerHeight', { configurable: true, writable: true, value: 800 });
    window.IntersectionObserver = ManualIntersectionObserver as unknown as typeof IntersectionObserver;
    observerCallback = null;
  });

  afterEach(() => {
    jest.restoreAllMocks();
    restoreMatchMedia();
    window.IntersectionObserver = setupIntersectionObserver;
  });

  it('holds an off-screen element dark until it scrolls in on the first page', () => {
    placeOnPage(2000);
    render(<Screen />);
    const element = screen.getByTestId('screen');

    expect(element).toHaveAttribute('data-standby', '');

    intersect();

    expect(element).not.toHaveAttribute('data-standby');
    expect(element).toHaveAttribute('data-powered', '');
  });

  it('never blacks out an element that is already on screen', () => {
    placeOnPage(100);
    render(<Screen />);

    expect(screen.getByTestId('screen')).not.toHaveAttribute('data-standby');
    expect(observerCallback).toBeNull();
  });

  it('stays on under reduced motion', () => {
    mockMatchMedia(REDUCED_MOTION_QUERY);
    placeOnPage(2000);
    render(<Screen />);

    expect(screen.getByTestId('screen')).not.toHaveAttribute('data-standby');
  });

  it('ignites a neon sign on the first page only', () => {
    const lines = [{ text: 'Open', variant: 'tube' as const }];
    const { unmount } = render(<NeonSign as='h2' id='first' lines={lines} />);
    expect(screen.getByRole('heading', { name: 'Open' })).not.toHaveAttribute('data-lit');
    unmount();

    markCityStarted();
    render(<NeonSign as='h2' id='later' lines={lines} />);
    expect(screen.getByRole('heading', { name: 'Open' })).toHaveAttribute('data-lit', '');
  });

  it('arrives already on after a client navigation', () => {
    placeOnPage(2000);
    markCityStarted();
    render(<Screen />);

    expect(screen.getByTestId('screen')).not.toHaveAttribute('data-standby');
  });
});
