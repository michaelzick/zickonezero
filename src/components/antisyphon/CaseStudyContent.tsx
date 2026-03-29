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
} from '../../../styles';
import SidebarSectionTabs from '../SidebarSectionTabs';
import {
  AnimatedSection,
  CaseStudyHeroMediaFrame,
  CaseStudyIntroOffset,
  CaseStudyHeroLabel,
  CaseStudySectionTitle,
  CaseStudyPageInner,
  HeroContent,
  HeroGrid,
  HiddenSectionAnchor,
  LinkRow,
  PageShell,
  RoleList,
  SectionNavRevealAnchor,
  SectionsBlock,
  ShowcaseImage,
  ShowcaseMediaButton,
  Summary,
  Title,
} from '../../../styles/projectShowcases';
import { THEME } from '../../../styles/theme';
import {
  CASE_STUDY_BOTTOM_SECTION_ID,
  CASE_STUDY_SECTIONS,
  HOW_IMAGES,
  METHOD_SECTIONS,
  PERSONA_ITEMS,
  TLDR_ITEMS
} from './data';

const OutcomeSection = styled(DemoStokeTldrSection)`
  width: 100%;
  padding: clamp(1.1em, 2.8vw, 1.8em) clamp(1.2em, 3vw, 2.1em);
  border-radius: ${THEME.radii.md};
  background: linear-gradient(135deg, rgba(37, 99, 235, 0.14), rgba(0, 113, 227, 0.22));
  border: 1px solid ${THEME.colors.blue};
  box-shadow: 0 26px 48px -32px rgb(0 0 0 / 75%), inset 0 1px 0 rgba(255, 255, 255, 0.06);
`;

const OutcomeCopy = styled(DemoStokeTldrCopy)`
  font-size: clamp(1.1em, 2vw, 1.35em);
  line-height: 1.85;
  font-weight: 500;
  letter-spacing: 0.01em;
  width: 100%;
`;

const MethodImages = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.8em;
`;

const MethodImageButton = styled.button`
  display: block;
  width: 100%;
  padding: 0;
  border: none;
  background: transparent;
  cursor: pointer;
  text-align: left;
  border-radius: ${THEME.radii.md};

  &:focus-visible {
    outline: 2px solid ${THEME.colors.demostoke};
    outline-offset: 4px;
  }
`;

const MethodImageFrame = styled.div`
  position: relative;
  width: 100%;
  aspect-ratio: 4 / 3;
  border-radius: ${THEME.radii.md};
  border: 1.5px solid ${THEME.colors.grey};
  overflow: hidden;
  box-shadow: 0 30px 38px -30px rgb(0 0 0 / 75%);
  background: ${THEME.colors.darkest};
  transition: border-color 0.18s ease, box-shadow 0.18s ease;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }

  ${MethodImageButton}:hover &,
  ${MethodImageButton}:focus-visible & {
    border-color: ${THEME.colors.hotRed};
    box-shadow: 0 24px 48px -32px rgb(0 0 0 / 70%), 0 0 0 1px ${THEME.colors.hotRed};
  }
`;

const ROLE_BULLETS = [
  'Product strategy',
  'UX design',
  'WordPress and WooCommerce engineering'
];

const INTRO_SUMMARY = 'Antisyphon Training is a cohesive marketplace experience for live, on-demand, and pay-what-you-can security education.';

type CaseStudyContentProps = {
  setAnimatedSectionRef: (id: string) => (el: HTMLDivElement | null) => void;
  visibleSections: Record<string, boolean>;
  scrollRowRef: RefObject<HTMLDivElement | null>;
  canScrollLeft: boolean;
  canScrollRight: boolean;
  scrollGalleryBy: (direction: number) => void;
  openLightbox: (index: number) => void;
  openMethodLightbox: (index: number) => void;
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
  openMethodLightbox,
  openPersonaId,
  togglePersona,
  topTabsEl,
  isActive
}: CaseStudyContentProps) => {
  const methodImageOffsets = METHOD_SECTIONS.reduce<number[]>((offsets, _section, idx) => {
    const priorCount = idx > 0 ? METHOD_SECTIONS[idx - 1]?.images.length ?? 0 : 0;
    const previous = offsets[idx - 1] ?? 0;
    offsets[idx] = idx === 0 ? 0 : previous + priorCount;
    return offsets;
  }, []);
  const lightboxOffset = TLDR_ITEMS.length;

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
                  <ShowcaseMediaButton
                    type='button'
                    aria-label='Open image: Antisyphon Training homepage with course cards'
                    onClick={() => openLightbox(0)}
                  >
                    <CaseStudyHeroMediaFrame className='image-animate'>
                      <img
                        src='/img/antisyphon/home.webp'
                        alt='Antisyphon Training homepage with course cards'
                        loading='lazy'
                      />
                    </CaseStudyHeroMediaFrame>
                  </ShowcaseMediaButton>

                  <HeroContent className='text-animate'>
                    <Title>Antisyphon UX Case Study</Title>

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
                        <a href="https://www.antisyphontraining.com/" target='_blank' rel='noopener noreferrer'>
                          AntisyphonTraining.com <OpenInNewWindowIcon aria-hidden="true" />
                        </a>
                      </div>
                    </LinkRow>
                  </HeroContent>
                </HeroGrid>

                <SectionNavRevealAnchor id='antisyphon-case-study-nav-anchor' aria-hidden='true' />
              </section>
            </AnimatedSection>
          </CaseStudyIntroOffset>

          <SidebarSectionTabs
            sections={CASE_STUDY_SECTIONS}
            topTabsEl={topTabsEl}
            isActive={isActive}
            lockToBottomSectionId={CASE_STUDY_BOTTOM_SECTION_ID}
            scrollOffsetAdjustment={8}
            desktopRevealAnchorId='antisyphon-case-study-nav-anchor'
          />

          <SectionsBlock as='div'>
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
                          <div className='text-animate'>
                            <DemoStokeTldrTitle>{title}</DemoStokeTldrTitle>
                            <DemoStokeTldrCopy>{description}</DemoStokeTldrCopy>
                          </div>
                          <ShowcaseImage
                            className='image-animate'
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
              </section>
            </AnimatedSection>

            <AnimatedSection
              ref={setAnimatedSectionRef('section-outcome')}
              data-animate-id='section-outcome'
              className={visibleSections['section-outcome'] ? 'visible' : undefined}
            >
              <section id='section-outcome' className='story-section'>
                <CaseStudySectionTitle as='h2'>The Outcome</CaseStudySectionTitle>
                <OutcomeSection className='text-animate'>
                  <OutcomeCopy>
                    <ul className='plain-lines'>
                      <li>Increased enrollments by 49%</li>
                      <li>Reduced customer support tickets by 67%</li>
                      <li>Cut course setup time by 85%</li>
                    </ul>
                  </OutcomeCopy>
                </OutcomeSection>
              </section>
            </AnimatedSection>

            <AnimatedSection
              ref={setAnimatedSectionRef('section-the-who')}
              data-animate-id='section-the-who'
              className={visibleSections['section-the-who'] ? 'visible' : undefined}
            >
              <section id='section-the-who' className='story-section'>
                <CaseStudySectionTitle as='h2'>The Who / Audiences and Stakeholders</CaseStudySectionTitle>
                <DemoStokeAccordion className='text-animate'>
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
                <CaseStudySectionTitle as='h2'>The How / End-to-End Experience</CaseStudySectionTitle>
                <DemoStokeTldrSection>
                  <DemoStokeTwoUp className='text-animate'>
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

                  <div className='image-animate' style={{ marginTop: 'clamp(1.2em, 3vw, 1.75em)' }}>
                    <DemoStokeTldrImage
                      src='/img/antisyphon/course-catalog-full.webp'
                      alt='Antisyphon course catalog layout'
                      loading='lazy'
                    />
                  </div>
                </DemoStokeTldrSection>

                <AnimatedSection
                  ref={setAnimatedSectionRef('section-how-gallery')}
                  data-animate-id='section-how-gallery'
                  className={visibleSections['section-how-gallery'] ? 'visible' : undefined}
                >
                  <div style={{ marginTop: 'clamp(1.35em, 3vw, 2em)' }}>
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
                      <DemoStokeScrollRow ref={scrollRowRef} aria-label='Antisyphon screenshot carousel'>
                        {HOW_IMAGES.map(({ src, alt }, index) => (
                          <DemoStokeScrollItem
                            key={src}
                            onClick={() => openLightbox(lightboxOffset + index)}
                            role='button'
                            tabIndex={0}
                            aria-label={`Open image: ${alt}`}
                            onKeyDown={(event: KeyboardEvent<HTMLDivElement>) => {
                              if (event.key === 'Enter' || event.key === ' ') {
                                event.preventDefault();
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
                </AnimatedSection>
              </section>
            </AnimatedSection>

            <section id='section-methodology' className='story-section'>
              <CaseStudySectionTitle as='h2'>Methods / The UX Process</CaseStudySectionTitle>
              <DemoStokeMethodList>
                {METHOD_SECTIONS.map(({ title, bullets, images }, index) => (
                  <AnimatedSection
                    key={title}
                    ref={setAnimatedSectionRef(`method-${index}`)}
                    data-animate-id={`method-${index}`}
                    className={visibleSections[`method-${index}`] ? 'visible' : undefined}
                  >
                    <DemoStokeMethodCard>
                      <DemoStokeMethodRow $reverse={index % 2 === 1}>
                        <div className='text-animate'>
                          <DemoStokeTldrTitle>{title}</DemoStokeTldrTitle>
                          <DemoStokeTldrCopy>
                            <ul className='plain-lines'>
                              {bullets.map((bullet) => (
                                <li key={bullet}>{bullet}</li>
                              ))}
                            </ul>
                          </DemoStokeTldrCopy>
                        </div>
                        <MethodImages className='image-animate'>
                          {images.map((image, imageIndex) => {
                            const globalIndex = (methodImageOffsets[index] ?? 0) + imageIndex;
                            return (
                              <MethodImageButton
                                key={image.src}
                                type='button'
                                onClick={() => openMethodLightbox(globalIndex)}
                                aria-label={`Open image: ${image.alt}`}
                              >
                                <MethodImageFrame>
                                  <img src={image.src} alt={image.alt} loading='lazy' />
                                </MethodImageFrame>
                              </MethodImageButton>
                            );
                          })}
                        </MethodImages>
                      </DemoStokeMethodRow>
                    </DemoStokeMethodCard>
                  </AnimatedSection>
                ))}
              </DemoStokeMethodList>
            </section>

            <section id='section-links' className='story-section'>
              <CaseStudySectionTitle as='h2'>Links</CaseStudySectionTitle>
              <DemoStokeTldrCopy>
                <a href='https://www.antisyphontraining.com/' target='_blank' rel='noopener noreferrer'>
                  AntisyphonTraining.com <OpenInNewWindowIcon aria-hidden='true' />
                </a>
              </DemoStokeTldrCopy>
            </section>
          </SectionsBlock>
        </CaseStudyPageInner>
      </PageShell>
    </div>
  );
};

export default CaseStudyContent;
