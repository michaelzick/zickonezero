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

import { TopNavContent, GridContent, FooterContent } from '.';
import { SectionHeader, Wrapper, WorkSectionHeader } from '../../styles';

const MainContent = () => {
  const { worksDataReversed } = useAppSelector(selectData);
  const { isMobileMenuShown } = useAppSelector(getMobileMenuState);
  const dispatch = useAppDispatch();

  // For lightbox
  const [lightboxController, setLightboxController] = useState({
    toggler: false,
    productIndex: 0
  });

  const onThumbClick = (index: number, squareLinkOut?: boolean) => {
    if (squareLinkOut) return;

    setLightboxController({
      toggler: !lightboxController.toggler,
      productIndex: index
    });
  };

  // Grab the images from the correct index supplied by Lightbox
  const { imgs } = worksDataReversed[lightboxController.productIndex] || [];

  return (
    <>
      <TopNavContent />

      <Wrapper isHomePage isMobileMenuShown={isMobileMenuShown}
        onClick={() => dispatch(showMobileMenu(false))}>
        <SectionHeader>
          {/* Projects I{"'"}ve <CommandLine>#managed</CommandLine> */}
          <WorkSectionHeader>Product Leadership</WorkSectionHeader>
        </SectionHeader>

        <GridContent
          worksDataReversed={worksDataReversed}
          onThumbClick={onThumbClick}
          isManagedWork
        />

        <SectionHeader>
          {/* Projects I{"'"}ve <CommandLine>$built</CommandLine> */}
          <WorkSectionHeader>Frontend Development</WorkSectionHeader>
        </SectionHeader>

        <GridContent
          worksDataReversed={worksDataReversed}
          onThumbClick={onThumbClick}
        />

        {imgs && <FsLightbox
          toggler={lightboxController.toggler}
          sources={imgs}
          slide={1}
        />}
      </Wrapper>
      <FooterContent />
    </>
  );
};

export default memo(MainContent);
