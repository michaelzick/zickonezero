import {
  DemoStokeMethodCard,
  DemoStokeMethodList,
  DemoStokeMethodRow,
  DemoStokeTldrCopy,
  DemoStokeTldrImage,
  DemoStokeTldrTitle,
} from '../../../../styles';
import { AnimatedSection, CaseStudySectionTitle } from '../../../../styles/projectShowcases';
import { METHOD_SECTIONS } from '../data';
import { SetAnimatedSectionRef, VisibleSections } from '../../showcaseTypes';

type MethodsSectionProps = {
  setAnimatedSectionRef: SetAnimatedSectionRef;
  visibleSections: VisibleSections;
};

const MethodsSection = ({ setAnimatedSectionRef, visibleSections }: MethodsSectionProps) => (
  <section id='section-methodology' className='story-section'>
    <CaseStudySectionTitle as='h2'>Methods / The UX Process</CaseStudySectionTitle>
    <DemoStokeMethodList>
      {METHOD_SECTIONS.map(({ title, bullets, image }, index) => (
        <AnimatedSection
          key={title}
          ref={setAnimatedSectionRef(`method-${index}`)}
          data-animate-id={`method-${index}`}
          className={visibleSections[`method-${index}`] ? 'visible' : undefined}
        >
          <DemoStokeMethodCard>
            <DemoStokeMethodRow $reverse={index % 2 === 1}>
              <div className='text-animate'>
                <DemoStokeTldrTitle>{title}</DemoStokeTldrTitle>
                <DemoStokeTldrCopy>
                  <ul className='plain-lines'>
                    {bullets.map((bullet) => (
                      <li key={bullet}>{bullet}</li>
                    ))}
                  </ul>
                </DemoStokeTldrCopy>
              </div>
              <DemoStokeTldrImage className='image-animate' src={image.src} alt={image.alt} loading='lazy' />
            </DemoStokeMethodRow>
          </DemoStokeMethodCard>
        </AnimatedSection>
      ))}
    </DemoStokeMethodList>
  </section>
);

export default MethodsSection;
