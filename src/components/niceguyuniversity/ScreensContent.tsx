import SidebarSectionTabs, { type SidebarSectionConfig } from '../SidebarSectionTabs';
import {
  CompactCaseStudyPageInner,
  PageShell,
  SectionsBlock,
} from '../../../styles/projectShowcases';
import { FlowMethodList } from '../../../styles/antisyphon';
import { SCREEN_BLOCKS } from './screenData';
import { SetAnimatedSectionRef, VisibleSections } from '../showcaseTypes';
import {
  IntroSection,
  ScreenBlockSection
} from './screens';

type ScreensContentProps = {
  setAnimatedSectionRef: SetAnimatedSectionRef;
  visibleSections: VisibleSections;
  topTabsEl: HTMLDivElement | null;
  sections: SidebarSectionConfig[];
  isActive: boolean;
  openScreenLightbox: (index: number) => void;
};

// Block images sit after the intro hero image in the lightbox sources, so
// every offset starts at 1.
const screenImageOffsets = SCREEN_BLOCKS.reduce<number[]>((offsets, _section, index) => {
  const previous = offsets[index - 1] ?? 1;
  const priorCount = index > 0 ? SCREEN_BLOCKS[index - 1]?.images.length ?? 0 : 0;
  offsets[index] = index === 0 ? 1 : previous + priorCount;
  return offsets;
}, []);

const getImageGlobalIndex = (blockId: string, imageIndex: number) => {
  const originalIndex = SCREEN_BLOCKS.findIndex(({ id }) => id === blockId);
  return (screenImageOffsets[originalIndex] ?? 0) + imageIndex;
};

const ScreensContent = ({
  setAnimatedSectionRef,
  visibleSections,
  topTabsEl,
  sections,
  isActive,
  openScreenLightbox
}: ScreensContentProps) => (
  <div id='screens-content'>
    <PageShell>
      <CompactCaseStudyPageInner className='demostoke-inner'>
        <IntroSection openScreenLightbox={openScreenLightbox} />
        <SidebarSectionTabs
          sections={sections}
          topTabsEl={topTabsEl}
          isActive={isActive}
          scrollOffsetAdjustment={8}
          desktopRevealAnchorId='nice-guy-university-screens-nav-anchor'
        />
        <SectionsBlock as='div'>
          <FlowMethodList>
            {SCREEN_BLOCKS.map((block) => (
              <ScreenBlockSection
                key={block.id}
                block={block}
                setAnimatedSectionRef={setAnimatedSectionRef}
                visibleSections={visibleSections}
                getImageGlobalIndex={getImageGlobalIndex}
                openScreenLightbox={openScreenLightbox}
              />
            ))}
          </FlowMethodList>
        </SectionsBlock>
      </CompactCaseStudyPageInner>
    </PageShell>
  </div>
);

export default ScreensContent;
