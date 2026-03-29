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

type FlowBlockSectionProps = {
  block: FlowBlock;
  setAnimatedSectionRef: SetAnimatedSectionRef;
  visibleSections: VisibleSections;
  getImageGlobalIndex: (blockId: string, imageIndex: number) => number;
  openFlowLightbox: (index: number) => void;
};

const FlowBlockSection = ({
  block,
  setAnimatedSectionRef,
  visibleSections,
  getImageGlobalIndex,
  openFlowLightbox
}: FlowBlockSectionProps) => (
  <AnimatedSection
    ref={setAnimatedSectionRef(block.id)}
    data-animate-id={block.id}
    className={visibleSections[block.id] ? 'visible' : undefined}
  >
    <FlowStorySection id={block.id}>
      <FlowSection>
        <FlowText className='text-animate'>
          <CaseStudySectionTitle as='h2'>{block.title}</CaseStudySectionTitle>
          <DemoStokeTldrCopy>{block.copy}</DemoStokeTldrCopy>
        </FlowText>
        <FlowImagesRow className='image-animate'>
          {block.images.map((image, imageIndex) => (
            <FlowImageButton
              key={image.src}
              type='button'
              onClick={() => openFlowLightbox(getImageGlobalIndex(block.id, imageIndex))}
              aria-label={`Open image: ${image.alt}`}
            >
              <FlowImage src={image.src} alt={image.alt} loading='lazy' />
            </FlowImageButton>
          ))}
        </FlowImagesRow>
      </FlowSection>
    </FlowStorySection>
  </AnimatedSection>
);

export default FlowBlockSection;
