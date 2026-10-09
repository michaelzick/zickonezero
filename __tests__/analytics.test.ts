import { trackEvent, trackLinkClick, trackPageView } from '../src/lib/analytics';

type TestWindow = Window & {
  amplitude?: {
    track?: jest.Mock;
    logEvent?: jest.Mock;
  };
};

describe('analytics helpers', () => {
  beforeEach(() => {
    delete (window as TestWindow).amplitude;
    document.title = 'Test page';
  });

  it('tracks custom events with Amplitude track', () => {
    const track = jest.fn();
    (window as TestWindow).amplitude = { track };

    trackEvent('cta_click', { label: 'Start' });

    expect(track).toHaveBeenCalledWith('cta_click', { label: 'Start' });
  });

  it('falls back to Amplitude logEvent when track is unavailable', () => {
    const logEvent = jest.fn();
    (window as TestWindow).amplitude = { logEvent };

    trackEvent('cta_click', { label: 'Start' });

    expect(logEvent).toHaveBeenCalledWith('cta_click', { label: 'Start' });
  });

  it('tracks normalized link click payloads', () => {
    const track = jest.fn();
    (window as TestWindow).amplitude = { track };

    trackLinkClick({
      location: 'footer',
      label: 'GitHub',
      href: 'https://github.com/michaelzick',
      section: 'links',
      variant: 'desktop',
    });

    expect(track).toHaveBeenCalledWith('link_click', {
      link_location: 'footer',
      link_text: 'GitHub',
      link_url: 'https://github.com/michaelzick',
      link_external: true,
      link_section: 'links',
      link_variant: 'desktop',
      page_path: '/',
    });
  });

  it('tracks page views with URL metadata', () => {
    const track = jest.fn();
    (window as TestWindow).amplitude = { track };

    trackPageView('/about?source=test', 'About');

    expect(track).toHaveBeenCalledWith('page_view', {
      page_path: '/about',
      page_url: 'http://localhost/about?source=test',
      page_title: 'About',
      page_referrer: undefined,
    });
  });
});

describe('events tracked before Amplitude loads', () => {
  // A fresh module per test, so each starts with an empty queue.
  const loadAnalytics = () => {
    let analytics!: typeof import('../src/lib/analytics');
    jest.isolateModules(() => {
      analytics = require('../src/lib/analytics');
    });
    return analytics;
  };

  beforeEach(() => {
    delete (window as TestWindow).amplitude;
  });

  afterEach(() => {
    delete (window as TestWindow).amplitude;
  });

  it('holds them until the SDK announces itself, then sends them in order', () => {
    const { AMPLITUDE_READY_EVENT, trackEvent: track } = loadAnalytics();

    track('page_view', { page_path: '/' });
    track('cta_click', { label: 'See Case Studies' });

    const sdkTrack = jest.fn();
    (window as TestWindow).amplitude = { track: sdkTrack };
    window.dispatchEvent(new Event(AMPLITUDE_READY_EVENT));

    expect(sdkTrack.mock.calls).toEqual([
      ['page_view', { page_path: '/' }],
      ['cta_click', { label: 'See Case Studies' }],
    ]);

    // The queue is empty afterwards, so another ready event sends nothing twice.
    window.dispatchEvent(new Event(AMPLITUDE_READY_EVENT));
    expect(sdkTrack).toHaveBeenCalledTimes(2);
  });

  it('sends the backlog first when the SDK appears before its ready event', () => {
    const { trackEvent: track } = loadAnalytics();

    track('page_view', { page_path: '/' });

    const sdkTrack = jest.fn();
    (window as TestWindow).amplitude = { track: sdkTrack };
    track('cta_click', { label: 'Contact' });

    expect(sdkTrack.mock.calls.map(([name]) => name)).toEqual(['page_view', 'cta_click']);
  });

  it('keeps at most 50 events while the SDK is missing', () => {
    const { AMPLITUDE_READY_EVENT, trackEvent: track } = loadAnalytics();

    for (let index = 0; index < 60; index += 1) {
      track('scroll_depth', { index });
    }

    const sdkTrack = jest.fn();
    (window as TestWindow).amplitude = { track: sdkTrack };
    window.dispatchEvent(new Event(AMPLITUDE_READY_EVENT));

    expect(sdkTrack).toHaveBeenCalledTimes(50);
    expect(sdkTrack.mock.calls[49]).toEqual(['scroll_depth', { index: 49 }]);
  });
});
