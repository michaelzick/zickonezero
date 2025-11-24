import { useState, useEffect, useCallback, useRef, type ReactNode, type KeyboardEvent } from 'react';
import FsLightbox from 'fslightbox-react';
import { FileTextIcon } from '@radix-ui/react-icons';
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
  DemoStokeTwoColumnLayout,
  DemoStokeTwoColumnRow,
  DemoStokeTwoColumnHeader,
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
  DemoStokeWhyImageFrame,
  DemoStokeScrollSection,
  DemoStokeScrollRow,
  DemoStokeScrollItem,
  DemoStokeScrollImage,
  DemoStokeScrollHeader,
  DemoStokeScrollControls,
  DemoStokeScrollButton
} from '../../styles';
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
      src: '/img/glob.webp',
      alt: 'DemoStoke global gear discovery collage'
    }
  },
  {
    title: 'The Problem',
    description: 'Riders want to try before they buy, but demos are rare, costly, and inconvenient.',
    image: {
      src: '/img/demo-van.webp',
      alt: 'DemoStoke mobile demo van in the field'
    }
  },
  {
    title: 'The Solution',
    description: 'A location-based marketplace to safely connect riders, lenders, and shops.',
    image: {
      src: '/img/surf-shop.webp',
      alt: 'Surf shop displaying boards available for demo'
    }
  },
  {
    title: 'My Roles',
    description: 'Founder, UX Designer, and Full-Stack Developer.',
    image: {
      src: '/img/ds-design-system.webp',
      alt: 'DemoStoke design system components'
    }
  }
] as const;

const RESEARCH_ITEMS = [
  {
    title: 'Primary Research',
    bullets: [
      'Interviewed riders across surf, snow, and MTB to understand demo frustrations.',
      'Captured quotes and pain points tied to trust, convenience, and selection gaps.'
    ]
  },
  {
    title: 'Secondary Research',
    bullets: [
      'Reviewed competitor offerings to benchmark discovery, safety, and community features.',
      'Analyzed demo availability patterns to find underserved locations and sports.'
    ]
  },
  {
    title: 'Insights',
    bullets: [
      'Riders are willing to pay for demos if trust and ease are guaranteed.',
      'Shapers and shops need lightweight tools to run demos and convert to sales.'
    ]
  }
] as const;

const UX_PROCESS_STEPS = [
  {
    title: 'Empathize',
    bullets: [
      'Ran stakeholder and rider interviews to uncover motivations, blockers, and context of use.',
      'Conducted field observations of demo flows (shops, events, P2P exchanges) to see friction first-hand.'
    ]
  },
  {
    title: 'Define',
    bullets: [
      'Synthesized themes into problem statements and opportunity areas tied to trust and convenience.',
      'Framed measurable goals (demo conversion, repeat usage, lender activation) to guide design.'
    ]
  },
  {
    title: 'Ideate',
    bullets: [
      'Mapped end-to-end flows (discovery → booking → pickup → feedback) and prioritized must-have moments.',
      'Documented trust signals (verification, reviews) and discovery (filters, maps, events).'
    ]
  },
  {
    title: 'Hi-Fi Prototype Development',
    bullets: [
      'Used Lovable AI to spin up working pages quickly, then refined with prompt engineering for UX polish.',
      'Layered in custom frontend tweaks to reach high fidelity for realistic interactions and visuals.',
      'Wired up Supabase backend to demo core discovery, administration, and AI integrations.'
    ]
  },
  {
    title: 'Test & Refine',
    bullets: [
      'Ran moderated and unmoderated walkthroughs on the hi-fi prototype to validate discovery, booking, and trust cues.',
      'Iterated copy, visual hierarchy, and features based on usability findings and feedback.',
      'Used Google Analytics and Amplitude on the live MVP to track engagement and SEO metrics for future improvements.'
    ]
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
      'She wants DemoStoke to offer verified local lenders, easy to find gear specs, and fair prices.'
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
  { src: '/img/feat-events.webp', alt: 'Featured events section' },
  { src: '/img/events-calendar.webp', alt: 'Events calendar' },
  { src: '/img/blog.webp', alt: 'Blog layout' },
  { src: '/img/admin-img-download.webp', alt: 'Admin dashboard' },
  { src: '/img/feat-posts.webp', alt: 'Featured posts section' },
  { src: '/img/calendar.webp', alt: 'Calendar overview' },
  { src: '/img/quiz.webp', alt: 'Quiz experience' }
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
  const scrollRowRef = useRef<HTMLDivElement | null>(null);
  const handleTopTabsRef = useCallback((node: HTMLDivElement | null) => {
    setTopTabsEl(node);
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
                        <PitchDeckLink className='pitch-link-desktop' href="/demostoke-investor-deck.pdf" target='_blank' rel='noopener noreferrer'>
                          Investor Pitch Deck <FileTextIcon aria-hidden="true" />
                        </PitchDeckLink>
                      </div>
                    </FlexBox>

                    <PitchDeckLink className='pitch-link-mobile' href="/demostoke-investor-deck.pdf" target='_blank' rel='noopener noreferrer'>
                      Investor Pitch Deck <FileTextIcon aria-hidden="true" />
                    </PitchDeckLink>

                    <section id='hero-spacer' aria-hidden='true' />

                    <section id='introduction' className='story-section'>
                      <DemoStokeTitle>Introduction</DemoStokeTitle>
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

                    <section id='section-tldr' className='story-section'>
                      <DemoStokeTldrSection>
                        <DemoStokeTldrList>
                          {TLDR_ITEMS.map(({ title, description, image }, index) => (
                            <DemoStokeTldrRow key={title} $reverse={index % 2 === 1}>
                              <div>
                                <DemoStokeTldrTitle>{title}</DemoStokeTldrTitle>
                                <DemoStokeTldrCopy>{description}</DemoStokeTldrCopy>
                              </div>
                              <DemoStokeTldrImage src={image.src} alt={image.alt} loading='lazy' />
                            </DemoStokeTldrRow>
                          ))}
                        </DemoStokeTldrList>
                      </DemoStokeTldrSection>
                    </section>

                    <br />

                    <section id='section-the-why' className='story-section'>
                      <DemoStokeTitle>The Why / How It Started</DemoStokeTitle>
                      <DemoStokeBorderBox>
                        <DemoStokeTwoUp>
                          <section id='section-problem'>
                            <h3>My Story</h3>
                            <p>
                              For the longest time, I struggled to find a way to try new gear without the hassle of traditional
                              demo days or the uncertainty of buying blind. I knew there had to be a better way for riders like
                              me to connect with gear they wanted to test out before making a pricey purchase.
                              <br />
                              <br />
                              It started with surfboards. I’d buy boards off Craigslist, hoping they’d match my style and skill
                              level, or, I’d sink a lot of money on a new board because it looked cool or it was a popular model.
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
                        <DemoStokeWhyImageFrame>
                          <FullBorderImage
                            src='/img/stuf-figma.webp'
                            alt='Early Stuf peer-to-peer gear lending concepts in Figma'
                            loading='lazy'
                          />
                        </DemoStokeWhyImageFrame>
                      </DemoStokeBorderBox>
                    </section>

                    <br />

                    <section id='section-the-who' className='story-section'>
                      <DemoStokeTitle>The Who / User Personas</DemoStokeTitle>
                      <DemoStokeAccordion>
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

                    <br />

                    <section id='section-the-how' className='story-section'>
                      <DemoStokeTitle>The How / AI-Driven Development</DemoStokeTitle>
                      <DemoStokeBorderBox>
                        <DemoStokeTwoUp>
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
                        <DemoStokeWhyImageFrame>
                          <FullBorderImage src='/img/all-equipment-hybrid.webp' alt='DemoStoke Hybrid View' loading="lazy" />
                        </DemoStokeWhyImageFrame>
                      </DemoStokeBorderBox>
                    </section>

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
                            ‹
                          </DemoStokeScrollButton>
                          <DemoStokeScrollButton
                            type='button'
                            onClick={() => scrollGalleryBy(1)}
                            disabled={!canScrollRight}
                            aria-label='Scroll right'
                          >
                            ›
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

                    <br />

                    <section id='section-methodology' className='story-section'>
                      <DemoStokeTitle>Methods / The UX Process</DemoStokeTitle>
                      <DemoStokeTwoColumnLayout>
                        {RESEARCH_ITEMS.map(({ title, bullets }) => (
                          <DemoStokeTwoColumnRow key={title}>
                            <DemoStokeTwoColumnHeader>{title}</DemoStokeTwoColumnHeader>
                            <DemoStokeTwoColumnCopy>
                              <ul className='plain-lines'>
                                {bullets.map((bullet) => (
                                  <li key={bullet}>{bullet}</li>
                                ))}
                              </ul>
                            </DemoStokeTwoColumnCopy>
                          </DemoStokeTwoColumnRow>
                        ))}
                      </DemoStokeTwoColumnLayout>
                    </section>

                    <section id='section-ux-process' className='story-section'>
                      <DemoStokeTwoColumnLayout>
                        {UX_PROCESS_STEPS.slice(0, 3).map(({ title, bullets }) => (
                          <DemoStokeTwoColumnRow key={title}>
                            <DemoStokeTwoColumnHeader>{title}</DemoStokeTwoColumnHeader>
                            <DemoStokeTwoColumnCopy>
                              <ul className='plain-lines'>
                                {bullets.map((bullet) => (
                                  <li key={bullet}>{bullet}</li>
                                ))}
                              </ul>
                            </DemoStokeTwoColumnCopy>
                          </DemoStokeTwoColumnRow>
                        ))}
                      </DemoStokeTwoColumnLayout>
                    </section>

                    <section className='story-section'>
                      <DemoStokeTwoColumnLayout>
                        {UX_PROCESS_STEPS.slice(3).map(({ title, bullets }) => (
                          <DemoStokeTwoColumnRow key={title}>
                            <DemoStokeTwoColumnHeader>{title}</DemoStokeTwoColumnHeader>
                            <DemoStokeTwoColumnCopy>
                              <ul className='plain-lines'>
                                {bullets.map((bullet) => (
                                  <li key={bullet}>{bullet}</li>
                                ))}
                              </ul>
                            </DemoStokeTwoColumnCopy>
                          </DemoStokeTwoColumnRow>
                        ))}
                      </DemoStokeTwoColumnLayout>
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
                      <UserStories.IndieShaper wrapWithBioBox={false} />
                    </section>
                    <section id='story-weekend-warrior'>
                      <UserStories.WeekendWarrior wrapWithBioBox={false} />
                    </section>
                    <section id='story-small-ski-shop'>
                      <UserStories.SmallSkiBikeShop wrapWithBioBox={false} />
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
