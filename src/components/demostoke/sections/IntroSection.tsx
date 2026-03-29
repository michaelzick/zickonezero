import { OpenInNewWindowIcon } from '@radix-ui/react-icons';

import {
  Video
} from '../../../../styles';
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
        <CaseStudyHeroMediaFrame>
          <Video
            autoPlay
            loop
            muted
            playsInline
            poster='/img/homepage_light_2025-07-22.webp'
            aria-label='DemoStoke hero video'
          >
            <source src='/video/homepage-2025-11-23-02.mp4' type='video/mp4' />
          </Video>
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
              <a href='https://www.demostoke.com/' target='_blank' rel='noopener noreferrer'>
                DemoStoke.com <OpenInNewWindowIcon aria-hidden='true' />
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
