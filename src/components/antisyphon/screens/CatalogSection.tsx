import { DemoStokeTldrCopy } from '../../../../styles';
import { AnimatedSection, CaseStudySectionTitle } from '../../../../styles/projectShowcases';
import {
  FlowImage,
  FlowImageButton,
  FlowImagesRow,
  FlowSection,
  FlowStorySection,
  FlowText
} from '../../../../styles/antisyphon';
import { type FlowBlock } from '../flowData';
import { SetAnimatedSectionRef, VisibleSections } from '../../showcaseTypes';

type CatalogSectionProps = {
  block: FlowBlock;
  setAnimatedSectionRef: SetAnimatedSectionRef;
  visibleSections: VisibleSections;
  getImageGlobalIndex: (blockId: string, imageIndex: number) => number;
  openFlowLightbox: (index: number) => void;
};

type FlowImageEntry = {
  image: FlowBlock['images'][number];
  index: number;
};

const CatalogSection = ({
  block,
  setAnimatedSectionRef,
  visibleSections,
  getImageGlobalIndex,
  openFlowLightbox
}: CatalogSectionProps) => {
  const imageRows = block.images.reduce<FlowImageEntry[][]>((rows, image, index) => {
    const rowIndex = Math.floor(index / 2);
    if (!rows[rowIndex]) rows[rowIndex] = [];
    rows[rowIndex]!.push({ image, index });
    return rows;
  }, []);

  return (
    <AnimatedSection
      ref={setAnimatedSectionRef(block.id)}
      data-animate-id={block.id}
      className={visibleSections[block.id] ? 'visible' : undefined}
    >
      <FlowStorySection id={block.id} className='story-section'>
        <FlowSection>
          <FlowText className='text-animate'>
            <CaseStudySectionTitle as='h2'>{block.title}</CaseStudySectionTitle>
            <DemoStokeTldrCopy>{block.copy}</DemoStokeTldrCopy>
          </FlowText>
          {imageRows.map((row, rowIndex) => (
            <FlowImagesRow
              key={`${block.id}-row-${rowIndex}`}
              className='image-animate'
              $topOffset={rowIndex === 0}
            >
              {row.map(({ image, index }) => (
                <FlowImageButton
                  key={image.src}
                  type='button'
                  onClick={() => openFlowLightbox(getImageGlobalIndex(block.id, index))}
                  aria-label={`Open image: ${image.alt}`}
                >
                  <FlowImage src={image.src} alt={image.alt} loading='lazy' />
                </FlowImageButton>
              ))}
            </FlowImagesRow>
          ))}
        </FlowSection>
      </FlowStorySection>
    </AnimatedSection>
  );
};

export default CatalogSection;
