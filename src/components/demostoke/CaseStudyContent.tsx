import { OpenInNewWindowIcon } from '@radix-ui/react-icons';
import { type KeyboardEvent, type RefObject } from 'react';
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
  CaseStudyPageInner,
  HeroContent,
  HeroGrid,
  HeroLabel,
  HeroMediaFrame,
  LinkRow,
  PageShell,
  RoleList,
  SectionNavRevealAnchor,
  SectionTitle,
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

const INTRO_SUMMARY = 'Riders and shops struggle with fragmented, offline demo and rental flows. I designed DemoStoke to be a unified marketplace to solve those issues. In validation sessions, 90% of shop owners said it would bring them more customers, and 100% of riders described it as "the thing that should already exist."';

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
  const lightboxOffset = TLDR_ITEMS.length;

  return (
    <div id="executive-content">
      <PageShell>
        <CaseStudyPageInner className='demostoke-inner'>
          <section id='hero-spacer' aria-hidden='true' />

          <AnimatedSection
            ref={setAnimatedSectionRef('section-intro')}
            data-animate-id='section-intro'
            className={visibleSections['section-intro'] ? 'visible' : undefined}
          >
            <section id='introduction' className='story-section'>
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
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1em', marginBottom: '0.25em' }}>
                    <img className='ds-logo' src='/img/squares/demostoke-logo-square.webp' alt='DemoStoke Logo' />
                    <HeroLabel>UX Case Study</HeroLabel>
                  </div>

                  <Title>DemoStoke UX Case Study</Title>

                  <div>
                    <HeroLabel>Description</HeroLabel>
                    <Summary>{INTRO_SUMMARY}</Summary>
                  </div>

                  <div>
                    <HeroLabel>My Roles</HeroLabel>
                    <RoleList>
                      {ROLE_BULLETS.map((bullet) => (
                        <li key={bullet}>{bullet}</li>
                      ))}
                    </RoleList>
                  </div>

                  <LinkRow>
                    <HeroLabel>Project Link</HeroLabel>
                    <div>
                      <a href="https://www.demostoke.com/" target='_blank' rel='noopener noreferrer'>
                        DemoStoke.com <OpenInNewWindowIcon aria-hidden="true" />
                      </a>
                    </div>
                  </LinkRow>
                </HeroContent>
              </HeroGrid>

              <div style={{ marginTop: 'clamp(1.8em, 4vw, 3em)' }}>
                <DemoStokeTldrSection>
                  <DemoStokeTldrTitle>Highlights</DemoStokeTldrTitle>
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
                          <DemoStokeTldrImage
                            className="image-animate"
                            src={image.src}
                            alt={image.alt}
                            loading='lazy'
                            role='button'
                            tabIndex={0}
                            onClick={() => openLightbox(index)}
                            onKeyDown={(event: KeyboardEvent<HTMLImageElement>) => {
                              if (event.key === 'Enter' || event.key === ' ') {
                                event.preventDefault();
                                openLightbox(index);
                              }
                            }}
                          />
                        </DemoStokeTldrRow>
                      </AnimatedSection>
                    ))}
                  </DemoStokeTldrList>
                </DemoStokeTldrSection>
              </div>
            </section>
          </AnimatedSection>

          <SectionNavRevealAnchor id='demostoke-case-study-nav-anchor' aria-hidden='true' />

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
              ref={setAnimatedSectionRef('section-the-who')}
              data-animate-id='section-the-who'
              className={visibleSections['section-the-who'] ? 'visible' : undefined}
            >
              <section id='section-the-who' className='story-section'>
                <SectionTitle as="h2">The Who / User Personas</SectionTitle>
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

            <AnimatedSection
              ref={setAnimatedSectionRef('section-the-how')}
              data-animate-id='section-the-how'
              className={visibleSections['section-the-how'] ? 'visible' : undefined}
            >
              <section id='section-the-how' className='story-section'>
                <SectionTitle as="h2">The How / AI-Driven Development</SectionTitle>
                <DemoStokeTldrSection>
                  <DemoStokeTwoUp className="text-animate">
                    <section>
                      <h3>Location-Based Discovery</h3>
                      <p>
                        With DemoStoke, I created a comprehensive gear discovery and rental platform that connects riders with
                        demo opportunities in their area.
                        <br />
                        <br />
                        By leveraging location-based services, DemoStoke helps riders find available gear to try before they buy,
                        while also providing a marketplace for gear owners to list their equipment for rent.
                        <br />
                        <br />
                        Additionally, shop owners can easily manage their demo inventory and track rentals through an intuitive
                        admin dashboard.
                      </p>
                    </section>
                    <section>
                      <h3>Rapid Prototyping with AI</h3>
                      <p>
                        Using Lovable.dev, I was able to spin up the app’s foundation with a well-written prompt, then iterated
                        rapidly to refine features and user experience.
                        <br />
                        <br />
                        By combining AI-generated code, my years of front-end development experience, and a database integration,
                        I created a fully-functional web application complete with signup/login, user and admin dashboards, and
                        geolocation services with OpenAI API integrations.
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
                              onClick={() => openLightbox(lightboxOffset + index)}
                              role='button'
                              tabIndex={0}
                              aria-label={`Open image: ${alt}`}
                              onKeyDown={(e: KeyboardEvent<HTMLDivElement>) => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                  e.preventDefault();
                                  openLightbox(lightboxOffset + index);
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
              <SectionTitle as="h2">Methods / The UX Process</SectionTitle>
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
          </SectionsBlock>
        </CaseStudyPageInner>
      </PageShell>
    </div>
  );
};

export default CaseStudyContent;
