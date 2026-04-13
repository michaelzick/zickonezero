import {
  DemoStokeTldrCopy,
  DemoStokeTldrList,
  DemoStokeTldrRow,
  DemoStokeTldrSection,
  DemoStokeTldrTitle,
} from '../../../../styles';
import { AnimatedSection, CaseStudySectionTitle } from '../../../../styles/projectShowcases';
import { DemoStokeWhatImage } from '../../../../styles/demostoke';
import { TLDR_ITEMS } from '../caseStudyData';
import { SetAnimatedSectionRef, VisibleSections } from '../../showcaseTypes';

type WhatSectionProps = {
  setAnimatedSectionRef: SetAnimatedSectionRef;
  visibleSections: VisibleSections;
};

const WhatSection = ({ setAnimatedSectionRef, visibleSections }: WhatSectionProps) => (
  <AnimatedSection
    ref={setAnimatedSectionRef('section-the-what')}
    data-animate-id='section-the-what'
    className={visibleSections['section-the-what'] ? 'visible' : undefined}
  >
    <section id='section-the-what' className='story-section'>
      <CaseStudySectionTitle as='h2'>The What</CaseStudySectionTitle>
      <DemoStokeTldrSection>
        <DemoStokeTldrList>
          {TLDR_ITEMS.map(({ title, description, image }, index) => (
            <AnimatedSection
              key={title}
              ref={setAnimatedSectionRef(`tldr-${index}`)}
              data-animate-id={`tldr-${index}`}
              className={visibleSections[`tldr-${index}`] ? 'visible' : undefined}
            >
              <DemoStokeTldrRow $reverse={index % 2 === 1}>
                <div className='text-animate'>
                  <DemoStokeTldrTitle>{title}</DemoStokeTldrTitle>
                  <DemoStokeTldrCopy>{description}</DemoStokeTldrCopy>
                </div>
                <DemoStokeWhatImage className='image-animate' src={image.src} alt={image.alt} loading='lazy' />
              </DemoStokeTldrRow>
            </AnimatedSection>
          ))}
        </DemoStokeTldrList>
      </DemoStokeTldrSection>
    </section>
  </AnimatedSection>
);

export default WhatSection;
