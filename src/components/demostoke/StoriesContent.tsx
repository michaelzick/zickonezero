import { DemoStokeContentGrid } from '../../../styles';
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
};

const StoriesContent = ({
  setAnimatedSectionRef,
  visibleSections,
  topTabsEl,
  sections,
  isActive
}: StoriesContentProps) => {
  return (
    <div id="stories-content">
      <PageShell>
        <CaseStudyPageInner className='demostoke-inner'>
          <DemoStokeContentGrid>
            <div>
              <SectionsBlock as="div">
                <section id='story-independent-shaper'>
                  <UserStories.IndieShaper
                    wrapWithBioBox={false}
                    setAnimatedSectionRef={setAnimatedSectionRef}
                    visibleSections={visibleSections}
                  />
                </section>

                <section id='story-weekend-warrior'>
                  <UserStories.WeekendWarrior
                    wrapWithBioBox={false}
                    setAnimatedSectionRef={setAnimatedSectionRef}
                    visibleSections={visibleSections}
                  />
                </section>

                <section id='story-small-ski-shop'>
                  <UserStories.SmallSkiBikeShop
                    wrapWithBioBox={false}
                    setAnimatedSectionRef={setAnimatedSectionRef}
                    visibleSections={visibleSections}
                  />
                </section>
              </SectionsBlock>
            </div>
            <SidebarSectionTabs
              sections={sections}
              topTabsEl={topTabsEl}
              isActive={isActive}
              scrollOffsetAdjustment={8}
            />
          </DemoStokeContentGrid>
        </CaseStudyPageInner>
      </PageShell>
    </div>
  );
};

export default StoriesContent;
