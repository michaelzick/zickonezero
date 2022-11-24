import {
  useAppSelector,
  useAppDispatch
} from '../hooks';
import {
  selectData,
} from '../worksDataSlice';
import {
  showMobileMenu,
  getMobileMenuState
} from '../showMobileMenuSlice';
import { useState, memo } from 'react';

import FsLightbox from 'fslightbox-react';

import { NavContent, Thumbnail } from '.';
import { SectionHeader, GridContainer, Wrapper } from '../../styles';

const MainContent = () => {
  const { worksDataReversed } = useAppSelector(selectData);
  const { isMobileMenuShown } = useAppSelector(getMobileMenuState);
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

      <Wrapper isHomePage isMobileMenuShown={isMobileMenuShown}
        onClick={() => dispatch(showMobileMenu(false))}>
        <SectionHeader>Things I{"'"}ve <span className='command-line'>$built</span></SectionHeader>

        <GridContainer>
          <div className='grid'>
            {worksDataReversed.map((item, index) => {
              const { group } = item;

              return (
                <Thumbnail
                  key={group}
                  index={index}
                  onThumbClick={onThumbClick}
                  {...item}
                />
              );
            })}
          </div>
        </GridContainer>

        {imgs && <FsLightbox
          toggler={lightboxController.toggler}
          sources={imgs}
          slide={1}
        />}
      </Wrapper>
    </>
  );
};

export default memo(MainContent);
