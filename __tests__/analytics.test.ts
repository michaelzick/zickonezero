import { trackEvent, trackLinkClick, trackPageView } from '../src/lib/analytics';

type TestWindow = Window & {
  mixpanel?: {
    init?: jest.Mock;
    track?: jest.Mock;
  };
};

describe('analytics helpers', () => {
  beforeEach(() => {
    delete (window as TestWindow).mixpanel;
    document.title = 'Test page';
  });

  it('tracks custom events with Mixpanel track', () => {
    const track = jest.fn();
    (window as TestWindow).mixpanel = { track };

    trackEvent('cta_click', { label: 'Start' });

    expect(track).toHaveBeenCalledWith('cta_click', { label: 'Start' });
  });

  it('never lets a failing SDK break the click that tracked it', () => {
    (window as TestWindow).mixpanel = { track: jest.fn(() => { throw new Error('blocked'); }) };

    expect(() => trackEvent('cta_click', { label: 'Start' })).not.toThrow();
  });

  it('tracks normalized link click payloads', () => {
    const track = jest.fn();
    (window as TestWindow).mixpanel = { track };

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
    (window as TestWindow).mixpanel = { track };

    trackPageView('/about?source=test', 'About');

    expect(track).toHaveBeenCalledWith('page_view', {
      page_path: '/about',
      page_url: 'http://localhost/about?source=test',
      page_title: 'About',
      page_referrer: undefined,
    });
  });
});

// A fresh module per test, so each starts with an empty queue and reads the
// token from the environment again.
const loadAnalytics = (token = 'test-token') => {
  const previous = process.env.NEXT_PUBLIC_MIXPANEL_TOKEN;
  process.env.NEXT_PUBLIC_MIXPANEL_TOKEN = token;
  let analytics!: typeof import('../src/lib/analytics');
  jest.isolateModules(() => {
    analytics = require('../src/lib/analytics');
  });
  if (previous === undefined) delete process.env.NEXT_PUBLIC_MIXPANEL_TOKEN;
  else process.env.NEXT_PUBLIC_MIXPANEL_TOKEN = previous;
  return analytics;
};

// The downloaded bundle can init but has no track until init runs.
const downloadedSdk = () => {
  const track = jest.fn();
  const sdk: { init: jest.Mock; track?: jest.Mock } = {
    init: jest.fn(() => { sdk.track = track; }),
  };
  (window as TestWindow).mixpanel = sdk;
  return { sdk, track };
};

describe('events tracked before Mixpanel starts', () => {
  beforeEach(() => {
    delete (window as TestWindow).mixpanel;
  });

  afterEach(() => {
    delete (window as TestWindow).mixpanel;
  });

  it('holds them until the SDK starts, then sends them in order', () => {
    const { startMixpanel, trackEvent: track } = loadAnalytics();

    track('page_view', { page_path: '/' });
    track('cta_click', { label: 'See Case Studies' });

    const { sdk, track: sdkTrack } = downloadedSdk();
    startMixpanel();

    expect(sdk.init).toHaveBeenCalledWith('test-token', expect.any(Object));
    expect(sdkTrack.mock.calls).toEqual([
      ['page_view', { page_path: '/' }],
      ['cta_click', { label: 'See Case Studies' }],
    ]);

    // Later events go straight out, and nothing is sent twice.
    track('link_click', { link_text: 'Contact' });
    expect(sdkTrack.mock.calls.map(([name]) => name)).toEqual(['page_view', 'cta_click', 'link_click']);
  });

  it('sends the backlog first when the SDK appears before it starts', () => {
    const { trackEvent: track } = loadAnalytics();

    track('page_view', { page_path: '/' });

    const sdkTrack = jest.fn();
    (window as TestWindow).mixpanel = { track: sdkTrack };
    track('cta_click', { label: 'Contact' });

    expect(sdkTrack.mock.calls.map(([name]) => name)).toEqual(['page_view', 'cta_click']);
  });

  it('keeps at most 50 events while the SDK is missing', () => {
    const { startMixpanel, trackEvent: track } = loadAnalytics();

    for (let index = 0; index < 60; index += 1) {
      track('scroll_depth', { index });
    }

    const { track: sdkTrack } = downloadedSdk();
    startMixpanel();

    expect(sdkTrack).toHaveBeenCalledTimes(50);
    expect(sdkTrack.mock.calls[49]).toEqual(['scroll_depth', { index: 49 }]);
  });

  it('drops the backlog and holds nothing more when the SDK fails to start', () => {
    const { startMixpanel, trackEvent: track } = loadAnalytics();

    track('page_view', { page_path: '/' });
    (window as TestWindow).mixpanel = { init: jest.fn(() => { throw new Error('blocked'); }) };
    expect(() => startMixpanel()).not.toThrow();
    track('cta_click', { label: 'Contact' });

    const sdkTrack = jest.fn();
    (window as TestWindow).mixpanel = { track: sdkTrack };
    track('link_click', { link_text: 'Contact' });

    expect(sdkTrack.mock.calls.map(([name]) => name)).toEqual(['link_click']);
  });
});

describe('loading Mixpanel off the canonical host', () => {
  afterEach(() => {
    delete (window as TestWindow).mixpanel;
  });

  // Jest's jsdom runs on localhost, like local dev and branch previews.
  it('downloads nothing and stops holding events', () => {
    const { loadMixpanel, trackEvent: track } = loadAnalytics();

    track('page_view', { page_path: '/' });
    loadMixpanel();

    expect(document.querySelector('script[src*="cdn.mxpnl.com"]')).toBeNull();
    expect((window as TestWindow).mixpanel).toBeUndefined();

    track('cta_click', { label: 'Contact' });
    const sdkTrack = jest.fn();
    (window as TestWindow).mixpanel = { track: sdkTrack };
    track('link_click', { link_text: 'Contact' });

    expect(sdkTrack.mock.calls.map(([name]) => name)).toEqual(['link_click']);
  });
});
