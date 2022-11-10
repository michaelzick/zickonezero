import {
  useAppSelector,
  useAppDispatch
} from '../hooks';
import {
  selectData,
} from '../worksDataSlice';
import {
  showMobileMenu,
} from '../showMobileMenuSlice';
import { useState } from 'react';

import Image from 'next/image';

import FsLightbox from 'fslightbox-react';

import { NavContent } from '.';
import { SectionHeader, GridContainer } from '../../styles';

const MainContent = () => {
  const { worksDataReversed } = useAppSelector(selectData);
  const dispatch = useAppDispatch();

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
    <>
      <NavContent />

      <div className='wrapper' onClick={() => dispatch(showMobileMenu(false))}>
        <SectionHeader>Things I{"'"}ve <span className='command-line'>$built</span></SectionHeader>

        <GridContainer>
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
        </GridContainer>

        {imgs && <FsLightbox
          toggler={lightboxController.toggler}
          sources={imgs}
          slide={1}
        />}
      </div>
    </>
  );
};

export default MainContent;
