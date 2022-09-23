import type { NextPage } from 'next';
import Head from 'next/head';

import {
  useAppDispatch,
} from '../src/hooks';
import {
  getData
} from '../src/worksDataSlice';

import { MainContents } from '../src/components/MainContents';
import { HeadContents } from '../src/components';
import { Container } from '../styles';

import type { WorksDataType } from '../src/types';

const Home: NextPage<WorksDataType> = (props) => {
  const { worksDataReversed } = props;
  const dispatch = useAppDispatch();
  dispatch(getData(worksDataReversed));

  return (
    <Container>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1"></meta>
        <title>ZICKONEZERO Engineering</title>
        <HeadContents />
      </Head>
      <MainContents />
    </Container >
  );
};

export async function getStaticProps() {
  let worksDataReversed = {};

  try {
    const fetchData = await fetch(
      `${process.env.NODE_ENV === 'development' ?
        'http://localhost:3000' :
        'https://zickonezero-syv79.ondigitalocean.app'}/api`
    );
    const dataJson = await fetchData.json();
    const { worksData } = dataJson;
    worksDataReversed = worksData.reverse();
  } catch (e) {
    return {
      props: { worksDataReversed: [{ desc: 'There was a problem with the data.' }] }
    };
  }

  return {
    props: { worksDataReversed } // will be passed to the page component as props
  };
}

export default Home;
