import { SITE_URL } from './siteConfig';

type MixpanelClient = {
  // The official snippet's stub carries these until the bundle replaces it.
  __SV?: number;
  _i?: unknown[];
  init?: (token: string, config: Record<string, unknown>) => void;
  track?: (name: string, props?: Record<string, unknown>) => void;
  register?: (props: Record<string, unknown>) => void;
};

type AnalyticsWindow = Window & {
  mixpanel?: MixpanelClient;
  dataLayer?: unknown[];
  gtag?: (...args: unknown[]) => void;
};

export type AnalyticsEventPayload = Record<string, unknown>;

export type LinkClickPayload = {
  location: string;
  label: string;
  href: string;
  section?: string;
  variant?: 'desktop' | 'mobile';
  pagePath?: string;
};

// Browser-side Mixpanel project token (public by design). Overridable via env;
// the literal fallback keeps production builds sending without extra
// configuration.
const MIXPANEL_TOKEN = process.env.NEXT_PUBLIC_MIXPANEL_TOKEN || 'fd2e07b182295dac64b9cb63934a268f';
// The package.json version, set by next.config.js, so every event names the
// production release it came from.
const RELEASE_VERSION = process.env.NEXT_PUBLIC_RELEASE_VERSION;
export const MIXPANEL_SCRIPT = 'https://cdn.mxpnl.com/libs/mixpanel-2-latest.min.js';
const MIXPANEL_LOAD_TIMEOUT_MS = 30000;

// The GA4 web stream "ZICKONEZERO Engineering" (public by design), loaded as
// gtag.js rather than through Tag Manager, so every event the site tracks
// reaches it and its setup lives here.
const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || 'G-DY992J2EV8';
export const GA_SCRIPT = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;

const GA_CONFIG = {
  // PageAnalytics sends page_view on every route change. This doesn't stop
  // gtag's history-based page views; the stream's enhanced measurement
  // setting for those must stay off, or every client navigation counts twice.
  send_page_view: false,
  allow_google_signals: false,
  allow_ad_personalization_signals: false,
  ...(RELEASE_VERSION ? { release: RELEASE_VERSION } : {}),
};

// GA reads the page from page_location, so the path and URL copies stay in Mixpanel.
const GA_OMITTED_PARAMS = new Set(['page_path', 'page_url']);

// Bar Four's rack shows patch and preset names the visitor typed or imported;
// only its header is public, so replays and heatmap clicks skip the rest.
const RACK_PRIVATE_SELECTOR = '[data-rackloose] section[aria-label="Rackloose modular synthesizer"] > :not(header)';

const MIXPANEL_CONFIG = {
  persistence: 'localStorage',
  // PageAnalytics sends page_view on every route change.
  track_pageview: false,
  // The site tracks its own clicks; heatmaps still collect theirs through
  // replay, and honor these block selectors.
  autocapture: {
    pageview: false,
    click: false,
    input: false,
    scroll: false,
    submit: false,
    page_leave: false,
    rage_click: false,
    dead_click: false,
    capture_text_content: false,
    block_selectors: [RACK_PRIVATE_SELECTOR],
  },
  record_sessions_percent: 100,
  record_heatmap_data: true,
  // Form fields stay masked; the portfolio's public copy and screenshots stay
  // readable (the default block selector would blank every image).
  record_mask_all_inputs: true,
  record_mask_all_text: false,
  record_block_selector: RACK_PRIVATE_SELECTOR,
  record_console: false,
  record_network: false,
};

const isBrowser = () => typeof window !== 'undefined';

// The stub, and the bundle before init, have no track; only an initialized
// SDK can take events.
const getMixpanel = (): MixpanelClient | undefined => {
  if (!isBrowser()) return undefined;
  const mixpanel = (window as AnalyticsWindow).mixpanel;
  return typeof mixpanel?.track === 'function' ? mixpanel : undefined;
};

const getPagePath = () => {
  if (!isBrowser()) return undefined;
  return window.location.pathname;
};

// Mixpanel loads a few seconds after the page does, so events tracked before
// then (the first page view, an early click) wait here and go out in order
// when it arrives. The cap keeps a slow SDK from growing the queue without
// bound, and nothing waits once Mixpanel won't load.
const MAX_PENDING_EVENTS = 50;

type PendingEvent = { name: string; payload: AnalyticsEventPayload };

let pendingEvents: PendingEvent[] = [];
let isMixpanelRequested = false;
let isMixpanelUnavailable = false;

const deliverEvent = (mixpanel: MixpanelClient, { name, payload }: PendingEvent) => {
  try {
    mixpanel.track?.(name, payload);
  } catch {
    // A vendor failure must never break the click or route change that tracked it.
  }
};

const flushPendingEvents = (mixpanel: MixpanelClient) => {
  const events = pendingEvents;
  pendingEvents = [];
  events.forEach((event) => deliverEvent(mixpanel, event));
};

const queueEvent = (event: PendingEvent) => {
  if (isMixpanelUnavailable || pendingEvents.length >= MAX_PENDING_EVENTS) return;

  pendingEvents.push(event);
};

const stopQueueing = () => {
  isMixpanelUnavailable = true;
  pendingEvents = [];
};

const sendToMixpanel = (name: string, payload: AnalyticsEventPayload) => {
  const mixpanel = getMixpanel();
  const event = { name, payload };

  if (!mixpanel) {
    queueEvent(event);
    return;
  }

  // Send the backlog first so events still go out in the order they happened.
  if (pendingEvents.length > 0) flushPendingEvents(mixpanel);
  deliverEvent(mixpanel, event);
};

/** Initializes the downloaded Mixpanel bundle, then sends the events that waited for it. */
export function startMixpanel() {
  if (!isBrowser()) return;

  try {
    (window as AnalyticsWindow).mixpanel?.init?.(MIXPANEL_TOKEN, MIXPANEL_CONFIG);
  } catch {
    // Handled below: without a working SDK nothing waits for it.
  }

  const mixpanel = getMixpanel();
  if (!mixpanel) {
    stopQueueing();
    return;
  }

  try {
    if (RELEASE_VERSION) mixpanel.register?.({ release: RELEASE_VERSION });
  } catch {
    // Events still go out, just without the release.
  }

  flushPendingEvents(mixpanel);
}

const isCanonicalHost = () => window.location.hostname === new URL(SITE_URL).hostname;

type GoogleEvent = { name: string; params: AnalyticsEventPayload };

// Events wait here until gtag.js is requested, like Mixpanel's queue, so the
// landing page_view goes out first with the URL (and any utm_* tags) it had.
let googleState: 'waiting' | 'on' | 'off' = 'waiting';
let pendingGoogleEvents: GoogleEvent[] = [];
let lastGooglePage: string | undefined;

/**
 * GA's parameters for an event: where it happened, captured now rather than
 * when gtag.js arrives, and the payload without the page copies or empty
 * values. A page view after a client navigation names the previous page as
 * its referrer, as gtag's own history page views do.
 */
const toGoogleEvent = (name: string, payload: AnalyticsEventPayload): GoogleEvent => {
  const params: AnalyticsEventPayload = { page_location: window.location.href };
  Object.entries(payload).forEach(([key, value]) => {
    if (value !== undefined && !GA_OMITTED_PARAMS.has(key)) params[key] = value;
  });

  if (name === 'page_view' && typeof payload.page_url === 'string') {
    params.page_location = payload.page_url;
    const referrer = lastGooglePage ?? payload.page_referrer;
    if (referrer) params.page_referrer = referrer;
    lastGooglePage = payload.page_url;
  }

  return { name, params };
};

const deliverGoogleEvent = ({ name, params }: GoogleEvent) => {
  try {
    (window as AnalyticsWindow).gtag?.('event', name, params);
  } catch {
    // A vendor failure must never break the click or route change that tracked it.
  }
};

const sendToGoogle = (name: string, payload: AnalyticsEventPayload) => {
  if (googleState === 'off') return;

  const event = toGoogleEvent(name, payload);
  if (googleState === 'on') deliverGoogleEvent(event);
  else if (pendingGoogleEvents.length < MAX_PENDING_EVENTS) pendingGoogleEvents.push(event);
};

/**
 * Starts GA4 once per document, only on the canonical host, so local dev,
 * workers.dev, and branch previews send nothing. Commands go into the
 * dataLayer at once, held events included, and gtag.js runs them in order
 * when it arrives. Called by SiteAnalyticsScripts once the page has settled.
 */
export function loadGoogleAnalytics() {
  if (!isBrowser() || googleState !== 'waiting') return;

  if (!GA_MEASUREMENT_ID || !isCanonicalHost()) {
    googleState = 'off';
    pendingGoogleEvents = [];
    return;
  }

  const analyticsWindow = window as AnalyticsWindow;
  const dataLayer = (analyticsWindow.dataLayer ??= []);
  // gtag.js runs only Arguments objects, as Google's snippet pushes them; it
  // silently skips commands pushed as arrays.
  analyticsWindow.gtag = function gtag() {
    // eslint-disable-next-line prefer-rest-params
    dataLayer.push(arguments);
  };
  analyticsWindow.gtag('js', new Date());
  analyticsWindow.gtag('config', GA_MEASUREMENT_ID, GA_CONFIG);

  googleState = 'on';
  const events = pendingGoogleEvents;
  pendingGoogleEvents = [];
  events.forEach(deliverGoogleEvent);

  const script = document.createElement('script');
  script.src = GA_SCRIPT;
  script.async = true;
  document.head.appendChild(script);
}

/**
 * Downloads Mixpanel once per document, only on the canonical host and only
 * when a token is set, so local dev, workers.dev, and branch previews send
 * nothing. Called by SiteAnalyticsScripts once the page has settled.
 */
export function loadMixpanel() {
  if (!isBrowser() || isMixpanelRequested) return;
  isMixpanelRequested = true;

  if (!MIXPANEL_TOKEN || !isCanonicalHost()) {
    stopQueueing();
    return;
  }

  // The CDN bundle boots only from the official snippet's stub: a snippet
  // version and a list of instances to create. Init waits for onload.
  const analyticsWindow = window as AnalyticsWindow;
  analyticsWindow.mixpanel ??= Object.assign([], { __SV: 1.2, _i: [] });

  const script = document.createElement('script');
  const finish = (loaded: boolean) => {
    window.clearTimeout(timer);
    script.onload = null;
    script.onerror = null;
    if (loaded) {
      startMixpanel();
      return;
    }
    script.remove();
    stopQueueing();
  };
  const timer = window.setTimeout(() => finish(false), MIXPANEL_LOAD_TIMEOUT_MS);

  script.src = MIXPANEL_SCRIPT;
  script.async = true;
  script.onload = () => finish(true);
  script.onerror = () => finish(false);
  document.head.appendChild(script);
}

export function trackEvent(name: string, payload: AnalyticsEventPayload = {}) {
  if (!isBrowser()) return;

  sendToGoogle(name, payload);
  sendToMixpanel(name, payload);
}

export function trackLinkClick({
  location,
  label,
  href,
  section,
  variant,
  pagePath,
}: LinkClickPayload) {
  if (!isBrowser()) return;

  const isExternal = /^[a-z][a-z0-9+.-]*:/i.test(href);
  const payload = {
    link_location: location,
    link_text: label,
    link_url: href,
    link_external: isExternal,
    ...(section ? { link_section: section } : {}),
    ...(variant ? { link_variant: variant } : {}),
    page_path: pagePath ?? getPagePath(),
  };

  trackEvent('link_click', payload);
}

export function trackPageView(url?: string, title?: string) {
  if (!isBrowser()) return;

  const resolvedUrl = url ?? `${window.location.pathname}${window.location.search}${window.location.hash}`;
  const parsedUrl = new URL(resolvedUrl, window.location.origin);

  trackEvent('page_view', {
    page_path: parsedUrl.pathname,
    page_url: parsedUrl.href,
    page_title: title ?? document.title,
    page_referrer: document.referrer || undefined,
  });
}
