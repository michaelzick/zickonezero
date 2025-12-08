import {
  BioBox,
  DemoStokeContentGrid
} from '../../../styles';
import SidebarSectionTabs, { SidebarSectionConfig } from '../SidebarSectionTabs';
import * as UserStories from '../userstories';

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
      <BioBox direction='right' noBottomPadding top>
        <div className='biobox-inner demostoke-inner'>
          <DemoStokeContentGrid>
            <div>
              <section id='story-independent-shaper'>
                <UserStories.IndieShaper
                  wrapWithBioBox={false}
                  setAnimatedSectionRef={setAnimatedSectionRef}
                  visibleSections={visibleSections}
                />
              </section>

              <br />

              <section id='story-weekend-warrior'>
                <UserStories.WeekendWarrior
                  wrapWithBioBox={false}
                  setAnimatedSectionRef={setAnimatedSectionRef}
                  visibleSections={visibleSections}
                />
              </section>

              <br />

              <section id='story-small-ski-shop'>
                <UserStories.SmallSkiBikeShop
                  wrapWithBioBox={false}
                  setAnimatedSectionRef={setAnimatedSectionRef}
                  visibleSections={visibleSections}
                />
              </section>
              <br />
              <br />
            </div>
            <SidebarSectionTabs
              sections={sections}
              topTabsEl={topTabsEl}
              isActive={isActive}
              scrollOffsetAdjustment={8}
            />
          </DemoStokeContentGrid>
        </div>
      </BioBox>
    </div>
  );
};

export default StoriesContent;
