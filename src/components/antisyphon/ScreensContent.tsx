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
  DemoStokeTldrSection,
  DemoStokeTldrTitle,
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
  gap: clamp(1.6em, 3vw, 2.6em);
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
  const flowImageOffsets = FLOW_BLOCKS.reduce<number[]>((offsets, _section, idx) => {
    const priorCount = idx > 0 ? FLOW_BLOCKS[idx - 1]?.images.length ?? 0 : 0;
    const previous = offsets[idx - 1] ?? 0;
    offsets[idx] = idx === 0 ? 0 : previous + priorCount;
    return offsets;
  }, []);

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
                    <DemoStokeTitle $noMobileTopPad>Product Screens and Flows</DemoStokeTitle>
                    <PitchDeckLink className='pitch-link-desktop' href="https://www.antisyphontraining.com/" target='_blank' rel='noopener noreferrer'>
                      AntisyphonTraining.com <OpenInNewWindowIcon aria-hidden="true" />
                    </PitchDeckLink>
                  </div>
                </FlexBox>

                <PitchDeckLink className='pitch-link-mobile' href="https://www.antisyphontraining.com/" target='_blank' rel='noopener noreferrer'>
                  AntisyphonTraining.com <OpenInNewWindowIcon aria-hidden="true" />
                </PitchDeckLink>

                <DemoStokeWhyImageFrame className="image-animate" style={{ marginTop: '0.75em' }}>
                  <FullBorderImage
                    src='/img/antisyphon/course-catalog-full.webp'
                    alt='Antisyphon course catalog layout'
                    loading='lazy'
                  />
                </DemoStokeWhyImageFrame>

                <br />

                <DemoStokeTldrSection className="text-animate">
                  <DemoStokeTldrTitle>TL;DR</DemoStokeTldrTitle>
                  <DemoStokeTldrCopy>
                    A sampling of the core Antisyphon experiences—from catalog browsing to admin operations—built on top of
                    WordPress, WooCommerce, and LMS integrations.
                  </DemoStokeTldrCopy>
                </DemoStokeTldrSection>
              </section>

              <FlowMethodList>
                {FLOW_BLOCKS.map(({ id, title, copy, images }, index) => (
                  <AnimatedSection
                    key={id}
                    ref={setAnimatedSectionRef(id)}
                    data-animate-id={id}
                    className={visibleSections[id] ? 'visible' : undefined}
                  >
                    <section id={id} className='story-section'>
                      <FlowSection>
                        <FlowText className="text-animate">
                          <DemoStokeTldrTitle>{title}</DemoStokeTldrTitle>
                          <DemoStokeTldrCopy>{copy}</DemoStokeTldrCopy>
                        </FlowText>
                        <FlowImagesRow className="image-animate">
                          {images.map((image, imageIndex) => {
                            const globalIndex = (flowImageOffsets[index] ?? 0) + imageIndex;
                            return (
                              <FlowImageButton
                                key={image.src}
                                type='button'
                                onClick={() => openFlowLightbox(globalIndex)}
                                aria-label={`Open image: ${image.alt}`}
                              >
                                <FlowImage
                                  src={image.src}
                                  alt={image.alt}
                                  loading='lazy'
                                />
                              </FlowImageButton>
                            );
                          })}
                        </FlowImagesRow>
                      </FlowSection>
                    </section>
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
