import {
  DemoStokeAccordion,
  DemoStokeAccordionChevron,
  DemoStokeAccordionContent,
  DemoStokeAccordionCopy,
  DemoStokeAccordionHeader,
  DemoStokeAccordionItem,
  DemoStokeAccordionTitle,
} from '../../../../styles';
import { AnimatedSection, CaseStudySectionTitle } from '../../../../styles/projectShowcases';
import { PERSONA_ITEMS } from '../data';
import { SetAnimatedSectionRef, VisibleSections } from '../../showcaseTypes';

type PersonasSectionProps = {
  setAnimatedSectionRef: SetAnimatedSectionRef;
  visibleSections: VisibleSections;
  openPersonaId: string | null;
  togglePersona: (id: string) => void;
};

const PersonasSection = ({
  setAnimatedSectionRef,
  visibleSections,
  openPersonaId,
  togglePersona
}: PersonasSectionProps) => (
  <AnimatedSection
    ref={setAnimatedSectionRef('section-the-who')}
    data-animate-id='section-the-who'
    className={visibleSections['section-the-who'] ? 'visible' : undefined}
  >
    <section id='section-the-who' className='story-section'>
      <CaseStudySectionTitle as='h2'>The Who / User Personas</CaseStudySectionTitle>
      <DemoStokeAccordion className='text-animate'>
        {PERSONA_ITEMS.map(({ title, bullets }) => {
          const personaId = `persona-${title.toLowerCase().replace(/\s+/g, '-')}`;
          const isOpen = openPersonaId === personaId;
          return (
            <DemoStokeAccordionItem key={title} $isOpen={isOpen}>
              <DemoStokeAccordionHeader
                type='button'
                onClick={() => togglePersona(personaId)}
                aria-expanded={isOpen}
                aria-controls={`${personaId}-content`}
              >
                <DemoStokeAccordionTitle>{title}</DemoStokeAccordionTitle>
                <DemoStokeAccordionChevron aria-hidden='true' $isOpen={isOpen}>
                  <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' role='presentation' focusable='false'>
                    <path d='m6 9 6 6 6-6' />
                  </svg>
                </DemoStokeAccordionChevron>
              </DemoStokeAccordionHeader>
              <DemoStokeAccordionContent id={`${personaId}-content`} role='region' aria-label={`${title} details`} $isOpen={isOpen}>
                <DemoStokeAccordionCopy>
                  <ul className='plain-lines'>
                    {bullets.map((bullet) => (
                      <li key={bullet}>{bullet}</li>
                    ))}
                  </ul>
                </DemoStokeAccordionCopy>
              </DemoStokeAccordionContent>
            </DemoStokeAccordionItem>
          );
        })}
      </DemoStokeAccordion>
    </section>
  </AnimatedSection>
);

export default PersonasSection;
