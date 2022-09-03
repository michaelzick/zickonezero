import type { NextPage } from 'next';
import Image from 'next/image';
import Head from 'next/head';
import { useEffect, useState } from 'react';

import FsLightbox from 'fslightbox-react';
import styles from '../styles/Home.module.scss';
import { BioBoxContent, LinkBoxContent } from '../src';
import { Wrapper, Title, SubTitle } from '../styles';

const Home: NextPage = () => {
  const [worksData, setWorks] = useState([]);

  useEffect(() => {
    const setData = async () => {
      const fetchData = await fetch('./api');
      const dataJson = await fetchData.json();
      const { worksData } = dataJson;
      setWorks(worksData.reverse());
    };

    setData();
  }, []);

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

  const { imgs } = worksData[lightboxController.productIndex] || [];

  return (
    <div className={styles.container}>
      <Head>
        <title>Michael Zick</title>
        <meta name="description" content="I'm a frontend engineer, coach, and cybersecurity enthusiast based in Los Angeles, CA." />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Wrapper>
        {worksData.length > 0 && <main className={styles.main}>
          <div className='titles'>
            <Title>
              ZICKONEZERO Engineering
            </Title>
            <SubTitle>
              React Development :: Cybersecurity
            </SubTitle>
          </div>

          <LinkBoxContent />

          <div className={styles.grid}>
            {worksData.map((item, index) => {
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
        </main>}
      </Wrapper>
    </div >
  );
};

export default Home;
