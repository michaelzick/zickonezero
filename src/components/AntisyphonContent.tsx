import { useCallback, useEffect, useMemo, useState } from 'react';
import FsLightbox from 'fslightbox-react';

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
import { TopNavContent, FooterContent } from '.';
import DemoStokeTabs from './DemoStokeTabs';
import { SidebarSectionTabsMobile } from './SidebarSectionTabs';
import CaseStudyContent from './antisyphon/CaseStudyContent';
import ScreensContent from './antisyphon/ScreensContent';
import {
  CASE_STUDY_BOTTOM_SECTION_ID,
  CASE_STUDY_SECTIONS,
  HOW_IMAGES,
  METHOD_SECTIONS,
  TLDR_ITEMS
} from './antisyphon/caseStudyData';
import {
  FLOW_BLOCKS,
  FLOW_BOTTOM_SECTION_ID,
  FLOW_SECTIONS,
} from './antisyphon/flowData';
import useAnimatedSections from '../hooks/useAnimatedSections';
import useHorizontalGallery from '../hooks/useHorizontalGallery';
import useLightboxController from '../hooks/useLightboxController';
import { trackEvent } from '../lib/analytics';

type SectionKey = 'case-study' | 'flows';

const AntisyphonContent = () => {
  const { isMobileMenuShown } = useAppSelector(getMobileMenuState);
  const dispatch = useAppDispatch();
  const [activeTab, setActiveTab] = useState<SectionKey>('case-study');
  const [topTabsEl, setTopTabsEl] = useState<HTMLDivElement | null>(null);
  const [openPersonaId, setOpenPersonaId] = useState<string | null>(null);
  const { visibleSections, setAnimatedSectionRef } = useAnimatedSections(activeTab);
  const { lightboxController, openLightbox } = useLightboxController();
  const { lightboxController: methodLightboxController, openLightbox: openMethodLightbox } = useLightboxController();
  const { lightboxController: flowLightboxController, openLightbox: openFlowLightbox } = useLightboxController();
  const { rowRef, canScrollLeft, canScrollRight, scrollGalleryBy } = useHorizontalGallery(activeTab);
  const methodImages = useMemo(() => METHOD_SECTIONS.flatMap(({ images }) => images), []);
  const flowImages = useMemo(() => FLOW_BLOCKS.flatMap(({ images }) => images), []);
  const caseStudyImages = useMemo(() => [...TLDR_ITEMS.map(({ image }) => image), ...HOW_IMAGES], []);

  const handleTopTabsRef = useCallback((node: HTMLDivElement | null) => {
    setTopTabsEl(node);
  }, []);

  const handleTabClick = (tabKey: string) => {
    setActiveTab(tabKey as SectionKey);
  };

  const isCaseStudyView = activeTab === 'case-study';
  const currentSections = isCaseStudyView ? CASE_STUDY_SECTIONS : FLOW_SECTIONS;
  const lockToBottomSectionId = isCaseStudyView ? CASE_STUDY_BOTTOM_SECTION_ID : FLOW_BOTTOM_SECTION_ID;

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
        location: 'antisyphon_personas',
        modal: 'persona',
        persona_id: id,
        page_path: window.location.pathname,
      });
      return isClosing ? null : id;
    });
  }, []);

  const handleGalleryScroll = useCallback((direction: number) => {
    trackEvent('gallery_scroll', {
      location: 'antisyphon_case_study_gallery',
      direction: direction < 0 ? 'left' : 'right',
      page_path: window.location.pathname,
    });
    scrollGalleryBy(direction);
  }, [scrollGalleryBy]);

  const handleOpenCaseStudyLightbox = useCallback((index: number) => {
    const image = caseStudyImages[index];
    trackEvent('lightbox_open', {
      location: 'antisyphon_case_study',
      image_index: index,
      image_alt: image?.alt,
      image_url: image?.src,
      page_path: window.location.pathname,
    });
    openLightbox(index);
  }, [caseStudyImages, openLightbox]);

  const handleOpenMethodLightbox = useCallback((index: number) => {
    const image = methodImages[index];
    trackEvent('lightbox_open', {
      location: 'antisyphon_methods',
      image_index: index,
      image_alt: image?.alt,
      image_url: image?.src,
      page_path: window.location.pathname,
    });
    openMethodLightbox(index);
  }, [methodImages, openMethodLightbox]);

  const handleOpenFlowLightbox = useCallback((index: number) => {
    const image = flowImages[index];
    trackEvent('lightbox_open', {
      location: 'antisyphon_product_screens',
      image_index: index,
      image_alt: image?.alt,
      image_url: image?.src,
      page_path: window.location.pathname,
    });
    openFlowLightbox(index);
  }, [flowImages, openFlowLightbox]);

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
            { key: 'flows', label: 'Product Screens' }
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

        {isCaseStudyView && (
          <CaseStudyContent
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
        )}

        {!isCaseStudyView && (
          <ScreensContent
            setAnimatedSectionRef={setAnimatedSectionRef}
            visibleSections={visibleSections}
            topTabsEl={topTabsEl}
            sections={FLOW_SECTIONS}
            isActive={!isCaseStudyView}
            openFlowLightbox={handleOpenFlowLightbox}
          />
        )}
      </Wrapper>
      <FsLightbox
        toggler={lightboxController.toggler}
        sources={caseStudyImages.map(({ src }) => src)}
        slide={lightboxController.slide}
      />
      <FsLightbox
        toggler={methodLightboxController.toggler}
        sources={methodImages.map(({ src }) => src)}
        slide={methodLightboxController.slide}
      />
      <FsLightbox
        toggler={flowLightboxController.toggler}
        sources={flowImages.map(({ src }) => src)}
        slide={flowLightboxController.slide}
      />
      <FooterContent />
    </>
  );
};

export default AntisyphonContent;
