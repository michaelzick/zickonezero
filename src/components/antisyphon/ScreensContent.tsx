import { OpenInNewWindowIcon } from '@radix-ui/react-icons';
import {
  DemoStokeTldrCopy,
  DemoStokeTldrTitle,
} from '../../../styles';
import SidebarSectionTabs, { SidebarSectionConfig } from '../SidebarSectionTabs';
import {
  AnimatedSection,
  CaseStudyPageInner,
  HeroContent,
  HeroGrid,
  HeroLabel,
  HeroMediaFrame,
  LinkRow,
  PageShell,
  RoleList,
  SectionNavRevealAnchor,
  SectionTitle,
  SectionsBlock,
  ShowcaseMediaButton,
  Summary,
  Title,
} from '../../../styles/projectShowcases';
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

const ROLE_BULLETS = [
  'Catalog UX',
  'Checkout architecture',
  'Admin tooling'
];

const INTRO_SUMMARY = 'The product screens below show how the Antisyphon marketplace scales from discovery through checkout, account management, and operations tooling. On desktop, the experience now follows the same editorial showcase rhythm as the rest of the case-study system instead of a split sidebar layout.';

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
      <PageShell>
        <CaseStudyPageInner className='demostoke-inner'>
          <section id='screens-introduction'>
            <HeroGrid>
              <ShowcaseMediaButton
                type='button'
                aria-label='Open image: Full course catalog with category filters and badges'
                onClick={() => openFlowLightbox(0)}
              >
                <HeroMediaFrame className='image-animate'>
                  <img
                    src='/img/antisyphon/course-catalog.webp'
                    alt='Full course catalog with category filters and badges'
                    loading='lazy'
                  />
                </HeroMediaFrame>
              </ShowcaseMediaButton>

              <HeroContent className='text-animate'>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1em', marginBottom: '0.25em' }}>
                  <img className='at-logo' src='/img/squares/at_logo_purple.webp' alt='Antisyphon Training Logo' />
                  <HeroLabel>Product Screens</HeroLabel>
                </div>

                <Title>Antisyphon Product Screens</Title>

                <div>
                  <HeroLabel>Description</HeroLabel>
                  <Summary>{INTRO_SUMMARY}</Summary>
                </div>

                <div>
                  <HeroLabel>Focus Areas</HeroLabel>
                  <RoleList>
                    {ROLE_BULLETS.map((bullet) => (
                      <li key={bullet}>{bullet}</li>
                    ))}
                  </RoleList>
                </div>

                <LinkRow>
                  <HeroLabel>Project Link</HeroLabel>
                  <div>
                    <a href="https://www.antisyphontraining.com/" target='_blank' rel='noopener noreferrer'>
                      AntisyphonTraining.com <OpenInNewWindowIcon aria-hidden="true" />
                    </a>
                  </div>
                </LinkRow>
              </HeroContent>
            </HeroGrid>
          </section>

          <SectionNavRevealAnchor id='antisyphon-screens-nav-anchor' aria-hidden='true' />

          <SidebarSectionTabs
            sections={sections}
            topTabsEl={topTabsEl}
            isActive={isActive}
            scrollOffsetAdjustment={8}
            desktopRevealAnchorId='antisyphon-screens-nav-anchor'
          />

          <SectionsBlock as='div'>
            {catalogBlock && (
              <AnimatedSection
                ref={setAnimatedSectionRef(catalogBlock.id)}
                data-animate-id={catalogBlock.id}
                className={visibleSections[catalogBlock.id] ? 'visible' : undefined}
              >
                <FlowStorySection id={catalogBlock.id} className='story-section'>
                  <FlowSection>
                    <FlowText className='text-animate'>
                      <SectionTitle as='h2'>{catalogBlock.title}</SectionTitle>
                      <DemoStokeTldrCopy>{catalogBlock.copy}</DemoStokeTldrCopy>
                    </FlowText>
                    {catalogImageRows.map((row, rowIndex) => (
                      <FlowImagesRow
                        key={`${catalogBlock.id}-row-${rowIndex}`}
                        className='image-animate'
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
                      <FlowText className='text-animate'>
                        <SectionTitle as='h2'>{title}</SectionTitle>
                        <DemoStokeTldrCopy>{copy}</DemoStokeTldrCopy>
                      </FlowText>
                      <FlowImagesRow className='image-animate'>
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

            <section className='story-section'>
              <DemoStokeTldrTitle>Context</DemoStokeTldrTitle>
              <DemoStokeTldrCopy>
                These product views stay tied to the same live course, on-demand, checkout, and operations patterns documented in the
                Antisyphon UX case study. The desktop shell now mirrors the showcase pages, but the underlying screen content and
                lightbox interactions remain unchanged.
              </DemoStokeTldrCopy>
            </section>
          </SectionsBlock>
        </CaseStudyPageInner>
      </PageShell>
    </div>
  );
};

export default ScreensContent;
