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

import { HeadContent, MainContent, FooterContent } from '../src/components';
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
      <MainContent />
      <FooterContent />
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
