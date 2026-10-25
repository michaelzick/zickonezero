import { type KeyboardEvent, type RefObject } from 'react';
import { OpenInNewWindowIcon } from '@radix-ui/react-icons';

import SidebarSectionTabs from '../SidebarSectionTabs';
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
  DemoStokeTwoUp
} from '../../../styles';
import {
  AntisyphonGalleryBlock,
  AntisyphonHeroImageWrap,
  AntisyphonSectionSubheading,
  MethodImageButton,
  MethodImageFrame,
  MethodImages,
  OutcomeCopy
} from '../../../styles/antisyphon';
import { DemoStokeWhatImage } from '../../../styles/demostoke';
import {
  PhoneImage,
  PhoneMethodImage,
  PhoneMethodImageButton,
  PhoneMethodImages,
  PhoneScrollImage,
  PhoneScrollItem
} from '../../../styles/phoneScreens';
import {
  AnimatedSection,
  CaseStudyHeroLabel,
  CaseStudyHeroMediaFrame,
  CaseStudyIntroOffset,
  CaseStudyPageInner,
  CaseStudySectionTitle,
  HeroContent,
  HeroGrid,
  HiddenSectionAnchor,
  LinkRow,
  PageShell,
  RoleList,
  SectionNavRevealAnchor,
  SectionsBlock,
  Summary,
  Title
} from '../../../styles/projectShowcases';
import { trackEvent, trackLinkClick } from '../../lib/analytics';
import { heroImageSources } from '../../lib/responsiveImages';
import { SetAnimatedSectionRef, VisibleSections } from '../showcaseTypes';
import { CASE_STUDY_BOTTOM_SECTION_ID, CASE_STUDY_SECTIONS } from './sections';
import { type CaseStudyData, type CaseStudyImage } from './types';

type SectionProps = {
  study: CaseStudyData;
  setAnimatedSectionRef: SetAnimatedSectionRef;
  visibleSections: VisibleSections;
};

const isPhoneSet = (images: CaseStudyImage[]) => images.length > 0 && images.every(({ portrait }) => portrait);

const IntroSection = ({ study, setAnimatedSectionRef, visibleSections }: SectionProps) => {
  const { name, analyticsId, intro } = study;
  return (
    <AnimatedSection
      ref={setAnimatedSectionRef('section-intro')}
      data-animate-id='section-intro'
      data-reveal='load'
      className={visibleSections['section-intro'] ? 'visible' : undefined}
    >
      <section id='introduction' className='story-section'>
        <HiddenSectionAnchor id='hero-spacer' aria-hidden='true' />
        <HeroGrid>
          <CaseStudyHeroMediaFrame className='image-animate' style={{ backgroundColor: intro.imageBackground }}>
            <img src={intro.image.src} {...heroImageSources(intro.image.src)} alt={intro.image.alt} loading='eager' fetchPriority='high' />
          </CaseStudyHeroMediaFrame>
          <HeroContent className='text-animate'>
            <Title>{name}<br />UX Case Study</Title>
            <div>
              <CaseStudyHeroLabel>Description</CaseStudyHeroLabel>
              <Summary>{intro.summary}</Summary>
            </div>
            <div>
              <CaseStudyHeroLabel>My Roles</CaseStudyHeroLabel>
              <RoleList>
                {intro.roles.map((role) => (
                  <li key={role}>{role}</li>
                ))}
              </RoleList>
            </div>
            <LinkRow>
              <CaseStudyHeroLabel>{intro.links.length > 1 ? 'Project Links' : 'Project Link'}</CaseStudyHeroLabel>
              <div>
                {intro.links.map(({ label, href }) => (
                  <a
                    key={href}
                    href={href}
                    target='_blank'
                    rel='noopener noreferrer'
                    onClick={() => {
                      trackLinkClick({
                        location: 'case_study_hero',
                        label,
                        href,
                        section: `${name} UX Case Study`,
                      });
                      trackEvent('external_project_click', {
                        location: `${analyticsId}_case_study`,
                        label,
                        href,
                        page_path: window.location.pathname,
                      });
                    }}
                  >
                    {label} <OpenInNewWindowIcon aria-hidden='true' />
                  </a>
                ))}
              </div>
            </LinkRow>
          </HeroContent>
        </HeroGrid>
        <SectionNavRevealAnchor id={`${study.id}-case-study-nav-anchor`} aria-hidden='true' />
      </section>
    </AnimatedSection>
  );
};

const WhatSection = ({ study, setAnimatedSectionRef, visibleSections }: SectionProps) => (
  <AnimatedSection
    ref={setAnimatedSectionRef('section-the-what')}
    data-animate-id='section-the-what'
    className={visibleSections['section-the-what'] ? 'visible' : undefined}
  >
    <section id='section-the-what' className='story-section'>
      <CaseStudySectionTitle as='h2'>The What</CaseStudySectionTitle>
      <DemoStokeTldrSection>
        <DemoStokeTldrList>
          {study.what.map(({ title, description, image }, index) => {
            const WhatImage = image.portrait ? PhoneImage : DemoStokeWhatImage;
            return (
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
                  <WhatImage className='image-animate' src={image.src} alt={image.alt} loading='lazy' />
                </DemoStokeTldrRow>
              </AnimatedSection>
            );
          })}
        </DemoStokeTldrList>
      </DemoStokeTldrSection>
    </section>
  </AnimatedSection>
);

type HowSectionProps = SectionProps & {
  scrollRowRef: RefObject<HTMLDivElement | null>;
  canScrollLeft: boolean;
  canScrollRight: boolean;
  scrollGalleryBy: (direction: number) => void;
  openLightbox: (index: number) => void;
};

const HowSection = ({
  study,
  setAnimatedSectionRef,
  visibleSections,
  scrollRowRef,
  canScrollLeft,
  canScrollRight,
  scrollGalleryBy,
  openLightbox
}: HowSectionProps) => {
  const { how } = study;
  // Gallery images follow the What images in the lightbox sources.
  const lightboxOffset = study.what.length;
  const HowImage = how.image.portrait ? PhoneImage : DemoStokeTldrImage;
  return (
    <AnimatedSection
      ref={setAnimatedSectionRef('section-the-how')}
      data-animate-id='section-the-how'
      className={visibleSections['section-the-how'] ? 'visible' : undefined}
    >
      <section id='section-the-how' className='story-section'>
        <CaseStudySectionTitle as='h2'>The How / {how.heading}</CaseStudySectionTitle>
        <DemoStokeTldrSection>
          <DemoStokeTwoUp className='text-animate'>
            {how.columns.map(({ title, copy }) => (
              <section key={title}>
                <h3>{title}</h3>
                <p>{copy}</p>
              </section>
            ))}
          </DemoStokeTwoUp>
          <AntisyphonHeroImageWrap className='image-animate'>
            <HowImage src={how.image.src} alt={how.image.alt} loading='lazy' />
          </AntisyphonHeroImageWrap>
        </DemoStokeTldrSection>
        <AnimatedSection
          ref={setAnimatedSectionRef('section-how-gallery')}
          data-animate-id='section-how-gallery'
          className={visibleSections['section-how-gallery'] ? 'visible' : undefined}
        >
          <AntisyphonGalleryBlock>
            <DemoStokeScrollHeader>
              <AntisyphonSectionSubheading>Screenshots</AntisyphonSectionSubheading>
              <DemoStokeScrollControls aria-label='Gallery navigation'>
                <DemoStokeScrollButton type='button' onClick={() => scrollGalleryBy(-1)} disabled={!canScrollLeft} aria-label='Scroll left'>
                  <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' aria-hidden='true' focusable='false'>
                    <path d='m14 18-6-6 6-6' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' />
                  </svg>
                </DemoStokeScrollButton>
                <DemoStokeScrollButton type='button' onClick={() => scrollGalleryBy(1)} disabled={!canScrollRight} aria-label='Scroll right'>
                  <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' aria-hidden='true' focusable='false'>
                    <path d='m10 6 6 6-6 6' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' />
                  </svg>
                </DemoStokeScrollButton>
              </DemoStokeScrollControls>
            </DemoStokeScrollHeader>
            <DemoStokeScrollSection>
              <DemoStokeScrollRow ref={scrollRowRef} aria-label={`${study.name} screenshot carousel`}>
                {how.gallery.map(({ src, alt, portrait }, index) => {
                  const ScrollItem = portrait ? PhoneScrollItem : DemoStokeScrollItem;
                  const ScrollImage = portrait ? PhoneScrollImage : DemoStokeScrollImage;
                  return (
                    <ScrollItem
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
                      <ScrollImage src={src} alt={alt} loading='lazy' />
                    </ScrollItem>
                  );
                })}
              </DemoStokeScrollRow>
            </DemoStokeScrollSection>
          </AntisyphonGalleryBlock>
        </AnimatedSection>
      </section>
    </AnimatedSection>
  );
};

type WhoSectionProps = SectionProps & {
  openPersonaId: string | null;
  togglePersona: (id: string) => void;
};

const WhoSection = ({
  study,
  setAnimatedSectionRef,
  visibleSections,
  openPersonaId,
  togglePersona
}: WhoSectionProps) => (
  <AnimatedSection
    ref={setAnimatedSectionRef('section-the-who')}
    data-animate-id='section-the-who'
    className={visibleSections['section-the-who'] ? 'visible' : undefined}
  >
    <section id='section-the-who' className='story-section'>
      <CaseStudySectionTitle as='h2'>The Who / Audiences and Stakeholders</CaseStudySectionTitle>
      <DemoStokeAccordion className='text-animate'>
        {study.personas.map(({ title, bullets }) => {
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
                  <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' role='presentation' focusable='false'>
                    <path d='m6 9 6 6 6-6' />
                  </svg>
                </DemoStokeAccordionChevron>
              </DemoStokeAccordionHeader>
              <DemoStokeAccordionContent id={`${personaId}-content`} role='region' aria-label={`${title} details`} $isOpen={isOpen}>
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
);

type MethodsSectionProps = SectionProps & {
  openMethodLightbox: (index: number) => void;
};

const MethodsSection = ({ study, setAnimatedSectionRef, visibleSections, openMethodLightbox }: MethodsSectionProps) => {
  let imageOffset = 0;
  return (
    <section id='section-methodology' className='story-section'>
      <CaseStudySectionTitle as='h2'>Methods / The UX Process</CaseStudySectionTitle>
      <DemoStokeMethodList>
        {study.methods.map(({ title, bullets, images }, index) => {
          const offset = imageOffset;
          imageOffset += images.length;
          const phones = isPhoneSet(images);
          const Images = phones ? PhoneMethodImages : MethodImages;
          return (
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
                  <Images className='image-animate'>
                    {images.map((image, imageIndex) => {
                      const open = () => openMethodLightbox(offset + imageIndex);
                      const label = `Open image: ${image.alt}`;
                      return phones ? (
                        <PhoneMethodImageButton key={image.src} type='button' onClick={open} aria-label={label}>
                          <PhoneMethodImage src={image.src} alt={image.alt} loading='lazy' />
                        </PhoneMethodImageButton>
                      ) : (
                        <MethodImageButton key={image.src} type='button' onClick={open} aria-label={label}>
                          <MethodImageFrame>
                            <img src={image.src} alt={image.alt} loading='lazy' />
                          </MethodImageFrame>
                        </MethodImageButton>
                      );
                    })}
                  </Images>
                </DemoStokeMethodRow>
              </DemoStokeMethodCard>
            </AnimatedSection>
          );
        })}
      </DemoStokeMethodList>
    </section>
  );
};

const OutcomeSection = ({ study, setAnimatedSectionRef, visibleSections }: SectionProps) => (
  <AnimatedSection
    ref={setAnimatedSectionRef('section-outcome')}
    data-animate-id='section-outcome'
    className={visibleSections['section-outcome'] ? 'visible' : undefined}
  >
    <section id='section-outcome' className='story-section'>
      <CaseStudySectionTitle as='h2'>The Outcome</CaseStudySectionTitle>
      <DemoStokeTldrSection className='text-animate'>
        <OutcomeCopy>
          <ul className='plain-lines'>
            {study.outcome.map((line, index) => (
              <li key={index}>{line}</li>
            ))}
          </ul>
        </OutcomeCopy>
      </DemoStokeTldrSection>
    </section>
  </AnimatedSection>
);

type CaseStudyTabProps = SectionProps & {
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

const CaseStudyTab = ({
  study,
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
}: CaseStudyTabProps) => {
  const sectionProps = { study, setAnimatedSectionRef, visibleSections };
  return (
    <div id='case-study-content' role='tabpanel' aria-labelledby='tab-case-study' hidden={!isActive}>
      <PageShell>
        <CaseStudyPageInner className='demostoke-inner'>
          <CaseStudyIntroOffset>
            <IntroSection {...sectionProps} />
          </CaseStudyIntroOffset>
          <SidebarSectionTabs
            sections={CASE_STUDY_SECTIONS}
            topTabsEl={topTabsEl}
            isActive={isActive}
            lockToBottomSectionId={CASE_STUDY_BOTTOM_SECTION_ID}
            scrollOffsetAdjustment={8}
            desktopRevealAnchorId={`${study.id}-case-study-nav-anchor`}
          />
          <SectionsBlock as='div'>
            <WhatSection {...sectionProps} />
            <HowSection
              {...sectionProps}
              scrollRowRef={scrollRowRef}
              canScrollLeft={canScrollLeft}
              canScrollRight={canScrollRight}
              scrollGalleryBy={scrollGalleryBy}
              openLightbox={openLightbox}
            />
            <WhoSection {...sectionProps} openPersonaId={openPersonaId} togglePersona={togglePersona} />
            <MethodsSection {...sectionProps} openMethodLightbox={openMethodLightbox} />
            <OutcomeSection {...sectionProps} />
          </SectionsBlock>
        </CaseStudyPageInner>
      </PageShell>
    </div>
  );
};

export default CaseStudyTab;
