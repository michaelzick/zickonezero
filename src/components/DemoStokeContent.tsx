import * as Tabs from '@radix-ui/react-tabs';
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
  TabWrapper,
  FlexBox,
  Video,
} from '../../styles';
import { TopNavContent, FooterContent } from '.';
import * as UserStories from './userstories';

const DemoStokeContent = () => {
  const { isMobileMenuShown } = useAppSelector(getMobileMenuState);
  const dispatch = useAppDispatch();

  return (
    <>
      <TopNavContent />
      <Wrapper isMobileMenuShown={isMobileMenuShown}
        onClick={() => dispatch(showMobileMenu(false))}>
        <TabWrapper>
          <Tabs.Root className='TabsRoot' defaultValue={'tab1'}>
            <Tabs.List className='TabsList'>
              <Tabs.Trigger
                className='TabsTrigger'
                value="tab1"
                onClick={scrollToTop}
              >
                <div>Executive Summary</div>
              </Tabs.Trigger>
              <Tabs.Trigger
                className='TabsTrigger'
                value="tab2"
                onClick={scrollToTop}
              >
                <div>User Stories</div>
              </Tabs.Trigger>
            </Tabs.List>
            <Tabs.Content className='TabsContent' value="tab1">
              <BioBox direction='right' noBottomPadding top>
                <div className='biobox-inner demostoke-inner'>
                  <div>
                    <FlexBox>
                      <img className='ds-logo' src='/img/squares/demostoke-logo-ds-transparent-cropped.webp' alt='DemoStoke Logo' />
                      <h2 className='tab-header'>Executive Summary</h2>
                    </FlexBox>
                    <p>DemoStoke is a P2P and B2C gear demo marketplace for the action sports industry.</p>

                    <Video
                      autoPlay
                      loop
                      muted
                      playsInline
                      poster='/img/snowboarders-flying-1125x633.webp'
                    >
                      {/* <source src='https://www.dropbox.com/scl/fi/th70vsmd5w0zcrbd0d23u/screen_recording_2025-06-01.mp4?rlkey=961yu81egqp4q0m6apdhd045d&dl&raw=1' type='video/mp4' /> */}
                      <source src='' type='video/mp4' />
                    </Video>
                    <br />

                    🤙🏻 <WhiteTransitionAnchor href="https://www.demostoke.com/" target='_blank' rel='noopener noreferrer'>
                      See the interactive prototype
                    </WhiteTransitionAnchor>.
                    <section>
                      <h3>TL;DR</h3>
                      <DemoStokeList>
                        <li><strong>What it is:</strong> A P2P and B2C platform to find and demo action sports gear from multiple sources.</li>
                        <li><strong>Problem:</strong> Riders want to try before they buy, but demos are rare, costly, and inconvenient.</li>
                        <li><strong>Solution:</strong> A location-based marketplace to safely connect riders and lenders.</li>
                        <li><strong>My Role:</strong> Founder, Head of Product, UX strategist, MVP architect.</li>
                      </DemoStokeList>
                    </section>
                    <section>
                      <h3>The Problem</h3>
                      <p>Demo opportunities for rideable gear are limited, inconvenient, or nonexistent.
                        Many riders either blindly purchase expensive equipment or wait for infrequent on-site demos.
                        Meanwhile, gear sits unused in garages, with no unifying platform to connect owners and riders.</p>

                      <h3>Current Complaints</h3>
                      <DemoStokeList>
                        <li className='complaint'>“I want to try before I buy but there’s nothing around me.”</li>
                        <li className='complaint'>“Shops have limited brands and sizes.”</li>
                        <li className='complaint'>“I don’t want to buy a $900 surfboard I’ve never ridden.”</li>
                        <li className='complaint'>“Demo days at the beach or mountain are few and far inbetween.”</li>
                        <li className='complaint'>“I need more people to try my boards but doing demo days takes me away from shaping.”</li>
                        <li className='complaint'>“It would be cool to have all available demos, no matter who they’re from, in one place.”</li>
                        <li className='complaint'>“Could I have the demo shipped to me so I don’t waste time picking it up?”</li>
                        <li className='complaint'>“Demo boards at the resort are expensive and they have a limited selection.”</li>
                        <li className='complaint'>“I want to try multiple pairs of skis before buying, but that gets very expensive.”</li>
                        <li className='complaint'>“I’d like to get more people into my shop but I have a limited ad budget.”</li>
                      </DemoStokeList>
                    </section>
                    <section>
                      <h3>Market Research & Competitive Analysis</h3>
                      <DemoStokeList>
                        <li className='interview'>I conducted user interviews and surveys with riders across snow, surf, and skate.</li>
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
                      <h3>MVP & UX Strategy</h3>
                      <p>I focused on minimizing friction while maximizing trust. Key MVP features:</p>
                      <DemoStokeList>
                        <li>Map and list-based gear discovery</li>
                        <li>Gear profile pages</li>
                        <li>Search filters by sport, location, and price</li>
                        <li>Mandatory verification with government ID</li>
                      </DemoStokeList>
                      <p>Out of Scope: payments, insurance, analytics dashboard, in-app messaging, paid subscription</p>
                    </section>
                    <section>
                      <h3>Build Process</h3>
                      <DemoStokeList>
                        <li>Rapid interactive prototyping using Vite, React, and Tailwind.{' '}
                          <WhiteTransitionAnchor href="https://www.demostoke.com/" target='_blank' rel='noopener noreferrer'>
                            See the prototype
                          </WhiteTransitionAnchor>.
                        </li>
                      </DemoStokeList>
                    </section>
                    <section>
                      <h3>Learnings</h3>
                      <p>This case study was born from real interviews and market gaps. I learned:</p>
                      <DemoStokeList>
                        <li className='learning'>User trust is central to any peer-based platform.</li>
                        <li className='learning'>UX must speak the cultural language of the target audience.</li>
                        <li className='learning'>Foundational research is everything; it’s all about solving pain points.</li>
                      </DemoStokeList>
                    </section>
                    <section>
                      <h3>Next Steps</h3>
                      <DemoStokeList>
                        <li className='next-step'>Conduct field testing with riders in Tahoe and SoCal</li>
                        <li className='next-step'>Increase gear listings via referral/early access program</li>
                        <li className='next-step'>Explore local shop and shaper pilot program</li>
                        <li className='next-step'>Build and test AI-driven quiz and search results</li>
                        <li className='next-step'>Build and test anayltics dashboard</li>
                        <li className='next-step'>Build and test subscription program</li>
                      </DemoStokeList>
                    </section>
                    <section>
                      <h3>Links</h3>
                      <DemoStokeList>
                        <li className='prototype'>
                          <WhiteTransitionAnchor href="https://www.demostoke.com/" target='_blank' rel='noopener noreferrer'>
                            DemoStoke Interactive Prototype
                          </WhiteTransitionAnchor>
                        </li>
                      </DemoStokeList>
                    </section>
                  </div>
                </div>
              </BioBox>
            </Tabs.Content>

            <Tabs.Content value="tab2">
              <UserStories.IndieShaper />
              <UserStories.WeekendWarrior />
              <UserStories.SmallSkiBikeShop />
            </Tabs.Content>
          </Tabs.Root>
        </TabWrapper>
      </Wrapper>
      <FooterContent />
    </>
  );
};

export default DemoStokeContent;
