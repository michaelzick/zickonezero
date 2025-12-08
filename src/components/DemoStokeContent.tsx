import { useState, useEffect, useCallback, useRef } from 'react';
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
import useAnimatedSections from './demostoke/useAnimatedSections';
import { CASE_STUDY_BOTTOM_SECTION_ID, CASE_STUDY_SECTIONS, HOW_IMAGES, STORY_SECTIONS } from './demostoke/data';
import CaseStudyContent from './demostoke/CaseStudyContent';
import StoriesContent from './demostoke/StoriesContent';

type SectionKey = 'case-study' | 'stories';

const DemoStokeContent = () => {
  const { isMobileMenuShown } = useAppSelector(getMobileMenuState);
  const dispatch = useAppDispatch();
  const [activeTab, setActiveTab] = useState<SectionKey>('case-study');
  const [topTabsEl, setTopTabsEl] = useState<HTMLDivElement | null>(null);
  const [lightboxController, setLightboxController] = useState({ toggler: false, slide: 1 });
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [openPersonaId, setOpenPersonaId] = useState<string | null>(null);
  const { visibleSections, setAnimatedSectionRef } = useAnimatedSections(activeTab);
  const scrollRowRef = useRef<HTMLDivElement | null>(null);
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

  const openLightbox = (index: number) => {
    setLightboxController({
      toggler: !lightboxController.toggler,
      slide: index + 1
    });
  };

  const updateScrollButtons = useCallback(() => {
    const row = scrollRowRef.current;
    if (!row) return;
    if (row.scrollLeft <= 1) {
      row.scrollLeft = 0;
    }
    const firstItem = row.firstElementChild as HTMLElement | null;
    const startThreshold = (firstItem?.offsetLeft ?? 0) + 1;
    const maxScroll = Math.max(row.scrollWidth - row.clientWidth, 0);
    const isAtStart = row.scrollLeft <= startThreshold;
    const isAtEnd = row.scrollLeft >= maxScroll - 1;
    setCanScrollLeft(!isAtStart);
    setCanScrollRight(!isAtEnd);
  }, []);

  // Ensure gallery starts at the beginning on mount/page refresh.
  useEffect(() => {
    const row = scrollRowRef.current;
    if (!row) return;
    row.scrollLeft = 0;
    updateScrollButtons();
  }, [updateScrollButtons]);

  const scrollGalleryBy = useCallback((direction: number) => {
    const row = scrollRowRef.current;
    if (!row) return;
    const firstItem = row.firstElementChild as HTMLElement | null;
    const itemWidth = firstItem?.getBoundingClientRect().width ?? 240;
    row.scrollBy({ left: direction * itemWidth, behavior: 'smooth' });
  }, []);

  const togglePersona = useCallback((id: string) => {
    setOpenPersonaId(current => current === id ? null : id);
  }, []);

  useEffect(() => {
    const row = scrollRowRef.current;
    if (!row) return;
    updateScrollButtons();
    const handleScroll = () => updateScrollButtons();
    row.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleScroll);
    return () => {
      row.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [updateScrollButtons]);

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
            scrollRowRef={scrollRowRef}
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
        sources={HOW_IMAGES.map(({ src }) => src)}
        slide={lightboxController.slide}
      />
      <FooterContent />
    </>
  );
};

export default DemoStokeContent;
