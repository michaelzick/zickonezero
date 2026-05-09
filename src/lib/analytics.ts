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

const sendAmplitudeEvent = (name: string, payload: AnalyticsEventPayload) => {
  const amplitude = getAmplitude();

  if (amplitude?.track) {
    amplitude.track(name, payload);
    return;
  }

  if (amplitude?.logEvent) {
    amplitude.logEvent(name, payload);
  }
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
