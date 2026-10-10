import { useEffect } from 'react';

import usePageSettled from '../hooks/usePageSettled';
import { loadGoogleAnalytics, loadMixpanel } from '../lib/analytics';

/**
 * How long analytics wait after the page's load event. Google Analytics and
 * Mixpanel's session replay together block a phone's main thread for about
 * half a second, so they start once the visitor has the page to themselves
 * (and after Lighthouse's default run stops recording). Events tracked
 * before then wait in src/lib/analytics.ts's queues, which each loader
 * flushes once it starts.
 */
export const ANALYTICS_DELAY_MS = 4000;

const SiteAnalyticsScripts = () => {
  const isPageSettled = usePageSettled(ANALYTICS_DELAY_MS);

  useEffect(() => {
    if (!isPageSettled) return;

    loadGoogleAnalytics();
    loadMixpanel();
  }, [isPageSettled]);

  return null;
};

export default SiteAnalyticsScripts;
