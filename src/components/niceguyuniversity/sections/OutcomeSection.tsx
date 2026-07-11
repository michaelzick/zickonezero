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
            <li>A live product at niceguyuniversity.com selling real courses, not a concept deck.</li>
            <li>A coaching practice that scales past my calendar — men can start the work without booking a session.</li>
            <li>A back office that lets one person run the entire business, from analytics to email.</li>
          </ul>
        </OutcomeCopy>
      </DemoStokeTldrSection>
    </section>
  </AnimatedSection>
);

export default OutcomeSection;
