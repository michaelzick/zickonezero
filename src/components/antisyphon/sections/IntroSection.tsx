import { OpenInNewWindowIcon } from '@radix-ui/react-icons';
import { trackEvent, trackLinkClick } from '../../../lib/analytics';

import { AnimatedSection, CaseStudyHeroLabel, CaseStudyHeroMediaFrame, HeroContent, HeroGrid, HiddenSectionAnchor, LinkRow, RoleList, SectionNavRevealAnchor, Summary, Title } from '../../../../styles/projectShowcases';
import { SetAnimatedSectionRef, VisibleSections } from '../../showcaseTypes';

type IntroSectionProps = {
  setAnimatedSectionRef: SetAnimatedSectionRef;
  visibleSections: VisibleSections;
};

const ROLE_BULLETS = ['Product strategy', 'UX design', 'Front-end development'] as const;
const INTRO_SUMMARY = 'Antisyphon Training is a cohesive marketplace experience for live, on-demand, and pay-what-you-can security education.';

const IntroSection = ({ setAnimatedSectionRef, visibleSections }: IntroSectionProps) => (
  <AnimatedSection
    ref={setAnimatedSectionRef('section-intro')}
    data-animate-id='section-intro'
    className={visibleSections['section-intro'] ? 'visible' : undefined}
  >
    <section id='introduction' className='story-section'>
      <HiddenSectionAnchor id='hero-spacer' aria-hidden='true' />
      <HeroGrid>
        <CaseStudyHeroMediaFrame className='image-animate' style={{ backgroundColor: '#151515' }}>
          <img src='/img/antisyphon/home.webp' alt='Antisyphon Training homepage with course cards' loading='lazy' />
        </CaseStudyHeroMediaFrame>
        <HeroContent className='text-animate'>
          <Title>Antisyphon<br />UX Case Study</Title>
          <div>
            <CaseStudyHeroLabel>Description</CaseStudyHeroLabel>
            <Summary>{INTRO_SUMMARY}</Summary>
          </div>
          <div>
            <CaseStudyHeroLabel>My Roles</CaseStudyHeroLabel>
            <RoleList>
              {ROLE_BULLETS.map((bullet) => (
                <li key={bullet}>{bullet}</li>
              ))}
            </RoleList>
          </div>
          <LinkRow>
            <CaseStudyHeroLabel>Project Link</CaseStudyHeroLabel>
            <div>
              <a
                href='https://www.antisyphontraining.com/'
                target='_blank'
                rel='noopener noreferrer'
                onClick={() => {
                  trackLinkClick({
                    location: 'case_study_hero',
                    label: 'www.antisyphontraining.com',
                    href: 'https://www.antisyphontraining.com/',
                    section: 'Antisyphon UX Case Study',
                  });
                  trackEvent('external_project_click', {
                    location: 'case_study_hero',
                    label: 'www.antisyphontraining.com',
                    href: 'https://www.antisyphontraining.com/',
                    page_path: window.location.pathname,
                  });
                }}
              >
                www.antisyphontraining.com <OpenInNewWindowIcon aria-hidden='true' />
              </a>
            </div>
          </LinkRow>
        </HeroContent>
      </HeroGrid>
      <SectionNavRevealAnchor id='antisyphon-case-study-nav-anchor' aria-hidden='true' />
    </section>
  </AnimatedSection>
);

export default IntroSection;
