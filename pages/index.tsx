import type { NextPage } from 'next';
import Image from 'next/image';
import Head from 'next/head';
import { useState } from 'react';

import FsLightbox from 'fslightbox-react';
import { BioBoxContent, LinkBoxContent } from '../src';
import { Container, Main, Wrapper, Title, SubTitle } from '../styles';

import type { Props } from '../src/types';

const Home: NextPage<Props> = (props) => {
  const { worksData } = props;

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

  const reversedWorksData = worksData.reverse();
  const { imgs } = reversedWorksData[lightboxController.productIndex] || [];

  return (
    <Container>
      <Head>
        <title>Michael Zick</title>
        <meta name="description" content="I'm a frontend engineer, coach, and cybersecurity enthusiast based in Los Angeles, CA." />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Wrapper>
        {reversedWorksData.length > 0 && <Main>
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
            {reversedWorksData.map((item, index) => {
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
  const fetchData = await fetch('http://localhost:3000/api');
  const dataJson = await fetchData.json();
  const { worksData } = dataJson;

  return {
    props: { worksData }, // will be passed to the page component as props
  };
}

export default Home;
