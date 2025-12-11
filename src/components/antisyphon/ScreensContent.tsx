import styled from 'styled-components';
import { OpenInNewWindowIcon } from '@radix-ui/react-icons';
import {
  BioBox,
  DemoStokeContentGrid,
  DemoStokeMethodCard,
  DemoStokeMethodList,
  DemoStokeTitle,
  DemoStokeTldrCopy,
  DemoStokeTldrImage,
  DemoStokeWhyImageFrame,
  FlexBox,
  FullBorderImage,
  PitchDeckLink
} from '../../../styles';
import SidebarSectionTabs, { SidebarSectionConfig } from '../SidebarSectionTabs';
import { AnimatedSection } from '../../../styles/projectShowcases';
import { THEME } from '../../../styles/theme';
import { FLOW_BLOCKS } from './data';

const FlowMethodList = styled(DemoStokeMethodList)`
  gap: 2.5em;
`;

const FlowSection = styled(DemoStokeMethodCard)`
  display: flex;
  flex-direction: column;
  gap: clamp(0.85em, 2vw, 1.3em);
`;

const FlowText = styled.div`
  align-self: flex-start;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  gap: 0.35em;
`;

const FlowImageButton = styled.button`
  display: block;
  width: 100%;
  padding: 0;
  border: none;
  background: transparent;
  cursor: pointer;
  text-align: left;
  border-radius: ${THEME.radii.md};

  &:focus-visible {
    outline: 2px solid ${THEME.colors.demostoke};
    outline-offset: 4px;
  }
`;

const FlowImage = styled(DemoStokeTldrImage)`
  width: 100%;
  height: auto;
  max-width: 100%;
  border-radius: ${THEME.radii.md};
  transition: border-color 0.18s ease, box-shadow 0.18s ease;

  ${FlowImageButton}:hover &,
  ${FlowImageButton}:focus-visible & {
    border-color: ${THEME.colors.hotRed};
    box-shadow: 0 24px 48px -32px rgb(0 0 0 / 70%), 0 0 0 1px ${THEME.colors.hotRed};
  }
`;

const FlowImagesRow = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: clamp(0.75em, 1.8vw, 1.2em);
`;

const FlowStorySection = styled.section`
  margin-top: 0;
  width: 100%;
`;

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
              <section id='screens-introduction' className='story-section'>
                <FlexBox>
                  <img className='ds-logo' src='/img/squares/at_logo_purple.webp' alt='Antisyphon Training Logo' />
                  <div>
                    <h2 className='tab-header page-header'>Product Screens and Flows</h2>
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
                  <FlowStorySection id={catalogBlock.id}>
                    <FlowSection>
                      <FlowText className="text-animate">
                        <DemoStokeTitle>{catalogBlock.title}</DemoStokeTitle>
                        <DemoStokeTldrCopy>{catalogBlock.copy}</DemoStokeTldrCopy>
                      </FlowText>
                      <DemoStokeWhyImageFrame className="image-animate" style={{ marginTop: '0.75em' }}>
                        <FullBorderImage
                          src='/img/antisyphon/course-catalog.webp'
                          alt='Antisyphon course catalog layout'
                          loading='lazy'
                        />
                      </DemoStokeWhyImageFrame>
                      <FlowImagesRow className="image-animate">
                        {catalogBlock.images.map((image, imageIndex) => (
                          <FlowImageButton
                            key={image.src}
                            type='button'
                            onClick={() => openFlowLightbox(getImageGlobalIndex(catalogBlock.id, imageIndex))}
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
              )}

              <FlowMethodList>
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
