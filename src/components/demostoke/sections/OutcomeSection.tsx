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
            <li>Live at demostoke.com for surf, snow, and mountain bike gear.</li>
            <li>A demo-event calendar that keeps itself current, with new events found and published every week.</li>
            <li>Measured with GTM, GA4, and Mixpanel across over 60 events, from search to shop listings.</li>
            <li>Steady growth in organic and AI search from automated, regular publishing: year over year, Google Search Console clicks are up 133% and impressions up 498%.</li>
          </ul>
        </OutcomeCopy>
      </DemoStokeTldrSection>
    </section>
  </AnimatedSection>
);

export default OutcomeSection;
