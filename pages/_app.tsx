import '../styles/globals.scss';
import type { AppProps } from 'next/app';
import Script from 'next/script';
import Head from 'next/head';
import { Provider } from 'react-redux';
import { store } from '../src/store';

import { HeadContent } from '../src/components';
import { Container } from '../styles';

function MyApp({
  Component, pageProps,
}: AppProps) {
  return (
    <Provider store={store}>
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

        <Head>
          <meta name="viewport" content="width=device-width, initial-scale=1"></meta>
          <title>ZICKONEZERO Product & Engineering</title>
          <HeadContent />
        </Head>

        <Component {...pageProps} />
      </Container>
    </Provider>
  );
}

export default MyApp;
