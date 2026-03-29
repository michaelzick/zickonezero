import {
  DemoStokeTldrSection
} from '../../../../styles';
import { AnimatedSection, CaseStudySectionTitle } from '../../../../styles/projectShowcases';
import { OutcomeCopy } from '../../../../styles/antisyphon';
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
            <li>Increased enrollments by 49%</li>
            <li>Reduced customer support tickets by 67%</li>
            <li>Cut course setup time by 85%</li>
          </ul>
        </OutcomeCopy>
      </DemoStokeTldrSection>
    </section>
  </AnimatedSection>
);

export default OutcomeSection;
