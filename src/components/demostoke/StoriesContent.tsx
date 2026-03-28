import SidebarSectionTabs, { SidebarSectionConfig } from '../SidebarSectionTabs';
import * as UserStories from '../userstories';
import {
  CaseStudyPageInner,
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
        <CaseStudyPageInner className='demostoke-inner'>
          <SidebarSectionTabs
            sections={sections}
            topTabsEl={topTabsEl}
            isActive={isActive}
            scrollOffsetAdjustment={8}
            desktopRevealAnchorId='demostoke-stories-nav-anchor'
          />

          <SectionsBlock as="div">
            <section id='story-independent-shaper'>
              <UserStories.IndieShaper
                wrapWithBioBox={false}
                setAnimatedSectionRef={setAnimatedSectionRef}
                visibleSections={visibleSections}
                openHeroLightbox={() => openStoryLightbox(0)}
                renderDesktopRevealAnchor
              />
            </section>

            <section id='story-weekend-warrior'>
              <UserStories.WeekendWarrior
                wrapWithBioBox={false}
                setAnimatedSectionRef={setAnimatedSectionRef}
                visibleSections={visibleSections}
                openHeroLightbox={() => openStoryLightbox(1)}
              />
            </section>

            <section id='story-small-ski-shop'>
              <UserStories.SmallSkiBikeShop
                wrapWithBioBox={false}
                setAnimatedSectionRef={setAnimatedSectionRef}
                visibleSections={visibleSections}
                openHeroLightbox={() => openStoryLightbox(2)}
              />
            </section>
          </SectionsBlock>
        </CaseStudyPageInner>
      </PageShell>
    </div>
  );
};

export default StoriesContent;
