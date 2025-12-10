import { OpenInNewWindowIcon } from '@radix-ui/react-icons';
import { type KeyboardEvent, type RefObject } from 'react';
import styled from 'styled-components';
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
  DemoStokeExternalLink,
  FlexBox,
  FullBorderImage,
  PitchDeckLink,
} from '../../../styles';
import SidebarSectionTabs from '../SidebarSectionTabs';
import { AnimatedSection } from '../../../styles/projectShowcases';
import { THEME } from '../../../styles/theme';
import { CASE_STUDY_BOTTOM_SECTION_ID, CASE_STUDY_SECTIONS, HOW_IMAGES, METHOD_SECTIONS, PERSONA_ITEMS, TLDR_ITEMS } from './data';

const OutcomeSection = styled(DemoStokeTldrSection)`
  background: linear-gradient(135deg, rgba(37, 99, 235, 0.14), rgba(0, 113, 227, 0.22));
  border: 1px solid ${THEME.colors.blue};
  box-shadow: 0 26px 48px -32px rgb(0 0 0 / 75%), inset 0 1px 0 rgba(255, 255, 255, 0.06);
`;

const OutcomeHeading = styled(DemoStokeTitle)`
  color: ${THEME.colors.demostoke};
  margin-bottom: 0.35em;
`;

const OutcomeCopy = styled(DemoStokeTldrCopy)`
  font-size: clamp(1.1em, 2vw, 1.35em);
  line-height: 1.85;
  font-weight: 500;
  letter-spacing: 0.01em;
  width: 100%;
`;

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
                <img className='ds-logo' src='/img/squares/at_logo_purple.webp' alt='Antisyphon Training Logo' />
                <div>
                  <h2 className='tab-header page-header'>UX Case Study</h2>
                  <PitchDeckLink className='pitch-link-desktop' href="https://www.antisyphontraining.com/" target='_blank' rel='noopener noreferrer'>
                    AntisyphonTraining.com <OpenInNewWindowIcon aria-hidden="true" />
                  </PitchDeckLink>
                </div>
              </FlexBox>

              <PitchDeckLink className='pitch-link-mobile' href="https://www.antisyphontraining.com/" target='_blank' rel='noopener noreferrer'>
                AntisyphonTraining.com <OpenInNewWindowIcon aria-hidden="true" />
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

                <DemoStokeWhyImageFrame className="image-animate">
                  <FullBorderImage
                    src='/img/antisyphon/home.webp'
                    alt='Antisyphon Training homepage with course cards'
                    loading='lazy'
                  />
                </DemoStokeWhyImageFrame>

                <br />

                <DemoStokeTldrSection className="text-animate">
                  <DemoStokeTldrTitle>TL;DR</DemoStokeTldrTitle>
                  <DemoStokeTldrCopy>
                    I was initially hired as a software engineer at Black Hills Information Security but quickly shifted into reimagining
                    the Antisyphon Training experience. The goal: replace a static marketing site and scattered LMS flows with a cohesive
                    marketplace that serves learners, instructors, corporate buyers, and operations teams.
                  </DemoStokeTldrCopy>
                </DemoStokeTldrSection>

                <br />
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
                ref={setAnimatedSectionRef('section-outcome')}
                data-animate-id='section-outcome'
                className={visibleSections['section-outcome'] ? 'visible' : undefined}
              >
                <section id='section-outcome' className='story-section'>
                  <OutcomeHeading>The Outcome</OutcomeHeading>
                  <OutcomeSection className="text-animate">
                    <OutcomeCopy>
                      We transformed Antisyphon into a full training marketplace with checkout, pay-what-you-can, learner dashboards,
                      and admin tooling. WordPress, WooCommerce, and LMS integrations now power a cohesive experience and cut course
                      setup time by roughly 85%.
                    </OutcomeCopy>
                  </OutcomeSection>
                </section>
              </AnimatedSection>

              <br />

              <AnimatedSection
                ref={setAnimatedSectionRef('section-the-why')}
                data-animate-id='section-the-why'
                className={visibleSections['section-the-why'] ? 'visible' : undefined}
              >
                <section id='section-the-why' className='story-section'>
                  <DemoStokeTitle>The Why / Starting Point</DemoStokeTitle>
                  <DemoStokeBorderBox>
                    <DemoStokeTwoUp className="text-animate">
                      <section id='section-beginning'>
                        <h3>The Beginning</h3>
                        <p>
                          Early on, the Antisyphon site was a collection of marketing pages pointing to third-party platforms.
                          The team needed something more cohesive that matched the playful BHIS brand while staying professional enough
                          for enterprise security buyers.
                        </p>
                        <p>
                          I stepped in to define the product direction, partner with creative directors, and translate ideas into
                          usable flows that could grow beyond a simple brochure site.
                        </p>
                      </section>
                      <section id='section-evolution'>
                        <h3>The Opportunity</h3>
                        <DemoStokeTwoColumnCopy>
                          <div className='plain-lines'>
                            <p>
                              Instead of shipping another static site, we built a true commerce experience with course discovery, a
                              shopping cart, and account dashboards. That meant new flows for live and on-demand courses, donations,
                              and coupons&mdash;all while keeping operations simple.
                            </p>
                          </div>
                        </DemoStokeTwoColumnCopy>
                      </section>
                    </DemoStokeTwoUp>
                    <DemoStokeWhyImageFrame className="image-animate">
                      <FullBorderImage
                        src='/img/antisyphon/wireframe-home.webp'
                        alt='Figma wireframes for the Antisyphon homepage'
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
                  <DemoStokeTitle>The Who / Audiences and Stakeholders</DemoStokeTitle>
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
                  <DemoStokeTitle>The How / End-to-End Experience</DemoStokeTitle>
                  <DemoStokeTldrSection>
                    <DemoStokeTwoUp className="text-animate">
                      <section>
                        <h3>Marketplace and Checkout</h3>
                        <p>
                          Course catalog filters, search, and badge styling make it easy to scan live versus on-demand options. We
                          customized WooCommerce for multi-course carts, donations, pay-what-you-can pricing, and accurate tax handling.
                        </p>
                      </section>
                      <section>
                        <h3>Accounts, LMS, and Billing</h3>
                        <p>
                          Logged-in dashboards separate live and on-demand enrollments, store saved cards, and surface certificates.
                          API integrations keep progress, attendance, and receipts in sync across WordPress, the LMS, and billing systems.
                        </p>
                      </section>
                    </DemoStokeTwoUp>
                    <DemoStokeWhyImageFrame className="image-animate">
                      <FullBorderImage src='/img/antisyphon/course-catalog-full.webp' alt='Antisyphon course catalog layout' loading="lazy" />
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
                    <DemoStokeExternalLink href="https://www.antisyphontraining.com/" target='_blank' rel='noopener noreferrer'>
                      AntisyphonTraining.com <OpenInNewWindowIcon aria-hidden="true" />
                    </DemoStokeExternalLink>
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
