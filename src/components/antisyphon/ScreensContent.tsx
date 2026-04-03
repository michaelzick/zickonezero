import SidebarSectionTabs, { type SidebarSectionConfig } from '../SidebarSectionTabs';
import {
  CompactCaseStudyPageInner,
  PageShell,
  SectionsBlock,
} from '../../../styles/projectShowcases';
import { FlowMethodList } from '../../../styles/antisyphon';
import { FLOW_BLOCKS } from './flowData';
import { SetAnimatedSectionRef, VisibleSections } from '../showcaseTypes';
import {
  CatalogSection,
  FlowBlockSection,
  IntroSection
} from './screens';

type ScreensContentProps = {
  setAnimatedSectionRef: SetAnimatedSectionRef;
  visibleSections: VisibleSections;
  topTabsEl: HTMLDivElement | null;
  sections: SidebarSectionConfig[];
  isActive: boolean;
  openFlowLightbox: (index: number) => void;
};

const flowImageOffsets = FLOW_BLOCKS.reduce<number[]>((offsets, _section, index) => {
  const previous = offsets[index - 1] ?? 0;
  const priorCount = index > 0 ? FLOW_BLOCKS[index - 1]?.images.length ?? 0 : 0;
  offsets[index] = index === 0 ? 0 : previous + priorCount;
  return offsets;
}, []);

const getImageGlobalIndex = (blockId: string, imageIndex: number) => {
  const originalIndex = FLOW_BLOCKS.findIndex(({ id }) => id === blockId);
  return (flowImageOffsets[originalIndex] ?? 0) + imageIndex;
};

const catalogBlock = FLOW_BLOCKS.find(({ id }) => id === 'screens-catalog');
const remainingFlowBlocks = FLOW_BLOCKS.filter(({ id }) => id !== 'screens-catalog');

const ScreensContent = ({
  setAnimatedSectionRef,
  visibleSections,
  topTabsEl,
  sections,
  isActive,
  openFlowLightbox
}: ScreensContentProps) => (
  <div id='screens-content'>
    <PageShell>
      <CompactCaseStudyPageInner className='demostoke-inner'>
        <IntroSection openFlowLightbox={openFlowLightbox} />
        <SidebarSectionTabs
          sections={sections}
          topTabsEl={topTabsEl}
          isActive={isActive}
          scrollOffsetAdjustment={8}
          desktopRevealAnchorId='antisyphon-screens-nav-anchor'
        />
        <SectionsBlock as='div'>
          {catalogBlock && (
            <CatalogSection
              block={catalogBlock}
              setAnimatedSectionRef={setAnimatedSectionRef}
              visibleSections={visibleSections}
              getImageGlobalIndex={getImageGlobalIndex}
              openFlowLightbox={openFlowLightbox}
            />
          )}
          <FlowMethodList>
            {remainingFlowBlocks.map((block) => (
              <FlowBlockSection
                key={block.id}
                block={block}
                setAnimatedSectionRef={setAnimatedSectionRef}
                visibleSections={visibleSections}
                getImageGlobalIndex={getImageGlobalIndex}
                openFlowLightbox={openFlowLightbox}
              />
            ))}
          </FlowMethodList>
        </SectionsBlock>
      </CompactCaseStudyPageInner>
    </PageShell>
  </div>
);

export default ScreensContent;
