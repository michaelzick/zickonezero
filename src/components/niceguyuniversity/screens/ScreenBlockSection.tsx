import { DemoStokeTldrCopy } from '../../../../styles';
import {
  FlowImage,
  FlowImageButton,
  FlowImagesRow,
  FlowSection,
  FlowStorySection,
  FlowText
} from '../../../../styles/antisyphon';
import { AnimatedSection, CaseStudySectionTitle } from '../../../../styles/projectShowcases';
import { type ScreenBlock } from '../screenData';
import { SetAnimatedSectionRef, VisibleSections } from '../../showcaseTypes';

type ScreenBlockSectionProps = {
  block: ScreenBlock;
  setAnimatedSectionRef: SetAnimatedSectionRef;
  visibleSections: VisibleSections;
  getImageGlobalIndex: (blockId: string, imageIndex: number) => number;
  openScreenLightbox: (index: number) => void;
};

const ScreenBlockSection = ({
  block,
  setAnimatedSectionRef,
  visibleSections,
  getImageGlobalIndex,
  openScreenLightbox
}: ScreenBlockSectionProps) => (
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
        <FlowImagesRow className='image-animate'>
          {block.images.map((image, imageIndex) => (
            <FlowImageButton
              key={image.src}
              type='button'
              onClick={() => openScreenLightbox(getImageGlobalIndex(block.id, imageIndex))}
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

export default ScreenBlockSection;
