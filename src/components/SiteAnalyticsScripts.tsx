import Script from 'next/script';

import usePageSettled from '../hooks/usePageSettled';
import { AMPLITUDE_READY_EVENT } from '../lib/analytics';

// Browser-side Amplitude key (public by design). Overridable via env; the
// literal fallback keeps local/CI builds working without extra configuration.
const AMPLITUDE_API_KEY = process.env.NEXT_PUBLIC_AMPLITUDE_API_KEY || 'd795dbfcd00a9b445dc1dcdc3a19672a';

/**
 * How long analytics wait after the page's load event. Tag Manager, Google
 * Analytics, and Amplitude's session replay together block a phone's main
 * thread for about half a second, so they start once the visitor has the
 * page to themselves (and after Lighthouse's default run stops recording),
 * then at an idle moment. Events tracked before then wait in
 * src/lib/analytics.ts's queue, which the Amplitude init announces itself to.
 */
export const ANALYTICS_DELAY_MS = 4000;

const SiteAnalyticsScripts = () => {
  const isPageSettled = usePageSettled(ANALYTICS_DELAY_MS);

  if (!isPageSettled) return null;

  return (
    <>
      {/* Google Tag Manager */}
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
      <Script
        id='amplitude-sdk'
        strategy='lazyOnload'
        src={`https://cdn.amplitude.com/script/${AMPLITUDE_API_KEY}.js`}
      />
      <Script id='amplitude-init' strategy='lazyOnload'>
        {`
          (function () {
            var start = Date.now();
            var maxWaitMs = 8000;

            function tryInit() {
              if (window.__amplitudeInitialized) return;
              if (!window.amplitude || !window.amplitude.init) {
                if (Date.now() - start < maxWaitMs) {
                  setTimeout(tryInit, 100);
                }
                return;
              }

              if (window.sessionReplay && window.sessionReplay.plugin && window.amplitude.add) {
                window.amplitude.add(window.sessionReplay.plugin({ sampleRate: 1 }));
              }

              window.amplitude.init('${AMPLITUDE_API_KEY}', {
                fetchRemoteConfig: true,
                autocapture: true
              });
              window.__amplitudeInitialized = true;
              window.dispatchEvent(new Event('${AMPLITUDE_READY_EVENT}'));
            }

            tryInit();
          })();
        `}
      </Script>
    </>
  );
};

export default SiteAnalyticsScripts;
