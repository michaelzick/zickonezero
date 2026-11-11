import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  useAppDispatch,
  useAppSelector
} from '../hooks';
import {
  showMobileMenu,
  getMobileMenuState
} from '../showMobileMenuSlice';
import { scrollToTop } from '../helpers';

import { Wrapper } from '../../styles';
import FooterContent from './FooterContent';
import TopNavContent from './TopNavContent';
import DemoStokeTabs from './DemoStokeTabs';
import { SidebarSectionTabsMobile } from './SidebarSectionTabs';
import { CASE_STUDY_BOTTOM_SECTION_ID, CASE_STUDY_SECTIONS, HOW_IMAGES } from './demostoke/data';
import {
  SCREEN_BLOCKS,
  SCREEN_BOTTOM_SECTION_ID,
  SCREEN_HERO_IMAGE,
  SCREEN_SECTIONS
} from './demostoke/screenData';
import CaseStudyContent from './demostoke/CaseStudyContent';
import ScreensContent from './demostoke/ScreensContent';
import LazyLightbox from './LazyLightbox';
import useAnimatedSections from '../hooks/useAnimatedSections';
import useHorizontalGallery from '../hooks/useHorizontalGallery';
import useLightboxController from '../hooks/useLightboxController';
import { trackEvent } from '../lib/analytics';

type SectionKey = 'case-study' | 'screens';

// The intro opens the page, so it boots up from the first paint.
const OPENING_SECTIONS = ['section-intro'];

const DemoStokeContent = () => {
  const { isMobileMenuShown } = useAppSelector(getMobileMenuState);
  const dispatch = useAppDispatch();
  const [activeTab, setActiveTab] = useState<SectionKey>('case-study');
  const [topTabsEl, setTopTabsEl] = useState<HTMLDivElement | null>(null);
  const [openPersonaId, setOpenPersonaId] = useState<string | null>(null);
  const { visibleSections, setAnimatedSectionRef } = useAnimatedSections(activeTab, OPENING_SECTIONS);
  const { lightboxController, openLightbox } = useLightboxController();
  const { lightboxController: screenLightboxController, openLightbox: openScreenLightbox } = useLightboxController();
  const { rowRef, canScrollLeft, canScrollRight, scrollGalleryBy } = useHorizontalGallery(activeTab);
  const caseStudyImages = HOW_IMAGES;
  const screenImages = useMemo(() => [SCREEN_HERO_IMAGE, ...SCREEN_BLOCKS.flatMap(({ images }) => images)], []);
  const handleTopTabsRef = useCallback((node: HTMLDivElement | null) => {
    setTopTabsEl(node);
  }, []);

  const handleTabClick = (tabKey: string) => {
    setActiveTab(tabKey as SectionKey);
  };
  const isCaseStudyView = activeTab === 'case-study';
  const currentSections = isCaseStudyView ? CASE_STUDY_SECTIONS : SCREEN_SECTIONS;
  const lockToBottomSectionId = isCaseStudyView ? CASE_STUDY_BOTTOM_SECTION_ID : SCREEN_BOTTOM_SECTION_ID;

  // Scroll to top after tab content changes
  useEffect(() => {
    // Use requestAnimationFrame to ensure scroll happens after browser layout calculations
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        scrollToTop();
      });
    });
  }, [activeTab]);

  const togglePersona = useCallback((id: string) => {
    setOpenPersonaId(current => {
      const isClosing = current === id;
      trackEvent(isClosing ? 'modal_close' : 'modal_open', {
        location: 'demostoke_personas',
        modal: 'persona',
        persona_id: id,
        page_path: window.location.pathname,
      });
      return isClosing ? null : id;
    });
  }, []);

  const handleGalleryScroll = useCallback((direction: number) => {
    trackEvent('gallery_scroll', {
      location: 'demostoke_case_study_gallery',
      direction: direction < 0 ? 'left' : 'right',
      page_path: window.location.pathname,
    });
    scrollGalleryBy(direction);
  }, [scrollGalleryBy]);

  const handleOpenLightbox = useCallback((index: number) => {
    const image = caseStudyImages[index];
    trackEvent('lightbox_open', {
      location: 'demostoke_case_study',
      image_index: index,
      image_alt: image?.alt,
      image_url: image?.src,
      page_path: window.location.pathname,
    });
    openLightbox(index);
  }, [caseStudyImages, openLightbox]);

  const handleOpenScreenLightbox = useCallback((index: number) => {
    const image = screenImages[index];
    trackEvent('lightbox_open', {
      location: 'demostoke_product_screens',
      image_index: index,
      image_alt: image?.alt,
      image_url: image?.src,
      page_path: window.location.pathname,
    });
    openScreenLightbox(index);
  }, [screenImages, openScreenLightbox]);

  return (
    <>
      <TopNavContent />
      <Wrapper isMobileMenuShown={isMobileMenuShown}
        onClick={() => dispatch(showMobileMenu(false))}>
        <DemoStokeTabs
          ref={handleTopTabsRef}
          tabs={[
            { key: 'case-study', label: 'Product Story' },
            { key: 'screens', label: 'Product Screens' }
          ]}
          activeTab={activeTab}
          onTabClick={handleTabClick}
        />
        <SidebarSectionTabsMobile
          sections={currentSections}
          topTabsEl={topTabsEl}
          isActive={true}
          lockToBottomSectionId={lockToBottomSectionId}
          scrollOffsetAdjustment={8}
          fitMobileLabels
        />

        <CaseStudyContent
          setAnimatedSectionRef={setAnimatedSectionRef}
          visibleSections={visibleSections}
          scrollRowRef={rowRef}
          canScrollLeft={canScrollLeft}
          canScrollRight={canScrollRight}
          scrollGalleryBy={handleGalleryScroll}
          openLightbox={handleOpenLightbox}
          openPersonaId={openPersonaId}
          togglePersona={togglePersona}
          topTabsEl={topTabsEl}
          isActive={activeTab === 'case-study'}
        />

        <ScreensContent
          setAnimatedSectionRef={setAnimatedSectionRef}
          visibleSections={visibleSections}
          topTabsEl={topTabsEl}
          sections={SCREEN_SECTIONS}
          isActive={!isCaseStudyView}
          openScreenLightbox={handleOpenScreenLightbox}
        />
      </Wrapper>
      <LazyLightbox
        toggler={lightboxController.toggler}
        sources={caseStudyImages.map(({ src }) => src)}
        slide={lightboxController.slide}
      />
      <LazyLightbox
        toggler={screenLightboxController.toggler}
        sources={screenImages.map(({ src }) => src)}
        slide={screenLightboxController.slide}
      />
      <FooterContent />
    </>
  );
};

export default DemoStokeContent;
