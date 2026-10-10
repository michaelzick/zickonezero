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

type GtagWindow = Window & { dataLayer?: unknown[]; gtag?: unknown };

// A fresh module whose canonical host is jsdom's own, so GA4 loads.
const loadCanonicalAnalytics = (env: Record<string, string> = {}) => {
  const overrides = { NEXT_PUBLIC_SITE_URL: 'http://localhost', ...env };
  const previous = Object.fromEntries(Object.keys(overrides).map((key) => [key, process.env[key]]));
  Object.assign(process.env, overrides);
  let analytics!: typeof import('../src/lib/analytics');
  jest.isolateModules(() => {
    analytics = require('../src/lib/analytics');
  });
  Object.entries(previous).forEach(([key, value]) => {
    if (value === undefined) delete process.env[key];
    else process.env[key] = value;
  });
  return analytics;
};

// gtag.js skips anything but Arguments objects, so check the kind as well as the contents.
const gtagCommands = () => ((window as GtagWindow).dataLayer ?? []).map((entry) => {
  expect(Object.prototype.toString.call(entry)).toBe('[object Arguments]');
  return Array.from(entry as ArrayLike<unknown>);
});

const gaScripts = () => document.querySelectorAll('script[src^="https://www.googletagmanager.com/gtag/js"]');

describe('Google Analytics', () => {
  afterEach(() => {
    delete (window as GtagWindow).dataLayer;
    delete (window as GtagWindow).gtag;
    gaScripts().forEach((script) => script.remove());
    window.history.replaceState(null, '', '/');
  });

  it('configures GA4 once, without signals or automatic page views, then loads gtag.js', () => {
    const { loadGoogleAnalytics, GA_SCRIPT } = loadCanonicalAnalytics({ NEXT_PUBLIC_RELEASE_VERSION: '9.9.9' });

    loadGoogleAnalytics();
    loadGoogleAnalytics();

    const commands = gtagCommands();
    expect(commands).toHaveLength(2);
    expect(commands[0]).toEqual(['js', expect.any(Date)]);
    expect(commands[1]).toEqual(['config', 'G-DY992J2EV8', {
      send_page_view: false,
      allow_google_signals: false,
      allow_ad_personalization_signals: false,
      release: '9.9.9',
    }]);
    expect(GA_SCRIPT).toBe('https://www.googletagmanager.com/gtag/js?id=G-DY992J2EV8');
    expect(gaScripts()).toHaveLength(1);
  });

  it('sends events held before it loads in order, where they happened, then later ones directly', () => {
    const { loadGoogleAnalytics, trackEvent: track, trackPageView: trackPage } = loadCanonicalAnalytics();

    window.history.replaceState(null, '', '/?utm_source=linkedin');
    trackPage(undefined, 'Home');
    track('cta_click', { label: 'See Case Studies', page_path: '/', missing: undefined });
    window.history.replaceState(null, '', '/contact/');

    loadGoogleAnalytics();
    track('contact_form_submit_succeeded', { page_path: '/contact/' });

    expect(gtagCommands().slice(2)).toEqual([
      ['event', 'page_view', {
        page_location: 'http://localhost/?utm_source=linkedin',
        page_title: 'Home',
      }],
      ['event', 'cta_click', { page_location: 'http://localhost/?utm_source=linkedin', label: 'See Case Studies' }],
      ['event', 'contact_form_submit_succeeded', { page_location: 'http://localhost/contact/' }],
    ]);
  });

  it('names the previous page as the referrer after a client navigation', () => {
    const { loadGoogleAnalytics, trackPageView: trackPage } = loadCanonicalAnalytics();
    loadGoogleAnalytics();

    trackPage('/', 'Home');
    trackPage('/about/', 'About');

    const pageViews = gtagCommands().slice(2).map(([, , params]) => params);
    expect(pageViews).toEqual([
      { page_location: 'http://localhost/', page_title: 'Home' },
      { page_location: 'http://localhost/about/', page_title: 'About', page_referrer: 'http://localhost/' },
    ]);
  });

  it('never lets a failing gtag break the click that tracked it', () => {
    const { loadGoogleAnalytics, trackEvent: track } = loadCanonicalAnalytics();
    loadGoogleAnalytics();
    (window as GtagWindow).gtag = () => { throw new Error('blocked'); };

    expect(() => track('cta_click', { label: 'Start' })).not.toThrow();
  });

  // Jest's jsdom runs on localhost, like local dev and branch previews.
  it('loads nothing off the canonical host and stops holding events', () => {
    const { loadGoogleAnalytics, trackEvent: track } = loadAnalytics();

    track('page_view', { page_path: '/' });
    loadGoogleAnalytics();
    track('cta_click', { label: 'Contact' });

    expect(gaScripts()).toHaveLength(0);
    expect((window as GtagWindow).gtag).toBeUndefined();
    expect((window as GtagWindow).dataLayer).toBeUndefined();
  });
});
