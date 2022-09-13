import type { NextPage } from 'next';
import Head from 'next/head';
import { useState, useEffect } from 'react';

import {
  useAppDispatch,
  useAppSelector,
} from '../src/hooks';
import {
  selectData,
  getData
} from '../src/worksDataSlice';

import FsLightbox from 'fslightbox-react';
import { BioBoxContent, LinkBoxContent, HeadContents } from '../src/components';
import { Container, Main, Wrapper, Title, SubTitle, SectionHeader } from '../styles';

import type { Props } from '../src/types';

const Home: NextPage<Props> = (props) => {
  const [shouldRender, setShouldRender] = useState(false);
  useEffect(() => {
    window.setTimeout(() => {
      setShouldRender(true);
    }, 300)
  }, []);

  const { worksDataReversed } = props;
  // const dispatch = useAppDispatch();
  // dispatch(getData(worksDataReversed));

  const { worksData } = useAppSelector(selectData);
  // console.log(worksData);

  // For lightbox
  const [lightboxController, setLightboxController] = useState({
    toggler: false,
    productIndex: 0
  });

  const onThumbClick = (index: number) => {
    setLightboxController({
      toggler: !lightboxController.toggler,
      productIndex: index
    });
  };

  const { imgs } = worksDataReversed[lightboxController.productIndex] || [];

  return (
    <Container>
      <Head>
        <HeadContents />
      </Head>

      <Wrapper>
        <Main>
          <div className='titles'>
            <Title>
              ZICKONEZERO Engineering
            </Title>
            <SubTitle>
              React Development & Cybersecurity
            </SubTitle>
          </div>

          <LinkBoxContent />

          <SectionHeader>Things I{"'"}ve Built</SectionHeader>

          {shouldRender ? <div className='grid'>
            {worksDataReversed.map((item, index) => {
              const { thumb, group, desc, header } = item;

              const Thumb: React.FunctionComponent = () => (
                <div onClick={() => onThumbClick(index)}>
                  {imgs && <img src={thumb} alt={group} className='thumb' />}
                  <h3>{header}</h3>
                  <p>{desc}</p>
                </div>
              );

              return (
                <Thumb key={group} />
              );
            })}
          </div> : <h2>Loading...</h2>}

          {imgs && <FsLightbox
            toggler={lightboxController.toggler}
            sources={imgs}
            slide={1}
          />}

          <BioBoxContent />
        </Main>
      </Wrapper>
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
