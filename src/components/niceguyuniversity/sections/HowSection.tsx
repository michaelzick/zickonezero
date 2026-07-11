import { type KeyboardEvent, type RefObject } from 'react';

import {
  DemoStokeScrollButton,
  DemoStokeScrollControls,
  DemoStokeScrollHeader,
  DemoStokeScrollImage,
  DemoStokeScrollItem,
  DemoStokeScrollRow,
  DemoStokeScrollSection,
  DemoStokeTldrImage,
  DemoStokeTldrSection,
  DemoStokeTwoUp
} from '../../../../styles';
import { AntisyphonGalleryBlock, AntisyphonHeroImageWrap, AntisyphonSectionSubheading } from '../../../../styles/antisyphon';
import { AnimatedSection, CaseStudySectionTitle } from '../../../../styles/projectShowcases';
import { HOW_IMAGES, TLDR_ITEMS } from '../caseStudyData';
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

const lightboxOffset = TLDR_ITEMS.length;

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
      <CaseStudySectionTitle as='h2'>The How / Course Platform Experience</CaseStudySectionTitle>
      <DemoStokeTldrSection>
        <DemoStokeTwoUp className='text-animate'>
          <section>
            <h3>Discovery and Conversion</h3>
            <p>
              The catalog reads like a menu of patterns, not a library. Search, categories, levels, and pricing narrow the
              options down to the right starting point, and a free intro course gives skeptical visitors a way in with
              nothing at stake.
            </p>
          </section>
          <section>
            <h3>Trust, Tone, and Support</h3>
            <p>
              Course pages show the full curriculum, the time commitment, and a plain warning that courses are not therapy.
              Coach pages put a face behind the material. The tone holds from homepage to lesson: direct, specific, no hype.
            </p>
          </section>
        </DemoStokeTwoUp>
        <AntisyphonHeroImageWrap className='image-animate'>
          <DemoStokeTldrImage src='/img/nice-guy-university/ngu-course-curriculum.webp' alt='Nice Guy University course curriculum with lesson list and durations' loading='lazy' />
        </AntisyphonHeroImageWrap>
      </DemoStokeTldrSection>
      <AnimatedSection
        ref={setAnimatedSectionRef('section-how-gallery')}
        data-animate-id='section-how-gallery'
        className={visibleSections['section-how-gallery'] ? 'visible' : undefined}
      >
        <AntisyphonGalleryBlock>
          <DemoStokeScrollHeader>
            <AntisyphonSectionSubheading>Screenshots</AntisyphonSectionSubheading>
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
            <DemoStokeScrollRow ref={scrollRowRef} aria-label='Nice Guy University screenshot carousel'>
              {HOW_IMAGES.map(({ src, alt }, index) => (
                <DemoStokeScrollItem
                  key={src}
                  onClick={() => openLightbox(lightboxOffset + index)}
                  role='button'
                  tabIndex={0}
                  aria-label={`Open image: ${alt}`}
                  onKeyDown={(event: KeyboardEvent<HTMLDivElement>) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                      event.preventDefault();
                      openLightbox(lightboxOffset + index);
                    }
                  }}
                >
                  <DemoStokeScrollImage src={src} alt={alt} loading='lazy' />
                </DemoStokeScrollItem>
              ))}
            </DemoStokeScrollRow>
          </DemoStokeScrollSection>
        </AntisyphonGalleryBlock>
      </AnimatedSection>
    </section>
  </AnimatedSection>
);

export default HowSection;
