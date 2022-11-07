import {
  useAppSelector,
} from '../hooks';
import {
  selectData,
} from '../worksDataSlice';
import { useState } from 'react';

import Image from 'next/image';

import FsLightbox from 'fslightbox-react';

import { BioBoxContent, LinkBoxContent } from '../components';
import { Main, Wrapper, Title, SubTitle, SectionHeader } from '../../styles';

const MainContents = () => {
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

  // Grab the images from the correct index supplied by Lightbox
  const { imgs } = worksDataReversed[lightboxController.productIndex] || [];

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
                {imgs && <Image src={thumb} width='240' height='240' alt={group} className='thumb' />}

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
