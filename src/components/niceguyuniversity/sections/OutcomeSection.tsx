import { DemoStokeTldrSection } from '../../../../styles';
import { OutcomeCopy } from '../../../../styles/antisyphon';
import { AnimatedSection, CaseStudySectionTitle } from '../../../../styles/projectShowcases';
import { SetAnimatedSectionRef, VisibleSections } from '../../showcaseTypes';

type OutcomeSectionProps = {
  setAnimatedSectionRef: SetAnimatedSectionRef;
  visibleSections: VisibleSections;
};

const OutcomeSection = ({ setAnimatedSectionRef, visibleSections }: OutcomeSectionProps) => (
  <AnimatedSection
    ref={setAnimatedSectionRef('section-outcome')}
    data-animate-id='section-outcome'
    className={visibleSections['section-outcome'] ? 'visible' : undefined}
  >
    <section id='section-outcome' className='story-section'>
      <CaseStudySectionTitle as='h2'>The Outcome</CaseStudySectionTitle>
      <DemoStokeTldrSection className='text-animate'>
        <OutcomeCopy>
          <ul className='plain-lines'>
            <li>A public platform that turns coaching language into structured course discovery.</li>
            <li>A scalable foundation for courses, coaches, resources, reviews, orders, and admin workflows.</li>
            <li>A brand experience that stays blunt, practical, and grounded in behavior change.</li>
          </ul>
        </OutcomeCopy>
      </DemoStokeTldrSection>
    </section>
  </AnimatedSection>
);

export default OutcomeSection;
