import type { NextPage } from 'next';
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
