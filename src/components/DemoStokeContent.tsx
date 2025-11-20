import { useState, useEffect, useCallback } from 'react';
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
  DemoStokeTable,
  WhiteTransitionAnchor,
  TableWrapper,
  FlexBox,
  PitchDeckLink,
  Video,
  Image,
  DemoStokeContentGrid,
  DemoStokeTitle
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
  { id: 'section-learnings', label: 'Misc' },
] as const;
const EXECUTIVE_BOTTOM_SECTION_ID = EXECUTIVE_SECTIONS[EXECUTIVE_SECTIONS.length - 1]?.id;

const STORY_SECTIONS: SidebarSectionConfig[] = [
  { id: 'story-introduction', label: 'Intro', hidden: true },
  { id: 'story-independent-shaper-title', label: 'Independent Shaper' },
  { id: 'story-weekend-warrior', label: 'Weekend Warrior' },
  { id: 'story-small-ski-shop', label: 'Small Ski/Bike Shop' }
] as const;

const DemoStokeContent = () => {
  const { isMobileMenuShown } = useAppSelector(getMobileMenuState);
  const dispatch = useAppDispatch();
  const [activeTab, setActiveTab] = useState<SectionKey>('executive');
  const [topTabsEl, setTopTabsEl] = useState<HTMLDivElement | null>(null);
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

  return (
    <>
      <TopNavContent />
      <Wrapper isMobileMenuShown={isMobileMenuShown}
        onClick={() => dispatch(showMobileMenu(false))}>
        <DemoStokeTabs
          ref={handleTopTabsRef}
          tabs={[
            { key: 'executive', label: 'Executive Summary' },
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
                        <h2 className='tab-header page-header'>Executive Summary</h2>
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
                      <p>
                        <WhiteTransitionAnchor href="https://www.demostoke.com/" target='_blank' rel='noopener noreferrer'>
                          DemoStoke
                        </WhiteTransitionAnchor>{' '}
                        is the go-to platform to find, try, and buy the gear you’ll eventually fall in love with.
                      </p>
                    </section>

                    <br />
                    <Video
                      autoPlay
                      loop
                      muted
                      playsInline
                      poster='/img/homepage_light_2025-07-22.webp'
                    >
                      <source src='/video/homepage_scroll_light_2025-07-22.mp4' type='video/mp4' />
                      <source src='' type='video/mp4' />
                    </Video>
                    <br />

                    <section id='section-tldr'>
                      <h3>TL;DR</h3>
                      <DemoStokeList>
                        <li><strong>What it is:</strong> A P2P and B2C platform to find and demo action sports gear from multiple sources.</li>
                        <br />
                        <li><strong>Problem:</strong> Riders want to try before they buy, but demos are rare, costly, and inconvenient.</li>
                        <br />
                        <li><strong>Solution:</strong> A location-based marketplace to safely connect riders and lenders.</li>
                        <br />
                        <li><strong>My Role:</strong> Founder, Head of Product, UX strategist, MVP architect.</li>
                      </DemoStokeList>
                    </section>

                    <section id='section-problem' className='story-section'>
                      <DemoStokeTitle>The Problem</DemoStokeTitle>
                      <p>Demo opportunities for rideable gear are limited, inconvenient, or nonexistent.
                        Many riders either blindly purchase expensive equipment or wait for infrequent on-site demos,
                        often leading to mismatched gear choices and wasted spending.</p>
                    </section>

                    <section id='section-complaints'>
                      <h3>Current Complaints</h3>
                      <DemoStokeList>
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

                    <section id='section-solution'>
                      <h3>The Solution</h3>
                      <p>A comprehensive gear discovery and rental platform that connects riders with demo opportunities in their area.
                        By leveraging location-based services, we can help riders find available gear to try before they buy,
                        while also providing a marketplace for gear owners to list their equipment for rent.</p>

                      <Image src='/img/all-equipment-hybrid.webp' alt='DemoStoke Hybrid View' loading="lazy" />
                      <br />
                    </section>

                    <section id='section-key-features' className='story-section'>
                      <DemoStokeTitle>Key Features</DemoStokeTitle>
                      <DemoStokeList>
                        <li>Map and list-based gear discovery.</li>
                        <br />
                        <li>Gear and owner profile pages.</li>
                        <br />
                        <li>Filter gear by category, location, and price.</li>
                        <br />
                        <li>Reviews, guides, and lifestyle content.</li>
                        <br />
                        <li>Demo events calendar with map and list views.</li>
                      </DemoStokeList>
                      <br />

                      <Image src='/img/events-calendar.webp' alt='DemoStoke Events Calendar' loading="lazy" />
                      <br />
                      <br />
                      <Image src='/img/blog-page.webp' alt='DemoStoke Blog Page' loading="lazy" />
                    </section>

                    <section id='section-admin' className='story-section'>
                      <DemoStokeTitle>Admin Dashboard</DemoStokeTitle>
                      <p>In addition to the client-facing site, DemoStoke is a full-featured admin dashboard
                        for managing users, gear listings, and demo events, built with a React frontend
                        and a Supabase/PostreSQL backend. Future iterations will include POS/API syncing
                        for real-time inventory management.</p>

                      <Image src='/img/admin-img-download.webp' alt='DemoStoke Admin Image Download' loading="lazy" />
                    </section>

                    <section id='section-market-research' className='story-section'>
                      <DemoStokeTitle>Market Research &amp; Competitive Analysis</DemoStokeTitle>
                      <DemoStokeList>
                        <li className='interview'>I conducted user interviews and surveys with riders across snow, surf, and MTB.</li>
                        <br />
                        <li className='learning'><strong>Key insight:</strong> People would pay to demo gear if trust and ease were guaranteed.</li>
                      </DemoStokeList>
                    </section>

                    <section id='section-competitors'>
                      <h3>Competitor Overview</h3>
                      <TableWrapper>
                        <DemoStokeTable>
                          <thead>
                            <tr>
                              <th>Feature</th>
                              <th>DemoStoke</th>
                              <th>Gearo</th>
                              <th>FriendWithA</th>
                              <th>The Quiver</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td>Try-before-you-buy culture</td>
                              <td>✓</td>
                              <td>X</td>
                              <td>X</td>
                              <td>X</td>
                            </tr>
                            <tr>
                              <td>Peer-to-Peer (P2P)</td>
                              <td>✓</td>
                              <td>X</td>
                              <td>✓</td>
                              <td>✓</td>
                            </tr>
                            <tr>
                              <td>Business-to-Consumer (B2C)</td>
                              <td>✓</td>
                              <td>✓</td>
                              <td>X</td>
                              <td>X</td>
                            </tr>
                            <tr>
                              <td>Indie shapers/local makers</td>
                              <td>✓</td>
                              <td>X</td>
                              <td>X</td>
                              <td>X</td>
                            </tr>
                            <tr>
                              <td>Lifestyle branding</td>
                              <td>✓</td>
                              <td>X</td>
                              <td>X</td>
                              <td>✓</td>
                            </tr>
                            <tr>
                              <td>Demo + rental hybrid</td>
                              <td>✓</td>
                              <td>X</td>
                              <td>X</td>
                              <td>X</td>
                            </tr>
                            <tr>
                              <td>Community features</td>
                              <td>✓</td>
                              <td>X</td>
                              <td>X</td>
                              <td>X</td>
                            </tr>
                            <tr>
                              <td>Data dashboard for users</td>
                              <td>✓</td>
                              <td>✓</td>
                              <td>X</td>
                              <td>X</td>
                            </tr>
                            <tr>
                              <td>Data API</td>
                              <td>✓</td>
                              <td>X</td>
                              <td>X</td>
                              <td>X</td>
                            </tr>
                            <tr>
                              <td>Multi-sport identity</td>
                              <td>✓</td>
                              <td>✓</td>
                              <td>✓</td>
                              <td>X</td>
                            </tr>
                            <tr>
                              <td>Destination readiness</td>
                              <td>✓</td>
                              <td>✓</td>
                              <td>X</td>
                              <td>X</td>
                            </tr>
                            <tr>
                              <td>Subscription model</td>
                              <td>✓</td>
                              <td>X</td>
                              <td>X</td>
                              <td>X</td>
                            </tr>
                            <tr>
                              <td>UX for lifestyle discovery</td>
                              <td>✓</td>
                              <td>✓</td>
                              <td>X</td>
                              <td>✓</td>
                            </tr>
                            <tr>
                              <td>Verified users</td>
                              <td>✓</td>
                              <td>✓</td>
                              <td>✓</td>
                              <td>X</td>
                            </tr>
                            <tr>
                              <td>Map-based discovery</td>
                              <td>✓</td>
                              <td>✓</td>
                              <td>✓</td>
                              <td>✓</td>
                            </tr>
                            <tr>
                              <td>Gear reservations</td>
                              <td>✓</td>
                              <td>✓</td>
                              <td>✓</td>
                              <td>✓</td>
                            </tr>
                            <tr>
                              <td>Promoted listings</td>
                              <td>✓</td>
                              <td>X</td>
                              <td>X</td>
                              <td>X</td>
                            </tr>
                            <tr>
                              <td>AI-driven search customization</td>
                              <td>✓</td>
                              <td>X</td>
                              <td>X</td>
                              <td>X</td>
                            </tr>
                          </tbody>
                        </DemoStokeTable>
                      </TableWrapper>
                    </section>

                    <section id='section-personas'>
                      <h3>Personas</h3>
                      <DemoStokeList spaced>
                        <li className='persona'><strong>Weekend Warrior:</strong> Rachel (34, San Diego) is a marketing manager who rides 1-2x/month. She wants to try before buying expensive gear but is frustrated by limited demo options. She looks to Instagram and friends for recs, and wants DemoStoke to offer trusted peer reviews, easy filters, and clear pickup info.</li>
                        <li className='persona'><strong>Die-Hard:</strong> Chris (29, Truckee) is a remote project manager who snowboards 3-4x/week. He seeks variety in gear but shops don’t offer enough options. He’s active in forums and trades gear with friends. He wants DemoStoke to offer high-quality listings, flexible pickup, and rider reviews.</li>
                        <li className='persona'><strong>Nomadic Renter:</strong> Maya (31, Santa Cruz) is a van-lifer and remote UX designer who rides 1-3x/week. She doesn’t want to own a ton of gear and struggles to find quality rentals in new locations. She wants DemoStoke to offer verified local lenders, easy to find gear specs, and fair prices.</li>
                        <li className='persona'><strong>Local Shop Owner:</strong> Tony (45, South Lake Tahoe) co-owns a board shop and wants to run demos without building his own tech. He’s frustrated that most platforms don’t support niche gear. He wants DemoStoke to help list demo boards, drive traffic, and convert demos into sales.</li>
                        <li className='persona'><strong>Local Shaper:</strong> Dustin (38, Ventura) is a known surfboard shaper trying to grow his reputation. He wants to organize demos and track who rides his boards but lacks the tools. He wants DemoStoke to offer a shaper-specific feature, demo tracking, and review visibility.</li>
                        <li className='persona'><strong>Quiver Lender:</strong> Jessie (27, Encinitas) is a yoga instructor with extra boards. She wants to earn passive income but doesn’t trust Craigslist. She wants DemoStoke to provide a smooth listing flow, damage protection, reviews, verified users, and an earnings dashboard.</li>
                      </DemoStokeList>
                    </section>

                    <section id='section-learnings' className='story-section'>
                      <DemoStokeTitle>Misc</DemoStokeTitle>
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
      <FooterContent />
    </>
  );
};

export default DemoStokeContent;
