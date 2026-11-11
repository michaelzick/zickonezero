import { OpenInNewWindowIcon } from '@radix-ui/react-icons';
import { trackEvent, trackLinkClick } from '../../../lib/analytics';
import { heroImageSources } from '../../../lib/responsiveImages';

import { AnimatedSection, CaseStudyHeroLabel, CaseStudyHeroMediaFrame, HeroContent, HeroGrid, HiddenSectionAnchor, LinkRow, RoleList, SectionNavRevealAnchor, Summary, Title, TitleStatus } from '../../../../styles/projectShowcases';
import { SetAnimatedSectionRef, VisibleSections } from '../../showcaseTypes';

const HERO_IMAGE_SRC = '/img/antisyphon/home.webp';

type IntroSectionProps = {
  setAnimatedSectionRef: SetAnimatedSectionRef;
  visibleSections: VisibleSections;
};

const ROLE_BULLETS = ['Product Lead', 'User research', 'UX design', 'Front-end development', 'Analytics'] as const;
const INTRO_SUMMARY = 'Antisyphon Training is a cybersecurity training marketplace in production, selling live, on-demand, and pay-what-you-can security courses.';
const TIMELINE = 'December 2022 to April 2025, leading a team of six';

const IntroSection = ({ setAnimatedSectionRef, visibleSections }: IntroSectionProps) => (
  <AnimatedSection
    ref={setAnimatedSectionRef('section-intro')}
    data-animate-id='section-intro'
    data-reveal='load'
    className={visibleSections['section-intro'] ? 'visible' : undefined}
  >
    <section id='introduction' className='story-section'>
      <HiddenSectionAnchor id='hero-spacer' aria-hidden='true' />
      <HeroGrid>
        <CaseStudyHeroMediaFrame className='image-animate' style={{ backgroundColor: '#151515' }}>
          <img src={HERO_IMAGE_SRC} {...heroImageSources(HERO_IMAGE_SRC)} alt='Antisyphon Training homepage with course cards' loading='eager' fetchPriority='high' />
        </CaseStudyHeroMediaFrame>
        <HeroContent className='text-animate'>
          <hgroup>
            <Title>Antisyphon Training</Title>
            <TitleStatus>Client product, live at antisyphontraining.com</TitleStatus>
          </hgroup>
          <div>
            <CaseStudyHeroLabel>The Product</CaseStudyHeroLabel>
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
          <div>
            <CaseStudyHeroLabel>Timeline and Team</CaseStudyHeroLabel>
            <Summary>{TIMELINE}</Summary>
          </div>
          <LinkRow>
            <CaseStudyHeroLabel>Use It Live</CaseStudyHeroLabel>
            <div>
              <a
                href='https://www.antisyphontraining.com/'
                target='_blank'
                rel='noopener noreferrer'
                onClick={() => {
                  trackLinkClick({
                    location: 'case_study_hero',
                    label: 'Web App',
                    href: 'https://www.antisyphontraining.com/',
                    section: 'Antisyphon Product Story',
                  });
                  trackEvent('external_project_click', {
                    location: 'case_study_hero',
                    label: 'Web App',
                    href: 'https://www.antisyphontraining.com/',
                    page_path: window.location.pathname,
                  });
                }}
              >
                Web App <OpenInNewWindowIcon aria-hidden='true' />
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
