import { OpenInNewWindowIcon } from '@radix-ui/react-icons';
import { trackEvent, trackLinkClick } from '../../../lib/analytics';
import { heroImageSources } from '../../../lib/responsiveImages';

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
  TitleStatus
} from '../../../../styles/projectShowcases';
import { SetAnimatedSectionRef, VisibleSections } from '../../showcaseTypes';

const HERO_IMAGE_SRC = '/img/nice-guy-university/ngu-home.webp';

type IntroSectionProps = {
  setAnimatedSectionRef: SetAnimatedSectionRef;
  visibleSections: VisibleSections;
};

const ROLE_BULLETS = [
  'Product strategy',
  'Product engineering',
  'UX design',
  'Content architecture',
  'Analytics'
] as const;
const INTRO_SUMMARY = 'Nice Guy University is a live course and coaching platform that turns the Nice Guy recovery coaching I do one-on-one into self-paced courses men can start tonight.';
const TIMELINE = 'March 2026 to now, solo';
const PROJECT_URL = 'https://www.niceguyuniversity.com/';

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
        <CaseStudyHeroMediaFrame className='image-animate' style={{ backgroundColor: '#111111' }}>
          <img src={HERO_IMAGE_SRC} {...heroImageSources(HERO_IMAGE_SRC)} alt='Nice Guy University homepage with hero and calls to action' loading='eager' fetchPriority='high' />
        </CaseStudyHeroMediaFrame>
        <HeroContent className='text-animate'>
          <hgroup>
            <Title>Nice Guy University</Title>
            <TitleStatus>Live at niceguyuniversity.com</TitleStatus>
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
                href={PROJECT_URL}
                target='_blank'
                rel='noopener noreferrer'
                onClick={() => {
                  trackLinkClick({
                    location: 'case_study_hero',
                    label: 'Web App',
                    href: PROJECT_URL,
                    section: 'Nice Guy University Product Story',
                  });
                  trackEvent('external_project_click', {
                    location: 'nice_guy_university_case_study',
                    label: 'Web App',
                    href: PROJECT_URL,
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
      <SectionNavRevealAnchor id='nice-guy-university-case-study-nav-anchor' aria-hidden='true' />
    </section>
  </AnimatedSection>
);

export default IntroSection;
