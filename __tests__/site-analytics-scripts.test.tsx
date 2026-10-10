import { act, render } from '@testing-library/react';

jest.mock('../src/lib/analytics', () => ({
  loadGoogleAnalytics: jest.fn(),
  loadMixpanel: jest.fn(),
}));

import SiteAnalyticsScripts, { ANALYTICS_DELAY_MS } from '../src/components/SiteAnalyticsScripts';
import { loadGoogleAnalytics, loadMixpanel } from '../src/lib/analytics';

const setReadyState = (state: DocumentReadyState) => {
  Object.defineProperty(document, 'readyState', { configurable: true, get: () => state });
};

describe('SiteAnalyticsScripts', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.mocked(loadGoogleAnalytics).mockClear();
    jest.mocked(loadMixpanel).mockClear();
  });

  afterEach(() => {
    jest.useRealTimers();
    // Drop the override so jsdom's own readyState shows through again.
    delete (document as { readyState?: DocumentReadyState }).readyState;
  });

  it('loads nothing until the delay after an already-finished load has passed', () => {
    setReadyState('complete');
    const { container } = render(<SiteAnalyticsScripts />);
    expect(container).toBeEmptyDOMElement();

    act(() => { jest.advanceTimersByTime(ANALYTICS_DELAY_MS - 1); });
    expect(loadGoogleAnalytics).not.toHaveBeenCalled();
    expect(loadMixpanel).not.toHaveBeenCalled();

    act(() => { jest.advanceTimersByTime(1); });
    expect(loadGoogleAnalytics).toHaveBeenCalledTimes(1);
    expect(loadMixpanel).toHaveBeenCalledTimes(1);
    expect(container).toBeEmptyDOMElement();
  });

  it('starts the delay at the load event when the page is still loading', () => {
    setReadyState('loading');
    render(<SiteAnalyticsScripts />);

    act(() => { jest.advanceTimersByTime(ANALYTICS_DELAY_MS * 3); });
    expect(loadGoogleAnalytics).not.toHaveBeenCalled();
    expect(loadMixpanel).not.toHaveBeenCalled();

    act(() => { window.dispatchEvent(new Event('load')); });
    act(() => { jest.advanceTimersByTime(ANALYTICS_DELAY_MS); });
    expect(loadGoogleAnalytics).toHaveBeenCalledTimes(1);
    expect(loadMixpanel).toHaveBeenCalledTimes(1);
  });

  it('cancels the pending delay when unmounted', () => {
    setReadyState('complete');
    const { unmount } = render(<SiteAnalyticsScripts />);
    unmount();

    expect(jest.getTimerCount()).toBe(0);
    expect(loadGoogleAnalytics).not.toHaveBeenCalled();
    expect(loadMixpanel).not.toHaveBeenCalled();
  });
});
