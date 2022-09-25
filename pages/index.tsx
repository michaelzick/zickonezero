import type { NextPage } from 'next';
import Script from 'next/script';
import Head from 'next/head';

import {
  useAppDispatch,
} from '../src/hooks';
import {
  setPageData
} from '../src/worksDataSlice';

import getWorksData from './api/getWorksData';

import { HeadContents, MainContents, FooterContents } from '../src/components';
import { Container } from '../styles';

import type { WorksDataType } from '../src/types';

const Home: NextPage<WorksDataType> = (props) => {
  const { worksDataReversed } = props;
  const dispatch = useAppDispatch();
  dispatch(setPageData(worksDataReversed));

  return (
    <Container>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1"></meta>
        <title>ZICKONEZERO Engineering</title>
        <HeadContents />
      </Head>
      <Script id='gtm' strategy="afterInteractive" dangerouslySetInnerHTML={{
        __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
        new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
        j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
        'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
        })(window,document,'script','dataLayer','GTM-5JHBZZX');`}}></Script>

      <noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-5JHBZZX"
        height="0" width="0" style={{ display: 'none', visibility: 'hidden' }}></iframe></noscript>
      <MainContents />
      <FooterContents />
    </Container >
  );
};

export async function getStaticProps() {
  const worksDataReversed = await getWorksData();

  return {
    props: { worksDataReversed } // will be passed to the page component as props
  };
}

export default Home;
