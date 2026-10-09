import { act, render } from '@testing-library/react';
import type { ReactNode } from 'react';

// Render each next/script as a marker, so the test sees what would load.
jest.mock('next/script', () => ({
  __esModule: true,
  default: ({ id, src, strategy }: { id?: string; src?: string; strategy?: string; children?: ReactNode }) => (
    <i data-testid='script' data-id={id} data-src={src} data-strategy={strategy} />
  ),
}));

jest.mock('../src/lib/analytics', () => ({
  loadMixpanel: jest.fn(),
}));

import SiteAnalyticsScripts, { ANALYTICS_DELAY_MS } from '../src/components/SiteAnalyticsScripts';
import { loadMixpanel } from '../src/lib/analytics';

const loadedScripts = () => Array.from(document.querySelectorAll('[data-testid="script"]'), (node) => node.getAttribute('data-id'));

const setReadyState = (state: DocumentReadyState) => {
  Object.defineProperty(document, 'readyState', { configurable: true, get: () => state });
};

describe('SiteAnalyticsScripts', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.mocked(loadMixpanel).mockClear();
  });

  afterEach(() => {
    jest.useRealTimers();
    // Drop the override so jsdom's own readyState shows through again.
    delete (document as { readyState?: DocumentReadyState }).readyState;
  });

  it('loads nothing until the delay after an already-finished load has passed', () => {
    setReadyState('complete');
    render(<SiteAnalyticsScripts />);
    expect(loadedScripts()).toEqual([]);

    act(() => { jest.advanceTimersByTime(ANALYTICS_DELAY_MS - 1); });
    expect(loadedScripts()).toEqual([]);
    expect(loadMixpanel).not.toHaveBeenCalled();

    act(() => { jest.advanceTimersByTime(1); });
    expect(loadedScripts()).toEqual(['gtm']);
    expect(loadMixpanel).toHaveBeenCalledTimes(1);
    document.querySelectorAll('[data-testid="script"]').forEach((node) => {
      expect(node).toHaveAttribute('data-strategy', 'lazyOnload');
    });
  });

  it('starts the delay at the load event when the page is still loading', () => {
    setReadyState('loading');
    render(<SiteAnalyticsScripts />);

    act(() => { jest.advanceTimersByTime(ANALYTICS_DELAY_MS * 3); });
    expect(loadedScripts()).toEqual([]);
    expect(loadMixpanel).not.toHaveBeenCalled();

    act(() => { window.dispatchEvent(new Event('load')); });
    act(() => { jest.advanceTimersByTime(ANALYTICS_DELAY_MS); });
    expect(loadedScripts()).toEqual(['gtm']);
    expect(loadMixpanel).toHaveBeenCalledTimes(1);
  });

  it('cancels the pending delay when unmounted', () => {
    setReadyState('complete');
    const { unmount } = render(<SiteAnalyticsScripts />);
    unmount();

    expect(jest.getTimerCount()).toBe(0);
    expect(loadMixpanel).not.toHaveBeenCalled();
  });
});
