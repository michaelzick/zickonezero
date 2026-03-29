import '@testing-library/jest-dom';
import { TextDecoder, TextEncoder } from 'util';

Object.assign(global, {
  TextDecoder,
  TextEncoder,
});

class MockIntersectionObserver implements IntersectionObserver {
  readonly root = null;
  readonly rootMargin = '0px';
  readonly thresholds = [];

  constructor(private readonly callback: IntersectionObserverCallback) {}

  disconnect = jest.fn();
  observe = jest.fn((target: Element) => {
    this.callback([
      {
        boundingClientRect: target.getBoundingClientRect(),
        intersectionRatio: 1,
        intersectionRect: target.getBoundingClientRect(),
        isIntersecting: true,
        rootBounds: null,
        target,
        time: Date.now(),
      },
    ], this);
  });
  takeRecords = jest.fn(() => []);
  unobserve = jest.fn();
}

class MockResizeObserver implements ResizeObserver {
  constructor(private readonly callback: ResizeObserverCallback) {
    this.callback([], this);
  }

  disconnect = jest.fn();
  observe = jest.fn();
  unobserve = jest.fn();
}

Object.defineProperty(window, 'IntersectionObserver', {
  writable: true,
  value: MockIntersectionObserver,
});

Object.defineProperty(window, 'ResizeObserver', {
  writable: true,
  value: MockResizeObserver,
});

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation((query: string) => ({
    matches: query.includes('prefers-color-scheme: dark'),
    media: query,
    onchange: null,
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    addListener: jest.fn(),
    removeListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

Object.defineProperty(window, 'scrollTo', {
  writable: true,
  value: jest.fn(),
});

Object.defineProperty(window.HTMLElement.prototype, 'scrollBy', {
  writable: true,
  value: jest.fn(),
});

Object.defineProperty(window.HTMLElement.prototype, 'scrollIntoView', {
  writable: true,
  value: jest.fn(),
});

Object.defineProperty(window, 'requestAnimationFrame', {
  writable: true,
  value: (callback: FrameRequestCallback) => window.setTimeout(() => callback(Date.now()), 0),
});

Object.defineProperty(window, 'cancelAnimationFrame', {
  writable: true,
  value: (handle: number) => window.clearTimeout(handle),
});

Object.defineProperty(window.HTMLMediaElement.prototype, 'play', {
  writable: true,
  value: jest.fn(),
});

Object.defineProperty(window.HTMLMediaElement.prototype, 'pause', {
  writable: true,
  value: jest.fn(),
});

jest.mock('fslightbox-react', () => function MockFsLightbox() {
  return null;
});
