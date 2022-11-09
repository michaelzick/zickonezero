import type { NextPage } from 'next';

import {
  useAppDispatch,
} from '../src/hooks';
import {
  setPageData
} from '../src/worksDataSlice';

import getWorksData from './api/getWorksData';

import { MainContent } from '../src/components';

import type { WorksDataType } from '../src/types';

const Home: NextPage<WorksDataType> = (props) => {
  const { worksDataReversed } = props;
  const dispatch = useAppDispatch();
  dispatch(setPageData(worksDataReversed));

  return (
    <MainContent />
  );
};

export async function getStaticProps() {
  const worksDataReversed = await getWorksData();

  return {
    props: { worksDataReversed } // will be passed to the page component as props
  };
}

export default Home;
