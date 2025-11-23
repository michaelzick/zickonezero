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
  DemoStokeTwoUp,
  DemoStokeBorderBox,
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

type SectionKey = 'executive' | 'stories';

const EXECUTIVE_SECTIONS: SidebarSectionConfig[] = [
  { id: 'introduction', label: 'Introduction', hidden: true },
  { id: 'section-problem', label: 'The Problem' },
  { id: 'section-key-features', label: 'Key Features' },
  { id: 'section-admin', label: 'Admin' },
  { id: 'section-market-research', label: 'Analysis' },
  { id: 'section-lessons', label: 'Lessons' },
] as const;
const EXECUTIVE_BOTTOM_SECTION_ID = EXECUTIVE_SECTIONS[EXECUTIVE_SECTIONS.length - 1]?.id;

const STORY_SECTIONS: SidebarSectionConfig[] = [
  { id: 'story-introduction', label: 'Intro', hidden: true },
  { id: 'story-independent-shaper-title', label: 'Independent Shaper' },
  { id: 'story-weekend-warrior', label: 'Weekend Warrior' },
  { id: 'story-small-ski-shop', label: 'Small Ski/Bike Shop' }
] as const;

const TLDR_ITEMS: { title: string; description: ReactNode; }[] = [
  {
    title: 'What it is',
    description: (
      <>
        <WhiteTransitionAnchor href="https://www.demostoke.com/" target='_blank' rel='noopener noreferrer'>
          DemoStoke
        </WhiteTransitionAnchor>{' '}
        is the go-to platform to find, try, and buy the gear you’ll eventually fall in love with.
      </>
    )
  },
  {
    title: 'The Problem',
    description: 'Riders want to try before they buy, but demos are rare, costly, and inconvenient.'
  },
  {
    title: 'The Solution',
    description: 'A location-based marketplace to safely connect riders and lenders.'
  },
  {
    title: 'My Role',
    description: 'Founder, Head of Product, UX strategist, MVP architect.'
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
  { src: '/img/all-equipment-hybrid.webp', alt: 'Hybrid equipment view' },
  { src: '/img/events-calendar.webp', alt: 'Events calendar' },
  { src: '/img/blog-page.webp', alt: 'Blog page' },
  { src: '/img/admin-img-download.webp', alt: 'Admin dashboard' },
  { src: '/img/homepage_light_2025-07-22.webp', alt: 'Homepage preview' }
] as const;

const DemoStokeContent = () => {
  const { isMobileMenuShown } = useAppSelector(getMobileMenuState);
  const dispatch = useAppDispatch();
  const [activeTab, setActiveTab] = useState<SectionKey>('executive');
  const [topTabsEl, setTopTabsEl] = useState<HTMLDivElement | null>(null);
  const [lightboxController, setLightboxController] = useState({ toggler: false, slide: 1 });
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const scrollRowRef = useRef<HTMLDivElement | null>(null);
  const handleTopTabsRef = useCallback((node: HTMLDivElement | null) => {
    setTopTabsEl(node);
  }, []);

  const handleTabClick = (tabKey: string) => {
    setActiveTab(tabKey as SectionKey);
  };
  const isExecutiveView = activeTab === 'executive';
  const currentSections = isExecutiveView ? EXECUTIVE_SECTIONS : STORY_SECTIONS;
  const lockToBottomSectionId = isExecutiveView ? EXECUTIVE_BOTTOM_SECTION_ID : undefined;

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

  const scrollGalleryBy = useCallback((direction: number) => {
    const row = scrollRowRef.current;
    if (!row) return;
    const firstItem = row.firstElementChild as HTMLElement | null;
    const itemWidth = firstItem?.getBoundingClientRect().width ?? 240;
    row.scrollBy({ left: direction * itemWidth, behavior: 'smooth' });
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
            { key: 'executive', label: 'UX Case Study' },
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
          scrollOffsetAdjustment={20}
        />

        {activeTab === 'executive' && (
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

                    <br />
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

                    <section id='section-tldr'>
                      <h3>TL;DR</h3>
                      <DemoStokeTwoColumnLayout>
                        {TLDR_ITEMS.map(({ title, description }) => (
                          <DemoStokeTwoColumnRow key={title}>
                            <DemoStokeTwoColumnHeader>{title}</DemoStokeTwoColumnHeader>
                            <DemoStokeTwoColumnCopy>{description}</DemoStokeTwoColumnCopy>
                          </DemoStokeTwoColumnRow>
                        ))}
                      </DemoStokeTwoColumnLayout>
                    </section>

                    <section id='section-pain-points' className='story-section'>
                      <DemoStokeTitle>The Why</DemoStokeTitle>
                      <DemoStokeBorderBox>
                        <DemoStokeTwoUp>
                          <section id='section-problem'>
                            <h3>The Problem</h3>
                            <p>
                              Demo opportunities for rideable gear are limited, inconvenient, or nonexistent. Many riders either blindly purchase
                              expensive equipment or wait for infrequent on-site demos, often leading to mismatched gear choices and wasted spending.
                            </p>
                          </section>
                          <section id='section-complaints'>
                            <h3>Current Complaints</h3>
                            <DemoStokeList $frameless>
                              <li className='complaint'>“I wait in long rental lines without knowing if they have what I want.”</li>
                              <br />
                              <li className='complaint'>“I can’t find the right gear in my size.”</li>
                              <br />
                              <li className='complaint'>“I don’t want to buy a $900 surfboard I’ve never ridden.”</li>
                              <br />
                              <li className='complaint'>“Demo days at the beach or mountain are few and far in between.”</li>
                              <br />
                              <li className='complaint'>“Demo boards at the resort are expensive and they have a limited selection.”</li>
                            </DemoStokeList>
                          </section>
                        </DemoStokeTwoUp>
                      </DemoStokeBorderBox>
                    </section>

                    <section id='section-personas' className='story-section'>
                      <DemoStokeTitle>The Who</DemoStokeTitle>
                      <DemoStokeTwoColumnLayout>
                        {PERSONA_ITEMS.map(({ title, bullets }) => (
                          <DemoStokeTwoColumnRow key={title}>
                            <DemoStokeTwoColumnHeader>{title}</DemoStokeTwoColumnHeader>
                            <DemoStokeTwoColumnCopy>
                              <DemoStokeList $frameless>
                                {bullets.map((bullet) => (
                                  <li className='prototype' key={bullet}>{bullet}</li>
                                ))}
                              </DemoStokeList>
                            </DemoStokeTwoColumnCopy>
                          </DemoStokeTwoColumnRow>
                        ))}
                      </DemoStokeTwoColumnLayout>
                    </section>

                    <section id='section-the-how' className='story-section'>
                      <DemoStokeTitle>The How</DemoStokeTitle>
                      <DemoStokeBorderBox>
                        <DemoStokeTwoUp>
                          <section>
                            <h3>Location-Based Discovery</h3>
                            <p>
                              A comprehensive gear discovery and rental platform that connects riders with demo opportunities in their area.
                              By leveraging location-based services, we can help riders find available gear to try before they buy,
                              while also providing a marketplace for gear owners to list their equipment for rent.
                            </p>
                          </section>
                          <section>
                            <h3>Marketplace for Gear Owners</h3>
                            <FullBorderImage src='/img/all-equipment-hybrid.webp' alt='DemoStoke Hybrid View' loading="lazy" />
                          </section>
                        </DemoStokeTwoUp>
                      </DemoStokeBorderBox>
                    </section>

                    <section id='section-how-gallery' className='story-section'>
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

                    <section id='section-lessons' className='story-section'>
                      <DemoStokeTitle>Lessons</DemoStokeTitle>
                      <p>This case study was born from real interviews and market gaps. I learned:</p>
                      <DemoStokeList>
                        <li className='learning'>User trust is central to any peer-based platform.</li>
                        <br />
                        <li className='learning'>UX must speak the cultural language of the target audience.</li>
                        <br />
                        <li className='learning'>Foundational research is everything; it’s all about solving pain points.</li>
                      </DemoStokeList>
                    </section>

                    <section id='section-links'>
                      <h3>Links</h3>
                      <DemoStokeList>
                        <li className='prototype'>
                          <WhiteTransitionAnchor href="https://www.demostoke.com/" target='_blank' rel='noopener noreferrer'>
                            See the full site
                          </WhiteTransitionAnchor> or{' '}
                          <WhiteTransitionAnchor href="/demostoke-investor-deck.pdf" target='_blank' rel='noopener noreferrer'>
                            download the investor pitch deck
                          </WhiteTransitionAnchor>.
                        </li>
                      </DemoStokeList>
                    </section>
                    <br />
                    <br />
                  </div>
                  <SidebarSectionTabs
                    sections={EXECUTIVE_SECTIONS}
                    topTabsEl={topTabsEl}
                    isActive={activeTab === 'executive'}
                    lockToBottomSectionId={EXECUTIVE_BOTTOM_SECTION_ID}
                    scrollOffsetAdjustment={20}
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
                  </div>
                  <SidebarSectionTabs
                    sections={STORY_SECTIONS}
                    topTabsEl={topTabsEl}
                    isActive={activeTab === 'stories'}
                    scrollOffsetAdjustment={20}
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
