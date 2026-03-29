import { useCallback, useEffect, useState } from 'react';
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
  const methodImages = METHOD_SECTIONS.flatMap(({ images }) => images);
  const flowImages = FLOW_BLOCKS.flatMap(({ images }) => images);
  const caseStudyImages = [...TLDR_ITEMS.map(({ image }) => image), ...HOW_IMAGES];

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
    setOpenPersonaId(current => current === id ? null : id);
  }, []);

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
            scrollGalleryBy={scrollGalleryBy}
            openLightbox={openLightbox}
            openMethodLightbox={openMethodLightbox}
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
            openFlowLightbox={openFlowLightbox}
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
