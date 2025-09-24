import { useState } from 'react';
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
  Video,
  Image
} from '../../styles';
import { TopNavContent, FooterContent } from '.';
import DemoStokeTabs from './DemoStokeTabs';
import * as UserStories from './userstories';

type SectionKey = 'executive' | 'stories';

const DemoStokeContent = () => {
  const { isMobileMenuShown } = useAppSelector(getMobileMenuState);
  const dispatch = useAppDispatch();
  const [activeTab, setActiveTab] = useState<SectionKey>('executive');

  const handleTabClick = (tabKey: string) => {
    setActiveTab(tabKey as SectionKey);
    scrollToTop();
  };

  return (
    <>
      <TopNavContent />
      <Wrapper isMobileMenuShown={isMobileMenuShown}
        onClick={() => dispatch(showMobileMenu(false))}>
        <DemoStokeTabs
          tabs={[
            { key: 'executive', label: 'Executive Summary' },
            { key: 'stories', label: 'User Stories' }
          ]}
          activeTab={activeTab}
          onTabClick={handleTabClick}
        />

        {activeTab === 'executive' && (
          <div id="executive-content">
            <BioBox direction='right' noBottomPadding top>
              <div className='biobox-inner demostoke-inner'>
                <div>
                  <FlexBox>
                    <img className='ds-logo' src='/img/squares/demostoke-logo-ds-transparent-cropped.webp' alt='DemoStoke Logo' />
                    <h2 className='tab-header'>Executive Summary</h2>
                  </FlexBox>
                  <p>
                    <WhiteTransitionAnchor href="https://www.demostoke.com/" target='_blank' rel='noopener noreferrer'>
                      DemoStoke
                    </WhiteTransitionAnchor> is the go-to platform to find, try, and buy the gear you’ll eventually fall in love with.
                  </p>

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

                  <section>
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

                  <section>
                    <h3>The Problem</h3>
                    <p>Demo opportunities for rideable gear are limited, inconvenient, or nonexistent.
                      Many riders either blindly purchase expensive equipment or wait for infrequent on-site demos,
                      often leading to mismatched gear choices and wasted spending.</p>

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

                  <section>
                    <h3>The Solution</h3>
                    <p>A comprehensive gear discovery and rental platform that connects riders with demo opportunities in their area.
                      By leveraging location-based services, we can help riders find available gear to try before they buy,
                      while also providing a marketplace for gear owners to list their equipment for rent.</p>

                    <Image src='/img/all-equipment-hybrid.webp' alt='DemoStoke Hybrid View' loading="lazy" />
                    <br />

                    <h3>Key Features</h3>
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

                    <Image src='/img/events-calendar.webp' alt='DemoStoke Events Calendar' loading="lazy" />
                    <br />
                    <br />
                    <Image src='/img/blog-page.webp' alt='DemoStoke Blog Page' loading="lazy" />
                  </section>

                  <section>
                    <h3>Admin Dashboard</h3>
                    <p>In addition to the client-facing site, DemoStoke is a full-featured admin dashboard
                      for managing users, gear listings, and demo events, built with a React frontend
                      and a Supabase/PostreSQL backend. Future iterations will include POS/API syncing
                      for real-time inventory management.</p>

                    <Image src='/img/admin-img-download.webp' alt='DemoStoke Admin Image Download' loading="lazy" />
                  </section>

                  <section>
                    <h3>Market Research & Competitive Analysis</h3>
                    <DemoStokeList>
                      <li className='interview'>I conducted user interviews and surveys with riders across snow, surf, and skate.</li>
                      <br />
                      <li className='learning'><strong>Key insight:</strong> People would pay to demo gear if trust and ease were guaranteed.</li>
                    </DemoStokeList>

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

                  <section>
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

                  <section>
                    <h3>Build Process</h3>
                    <DemoStokeList>
                      <li>Rapid interactive prototyping using Vite, React, and Tailwind.{' '}
                        <WhiteTransitionAnchor href="https://www.demostoke.com/" target='_blank' rel='noopener noreferrer'>
                          See the full site
                        </WhiteTransitionAnchor>.
                      </li>
                    </DemoStokeList>
                  </section>

                  <section>
                    <h3>Learnings</h3>
                    <p>This case study was born from real interviews and market gaps. I learned:</p>
                    <DemoStokeList>
                      <li className='learning'>User trust is central to any peer-based platform.</li>
                      <br />
                      <li className='learning'>UX must speak the cultural language of the target audience.</li>
                      <br />
                      <li className='learning'>Foundational research is everything; it’s all about solving pain points.</li>
                    </DemoStokeList>
                  </section>

                  <section>
                    <h3>Links</h3>
                    <DemoStokeList>
                      <li className='prototype'>
                        <WhiteTransitionAnchor href="https://www.demostoke.com/" target='_blank' rel='noopener noreferrer'>
                          See the full site
                        </WhiteTransitionAnchor>
                      </li>
                    </DemoStokeList>
                  </section>
                </div>
              </div>
            </BioBox>
          </div>
        )}

        {activeTab === 'stories' && (
          <div id="stories-content">
            <UserStories.IndieShaper />
            <UserStories.WeekendWarrior />
            <UserStories.SmallSkiBikeShop />
          </div>
        )}
      </Wrapper>
      <FooterContent />
    </>
  );
};

export default DemoStokeContent;
