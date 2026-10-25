import { useCallback, useEffect, useMemo, useState } from 'react';

import {
  useAppDispatch,
  useAppSelector
} from '../../hooks';
import {
  getMobileMenuState,
  showMobileMenu
} from '../../showMobileMenuSlice';
import { scrollToTop } from '../../helpers';

import { Wrapper } from '../../../styles';
import FooterContent from '../FooterContent';
import TopNavContent from '../TopNavContent';
import DemoStokeTabs from '../DemoStokeTabs';
import { SidebarSectionTabsMobile } from '../SidebarSectionTabs';
import LazyLightbox from '../LazyLightbox';
import CaseStudyTab from './CaseStudyTab';
import ScreensTab from './ScreensTab';
import { CASE_STUDY_BOTTOM_SECTION_ID, CASE_STUDY_SECTIONS, screenSections } from './sections';
import { type CaseStudyData, type CaseStudyImage } from './types';
import useAnimatedSections from '../../hooks/useAnimatedSections';
import useHorizontalGallery from '../../hooks/useHorizontalGallery';
import useLightboxController from '../../hooks/useLightboxController';
import { trackEvent } from '../../lib/analytics';

type SectionKey = 'case-study' | 'screens';

// The intro opens the page, so it boots up from the first paint.
const OPENING_SECTIONS = ['section-intro'];

type CaseStudyPageProps = {
  study: CaseStudyData;
};

/**
 * A two-tab case study, UX Case Study and Product Screens, built from data
 * with the same layout, section nav, and tracking as Nice Guy University's.
 */
const CaseStudyPage = ({ study }: CaseStudyPageProps) => {
  const { analyticsId } = study;
  const { isMobileMenuShown } = useAppSelector(getMobileMenuState);
  const dispatch = useAppDispatch();
  const [activeTab, setActiveTab] = useState<SectionKey>('case-study');
  const [topTabsEl, setTopTabsEl] = useState<HTMLDivElement | null>(null);
  const [openPersonaId, setOpenPersonaId] = useState<string | null>(null);
  const { visibleSections, setAnimatedSectionRef } = useAnimatedSections(activeTab, OPENING_SECTIONS);
  const { lightboxController, openLightbox } = useLightboxController();
  const { lightboxController: methodLightboxController, openLightbox: openMethodLightbox } = useLightboxController();
  const { lightboxController: screenLightboxController, openLightbox: openScreenLightbox } = useLightboxController();
  const { rowRef, canScrollLeft, canScrollRight, scrollGalleryBy } = useHorizontalGallery(activeTab);
  const caseStudyImages = useMemo(() => [...study.what.map(({ image }) => image), ...study.how.gallery], [study]);
  const methodImages = useMemo(() => study.methods.flatMap(({ images }) => images), [study]);
  const screenImages = useMemo(() => [study.screens.hero, ...study.screens.blocks.flatMap(({ images }) => images)], [study]);
  const screensNav = useMemo(() => screenSections(study), [study]);

  const handleTopTabsRef = useCallback((node: HTMLDivElement | null) => {
    setTopTabsEl(node);
  }, []);

  const handleTabClick = (tabKey: string) => {
    setActiveTab(tabKey as SectionKey);
  };

  const isCaseStudyView = activeTab === 'case-study';
  const currentSections = isCaseStudyView ? CASE_STUDY_SECTIONS : screensNav;
  const lockToBottomSectionId = isCaseStudyView
    ? CASE_STUDY_BOTTOM_SECTION_ID
    : screensNav[screensNav.length - 1]?.id;

  useEffect(() => {
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
        location: `${analyticsId}_personas`,
        modal: 'persona',
        persona_id: id,
        page_path: window.location.pathname,
      });
      return isClosing ? null : id;
    });
  }, [analyticsId]);

  const handleGalleryScroll = useCallback((direction: number) => {
    trackEvent('gallery_scroll', {
      location: `${analyticsId}_case_study_gallery`,
      direction: direction < 0 ? 'left' : 'right',
      page_path: window.location.pathname,
    });
    scrollGalleryBy(direction);
  }, [analyticsId, scrollGalleryBy]);

  const trackLightboxOpen = useCallback((location: string, images: CaseStudyImage[], index: number) => {
    const image = images[index];
    trackEvent('lightbox_open', {
      location: `${analyticsId}_${location}`,
      image_index: index,
      image_alt: image?.alt,
      image_url: image?.src,
      page_path: window.location.pathname,
    });
  }, [analyticsId]);

  const handleOpenCaseStudyLightbox = useCallback((index: number) => {
    trackLightboxOpen('case_study', caseStudyImages, index);
    openLightbox(index);
  }, [caseStudyImages, openLightbox, trackLightboxOpen]);

  const handleOpenMethodLightbox = useCallback((index: number) => {
    trackLightboxOpen('methods', methodImages, index);
    openMethodLightbox(index);
  }, [methodImages, openMethodLightbox, trackLightboxOpen]);

  const handleOpenScreenLightbox = useCallback((index: number) => {
    trackLightboxOpen('product_screens', screenImages, index);
    openScreenLightbox(index);
  }, [screenImages, openScreenLightbox, trackLightboxOpen]);

  return (
    <>
      <TopNavContent />
      <Wrapper
        isMobileMenuShown={isMobileMenuShown}
        onClick={() => dispatch(showMobileMenu(false))}
      >
        <DemoStokeTabs
          ref={handleTopTabsRef}
          tabs={[
            { key: 'case-study', label: 'UX Case Study' },
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
        />

        <CaseStudyTab
          study={study}
          setAnimatedSectionRef={setAnimatedSectionRef}
          visibleSections={visibleSections}
          scrollRowRef={rowRef}
          canScrollLeft={canScrollLeft}
          canScrollRight={canScrollRight}
          scrollGalleryBy={handleGalleryScroll}
          openLightbox={handleOpenCaseStudyLightbox}
          openMethodLightbox={handleOpenMethodLightbox}
          openPersonaId={openPersonaId}
          togglePersona={togglePersona}
          topTabsEl={topTabsEl}
          isActive={isCaseStudyView}
        />

        <ScreensTab
          study={study}
          sections={screensNav}
          setAnimatedSectionRef={setAnimatedSectionRef}
          visibleSections={visibleSections}
          topTabsEl={topTabsEl}
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
        toggler={methodLightboxController.toggler}
        sources={methodImages.map(({ src }) => src)}
        slide={methodLightboxController.slide}
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

export default CaseStudyPage;
