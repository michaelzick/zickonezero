import { OpenInNewWindowIcon } from '@radix-ui/react-icons';
import {
  BioBox,
  DemoStokeContentGrid,
  DemoStokeTitle,
  DemoStokeTldrCopy,
  FlexBox,
  PitchDeckLink
} from '../../../styles';
import SidebarSectionTabs, { SidebarSectionConfig } from '../SidebarSectionTabs';
import { AnimatedSection } from '../../../styles/projectShowcases';
import { FLOW_BLOCKS } from './data';
import {
  FlowImage,
  FlowImageButton,
  FlowImagesRow,
  FlowMethodList,
  FlowSection,
  FlowStorySection,
  FlowText
} from '../../../styles/antisyphon';

type FlowBlock = (typeof FLOW_BLOCKS)[number];

type ScreensContentProps = {
  setAnimatedSectionRef: (id: string) => (el: HTMLDivElement | null) => void;
  visibleSections: Record<string, boolean>;
  topTabsEl: HTMLDivElement | null;
  sections: SidebarSectionConfig[];
  isActive: boolean;
  openFlowLightbox: (index: number) => void;
};

const ScreensContent = ({
  setAnimatedSectionRef,
  visibleSections,
  topTabsEl,
  sections,
  isActive,
  openFlowLightbox
}: ScreensContentProps) => {
  const catalogBlock = FLOW_BLOCKS.find(({ id }) => id === 'screens-catalog');
  const remainingFlowBlocks = FLOW_BLOCKS.filter(({ id }) => id !== 'screens-catalog');
  const flowImageOffsets = FLOW_BLOCKS.reduce<number[]>((offsets, _section, idx) => {
    const priorCount = idx > 0 ? FLOW_BLOCKS[idx - 1]?.images.length ?? 0 : 0;
    const previous = offsets[idx - 1] ?? 0;
    offsets[idx] = idx === 0 ? 0 : previous + priorCount;
    return offsets;
  }, []);
  const catalogImageRows = catalogBlock?.images.reduce<{ image: FlowBlock['images'][number]; index: number; }[][]>((rows, image, index) => {
    const rowIndex = Math.floor(index / 2);
    if (!rows[rowIndex]) rows[rowIndex] = [];
    rows[rowIndex]!.push({ image, index });
    return rows;
  }, []) ?? [];

  const getImageGlobalIndex = (blockId: string, imageIndex: number) => {
    const originalIndex = FLOW_BLOCKS.findIndex(({ id }) => id === blockId);
    return (flowImageOffsets[originalIndex] ?? 0) + imageIndex;
  };

  return (
    <div id="screens-content">
      <BioBox direction='right' noBottomPadding top>
        <div className='biobox-inner demostoke-inner'>
          <DemoStokeContentGrid>
            <div>
              <section id='screens-introduction'>
                <FlexBox>
                  <img className='ds-logo' src='/img/squares/at_logo_purple.webp' alt='Antisyphon Training Logo' />
                  <div>
                    <h2 className='tab-header page-header'>Antisyphon Training Product Screens</h2>
                    <PitchDeckLink className='pitch-link-desktop' href="https://www.antisyphontraining.com/" target='_blank' rel='noopener noreferrer'>
                      AntisyphonTraining.com <OpenInNewWindowIcon aria-hidden="true" />
                    </PitchDeckLink>
                  </div>
                </FlexBox>

                <PitchDeckLink className='pitch-link-mobile' href="https://www.antisyphontraining.com/" target='_blank' rel='noopener noreferrer'>
                  AntisyphonTraining.com <OpenInNewWindowIcon aria-hidden="true" />
                </PitchDeckLink>

                <section id='hero-spacer' aria-hidden='true' />
              </section>

              {catalogBlock && (
                <AnimatedSection
                  ref={setAnimatedSectionRef(catalogBlock.id)}
                  data-animate-id={catalogBlock.id}
                  className={visibleSections[catalogBlock.id] ? 'visible' : undefined}
                >
                  <FlowStorySection id={catalogBlock.id} className='story-section'>
                    <FlowSection>
                      <FlowText className="text-animate">
                        <DemoStokeTitle>{catalogBlock.title}</DemoStokeTitle>
                        <DemoStokeTldrCopy>{catalogBlock.copy}</DemoStokeTldrCopy>
                      </FlowText>
                      {catalogImageRows.map((row, rowIndex) => (
                        <FlowImagesRow
                          key={`${catalogBlock.id}-row-${rowIndex}`}
                          className="image-animate"
                          style={rowIndex === 0 ? { marginTop: '0.75em' } : undefined}
                        >
                          {row.map(({ image, index }) => (
                            <FlowImageButton
                              key={image.src}
                              type='button'
                              onClick={() => openFlowLightbox(getImageGlobalIndex(catalogBlock.id, index))}
                              aria-label={`Open image: ${image.alt}`}
                            >
                              <FlowImage
                                src={image.src}
                                alt={image.alt}
                                loading='lazy'
                              />
                            </FlowImageButton>
                          ))}
                        </FlowImagesRow>
                      ))}
                    </FlowSection>
                  </FlowStorySection>
                </AnimatedSection>
              )}

              <FlowMethodList className='story-section'>
                {remainingFlowBlocks.map(({ id, title, copy, images }) => (
                  <AnimatedSection
                    key={id}
                    ref={setAnimatedSectionRef(id)}
                    data-animate-id={id}
                    className={visibleSections[id] ? 'visible' : undefined}
                  >
                    <FlowStorySection id={id}>
                      <FlowSection>
                        <FlowText className="text-animate">
                          <DemoStokeTitle>{title}</DemoStokeTitle>
                          <DemoStokeTldrCopy>{copy}</DemoStokeTldrCopy>
                        </FlowText>
                        <FlowImagesRow className="image-animate">
                          {images.map((image, imageIndex) => (
                            <FlowImageButton
                              key={image.src}
                              type='button'
                              onClick={() => openFlowLightbox(getImageGlobalIndex(id, imageIndex))}
                              aria-label={`Open image: ${image.alt}`}
                            >
                              <FlowImage
                                src={image.src}
                                alt={image.alt}
                                loading='lazy'
                              />
                            </FlowImageButton>
                          ))}
                        </FlowImagesRow>
                      </FlowSection>
                    </FlowStorySection>
                  </AnimatedSection>
                ))}
              </FlowMethodList>

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

export default ScreensContent;
