import Script from 'next/script';
import { useEffect } from 'react';

import usePageSettled from '../hooks/usePageSettled';
import { loadMixpanel } from '../lib/analytics';

/**
 * How long analytics wait after the page's load event. Tag Manager, Google
 * Analytics, and Mixpanel's session replay together block a phone's main
 * thread for about half a second, so they start once the visitor has the
 * page to themselves (and after Lighthouse's default run stops recording).
 * Events tracked before then wait in src/lib/analytics.ts's queue, which
 * Mixpanel's loader flushes once the SDK is initialized.
 */
export const ANALYTICS_DELAY_MS = 4000;

const SiteAnalyticsScripts = () => {
  const isPageSettled = usePageSettled(ANALYTICS_DELAY_MS);

  useEffect(() => {
    if (isPageSettled) loadMixpanel();
  }, [isPageSettled]);

  if (!isPageSettled) return null;

  return (
    /* Google Tag Manager */
    <Script
      id='gtm'
      strategy='lazyOnload'
      dangerouslySetInnerHTML={{
        __html: `
          (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
          new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
          j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
          'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
          })(window,document,'script','dataLayer','GTM-5JHBZZX');
        `,
      }}
    />
  );
};

export default SiteAnalyticsScripts;
