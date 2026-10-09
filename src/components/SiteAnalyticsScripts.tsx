import Script from 'next/script';

import { AMPLITUDE_READY_EVENT } from '../lib/analytics';

// Browser-side Amplitude key (public by design). Overridable via env; the
// literal fallback keeps local/CI builds working without extra configuration.
const AMPLITUDE_API_KEY = process.env.NEXT_PUBLIC_AMPLITUDE_API_KEY || 'd795dbfcd00a9b445dc1dcdc3a19672a';

// Both scripts load once the page is idle, so analytics never competes with
// the first paint. Events tracked before then wait in src/lib/analytics.ts's
// queue, which the init announces itself to.
const SiteAnalyticsScripts = () => (
  <>
    <Script
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

export default SiteAnalyticsScripts;
