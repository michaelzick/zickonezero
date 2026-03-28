import SidebarSectionTabs, { SidebarSectionConfig } from '../SidebarSectionTabs';
import * as UserStories from '../userstories';
import { OpenInNewWindowIcon } from '@radix-ui/react-icons';
import { PitchDeckLink } from '../../../styles';
import {
  AnimatedSection,
  CompactCaseStudyPageInner,
  CompactIntroHeaderRow,
  CompactSectionNavRevealAnchor,
  PageShell,
  SectionsBlock
} from '../../../styles/projectShowcases';

type StoriesContentProps = {
  setAnimatedSectionRef: (id: string) => (el: HTMLDivElement | null) => void;
  visibleSections: Record<string, boolean>;
  topTabsEl: HTMLDivElement | null;
  sections: SidebarSectionConfig[];
  isActive: boolean;
  openStoryLightbox: (index: number) => void;
};

const StoriesContent = ({
  setAnimatedSectionRef,
  visibleSections,
  topTabsEl,
  sections,
  isActive,
  openStoryLightbox
}: StoriesContentProps) => {
  return (
    <div id="stories-content">
      <PageShell>
        <CompactCaseStudyPageInner className='demostoke-inner'>
          <AnimatedSection
            ref={setAnimatedSectionRef('story-introduction')}
            data-animate-id='story-introduction'
            className={visibleSections['story-introduction'] ? 'visible' : undefined}
          >
            <section id='story-introduction'>
              <CompactIntroHeaderRow>
                <img className='ds-logo' src='/img/squares/demostoke-logo-square.webp' alt='DemoStoke Logo' />
                <div>
                  <h2 className='tab-header page-header'>DemoStoke User Stories</h2>
                  <PitchDeckLink href="https://www.demostoke.com/" target='_blank' rel='noopener noreferrer'>
                    DemoStoke.com <OpenInNewWindowIcon aria-hidden="true" />
                  </PitchDeckLink>
                </div>
              </CompactIntroHeaderRow>
            </section>

            <CompactSectionNavRevealAnchor id='demostoke-stories-nav-anchor' aria-hidden='true' />
          </AnimatedSection>

          <SidebarSectionTabs
            sections={sections}
            topTabsEl={topTabsEl}
            isActive={isActive}
            scrollOffsetAdjustment={8}
            desktopRevealAnchorId='demostoke-stories-nav-anchor'
          />

          <SectionsBlock as="div">
            <div>
              <UserStories.IndieShaper
                wrapWithBioBox={false}
                setAnimatedSectionRef={setAnimatedSectionRef}
                visibleSections={visibleSections}
                openHeroLightbox={() => openStoryLightbox(0)}
              />
            </div>

            <div>
              <UserStories.WeekendWarrior
                wrapWithBioBox={false}
                setAnimatedSectionRef={setAnimatedSectionRef}
                visibleSections={visibleSections}
                openHeroLightbox={() => openStoryLightbox(1)}
              />
            </div>

            <div>
              <UserStories.SmallSkiBikeShop
                wrapWithBioBox={false}
                setAnimatedSectionRef={setAnimatedSectionRef}
                visibleSections={visibleSections}
                openHeroLightbox={() => openStoryLightbox(2)}
              />
            </div>
          </SectionsBlock>
        </CompactCaseStudyPageInner>
      </PageShell>
    </div>
  );
};

export default StoriesContent;
