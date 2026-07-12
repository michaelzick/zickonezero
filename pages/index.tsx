import type { NextPage } from 'next';
import { useEffect } from 'react';

import {
  useAppDispatch,
} from '../src/hooks';
import {
  setPageData
} from '../src/worksDataSlice';

import getWorksData from '../src/lib/getWorksData';

import { MainContent } from '../src/components';

import type { WorksDataType } from '../src/types';

const Home: NextPage<WorksDataType> = (props) => {
  const { worksDataReversed } = props;
  const dispatch = useAppDispatch();

  // Keep the Redux store in sync for any store consumers on the client. The
  // pre-rendered grid HTML comes from the `worksDataReversed` prop below, so the
  // static export never depends on this effect having run.
  useEffect(() => {
    dispatch(setPageData(worksDataReversed));
  }, [dispatch, worksDataReversed]);

  return (
    <MainContent worksDataReversed={worksDataReversed} />
  );
};

export async function getStaticProps() {
  const worksDataReversed = await getWorksData();

  return {
    props: { worksDataReversed } // will be passed to the page component as props
  };
}

export default Home;
