import { type KeyboardEvent, type RefObject } from 'react';

import {
  DemoStokeScrollButton,
  DemoStokeScrollControls,
  DemoStokeScrollHeader,
  DemoStokeScrollImage,
  DemoStokeScrollItem,
  DemoStokeScrollRow,
  DemoStokeScrollSection,
  DemoStokeTldrSection,
  DemoStokeTwoUp,
  DemoStokeWhyImageFrame,
  FullBorderImage,
} from '../../../../styles';
import { AnimatedSection, CaseStudySectionTitle } from '../../../../styles/projectShowcases';
import { DemoStokeGalleryBlock, DemoStokeSectionSubheading } from '../../../../styles/demostoke';
import { HOW_IMAGES } from '../data';
import { SetAnimatedSectionRef, VisibleSections } from '../../showcaseTypes';

type HowSectionProps = {
  setAnimatedSectionRef: SetAnimatedSectionRef;
  visibleSections: VisibleSections;
  scrollRowRef: RefObject<HTMLDivElement | null>;
  canScrollLeft: boolean;
  canScrollRight: boolean;
  scrollGalleryBy: (direction: number) => void;
  openLightbox: (index: number) => void;
};

const HowSection = ({
  setAnimatedSectionRef,
  visibleSections,
  scrollRowRef,
  canScrollLeft,
  canScrollRight,
  scrollGalleryBy,
  openLightbox
}: HowSectionProps) => (
  <AnimatedSection
    ref={setAnimatedSectionRef('section-the-how')}
    data-animate-id='section-the-how'
    className={visibleSections['section-the-how'] ? 'visible' : undefined}
  >
    <section id='section-the-how' className='story-section'>
      <CaseStudySectionTitle as='h2'>The How / AI-Driven Development</CaseStudySectionTitle>
      <DemoStokeTldrSection>
        <DemoStokeTwoUp className='text-animate'>
          <section>
            <h3>Location-Based Discovery</h3>
            <p>
              With DemoStoke, I created a comprehensive gear discovery and rental platform that connects riders with
              demo opportunities in their area.
            </p>
          </section>
          <section>
            <h3>Rapid Prototyping with AI</h3>
            <p>
              Using Lovable.dev, I was able to spin up the app’s foundation with a well-written prompt, then iterated
              rapidly to refine features and user experience.
            </p>
          </section>
        </DemoStokeTwoUp>
        <DemoStokeWhyImageFrame className='image-animate'>
          <FullBorderImage src='/img/demostoke/case-study/ds-explore-hybrid.webp' alt='DemoStoke Hybrid View' loading='lazy' />
        </DemoStokeWhyImageFrame>
      </DemoStokeTldrSection>
      <DemoStokeGalleryBlock>
        <DemoStokeScrollHeader>
          <DemoStokeSectionSubheading>Screenshots</DemoStokeSectionSubheading>
          <DemoStokeScrollControls aria-label='Gallery navigation'>
            <DemoStokeScrollButton type='button' onClick={() => scrollGalleryBy(-1)} disabled={!canScrollLeft} aria-label='Scroll left'>
              <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' aria-hidden='true' focusable='false'>
                <path d='m14 18-6-6 6-6' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' />
              </svg>
            </DemoStokeScrollButton>
            <DemoStokeScrollButton type='button' onClick={() => scrollGalleryBy(1)} disabled={!canScrollRight} aria-label='Scroll right'>
              <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' aria-hidden='true' focusable='false'>
                <path d='m10 6 6 6-6 6' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' />
              </svg>
            </DemoStokeScrollButton>
          </DemoStokeScrollControls>
        </DemoStokeScrollHeader>
        <DemoStokeScrollSection>
          <DemoStokeScrollRow ref={scrollRowRef} aria-label='DemoStoke screenshot carousel'>
            {HOW_IMAGES.map(({ src, alt }, index) => (
              <DemoStokeScrollItem
                key={src}
                onClick={() => openLightbox(index)}
                role='button'
                tabIndex={0}
                aria-label={`Open image: ${alt}`}
                onKeyDown={(event: KeyboardEvent<HTMLDivElement>) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    openLightbox(index);
                  }
                }}
              >
                <DemoStokeScrollImage src={src} alt={alt} loading='lazy' />
              </DemoStokeScrollItem>
            ))}
          </DemoStokeScrollRow>
        </DemoStokeScrollSection>
      </DemoStokeGalleryBlock>
    </section>
  </AnimatedSection>
);

export default HowSection;
