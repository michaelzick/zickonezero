import { OpenInNewWindowIcon } from '@radix-ui/react-icons';
import { type KeyboardEvent, type RefObject } from 'react';
import {
  BioBox,
  DemoStokeAccordion,
  DemoStokeAccordionChevron,
  DemoStokeAccordionContent,
  DemoStokeAccordionCopy,
  DemoStokeAccordionHeader,
  DemoStokeAccordionItem,
  DemoStokeAccordionTitle,
  DemoStokeBorderBox,
  DemoStokeContentGrid,
  DemoStokeList,
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
  DemoStokeTitle,
  DemoStokeTldrCopy,
  DemoStokeTldrImage,
  DemoStokeTldrList,
  DemoStokeTldrRow,
  DemoStokeTldrSection,
  DemoStokeTldrTitle,
  DemoStokeTwoColumnCopy,
  DemoStokeTwoUp,
  DemoStokeWhyImageFrame,
  FlexBox,
  FullBorderImage,
  PitchDeckLink,
  Video,
  VideoFrame,
  WhiteTransitionAnchor
} from '../../../styles';
import SidebarSectionTabs from '../SidebarSectionTabs';
import { AnimatedSection } from '../../../styles/projectShowcases';
import { CASE_STUDY_SECTIONS, CASE_STUDY_BOTTOM_SECTION_ID, HOW_IMAGES, METHOD_SECTIONS, PERSONA_ITEMS, TLDR_ITEMS } from './data.tsx';

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
      <BioBox direction='right' noBottomPadding top>
        <div className='biobox-inner demostoke-inner'>
          <DemoStokeContentGrid>
            <div>
              <FlexBox>
                <img className='ds-logo' src='/img/squares/demostoke-logo-square.webp' alt='DemoStoke Logo' />
                <div>
                  <h2 className='tab-header page-header'>UX Case Study</h2>
                  <PitchDeckLink className='pitch-link-desktop' href="https://www.demostoke.com/" target='_blank' rel='noopener noreferrer'>
                    DemoStoke.com <OpenInNewWindowIcon aria-hidden="true" />
                  </PitchDeckLink>
                </div>
              </FlexBox>

              <PitchDeckLink className='pitch-link-mobile' href="https://www.demostoke.com/" target='_blank' rel='noopener noreferrer'>
                DemoStoke.com <OpenInNewWindowIcon aria-hidden="true" />
              </PitchDeckLink>

              <section id='hero-spacer' aria-hidden='true' />

              <AnimatedSection
                ref={setAnimatedSectionRef('section-intro')}
                data-animate-id='section-intro'
                className={visibleSections['section-intro'] ? 'visible' : undefined}
              >
                <section id='introduction' className='story-section'>
                  <DemoStokeTitle $noMobileTopPad>Introduction</DemoStokeTitle>
                </section>

                <VideoFrame>
                  <Video
                    autoPlay
                    loop
                    muted
                    playsInline
                    poster='/img/homepage_light_2025-07-22.webp'
                  >
                    <source src='/video/homepage-2025-11-23-02.mp4' type='video/mp4' />
                  </Video>
                </VideoFrame>
                <br />
              </AnimatedSection>

              <AnimatedSection
                ref={setAnimatedSectionRef('section-intro-tldr')}
                data-animate-id='section-intro-tldr'
                className={visibleSections['section-intro-tldr'] ? 'visible' : undefined}
              >
                <DemoStokeTldrSection>
                  <DemoStokeTldrTitle>TL;DR</DemoStokeTldrTitle>
                  <DemoStokeTldrCopy>
                    Riders and shops struggle with fragmented, offline demo and rental flows. I designed DemoStoke to be a unified
                    marketplace to solve those issues. In validation sessions, 90% of shop owners said it would bring them more
                    customers, and 100% of riders described it as &ldquo;the thing that should already exist.&rdquo;
                  </DemoStokeTldrCopy>
                </DemoStokeTldrSection>
              </AnimatedSection>

              <section id='section-tldr' className='story-section'>
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
                          <DemoStokeTldrImage className="image-animate" src={image.src} alt={image.alt} loading='lazy' />
                        </DemoStokeTldrRow>
                      </AnimatedSection>
                    ))}
                  </DemoStokeTldrList>
                </DemoStokeTldrSection>
              </section>

              <br />

              <AnimatedSection
                ref={setAnimatedSectionRef('section-the-why')}
                data-animate-id='section-the-why'
                className={visibleSections['section-the-why'] ? 'visible' : undefined}
              >
                <section id='section-the-why' className='story-section'>
                  <DemoStokeTitle>The Why / How It Started</DemoStokeTitle>
                  <DemoStokeBorderBox>
                    <DemoStokeTwoUp className="text-animate">
                      <section id='section-problem'>
                        <h3>My Story</h3>
                      <p>
                        For the longest time, I struggled to find a way to try new gear without the hassle of traditional
                        demo days or the uncertainty of buying blind. I knew there had to be a better way for riders like
                        me to connect with gear they wanted to test out before making a pricey purchase.
                        <br />
                        <br />
                        It started with surfboards. I’d buy boards off Craigslist, hoping they’d match my style and skill
                        level—or I’d sink a lot of money on a new board because it looked cool or was a popular model.
                      </p>
                    </section>
                    <section id='section-complaints'>
                      <h3>Is There a Better Way?</h3>
                      <DemoStokeTwoColumnCopy>
                        <div className='plain-lines'>
                          <p>I started playing with ideas, and years before I built DemoStoke, I created designs for a peer-to-peer
                            lending app called <em>Stuf</em>. It wasn’t specific to action sports gear, but it planted the seed
                            for what DemoStoke would eventually become.
                            <br />
                            <br />
                            In late 2023, after demoing a Capita DOA snowboard at Palisades Tahoe and loving it, I realized
                            the power of trying before buying. I thought, why not create a platform that makes this process
                            seamless for everyone?
                          </p>
                        </div>
                      </DemoStokeTwoColumnCopy>
                    </section>
                  </DemoStokeTwoUp>
                  <DemoStokeWhyImageFrame className="image-animate">
                    <FullBorderImage
                      src='/img/demostoke/stuf-figma.webp'
                      alt='Early Stuf peer-to-peer gear lending concepts in Figma'
                      loading='lazy'
                    />
                  </DemoStokeWhyImageFrame>
                  </DemoStokeBorderBox>
                </section>
              </AnimatedSection>

              <br />

              <AnimatedSection
                ref={setAnimatedSectionRef('section-the-who')}
                data-animate-id='section-the-who'
                className={visibleSections['section-the-who'] ? 'visible' : undefined}
              >
                <section id='section-the-who' className='story-section'>
                  <DemoStokeTitle>The Who / User Personas</DemoStokeTitle>
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

              <br />

              <AnimatedSection
                ref={setAnimatedSectionRef('section-the-how')}
                data-animate-id='section-the-how'
                className={visibleSections['section-the-how'] ? 'visible' : undefined}
              >
                <section id='section-the-how' className='story-section'>
                  <DemoStokeTitle>The How / AI-Driven Development</DemoStokeTitle>
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
                      <p>Using Lovable.dev, I was able to spin up the app’s foundation with a well-written prompt, then iterated
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
                </section>
              </AnimatedSection>

              <AnimatedSection
                ref={setAnimatedSectionRef('section-how-gallery')}
                data-animate-id='section-how-gallery'
                className={visibleSections['section-how-gallery'] ? 'visible' : undefined}
              >
                <section id='section-how-gallery'>
                <DemoStokeScrollHeader>
                  <h3>Screenshots</h3>
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
                  <DemoStokeScrollRow ref={scrollRowRef}>
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
                </section>
              </AnimatedSection>

              <br />

              <section id='section-methodology' className='story-section'>
                <DemoStokeTitle>Methods / The UX Process</DemoStokeTitle>
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

              <section id='section-links' className='story-section'>
                <h3>Links</h3>
                <DemoStokeList>
                  <li className='next-steps'>
                    <WhiteTransitionAnchor href="https://www.demostoke.com/" target='_blank' rel='noopener noreferrer'>
                      See the full site
                    </WhiteTransitionAnchor>
                  </li>
                </DemoStokeList>
              </section>
              <br />
              <br />
            </div>
            <SidebarSectionTabs
              sections={CASE_STUDY_SECTIONS}
              topTabsEl={topTabsEl}
              isActive={isActive}
              lockToBottomSectionId={CASE_STUDY_BOTTOM_SECTION_ID}
              scrollOffsetAdjustment={8}
            />
          </DemoStokeContentGrid>
        </div>
      </BioBox>
    </div>
  );
};

export default CaseStudyContent;
