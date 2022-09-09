import type { NextPage } from 'next';
import Image from 'next/image';
import Head from 'next/head';
import { useState } from 'react';

import FsLightbox from 'fslightbox-react';
import { BioBoxContent, LinkBoxContent } from '../src';
import { Container, Main, Wrapper, Title, SubTitle } from '../styles';

import type { Props } from '../src/types';

const Home: NextPage<Props> = (props) => {
  const { worksDataReversed } = props;

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
        <title>Michael Zick</title>
        <meta name="description" content="I'm a frontend engineer, coach, and cybersecurity enthusiast based in Los Angeles, CA." />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Wrapper>
        {worksDataReversed.length > 0 && <Main>
          <div className='titles'>
            <Title>
              ZICKONEZERO Engineering
            </Title>
            <SubTitle>
              React Development & Cybersecurity
            </SubTitle>
          </div>

          <LinkBoxContent />

          <div className='grid'>
            {worksDataReversed.map((item, index) => {
              const { thumb, group } = item;

              const Thumb: React.FunctionComponent = () => (
                <div onClick={() => onThumbClick(index)}>
                  <Image src={thumb} width='200px' height='200px' alt={group} className='thumb' style={{ borderRadius: 3 }} />
                </div>
              );

              return (
                <Thumb key={group} />
              );
            })}
          </div>

          <FsLightbox
            toggler={lightboxController.toggler}
            sources={imgs}
            slide={1}
          />

          <BioBoxContent />
        </Main>}
      </Wrapper>
    </Container >
  );
};

export async function getServerSideProps() {
  const fetchData = await fetch(
    `${process.env.NODE_ENV === 'development' ?
      'http://localhost:3000' :
      'https://zickonezero-syv79.ondigitalocean.app'}/api`
  );
  const dataJson = await fetchData.json();
  const { worksData } = dataJson;
  const worksDataReversed = worksData.reverse();

  return {
    props: { worksDataReversed } // will be passed to the page component as props
  };
}

export default Home;
