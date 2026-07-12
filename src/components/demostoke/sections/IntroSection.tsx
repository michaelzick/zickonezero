import { OpenInNewWindowIcon } from '@radix-ui/react-icons';
import { trackEvent, trackLinkClick } from '../../../lib/analytics';

import {
  AnimatedSection,
  CaseStudyHeroLabel,
  CaseStudyHeroMediaFrame,
  HeroContent,
  HeroGrid,
  HiddenSectionAnchor,
  LinkRow,
  RoleList,
  SectionNavRevealAnchor,
  Summary,
  Title,
} from '../../../../styles/projectShowcases';
import { SetAnimatedSectionRef, VisibleSections } from '../../showcaseTypes';

type IntroSectionProps = {
  setAnimatedSectionRef: SetAnimatedSectionRef;
  visibleSections: VisibleSections;
};

const ROLE_BULLETS = ['Founder', 'UX designer', 'Full-stack developer'] as const;
const INTRO_SUMMARY = 'DemoStoke is a unified marketplace that helps riders and shops discover, book, and manage demo and rental gear in one place.';

const IntroSection = ({ setAnimatedSectionRef, visibleSections }: IntroSectionProps) => (
  <AnimatedSection
    ref={setAnimatedSectionRef('section-intro')}
    data-animate-id='section-intro'
    className={visibleSections['section-intro'] ? 'visible' : undefined}
  >
    <section id='introduction' className='story-section'>
      <HiddenSectionAnchor id='hero-spacer' aria-hidden='true' />
      <HeroGrid>
        <CaseStudyHeroMediaFrame className='image-animate'>
          <img
            src='/img/demostoke/case-study/ds-hero-surf.webp'
            alt='DemoStoke homepage hero showing a surfer riding through the wave'
            loading='eager'
          />
        </CaseStudyHeroMediaFrame>
        <HeroContent className='text-animate'>
          <Title>DemoStoke<br />UX Case Study</Title>
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
                href='https://www.demostoke.com/'
                target='_blank'
                rel='noopener noreferrer'
                onClick={() => {
                  trackLinkClick({
                    location: 'case_study_hero',
                    label: 'www.demostoke.com',
                    href: 'https://www.demostoke.com/',
                    section: 'DemoStoke UX Case Study',
                  });
                  trackEvent('external_project_click', {
                    location: 'case_study_hero',
                    label: 'www.demostoke.com',
                    href: 'https://www.demostoke.com/',
                    page_path: window.location.pathname,
                  });
                }}
              >
                www.demostoke.com <OpenInNewWindowIcon aria-hidden='true' />
              </a>
            </div>
          </LinkRow>
        </HeroContent>
      </HeroGrid>
      <SectionNavRevealAnchor id='demostoke-case-study-nav-anchor' aria-hidden='true' />
    </section>
  </AnimatedSection>
);

export default IntroSection;
