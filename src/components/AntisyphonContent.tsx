import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
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
import CaseStudyContent from './antisyphon/CaseStudyContent';
import ScreensContent from './antisyphon/ScreensContent';
import { CASE_STUDY_BOTTOM_SECTION_ID, CASE_STUDY_SECTIONS, FLOW_BOTTOM_SECTION_ID, FLOW_SECTIONS, HOW_IMAGES, METHOD_SECTIONS } from './antisyphon/data';

type SectionKey = 'case-study' | 'flows';

const AntisyphonContent = () => {
  const { isMobileMenuShown } = useAppSelector(getMobileMenuState);
  const dispatch = useAppDispatch();
  const [activeTab, setActiveTab] = useState<SectionKey>('case-study');
  const [topTabsEl, setTopTabsEl] = useState<HTMLDivElement | null>(null);
  const [lightboxController, setLightboxController] = useState({ toggler: false, slide: 1 });
  const [methodLightboxController, setMethodLightboxController] = useState({ toggler: false, slide: 1 });
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [openPersonaId, setOpenPersonaId] = useState<string | null>(null);
  const { visibleSections, setAnimatedSectionRef } = useAnimatedSections(activeTab);
  const scrollRowRef = useRef<HTMLDivElement | null>(null);
  const methodImages = useMemo(() => METHOD_SECTIONS.flatMap(({ images }) => images), []);

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

  const openLightbox = (index: number) => {
    setLightboxController({
      toggler: !lightboxController.toggler,
      slide: index + 1
    });
  };

  const openMethodLightbox = useCallback((index: number) => {
    setMethodLightboxController((prev) => ({
      toggler: !prev.toggler,
      slide: index + 1
    }));
  }, []);

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
            scrollRowRef={scrollRowRef}
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
          />
        )}
      </Wrapper>
      <FsLightbox
        toggler={lightboxController.toggler}
        sources={HOW_IMAGES.map(({ src }) => src)}
        slide={lightboxController.slide}
      />
      <FsLightbox
        toggler={methodLightboxController.toggler}
        sources={methodImages.map(({ src }) => src)}
        slide={methodLightboxController.slide}
      />
      <FooterContent />
    </>
  );
};

export default AntisyphonContent;
