import { act, render } from '@testing-library/react';

import FastTravelTransition from '../src/components/city/FastTravelTransition';
import { getRouteMeta } from '../src/lib/city/routes';
import { REDUCED_MOTION_QUERY, mockMatchMedia, restoreMatchMedia } from '../src/test/matchMedia';
import { FAST_TRAVEL_COVER_MS, FAST_TRAVEL_REVEAL_MS } from '../styles/city';

type Handler = (...args: unknown[]) => void;

const mockHandlers = new Map<string, Set<Handler>>();

const mockRouter = {
  events: {
    on: (type: string, handler: Handler) => {
      if (!mockHandlers.has(type)) {
        mockHandlers.set(type, new Set());
      }
      mockHandlers.get(type)?.add(handler);
    },
    off: (type: string, handler: Handler) => {
      mockHandlers.get(type)?.delete(handler);
    },
  },
};

jest.mock('next/router', () => ({
  useRouter: () => mockRouter,
}));

const emit = (type: string, ...args: unknown[]) => {
  act(() => {
    mockHandlers.get(type)?.forEach((handler) => handler(...args));
  });
};

const advance = (ms: number) => {
  act(() => {
    jest.advanceTimersByTime(ms);
  });
};

const getOverlay = (container: HTMLElement) => container.firstElementChild as HTMLElement | null;

describe('FastTravelTransition', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    mockHandlers.clear();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.restoreAllMocks();
    restoreMatchMedia();
  });

  it('stays out of the page until a navigation starts', () => {
    const { container } = render(<FastTravelTransition />);

    expect(container).toBeEmptyDOMElement();
    expect(mockHandlers.get('routeChangeStart')?.size).toBe(1);
  });

  it('drops the shutters, names the destination, and lifts them once the page is in', () => {
    const { container } = render(<FastTravelTransition />);
    const destination = getRouteMeta('/demostoke');

    emit('routeChangeStart', '/demostoke/');

    const overlay = getOverlay(container);
    expect(overlay).toHaveAttribute('aria-hidden', 'true');
    expect(overlay).toHaveAttribute('data-phase', 'covering');
    expect(overlay).toHaveTextContent(`Fast travel ▸${destination.label}`);
    expect(overlay?.style.getPropertyValue('--travel-accent')).toBe(`var(--neon-${destination.accent})`);
    expect(container.querySelectorAll('.slat')).toHaveLength(6);

    emit('routeChangeComplete', '/demostoke/');

    // The shutters finish closing before they lift.
    advance(FAST_TRAVEL_COVER_MS - 1);
    expect(getOverlay(container)).toHaveAttribute('data-phase', 'covering');

    advance(1);
    expect(getOverlay(container)).toHaveAttribute('data-phase', 'revealing');

    advance(FAST_TRAVEL_REVEAL_MS);
    expect(container).toBeEmptyDOMElement();
  });

  it('lifts straight away when the page took longer than the shutters', () => {
    const { container } = render(<FastTravelTransition />);

    emit('routeChangeStart', '/about');
    advance(FAST_TRAVEL_COVER_MS + 500);
    emit('routeChangeComplete', '/about');
    advance(0);

    expect(getOverlay(container)).toHaveAttribute('data-phase', 'revealing');
  });

  it('ignores shallow routes, hash links, and query changes on the same page', () => {
    const { container } = render(<FastTravelTransition />);

    emit('routeChangeStart', '/about', { shallow: true });
    emit('routeChangeStart', '/#case-studies', { shallow: false });
    emit('routeChangeStart', '/?ref=nav', { shallow: false });

    expect(container).toBeEmptyDOMElement();
  });

  it('treats the page it arrived at as home for the next trip', () => {
    const { container } = render(<FastTravelTransition />);

    emit('routeChangeStart', '/contact');
    emit('routeChangeComplete', '/contact');
    advance(FAST_TRAVEL_COVER_MS + FAST_TRAVEL_REVEAL_MS);
    expect(container).toBeEmptyDOMElement();

    emit('routeChangeStart', '/contact/#form');
    expect(container).toBeEmptyDOMElement();

    emit('routeChangeStart', '/');
    expect(getOverlay(container)).toHaveTextContent(getRouteMeta('/').label);
  });

  it('follows a newer navigation that cancelled the first', () => {
    const { container } = render(<FastTravelTransition />);

    emit('routeChangeStart', '/about');
    emit('routeChangeError', { cancelled: true }, '/about');
    advance(FAST_TRAVEL_COVER_MS + FAST_TRAVEL_REVEAL_MS);
    expect(getOverlay(container)).toHaveAttribute('data-phase', 'covering');

    emit('routeChangeStart', '/contact');
    expect(getOverlay(container)).toHaveTextContent(getRouteMeta('/contact').label);

    emit('routeChangeComplete', '/contact');
    advance(FAST_TRAVEL_COVER_MS + FAST_TRAVEL_REVEAL_MS);
    expect(container).toBeEmptyDOMElement();
  });

  it('lifts the shutters when a navigation fails', () => {
    const { container } = render(<FastTravelTransition />);

    emit('routeChangeStart', '/about');
    emit('routeChangeError', new Error('chunk failed'), '/about');
    advance(FAST_TRAVEL_COVER_MS);

    expect(getOverlay(container)).toHaveAttribute('data-phase', 'revealing');
  });

  it('never leaves the shutters down when a navigation goes quiet', () => {
    const { container } = render(<FastTravelTransition />);

    emit('routeChangeStart', '/about');
    advance(3999);
    expect(getOverlay(container)).toHaveAttribute('data-phase', 'covering');

    advance(10);
    expect(getOverlay(container)).toHaveAttribute('data-phase', 'revealing');

    advance(FAST_TRAVEL_REVEAL_MS);
    expect(container).toBeEmptyDOMElement();
  });

  it('stays still under reduced motion', () => {
    mockMatchMedia(REDUCED_MOTION_QUERY);
    const { container } = render(<FastTravelTransition />);

    emit('routeChangeStart', '/about');

    expect(container).toBeEmptyDOMElement();
  });

  it('stops listening when it unmounts', () => {
    const { unmount } = render(<FastTravelTransition />);

    unmount();

    ['routeChangeStart', 'routeChangeComplete', 'routeChangeError'].forEach((type) => {
      expect(mockHandlers.get(type)?.size ?? 0).toBe(0);
    });
  });
});
