import { type RefObject } from 'react';

import SidebarSectionTabs from '../SidebarSectionTabs';
import {
  CaseStudyIntroOffset,
  CaseStudyPageInner,
  PageShell,
  SectionsBlock
} from '../../../styles/projectShowcases';
import {
  CASE_STUDY_BOTTOM_SECTION_ID,
  CASE_STUDY_SECTIONS,
} from './caseStudyData';
import { SetAnimatedSectionRef, VisibleSections } from '../showcaseTypes';
import {
  HowSection,
  IntroSection,
  LinksSection,
  MethodsSection,
  WhatSection,
  WhoSection
} from './sections';

type CaseStudyContentProps = {
  setAnimatedSectionRef: SetAnimatedSectionRef;
  visibleSections: VisibleSections;
  scrollRowRef: RefObject<HTMLDivElement | null>;
  canScrollLeft: boolean;
  canScrollRight: boolean;
  scrollGalleryBy: (direction: number) => void;
  openLightbox: (index: number) => void;
  openMethodLightbox: (index: number) => void;
  openPersonaId: string | null;
  togglePersona: (id: string) => void;
  topTabsEl: HTMLDivElement | null;
  isActive: boolean;
};

const CaseStudyContent = ({
  setAnimatedSectionRef,
  visibleSections,
  scrollRowRef,
  canScrollLeft,
  canScrollRight,
  scrollGalleryBy,
  openLightbox,
  openMethodLightbox,
  openPersonaId,
  togglePersona,
  topTabsEl,
  isActive
}: CaseStudyContentProps) => (
  <div id='executive-content'>
    <PageShell>
      <CaseStudyPageInner className='demostoke-inner'>
        <CaseStudyIntroOffset>
          <IntroSection
            setAnimatedSectionRef={setAnimatedSectionRef}
            visibleSections={visibleSections}
            openLightbox={openLightbox}
          />
        </CaseStudyIntroOffset>
        <SidebarSectionTabs
          sections={CASE_STUDY_SECTIONS}
          topTabsEl={topTabsEl}
          isActive={isActive}
          lockToBottomSectionId={CASE_STUDY_BOTTOM_SECTION_ID}
          scrollOffsetAdjustment={8}
          desktopRevealAnchorId='antisyphon-case-study-nav-anchor'
        />
        <SectionsBlock as='div'>
          <WhatSection
            setAnimatedSectionRef={setAnimatedSectionRef}
            visibleSections={visibleSections}
            openLightbox={openLightbox}
          />
          <HowSection
            setAnimatedSectionRef={setAnimatedSectionRef}
            visibleSections={visibleSections}
            scrollRowRef={scrollRowRef}
            canScrollLeft={canScrollLeft}
            canScrollRight={canScrollRight}
            scrollGalleryBy={scrollGalleryBy}
            openLightbox={openLightbox}
          />
          <WhoSection
            setAnimatedSectionRef={setAnimatedSectionRef}
            visibleSections={visibleSections}
            openPersonaId={openPersonaId}
            togglePersona={togglePersona}
          />
          <MethodsSection
            setAnimatedSectionRef={setAnimatedSectionRef}
            visibleSections={visibleSections}
            openMethodLightbox={openMethodLightbox}
          />
          <LinksSection />
        </SectionsBlock>
      </CaseStudyPageInner>
    </PageShell>
  </div>
);

export default CaseStudyContent;
