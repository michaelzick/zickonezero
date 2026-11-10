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
  TitleStatus,
} from '../../../../styles/projectShowcases';
import { SetAnimatedSectionRef, VisibleSections } from '../../showcaseTypes';

const HERO_IMAGE_SRC = '/img/demostoke/case-study/ds-hero-surf.webp';

type IntroSectionProps = {
  setAnimatedSectionRef: SetAnimatedSectionRef;
  visibleSections: VisibleSections;
};

const ROLE_BULLETS = ['Founder', 'product engineering', 'UX design', 'product analytics'] as const;
const INTRO_SUMMARY = 'DemoStoke is a live marketplace that helps riders and shops discover, book, and manage demo and rental gear in one place.';

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
        <CaseStudyHeroMediaFrame className='image-animate'>
          <img
            src={HERO_IMAGE_SRC}
            {...heroImageSources(HERO_IMAGE_SRC)}
            alt='DemoStoke homepage hero showing a surfer riding through the wave'
            loading='eager'
            fetchPriority='high'
          />
        </CaseStudyHeroMediaFrame>
        <HeroContent className='text-animate'>
          <hgroup>
            <Title>DemoStoke</Title>
            <TitleStatus>Live at demostoke.com</TitleStatus>
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
          <LinkRow>
            <CaseStudyHeroLabel>Use It Live</CaseStudyHeroLabel>
            <div>
              <a
                href='https://www.demostoke.com/'
                target='_blank'
                rel='noopener noreferrer'
                onClick={() => {
                  trackLinkClick({
                    location: 'case_study_hero',
                    label: 'Website',
                    href: 'https://www.demostoke.com/',
                    section: 'DemoStoke Product Story',
                  });
                  trackEvent('external_project_click', {
                    location: 'case_study_hero',
                    label: 'Website',
                    href: 'https://www.demostoke.com/',
                    page_path: window.location.pathname,
                  });
                }}
              >
                Website <OpenInNewWindowIcon aria-hidden='true' />
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
