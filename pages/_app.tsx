import '../styles/globals.scss';
import type { AppProps } from 'next/app';
import Script from 'next/script';
import Head from 'next/head';
import { Provider } from 'react-redux';
import { store } from '../src/store';

import { HeadContent, FooterContent } from '../src/components';
import { Container } from '../styles';

function MyApp({
  Component, pageProps,
}: AppProps) {
  return (
    <Provider store={store}>
      <Container>
        <Head>
          <meta name="viewport" content="width=device-width, initial-scale=1"></meta>
          <title>ZICKONEZERO Engineering</title>
          <HeadContent />
        </Head>
        <Script id='gtm' strategy="afterInteractive" dangerouslySetInnerHTML={{
          __html: `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());

          gtag('config', 'G-DY992J2EV8');
        `}}>
        </Script>
        <Script async src="https://www.googletagmanager.com/gtag/js?id=G-DY992J2EV8"></Script>

        <Component {...pageProps} />
        <FooterContent />
      </Container>
    </Provider>
  );
}

export default MyApp;
