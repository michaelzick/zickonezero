import {
  useAppSelector,
} from '../hooks';
import {
  selectData,
} from '../worksDataSlice';
import { useState, useEffect } from 'react';

import Image from 'next/image';

import FsLightbox from 'fslightbox-react';

import { BioBoxContent, LinkBoxContent } from '../components';
import { Main, Wrapper, Title, SubTitle, SectionHeader } from '../../styles';

const MainContents = () => {
  const [shouldRender, setShouldRender] = useState(false);
  useEffect(() => {
    window.setTimeout(() => {
      setShouldRender(true);
    }, 0);
  }, []);

  const { worksDataReversed } = useAppSelector(selectData);

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
  const baseUrl = `${process.env.NODE_ENV === 'production' ?
    'https://www.zickonezero.com' :
    'http://localhost:3000'}`;

  return (
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

        <div className='grid'>
          {worksDataReversed.map((item, index) => {
            const { thumb, group, desc, header } = item;

            const Thumb: React.FunctionComponent = () => (
              <div onClick={() => onThumbClick(index)}>
                {imgs && <Image src={thumb} width='240' height='240' alt={group}
                  className='thumb' placeholder='blur' blurDataURL={thumb} />}

                <h3>{header}</h3>

                <p>{desc}</p>
              </div>
            );

            return (
              <Thumb key={group} />
            );
          })}
        </div>

        {imgs && <FsLightbox
          toggler={lightboxController.toggler}
          sources={imgs}
          slide={1}
        />}

        <BioBoxContent />
      </Main>
    </Wrapper>
  );
};

export default MainContents;
