import {
  useAppDispatch,
  useAppSelector
} from '../hooks';
import {
  showMobileMenu,
  getMobileMenuState
} from '../showMobileMenuSlice';

import { BioBox, Wrapper, DemoStokeTitle, DemoStokeList, DemoStokeTable, WhiteTransitionAnchor } from '../../styles';
import { TopNavContent, FooterContent } from '.';

const AntisyphonContent = () => {
  const { isMobileMenuShown } = useAppSelector(getMobileMenuState);
  const dispatch = useAppDispatch();

  return (
    <>
      <TopNavContent />
      <Wrapper isMobileMenuShown={isMobileMenuShown}
        onClick={() => dispatch(showMobileMenu(false))}>
        <BioBox direction='right' noBottomPadding>
          <div className='biobox-inner demostoke-inner'>
            <div>
              <img className='ds-logo' src='/img/squares/demostoke-logo-ds-transparent-cropped.webp' alt='DemoStoke Logo' /><DemoStokeTitle>DemoStoke Case Study</DemoStokeTitle>
              <p>Peer-to-Peer Demo Marketplace for Snow, Surf, and Skate</p>
              🤙🏻 <WhiteTransitionAnchor href="https://demostoke.loveable.dev" target='_blank' rel='noopener noreferrer'>See the MVP</WhiteTransitionAnchor>
              <section>
                <h3>TL;DR (Executive Summary)</h3>
                <DemoStokeList>
                  <li><strong>What it is:</strong> A peer-to-peer platform where riders can demo gear from local owners.</li>
                  <li><strong>Problem:</strong> Riders want to try before they buy, but demos are rare, costly, and inconvenient.</li>
                  <li><strong>Solution:</strong> A location-based marketplace to safely connect riders and lenders.</li>
                  <li><strong>My Role:</strong> Founder, Product Lead, UX strategist, MVP architect.</li>
                </DemoStokeList>
              </section>
              <section>
                <h3>The Problem</h3>
                <p>Demo opportunities for rideable gear are limited, inconvenient, or nonexistent. Many riders either blindly purchase expensive equipment or wait for infrequent on-site demos. Meanwhile, gear sits unused in garages, with no platform to connect owners and riders.</p>
                <DemoStokeList>
                  <li>“I want to try before I buy but there’s nothing around me.”</li>
                  <li>“Shops only have limited brands.”</li>
                  <li>“I don’t want to buy a $750 surfboard I’ve never ridden.”</li>
                  <li>“Demo days at the beach and mountain are few and far inbetween.”</li>
                  <li>“I need more people to try my boards but doing demo days takes me away from shaping.”</li>
                  <li>“It would be cool to have all available demos, no matter who they’re from, in one place.”</li>
                  <li>“Could I have the demo shipped to me so I don’t waste time picking it up?”</li>
                  <li>“Demo boards at the resort are expensive and they have a limited selection.”</li>
                </DemoStokeList>
              </section>
              <section>
                <h3>Market Research & Competitive Analysis</h3>
                <p>Conducted user interviews and surveys with riders across snow, surf, and skate.
                  <br /><strong>Key insight:</strong> People would pay to demo gear if trust and ease were guaranteed.</p>
                <h3>Competitor Overview</h3>
                <DemoStokeTable>
                  <thead>
                    <tr>
                      <th>Feature</th>
                      <th>FriendWithA</th>
                      <th>The Quiver</th>
                      <th>DemoStoke</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Multi-sport</td>
                      <td>✅</td>
                      <td>✖️</td>
                      <td>✅</td>
                    </tr>
                    <tr>
                      <td>Targeted lifestyle branding</td>
                      <td>✖️</td>
                      <td>✅</td>
                      <td>✅</td>
                    </tr>
                    <tr>
                      <td>Verified users</td>
                      <td>✅</td>
                      <td>✖️</td>
                      <td>✅</td>
                    </tr>
                    <tr>
                      <td>Map-based discovery</td>
                      <td>✅</td>
                      <td>✅</td>
                      <td>✅</td>
                    </tr>
                    <tr>
                      <td>Community building</td>
                      <td>✖️</td>
                      <td>✖️</td>
                      <td>✅</td>
                    </tr>
                    <tr>
                      <td>Monthly membership</td>
                      <td>✖️</td>
                      <td>✖️</td>
                      <td>✅</td>
                    </tr>
                    <tr>
                      <td>P2P and B2C demos</td>
                      <td>✖️</td>
                      <td>✖️</td>
                      <td>✅</td>
                    </tr>
                  </tbody>
                </DemoStokeTable>
              </section>
              <section>
                <h3>Personas</h3>
                <DemoStokeList spaced>
                  <li><strong>Weekend Warrior:</strong> Rachel (34, San Diego) is a marketing manager who rides 1–2x/month. She wants to try before buying expensive gear but is frustrated by limited demo options. She looks to Instagram and friends for recs, and wants DemoStoke to offer trusted peer reviews, easy filters, and clear pickup info.</li>
                  <li><strong>Die-Hard:</strong> Chris (29, Truckee) is a remote developer who rides almost daily. He seeks variety in gear but shops don’t offer enough options. He’s active in forums and trades gear with friends. He wants DemoStoke to offer high-quality listings, flexible pickup, and rider reviews.</li>
                  <li><strong>Nomadic Renter:</strong> Maya (31, Santa Cruz) is a van-lifer and remote UX designer who rides 1–3x/week. She doesn’t want to own a ton of gear and struggles to find quality rentals in new locations. She wants DemoStoke to offer verified local lenders, easy gear specs, and fair prices.</li>
                  <li><strong>Local Shop Owner:</strong> Tony (45, South Lake Tahoe) co-owns a board shop and wants to run demos without building his own tech. He’s frustrated that most platforms don’t support niche gear. He wants DemoStoke to help list demo boards, drive traffic, and convert demos into sales.</li>
                  <li><strong>Local Shaper:</strong> Dustin (38, Ventura) is a known surfboard shaper trying to grow his reputation. He wants to organize demos and track who rides his boards but lacks the tools. He wants DemoStoke to offer a shaper-specific feature, demo tracking, and review visibility.</li>
                  <li><strong>Quiver Lender:</strong> Jessie (27, Encinitas) is a yoga instructor with extra boards. She wants to earn passive income but doesn’t trust Craigslist. She wants DemoStoke to provide a smooth listing flow, damage protection, reviews, and an earnings dashboard.</li>
                </DemoStokeList>

              </section>
              <section>
                <h3>MVP & UX Strategy</h3>
                <p>We focused on minimizing friction while maximizing trust. Key MVP features:</p>
                <DemoStokeList>
                  <li>Map-based gear discovery</li>
                  <li>Search filters by sport, location, and price</li>
                  <li>Gear profile pages with direct messaging</li>
                  <li>Mandatory verification with government ID</li>
                </DemoStokeList>
                <p><em>Out of Scope: Payments, insurance, shop onboarding</em></p>
              </section>
              <section>
                <h3>Build Process</h3>
                <DemoStokeList>
                  <li>Rapid interactive prototyping using Vite, React, and kickstarted by <WhiteTransitionAnchor href="https://demostoke.loveable.dev" target='_blank' rel='noopener noreferrer'>loveable.dev</WhiteTransitionAnchor></li>
                </DemoStokeList>
              </section>
              <section>
                <h3>Monetization</h3>
                <DemoStokeList>
                  <li>15% transaction fee on rentals</li>
                  <li>$49–$99/month for shop demo listings</li>
                  <li><strong>Future:</strong> Add-ons for insurance, verified listings, affiliate referrals</li>
                  <li><strong>Future:</strong> Monthly and yearly subscriptions with different price and demo tiers</li>
                </DemoStokeList>
              </section>
              <section>
                <h3>Learnings</h3>
                <p>This case study was born from real interviews and market gaps. I learned:</p>
                <DemoStokeList>
                  <li>User trust is central to any peer-based platform</li>
                  <li>UX must speak the cultural language of riders</li>
                  <li>Foundational research is everything; it’s all about solving pain points</li>
                </DemoStokeList>
              </section>
              <section>
                <h3>Next Steps</h3>
                <DemoStokeList>
                  <li>Conduct field testing with riders in Tahoe and SoCal</li>
                  <li>Increase gear listings via referral/early access program</li>
                  <li>Explore local shop and shaper pilot program</li>
                  <li>Test membership program</li>
                </DemoStokeList>
              </section>
              <section>
                <h3>Links</h3>
                <DemoStokeList>
                  <li>
                    <WhiteTransitionAnchor href="https://demostoke.loveable.dev" target='_blank' rel='noopener noreferrer'>DemoStoke MVP</WhiteTransitionAnchor>
                  </li>
                </DemoStokeList>
              </section>
            </div>
          </div>
        </BioBox>
      </Wrapper>
      <FooterContent />
    </>
  );
};

export default AntisyphonContent;
