import '../styles/globals.scss';
import type { AppProps } from 'next/app';
import { Provider } from 'react-redux';
import { store } from '../src/store';
import { useEffect } from 'react';

import TagManager from "react-gtm-module";

const tagManagerArgs = {
  gtmId: 'GTM-NWCBJRT'
};

function MyApp({
  Component, pageProps,
}: AppProps) {
  useEffect(() => {
    TagManager.initialize(tagManagerArgs);
  }, []);
  return (
    <Provider store={store}>
      <Component {...pageProps} />
    </Provider>
  );
}

export default MyApp;
