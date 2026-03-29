import { useState, useEffect, useCallback } from 'react';
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
import { CASE_STUDY_BOTTOM_SECTION_ID, CASE_STUDY_SECTIONS, HOW_IMAGES, STORY_SECTIONS } from './demostoke/data';
import CaseStudyContent from './demostoke/CaseStudyContent';
import StoriesContent from './demostoke/StoriesContent';
import useAnimatedSections from '../hooks/useAnimatedSections';
import useHorizontalGallery from '../hooks/useHorizontalGallery';
import useLightboxController from '../hooks/useLightboxController';

type SectionKey = 'case-study' | 'stories';

const DemoStokeContent = () => {
  const { isMobileMenuShown } = useAppSelector(getMobileMenuState);
  const dispatch = useAppDispatch();
  const [activeTab, setActiveTab] = useState<SectionKey>('case-study');
  const [topTabsEl, setTopTabsEl] = useState<HTMLDivElement | null>(null);
  const [openPersonaId, setOpenPersonaId] = useState<string | null>(null);
  const { visibleSections, setAnimatedSectionRef } = useAnimatedSections(activeTab);
  const { lightboxController, openLightbox } = useLightboxController();
  const { rowRef, canScrollLeft, canScrollRight, scrollGalleryBy } = useHorizontalGallery(activeTab);
  const caseStudyImages = HOW_IMAGES;
  const handleTopTabsRef = useCallback((node: HTMLDivElement | null) => {
    setTopTabsEl(node);
  }, []);

  const handleTabClick = (tabKey: string) => {
    setActiveTab(tabKey as SectionKey);
  };
  const isCaseStudyView = activeTab === 'case-study';
  const currentSections = isCaseStudyView ? CASE_STUDY_SECTIONS : STORY_SECTIONS;
  const lockToBottomSectionId = isCaseStudyView ? CASE_STUDY_BOTTOM_SECTION_ID : undefined;

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
    setOpenPersonaId(current => current === id ? null : id);
  }, []);

  return (
    <>
      <TopNavContent />
      <Wrapper isMobileMenuShown={isMobileMenuShown}
        onClick={() => dispatch(showMobileMenu(false))}>
        <DemoStokeTabs
          ref={handleTopTabsRef}
          tabs={[
            { key: 'case-study', label: 'UX Case Study' },
            { key: 'stories', label: 'User Stories' }
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

        {activeTab === 'case-study' && (
          <CaseStudyContent
            setAnimatedSectionRef={setAnimatedSectionRef}
            visibleSections={visibleSections}
            scrollRowRef={rowRef}
            canScrollLeft={canScrollLeft}
            canScrollRight={canScrollRight}
            scrollGalleryBy={scrollGalleryBy}
            openLightbox={openLightbox}
            openPersonaId={openPersonaId}
            togglePersona={togglePersona}
            topTabsEl={topTabsEl}
            isActive={activeTab === 'case-study'}
          />
        )}

        {activeTab === 'stories' && (
          <StoriesContent
            setAnimatedSectionRef={setAnimatedSectionRef}
            visibleSections={visibleSections}
            topTabsEl={topTabsEl}
            sections={STORY_SECTIONS}
            isActive={activeTab === 'stories'}
          />
        )}
      </Wrapper>
      <FsLightbox
        toggler={lightboxController.toggler}
        sources={caseStudyImages.map(({ src }) => src)}
        slide={lightboxController.slide}
      />
      <FooterContent />
    </>
  );
};

export default DemoStokeContent;
