import Script from 'next/script';

// Browser-side Amplitude key (public by design). Overridable via env; the
// literal fallback keeps local/CI builds working without extra configuration.
const AMPLITUDE_API_KEY = process.env.NEXT_PUBLIC_AMPLITUDE_API_KEY || 'd795dbfcd00a9b445dc1dcdc3a19672a';

const SiteAnalyticsScripts = () => (
  <>
    <Script
      strategy='afterInteractive'
      src={`https://cdn.amplitude.com/script/${AMPLITUDE_API_KEY}.js`}
    />
    <Script id='amplitude-init' strategy='afterInteractive'>
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
          }

          tryInit();
        })();
      `}
    </Script>
  </>
);

export default SiteAnalyticsScripts;
