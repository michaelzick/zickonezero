type AmplitudeClient = {
  track?: (name: string, props?: Record<string, unknown>) => void;
  logEvent?: (name: string, props?: Record<string, unknown>) => void;
};

type AnalyticsWindow = Window & {
  amplitude?: AmplitudeClient;
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

const isBrowser = () => typeof window !== 'undefined';

const getAmplitude = (): AmplitudeClient | undefined => {
  if (!isBrowser()) return undefined;
  return (window as AnalyticsWindow).amplitude;
};

const getPagePath = () => {
  if (!isBrowser()) return undefined;
  return window.location.pathname;
};

/** Dispatched on window by the Amplitude init script (SiteAnalyticsScripts) once the SDK is ready. */
export const AMPLITUDE_READY_EVENT = 'zickonezero:amplitude-ready';

// Amplitude loads once the page is idle, so events tracked before then (the
// first page view, an early click) wait here and go out in order when it
// arrives. The cap keeps a blocked SDK from growing the queue without bound.
const MAX_PENDING_EVENTS = 50;

type PendingEvent = { name: string; payload: AnalyticsEventPayload };

let pendingEvents: PendingEvent[] = [];
let isWaitingForAmplitude = false;

const deliverEvent = (amplitude: AmplitudeClient, { name, payload }: PendingEvent) => {
  if (amplitude.track) {
    amplitude.track(name, payload);
    return;
  }

  amplitude.logEvent?.(name, payload);
};

const flushPendingEvents = () => {
  const amplitude = getAmplitude();
  if (!amplitude) return;

  window.removeEventListener(AMPLITUDE_READY_EVENT, flushPendingEvents);
  isWaitingForAmplitude = false;
  const events = pendingEvents;
  pendingEvents = [];
  events.forEach((event) => deliverEvent(amplitude, event));
};

const queueEvent = (event: PendingEvent) => {
  if (pendingEvents.length >= MAX_PENDING_EVENTS) return;

  pendingEvents.push(event);
  if (!isWaitingForAmplitude) {
    isWaitingForAmplitude = true;
    window.addEventListener(AMPLITUDE_READY_EVENT, flushPendingEvents);
  }
};

const sendAmplitudeEvent = (name: string, payload: AnalyticsEventPayload) => {
  const amplitude = getAmplitude();
  const event = { name, payload };

  if (!amplitude) {
    queueEvent(event);
    return;
  }

  // The SDK can appear before its ready event; send the backlog first so
  // events still go out in the order they happened.
  if (pendingEvents.length > 0) flushPendingEvents();
  deliverEvent(amplitude, event);
};

export function trackEvent(name: string, payload: AnalyticsEventPayload = {}) {
  if (!isBrowser()) return;

  sendAmplitudeEvent(name, payload);
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
