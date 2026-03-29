import { OpenInNewWindowIcon } from '@radix-ui/react-icons';
import { type KeyboardEvent, type RefObject } from 'react';
import styled from 'styled-components';
import {
  DemoStokeAccordion,
  DemoStokeAccordionChevron,
  DemoStokeAccordionContent,
  DemoStokeAccordionCopy,
  DemoStokeAccordionHeader,
  DemoStokeAccordionItem,
  DemoStokeAccordionTitle,
  DemoStokeMethodCard,
  DemoStokeMethodList,
  DemoStokeMethodRow,
  DemoStokeScrollButton,
  DemoStokeScrollControls,
  DemoStokeScrollHeader,
  DemoStokeScrollImage,
  DemoStokeScrollItem,
  DemoStokeScrollRow,
  DemoStokeScrollSection,
  DemoStokeTldrCopy,
  DemoStokeTldrImage,
  DemoStokeTldrList,
  DemoStokeTldrRow,
  DemoStokeTldrSection,
  DemoStokeTldrTitle,
  DemoStokeTwoUp,
  DemoStokeWhyImageFrame,
  FullBorderImage,
  Video,
} from '../../../styles';
import SidebarSectionTabs from '../SidebarSectionTabs';
import {
  AnimatedSection,
  CaseStudyIntroOffset,
  CaseStudyHeroLabel,
  CaseStudySectionTitle,
  CaseStudyPageInner,
  HeroContent,
  HeroGrid,
  HiddenSectionAnchor,
  HeroMediaFrame,
  LinkRow,
  PageShell,
  RoleList,
  SectionNavRevealAnchor,
  SectionsBlock,
  Summary,
  Title,
} from '../../../styles/projectShowcases';
import {
  CASE_STUDY_BOTTOM_SECTION_ID,
  CASE_STUDY_SECTIONS,
  HOW_IMAGES,
  METHOD_SECTIONS,
  PERSONA_ITEMS,
  TLDR_ITEMS
} from './data';

type CaseStudyContentProps = {
  setAnimatedSectionRef: (id: string) => (el: HTMLDivElement | null) => void;
  visibleSections: Record<string, boolean>;
  scrollRowRef: RefObject<HTMLDivElement | null>;
  canScrollLeft: boolean;
  canScrollRight: boolean;
  scrollGalleryBy: (direction: number) => void;
  openLightbox: (index: number) => void;
  openPersonaId: string | null;
  togglePersona: (id: string) => void;
  topTabsEl: HTMLDivElement | null;
  isActive: boolean;
};

const ROLE_BULLETS = [
  'Founder',
  'UX designer',
  'Full-stack developer'
];

const INTRO_SUMMARY = 'DemoStoke is a unified marketplace that helps riders and shops discover, book, and manage demo and rental gear in one place.';

const DemoStokeWhatImage = styled(DemoStokeTldrImage)`
  border: none;
`;

const CaseStudyContent = ({
  setAnimatedSectionRef,
  visibleSections,
  scrollRowRef,
  canScrollLeft,
  canScrollRight,
  scrollGalleryBy,
  openLightbox,
  openPersonaId,
  togglePersona,
  topTabsEl,
  isActive
}: CaseStudyContentProps) => {
  return (
    <div id="executive-content">
      <PageShell>
        <CaseStudyPageInner className='demostoke-inner'>
          <CaseStudyIntroOffset>
            <AnimatedSection
              ref={setAnimatedSectionRef('section-intro')}
              data-animate-id='section-intro'
              className={visibleSections['section-intro'] ? 'visible' : undefined}
            >
              <section id='introduction' className='story-section'>
                <HiddenSectionAnchor id='hero-spacer' aria-hidden='true' />

                <HeroGrid>
                  <HeroMediaFrame>
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
                  </HeroMediaFrame>

                  <HeroContent className='text-animate'>
                    <Title>DemoStoke UX Case Study</Title>

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
                        <a href="https://www.demostoke.com/" target='_blank' rel='noopener noreferrer'>
                          DemoStoke.com <OpenInNewWindowIcon aria-hidden="true" />
                        </a>
                      </div>
                    </LinkRow>
                  </HeroContent>
                </HeroGrid>

                <SectionNavRevealAnchor id='demostoke-case-study-nav-anchor' aria-hidden='true' />
              </section>
            </AnimatedSection>
          </CaseStudyIntroOffset>

          <SidebarSectionTabs
            sections={CASE_STUDY_SECTIONS}
            topTabsEl={topTabsEl}
            isActive={isActive}
            lockToBottomSectionId={CASE_STUDY_BOTTOM_SECTION_ID}
            scrollOffsetAdjustment={8}
            desktopRevealAnchorId='demostoke-case-study-nav-anchor'
          />

          <SectionsBlock as="div">
            <AnimatedSection
              ref={setAnimatedSectionRef('section-the-what')}
              data-animate-id='section-the-what'
              className={visibleSections['section-the-what'] ? 'visible' : undefined}
            >
              <section id='section-the-what' className='story-section'>
                <DemoStokeTldrSection>
                  <DemoStokeTldrList>
                    {TLDR_ITEMS.map(({ title, description, image }, index) => (
                      <AnimatedSection
                        key={title}
                        ref={setAnimatedSectionRef(`tldr-${index}`)}
                        data-animate-id={`tldr-${index}`}
                        className={visibleSections[`tldr-${index}`] ? 'visible' : undefined}
                      >
                        <DemoStokeTldrRow $reverse={index % 2 === 1}>
                          <div className="text-animate">
                            <DemoStokeTldrTitle>{title}</DemoStokeTldrTitle>
                            <DemoStokeTldrCopy>{description}</DemoStokeTldrCopy>
                          </div>
                          <DemoStokeWhatImage
                            className="image-animate"
                            src={image.src}
                            alt={image.alt}
                            loading='lazy'
                          />
                        </DemoStokeTldrRow>
                      </AnimatedSection>
                    ))}
                  </DemoStokeTldrList>
                </DemoStokeTldrSection>
              </section>
            </AnimatedSection>

            <AnimatedSection
              ref={setAnimatedSectionRef('section-the-how')}
              data-animate-id='section-the-how'
              className={visibleSections['section-the-how'] ? 'visible' : undefined}
            >
              <section id='section-the-how' className='story-section'>
                <CaseStudySectionTitle as="h2">The How / AI-Driven Development</CaseStudySectionTitle>
                <DemoStokeTldrSection>
                  <DemoStokeTwoUp className="text-animate">
                    <section>
                      <h3>Location-Based Discovery</h3>
                      <p>
                        With DemoStoke, I created a comprehensive gear discovery and rental platform that connects riders with
                        demo opportunities in their area.
                      </p>
                    </section>
                    <section>
                      <h3>Rapid Prototyping with AI</h3>
                      <p>
                        Using Lovable.dev, I was able to spin up the app’s foundation with a well-written prompt, then iterated
                        rapidly to refine features and user experience.
                      </p>
                    </section>
                  </DemoStokeTwoUp>
                  <DemoStokeWhyImageFrame className="image-animate">
                    <FullBorderImage src='/img/demostoke/all-equipment-hybrid.webp' alt='DemoStoke Hybrid View' loading="lazy" />
                  </DemoStokeWhyImageFrame>
                </DemoStokeTldrSection>

                <div style={{ marginTop: 'clamp(1.4em, 3vw, 2.1em)' }}>
                  <DemoStokeScrollHeader>
                    <h3 style={{ margin: 0 }}>Screenshots</h3>
                    <DemoStokeScrollControls aria-label='Gallery navigation'>
                      <DemoStokeScrollButton
                        type='button'
                        onClick={() => scrollGalleryBy(-1)}
                        disabled={!canScrollLeft}
                        aria-label='Scroll left'
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                          <path d="m14 18-6-6 6-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </DemoStokeScrollButton>
                      <DemoStokeScrollButton
                        type='button'
                        onClick={() => scrollGalleryBy(1)}
                        disabled={!canScrollRight}
                        aria-label='Scroll right'
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                          <path d="m10 6 6 6-6 6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </DemoStokeScrollButton>
                    </DemoStokeScrollControls>
                  </DemoStokeScrollHeader>
                  <DemoStokeScrollSection>
                        <DemoStokeScrollRow ref={scrollRowRef} aria-label='DemoStoke screenshot carousel'>
                          {HOW_IMAGES.map(({ src, alt }, index) => (
                            <DemoStokeScrollItem
                              key={src}
                              onClick={() => openLightbox(index)}
                              role='button'
                              tabIndex={0}
                              aria-label={`Open image: ${alt}`}
                              onKeyDown={(e: KeyboardEvent<HTMLDivElement>) => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                  e.preventDefault();
                                  openLightbox(index);
                                }
                              }}
                            >
                          <DemoStokeScrollImage src={src} alt={alt} loading='lazy' />
                        </DemoStokeScrollItem>
                      ))}
                    </DemoStokeScrollRow>
                  </DemoStokeScrollSection>
                </div>
              </section>
            </AnimatedSection>

            <section id='section-methodology' className='story-section'>
              <CaseStudySectionTitle as="h2">Methods / The UX Process</CaseStudySectionTitle>
              <DemoStokeMethodList>
                {METHOD_SECTIONS.map(({ title, bullets, image }, index) => (
                  <AnimatedSection
                    key={title}
                    ref={setAnimatedSectionRef(`method-${index}`)}
                    data-animate-id={`method-${index}`}
                    className={visibleSections[`method-${index}`] ? 'visible' : undefined}
                  >
                    <DemoStokeMethodCard>
                      <DemoStokeMethodRow $reverse={index % 2 === 1}>
                        <div className="text-animate">
                          <DemoStokeTldrTitle>{title}</DemoStokeTldrTitle>
                          <DemoStokeTldrCopy>
                            <ul className='plain-lines'>
                              {bullets.map((bullet) => (
                                <li key={bullet}>{bullet}</li>
                              ))}
                            </ul>
                          </DemoStokeTldrCopy>
                        </div>
                        <DemoStokeTldrImage className="image-animate" src={image.src} alt={image.alt} loading='lazy' />
                      </DemoStokeMethodRow>
                    </DemoStokeMethodCard>
                  </AnimatedSection>
                ))}
              </DemoStokeMethodList>
            </section>

            <AnimatedSection
              ref={setAnimatedSectionRef('section-the-who')}
              data-animate-id='section-the-who'
              className={visibleSections['section-the-who'] ? 'visible' : undefined}
            >
              <section id='section-the-who' className='story-section'>
                <CaseStudySectionTitle as="h2">The Who / User Personas</CaseStudySectionTitle>
                <DemoStokeAccordion className="text-animate">
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
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                              role="presentation"
                              focusable="false"
                            >
                              <path d="m6 9 6 6 6-6" />
                            </svg>
                          </DemoStokeAccordionChevron>
                        </DemoStokeAccordionHeader>
                        <DemoStokeAccordionContent
                          id={`${personaId}-content`}
                          role='region'
                          aria-label={`${title} details`}
                          $isOpen={isOpen}
                        >
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
          </SectionsBlock>
        </CaseStudyPageInner>
      </PageShell>
    </div>
  );
};

export default CaseStudyContent;
