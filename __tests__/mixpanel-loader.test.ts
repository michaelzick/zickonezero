/**
 * @jest-environment-options {"url": "https://www.zickonezero.com/"}
 */

// Mixpanel loads only on the canonical host, so this file runs there.

type TestWindow = Window & {
  mixpanel?: {
    __SV?: number;
    _i?: unknown[];
    init?: jest.Mock;
    track?: jest.Mock;
    register?: jest.Mock;
  };
};

const RACK_PRIVATE_SELECTOR = '[data-rackloose] section[aria-label="Rackloose modular synthesizer"] > :not(header)';

const setEnv = (name: string, value: string | undefined) => {
  if (value === undefined) delete process.env[name];
  else process.env[name] = value;
};

// A fresh module per test, reading the token and release from the
// environment again.
const loadAnalytics = (token = 'test-token', release = '9.8.7') => {
  const previousToken = process.env.NEXT_PUBLIC_MIXPANEL_TOKEN;
  const previousRelease = process.env.NEXT_PUBLIC_RELEASE_VERSION;
  setEnv('NEXT_PUBLIC_MIXPANEL_TOKEN', token);
  setEnv('NEXT_PUBLIC_RELEASE_VERSION', release);
  let analytics!: typeof import('../src/lib/analytics');
  jest.isolateModules(() => {
    analytics = require('../src/lib/analytics');
  });
  setEnv('NEXT_PUBLIC_MIXPANEL_TOKEN', previousToken);
  setEnv('NEXT_PUBLIC_RELEASE_VERSION', previousRelease);
  return analytics;
};

const sdkScripts = () => Array.from(document.head.querySelectorAll<HTMLScriptElement>('script[src*="cdn.mxpnl.com"]'));

// What the bundle does on load: it gives the stub an init, which creates the
// real instance with track.
const bootBundle = () => {
  const track = jest.fn();
  const register = jest.fn();
  const init = jest.fn(() => {
    (window as TestWindow).mixpanel = { track, register };
  });
  (window as TestWindow).mixpanel!.init = init;
  sdkScripts()[0].dispatchEvent(new Event('load'));
  return { init, track, register };
};

describe('loadMixpanel on www.zickonezero.com', () => {
  beforeEach(() => {
    delete (window as TestWindow).mixpanel;
    sdkScripts().forEach((script) => script.remove());
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('downloads the SDK once, behind the official snippet stub', () => {
    const { MIXPANEL_SCRIPT, loadMixpanel } = loadAnalytics();

    loadMixpanel();
    loadMixpanel();

    expect(sdkScripts()).toHaveLength(1);
    expect(sdkScripts()[0].src).toBe(MIXPANEL_SCRIPT);
    expect(sdkScripts()[0].async).toBe(true);

    const stub = (window as TestWindow).mixpanel;
    expect(Array.isArray(stub)).toBe(true);
    expect(stub).toMatchObject({ __SV: 1.2, _i: [] });
  });

  it('initializes with replay on, inputs masked, and the rack blocked, then sends what waited', () => {
    jest.useFakeTimers();
    const { loadMixpanel, trackEvent } = loadAnalytics();

    trackEvent('page_view', { page_path: '/' });
    loadMixpanel();
    const { init, track } = bootBundle();

    expect(init).toHaveBeenCalledWith('test-token', expect.objectContaining({
      track_pageview: false,
      autocapture: expect.objectContaining({
        pageview: false,
        click: false,
        block_selectors: [RACK_PRIVATE_SELECTOR],
      }),
      record_sessions_percent: 100,
      record_heatmap_data: true,
      record_mask_all_inputs: true,
      record_mask_all_text: false,
      record_block_selector: RACK_PRIVATE_SELECTOR,
      record_console: false,
    }));
    expect(track).toHaveBeenCalledWith('page_view', { page_path: '/' });
    // The download timeout is cleared once the SDK arrives.
    expect(jest.getTimerCount()).toBe(0);
  });

  it('tags every event with the release, including those that waited', () => {
    const { loadMixpanel, trackEvent } = loadAnalytics();

    trackEvent('page_view', { page_path: '/' });
    loadMixpanel();
    const { track, register } = bootBundle();

    expect(register).toHaveBeenCalledWith({ release: '9.8.7' });
    expect(register.mock.invocationCallOrder[0]).toBeLessThan(track.mock.invocationCallOrder[0]);
  });

  it('registers nothing when no release is set', () => {
    const { loadMixpanel } = loadAnalytics('test-token', '');

    loadMixpanel();
    const { register } = bootBundle();

    expect(register).not.toHaveBeenCalled();
  });

  it('drops waiting events and holds no more when the SDK fails to download', () => {
    const { loadMixpanel, trackEvent } = loadAnalytics();

    trackEvent('page_view', { page_path: '/' });
    loadMixpanel();
    sdkScripts()[0].dispatchEvent(new Event('error'));
    expect(sdkScripts()).toHaveLength(0);

    trackEvent('cta_click', { label: 'Contact' });
    const track = jest.fn();
    (window as TestWindow).mixpanel = { track };
    trackEvent('link_click', { link_text: 'Contact' });

    expect(track.mock.calls.map(([name]) => name)).toEqual(['link_click']);
  });

  it('gives up on an SDK that never arrives', () => {
    jest.useFakeTimers();
    const { loadMixpanel } = loadAnalytics();

    loadMixpanel();
    jest.advanceTimersByTime(30000);

    expect(sdkScripts()).toHaveLength(0);
    expect(jest.getTimerCount()).toBe(0);
  });

  it('falls back to the project token when the env sets none', () => {
    const { loadMixpanel } = loadAnalytics('');

    loadMixpanel();
    const init = jest.fn();
    (window as TestWindow).mixpanel = { init } as TestWindow['mixpanel'];
    sdkScripts()[0].dispatchEvent(new Event('load'));

    expect(init).toHaveBeenCalledWith('fd2e07b182295dac64b9cb63934a268f', expect.any(Object));
  });
});
