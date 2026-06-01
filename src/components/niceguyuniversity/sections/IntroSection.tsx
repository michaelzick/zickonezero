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
  ShowcaseMediaButton,
  Summary,
  Title
} from '../../../../styles/projectShowcases';
import { SetAnimatedSectionRef, VisibleSections } from '../../showcaseTypes';

type IntroSectionProps = {
  setAnimatedSectionRef: SetAnimatedSectionRef;
  visibleSections: VisibleSections;
  openLightbox: (index: number) => void;
};

const ROLE_BULLETS = [
  'Product strategy',
  'UX/UI design',
  'Front-end engineering',
  'Content architecture',
  'Analytics planning'
] as const;
const INTRO_SUMMARY = 'Nice Guy University is a course and coaching platform for men working through approval addiction, weak boundaries, shame, and people-pleasing patterns.';
const PROJECT_URL = 'https://www.niceguyuniversity.com/';

const IntroSection = ({ setAnimatedSectionRef, visibleSections, openLightbox }: IntroSectionProps) => (
  <AnimatedSection
    ref={setAnimatedSectionRef('section-intro')}
    data-animate-id='section-intro'
    className={visibleSections['section-intro'] ? 'visible' : undefined}
  >
    <section id='introduction' className='story-section'>
      <HiddenSectionAnchor id='hero-spacer' aria-hidden='true' />
      <HeroGrid>
        <ShowcaseMediaButton type='button' aria-label='Open image: Nice Guy University homepage with hero and calls to action' onClick={() => openLightbox(0)}>
          <CaseStudyHeroMediaFrame className='image-animate' style={{ backgroundColor: '#111111' }}>
            <img src='/img/nice-guy-university/ngu-home.webp' alt='Nice Guy University homepage with hero and calls to action' loading='lazy' />
          </CaseStudyHeroMediaFrame>
        </ShowcaseMediaButton>
        <HeroContent className='text-animate'>
          <Title>Nice Guy University<br />UX Case Study</Title>
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
                href={PROJECT_URL}
                target='_blank'
                rel='noopener noreferrer'
                onClick={() => {
                  trackLinkClick({
                    location: 'case_study_hero',
                    label: 'NiceGuyUniversity.com',
                    href: PROJECT_URL,
                    section: 'Nice Guy University UX Case Study',
                  });
                  trackEvent('external_project_click', {
                    location: 'nice_guy_university_case_study',
                    label: 'NiceGuyUniversity.com',
                    href: PROJECT_URL,
                    page_path: window.location.pathname,
                  });
                }}
              >
                NiceGuyUniversity.com <OpenInNewWindowIcon aria-hidden='true' />
              </a>
            </div>
          </LinkRow>
        </HeroContent>
      </HeroGrid>
      <SectionNavRevealAnchor id='nice-guy-university-case-study-nav-anchor' aria-hidden='true' />
    </section>
  </AnimatedSection>
);

export default IntroSection;
