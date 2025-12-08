import { useState, useEffect, useCallback, useRef, type ReactNode, type KeyboardEvent } from 'react';
import FsLightbox from 'fslightbox-react';
import { OpenInNewWindowIcon } from '@radix-ui/react-icons';
import {
  useAppDispatch,
  useAppSelector
} from '../hooks';
import {
  showMobileMenu,
  getMobileMenuState
} from '../showMobileMenuSlice';
import { scrollToTop } from '../helpers';

import {
  BioBox,
  Wrapper,
  DemoStokeList,
  WhiteTransitionAnchor,
  FlexBox,
  PitchDeckLink,
  Video,
  VideoFrame,
  FullBorderImage,
  DemoStokeContentGrid,
  DemoStokeTitle,
  DemoStokeTwoColumnCopy,
  DemoStokeTldrList,
  DemoStokeTldrSection,
  DemoStokeTldrRow,
  DemoStokeTldrTitle,
  DemoStokeTldrCopy,
  DemoStokeTldrImage,
  DemoStokeAccordion,
  DemoStokeAccordionItem,
  DemoStokeAccordionHeader,
  DemoStokeAccordionTitle,
  DemoStokeAccordionChevron,
  DemoStokeAccordionContent,
  DemoStokeAccordionCopy,
  DemoStokeTwoUp,
  DemoStokeBorderBox,
  DemoStokeMethodList,
  DemoStokeMethodCard,
  DemoStokeMethodRow,
  DemoStokeWhyImageFrame,
  DemoStokeScrollSection,
  DemoStokeScrollRow,
  DemoStokeScrollItem,
  DemoStokeScrollImage,
  DemoStokeScrollHeader,
  DemoStokeScrollControls,
  DemoStokeScrollButton
} from '../../styles';
import { AnimatedSection } from '../../styles/projectShowcases';
import { TopNavContent, FooterContent } from '.';
import DemoStokeTabs from './DemoStokeTabs';
import SidebarSectionTabs, { SidebarSectionConfig, SidebarSectionTabsMobile } from './SidebarSectionTabs';
import * as UserStories from './userstories';

type SectionKey = 'case-study' | 'stories';

const CASE_STUDY_SECTIONS: SidebarSectionConfig[] = [
  { id: 'hero-spacer', label: 'Intro Spacer', hidden: true },
  { id: 'introduction', label: 'Intro' },
  { id: 'section-the-why', label: 'The Why' },
  { id: 'section-the-who', label: 'The Who' },
  { id: 'section-the-how', label: 'The How' },
  { id: 'section-methodology', label: 'Methods' }
] as const;
const CASE_STUDY_BOTTOM_SECTION_ID = CASE_STUDY_SECTIONS[CASE_STUDY_SECTIONS.length - 1]?.id;

const STORY_SECTIONS: SidebarSectionConfig[] = [
  { id: 'story-introduction', label: 'Intro', hidden: true },
  { id: 'story-independent-surfboard-shaper-title', label: 'Independent Shaper' },
  { id: 'story-weekend-warrior', label: 'Weekend Warrior' },
  { id: 'story-small-ski-shop', label: 'Small Ski/Bike Shop' }
] as const;

const TLDR_ITEMS: {
  title: string;
  description: ReactNode;
  image: { src: string; alt: string; };
}[] = [
  {
    title: 'What It Is',
    description: (
      <>
        <WhiteTransitionAnchor href="https://www.demostoke.com/" target='_blank' rel='noopener noreferrer'>
          DemoStoke
        </WhiteTransitionAnchor>{' '}
        is the go-to platform to find, try, and buy the gear you’ll eventually fall in love with.
      </>
    ),
    image: {
      src: '/img/demostoke/globe.webp',
      alt: 'DemoStoke global gear discovery collage'
    }
  },
  {
    title: 'The Problem',
    description: 'Riders want to try before they buy, but demos are rare, costly, and inconvenient.',
    image: {
      src: '/img/demostoke/demo-van.webp',
      alt: 'DemoStoke mobile demo van in the field'
    }
  },
  {
    title: 'The Solution',
    description: 'A location-based marketplace to safely connect riders, lenders, and shops.',
    image: {
      src: '/img/demostoke/surf-shop.webp',
      alt: 'Surf shop displaying boards available for demo'
    }
  },
  {
    title: 'My Roles',
    description: 'Founder, UX Designer, and Full-Stack Developer.',
    image: {
      src: '/img/demostoke/ds-design-system.webp',
      alt: 'DemoStoke design system components'
    }
  }
] as const;

const METHOD_SECTIONS = [
  {
    title: 'Primary and Secondary Research',
    bullets: [
      'Interviewed riders across surf, snow, and MTB to surface demo frustrations and trust gaps.',
      'Captured quotes about convenience, selection, and safety to anchor problem statements.',
      'Benchmarked competitors and availability patterns to spot underserved sports and locations.'
    ],
    image: { src: '/img/demostoke/zoom-call-good.webp', alt: 'Two people talking during a video call' }
  },
  {
    title: 'Empathize, Define, and Ideate With Users',
    bullets: [
      'Ran rider and shop employee interviews plus field observations to see friction in context.',
      'Framed trust-and-convenience problem statements with measurable goals for activation and conversion.',
      'Mapped discovery-to-feedback flows and prioritized must-have moments for riders and lenders.'
    ],
    image: { src: '/img/demostoke/skiiers-on-lift.webp', alt: 'Skiers riding a chairlift together' }
  },
  {
    title: 'Prototype, Test, and Refine the Product',
    bullets: [
      'Used Lovable AI to generate hi-fi pages quickly, then refined with prompt engineering.',
      'Layered custom frontend polish and Supabase to demo discovery, admin, and AI integrations.',
      'Ran moderated and unmoderated walkthroughs to validate discovery, booking, and trust cues.'
    ],
    image: { src: '/img/demostoke/surfer-and-guy-with-phone.webp', alt: 'Surfer carrying a board while walking beside a man on his phone' }
  }
] as const;

const PERSONA_ITEMS = [
  {
    title: 'Weekend Warrior',
    bullets: [
      'Rachel (34, San Diego) is a marketing manager who rides 1-2x/month.',
      'She wants to try before buying expensive gear but is frustrated by limited demo options.',
      'She looks to Instagram and friends for recs, and wants DemoStoke to offer trusted peer reviews, easy filters, and clear pickup info.'
    ]
  },
  {
    title: 'Die-Hard',
    bullets: [
      'Chris (29, Truckee) is a remote project manager who snowboards 3-4x/week.',
      'He seeks variety in gear but shops don’t offer enough options.',
      'He’s active in forums and trades gear with friends.',
      'He wants DemoStoke to offer high-quality listings, flexible pickup, and rider reviews.'
    ]
  },
  {
    title: 'Nomadic Renter',
    bullets: [
      'Maya (31, Santa Cruz) is a van-lifer and remote UX designer who rides 1-3x/week.',
      'She doesn’t want to own a ton of gear and struggles to find quality rentals in new locations.',
      'She wants DemoStoke to offer verified local lenders, easy-to-find gear specs, and fair prices.'
    ]
  },
  {
    title: 'Local Shop Owner',
    bullets: [
      'Tony (45, South Lake Tahoe) co-owns a board shop and wants to run demos without building his own tech.',
      'He’s frustrated that most platforms don’t support niche gear.',
      'He wants DemoStoke to help list demo boards, drive traffic, and convert demos into sales.'
    ]
  },
  {
    title: 'Local Shaper',
    bullets: [
      'Dustin (38, Ventura) is a known surfboard shaper trying to grow his reputation.',
      'He wants to organize demos and track who rides his boards but lacks the tools.',
      'He wants DemoStoke to offer a shaper-specific feature, demo tracking, and review visibility.'
    ]
  },
  {
    title: 'Quiver Lender',
    bullets: [
      'Jessie (27, Encinitas) is a yoga instructor with extra boards.',
      'She wants to earn passive income but doesn’t trust Craigslist.',
      'She wants DemoStoke to provide a smooth listing flow, damage protection, reviews, verified users, and an earnings dashboard.'
    ]
  }
] as const;

const HOW_IMAGES = [
  { src: '/img/demostoke/feat-events.webp', alt: 'Featured events section' },
  { src: '/img/demostoke/feat-posts.webp', alt: 'Featured posts section' },
  { src: '/img/demostoke/events-calendar.webp', alt: 'Events calendar' },
  { src: '/img/demostoke/admin-img-download.webp', alt: 'Admin dashboard' },
  { src: '/img/demostoke/gear-quiz.webp', alt: 'Gear quiz' },
  { src: '/img/demostoke/blog-with-drafts.webp', alt: 'Blog home with drafts and published posts' },
  { src: '/img/demostoke/blog-drafts.webp', alt: 'Blog drafts management view' },
  { src: '/img/demostoke/blog-edit-post.webp', alt: 'Blog post editor' },
] as const;

const DemoStokeContent = () => {
  const { isMobileMenuShown } = useAppSelector(getMobileMenuState);
  const dispatch = useAppDispatch();
  const [activeTab, setActiveTab] = useState<SectionKey>('case-study');
  const [topTabsEl, setTopTabsEl] = useState<HTMLDivElement | null>(null);
  const [lightboxController, setLightboxController] = useState({ toggler: false, slide: 1 });
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [openPersonaId, setOpenPersonaId] = useState<string | null>(null);
  const [visibleSections, setVisibleSections] = useState<Record<string, boolean>>({});
  const scrollRowRef = useRef<HTMLDivElement | null>(null);
  const animatedSectionRefs = useRef<Map<string, HTMLDivElement | null>>(new Map());
  const handleTopTabsRef = useCallback((node: HTMLDivElement | null) => {
    setTopTabsEl(node);
  }, []);

  const setAnimatedSectionRef = useCallback((id: string) => (el: HTMLDivElement | null) => {
    animatedSectionRefs.current.set(id, el);
  }, []);

  const handleTabClick = (tabKey: string) => {
    setActiveTab(tabKey as SectionKey);
  };
  const isCaseStudyView = activeTab === 'case-study';
  const currentSections = isCaseStudyView ? CASE_STUDY_SECTIONS : STORY_SECTIONS;
  const lockToBottomSectionId = isCaseStudyView ? CASE_STUDY_BOTTOM_SECTION_ID : undefined;

  // Scroll to top after tab content changes
  useEffect(() => {
    // Use requestAnimationFrame to ensure scroll happens after browser layout calculations
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        scrollToTop();
      });
    });
  }, [activeTab]);

  // IntersectionObserver for fade-in animations
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const sectionId = entry.target.getAttribute('data-animate-id');
        if (entry.isIntersecting && sectionId) {
          setVisibleSections((prev) => (prev[sectionId] ? prev : { ...prev, [sectionId]: true }));
        }
      });
    }, { threshold: 0.22 });

    animatedSectionRefs.current.forEach((node) => node && observer.observe(node));

    return () => observer.disconnect();
  }, [activeTab]);

  const openLightbox = (index: number) => {
    setLightboxController({
      toggler: !lightboxController.toggler,
      slide: index + 1
    });
  };

  const updateScrollButtons = useCallback(() => {
    const row = scrollRowRef.current;
    if (!row) return;
    if (row.scrollLeft <= 1) {
      row.scrollLeft = 0;
    }
    const firstItem = row.firstElementChild as HTMLElement | null;
    const startThreshold = (firstItem?.offsetLeft ?? 0) + 1;
    const maxScroll = Math.max(row.scrollWidth - row.clientWidth, 0);
    const isAtStart = row.scrollLeft <= startThreshold;
    const isAtEnd = row.scrollLeft >= maxScroll - 1;
    setCanScrollLeft(!isAtStart);
    setCanScrollRight(!isAtEnd);
  }, []);

  // Ensure gallery starts at the beginning on mount/page refresh.
  useEffect(() => {
    const row = scrollRowRef.current;
    if (!row) return;
    row.scrollLeft = 0;
    updateScrollButtons();
  }, [updateScrollButtons]);

  const scrollGalleryBy = useCallback((direction: number) => {
    const row = scrollRowRef.current;
    if (!row) return;
    const firstItem = row.firstElementChild as HTMLElement | null;
    const itemWidth = firstItem?.getBoundingClientRect().width ?? 240;
    row.scrollBy({ left: direction * itemWidth, behavior: 'smooth' });
  }, []);

  const togglePersona = useCallback((id: string) => {
    setOpenPersonaId(current => current === id ? null : id);
  }, []);

  useEffect(() => {
    const row = scrollRowRef.current;
    if (!row) return;
    updateScrollButtons();
    const handleScroll = () => updateScrollButtons();
    row.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleScroll);
    return () => {
      row.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [updateScrollButtons]);

  return (
    <>
      <TopNavContent />
      <Wrapper isMobileMenuShown={isMobileMenuShown}
        onClick={() => dispatch(showMobileMenu(false))}>
        <DemoStokeTabs
          ref={handleTopTabsRef}
          tabs={[
            { key: 'case-study', label: 'UX Case Study' },
            { key: 'stories', label: 'User Stories' }
          ]}
          activeTab={activeTab}
          onTabClick={handleTabClick}
        />
        <SidebarSectionTabsMobile
          sections={currentSections}
          topTabsEl={topTabsEl}
          isActive={true}
          lockToBottomSectionId={lockToBottomSectionId}
          scrollOffsetAdjustment={8}
        />

        {activeTab === 'case-study' && (
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
                          <source src='' type='video/mp4' />
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
                    isActive={activeTab === 'case-study'}
                    lockToBottomSectionId={CASE_STUDY_BOTTOM_SECTION_ID}
                    scrollOffsetAdjustment={8}
                  />
                </DemoStokeContentGrid>
              </div>
            </BioBox>
          </div>
        )}

        {activeTab === 'stories' && (
          <div id="stories-content">
            <BioBox direction='right' noBottomPadding top>
              <div className='biobox-inner demostoke-inner'>
                <DemoStokeContentGrid>
                  <div>
                    <section id='story-independent-shaper'>
                      <UserStories.IndieShaper
                        wrapWithBioBox={false}
                        setAnimatedSectionRef={setAnimatedSectionRef}
                        visibleSections={visibleSections}
                      />
                    </section>

                    <br />

                    <section id='story-weekend-warrior'>
                      <UserStories.WeekendWarrior
                        wrapWithBioBox={false}
                        setAnimatedSectionRef={setAnimatedSectionRef}
                        visibleSections={visibleSections}
                      />
                    </section>

                    <br />

                    <section id='story-small-ski-shop'>
                      <UserStories.SmallSkiBikeShop
                        wrapWithBioBox={false}
                        setAnimatedSectionRef={setAnimatedSectionRef}
                        visibleSections={visibleSections}
                      />
                    </section>
                    <br />
                    <br />
                  </div>
                  <SidebarSectionTabs
                    sections={STORY_SECTIONS}
                    topTabsEl={topTabsEl}
                    isActive={activeTab === 'stories'}
                    scrollOffsetAdjustment={8}
                  />
                </DemoStokeContentGrid>
              </div>
            </BioBox>
          </div>
        )}
      </Wrapper>
      <FsLightbox
        toggler={lightboxController.toggler}
        sources={HOW_IMAGES.map(({ src }) => src)}
        slide={lightboxController.slide}
      />
      <FooterContent />
    </>
  );
};

export default DemoStokeContent;
