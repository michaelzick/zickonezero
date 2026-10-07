import '../styles/globals.scss';
import type { AppProps } from 'next/app';
import Script from 'next/script';
import Head from 'next/head';
import { useEffect } from 'react';
import { Provider } from 'react-redux';
import { store } from '../src/store';

import CityBackdrop from '../src/components/city/CityBackdrop';
import FastTravelTransition from '../src/components/city/FastTravelTransition';
import WeatherCanvas from '../src/components/city/WeatherCanvas';
import PageAnalytics from '../src/components/PageAnalytics';
import SiteAnalyticsScripts from '../src/components/SiteAnalyticsScripts';
import { CurrentPathContext } from '../src/hooks/useCurrentPath';
import { markCityStarted } from '../src/lib/city/powerOn';
import { isHomePath, normalizeRoutePath } from '../src/lib/city/routes';
import { AppThemeProvider } from '../src/theme/ThemeContext';
import FontVariables from '../src/theme/FontVariables';
import ThemeColorMeta from '../src/theme/ThemeColorMeta';
import { Container } from '../styles';

function MyApp({
  Component, pageProps, router,
}: AppProps) {
  // Power-on effects play on the first page only; later pages arrive lit.
  useEffect(markCityStarted, []);

  return (
    <Provider store={store}>
      <AppThemeProvider>
        <FontVariables />
        <ThemeColorMeta />
        <Container>
          {/* Google Tag Manager Script */}
          <Script
            id="gtm"
            strategy="afterInteractive"
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
          <SiteAnalyticsScripts />
          <PageAnalytics />

          <Head>
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <link rel="icon" href="/img/favicon/favicon.ico" sizes="any" />
            <link rel="icon" type="image/png" sizes="32x32" href="/img/favicon/favicon-32x32.png" />
            <link rel="icon" type="image/png" sizes="16x16" href="/img/favicon/favicon-16x16.png" />
            <link rel="apple-touch-icon" href="/img/favicon/apple-touch-icon.png" />
            <link rel="manifest" href="/img/favicon/site.webmanifest" />
          </Head>

          {/* The persistent city: mounted once, alive across page changes. */}
          <CityBackdrop pathname={router.pathname} />
          <WeatherCanvas
            dimmed={!isHomePath(router.pathname)}
            snow={normalizeRoutePath(router.pathname) === '/about'}
          />

          <CurrentPathContext.Provider value={normalizeRoutePath(router.pathname)}>
            <Component {...pageProps} />
          </CurrentPathContext.Provider>

          <FastTravelTransition />
        </Container>
      </AppThemeProvider>
    </Provider>
  );
}

export default MyApp;
