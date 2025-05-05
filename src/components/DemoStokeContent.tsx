import {
  useAppDispatch,
  useAppSelector
} from '../hooks';
import {
  showMobileMenu,
  getMobileMenuState
} from '../showMobileMenuSlice';

import { BioBox, Wrapper, DemoStokeTitle, DemoStokeList, DemoStokeTable } from '../../styles';
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
              <DemoStokeTitle>DemoStoke Case Study</DemoStokeTitle>
              <p>Peer-to-Peer Demo Marketplace for Surf, Snow, SUP, Skate</p>
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
                <p>Demo opportunities for rideable gear are limited, inconvenient, or nonexistent. Many riders either blindly purchase expensive equipment or wait for infrequent shop demos. Meanwhile, gear sits unused in garages, with no platform to connect owners and seekers.</p>
                <DemoStokeList>
                  <li>“I want to try before I buy but there’s nothing around me.”</li>
                  <li>“Shops only have limited brands.”</li>
                  <li>“I don’t want to buy a $750 surfboard I’ve never ridden.”</li>
                </DemoStokeList>
              </section>
              <section>
                <h3>Market Research & Competitive Analysis</h3>
                <p>Conducted 10 interviews and 27 survey responses with riders. Key insight: People would pay to demo gear <em>if</em> trust and ease were guaranteed.</p>
                <h3>Competitor Overview</h3>
                <DemoStokeTable>
                  <thead>
                    <tr>
                      <th>DemoStoke</th>
                      <th>FriendWithA</th>
                      <th>The Quiver</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Multi-sport</td>
                      <td>✖️</td>
                      <td>✖️</td>
                    </tr>
                    <tr>
                      <td>Targeted lifestyle branding</td>
                      <td>✖️</td>
                      <td>✅</td>
                    </tr>
                    <tr>
                      <td>Verified local riders</td>
                      <td>✖️</td>
                      <td>✖️</td>
                    </tr>
                    <tr>
                      <td>Community messaging</td>
                      <td>✖️</td>
                      <td>✖️</td>
                    </tr>
                    <tr>
                      <td>Map-based discovery</td>
                      <td>✅</td>
                      <td>✖️</td>
                    </tr>
                  </tbody>
                </DemoStokeTable>
              </section>
              <section>
                <h3>Personas</h3>
                <ul>
                  <li><strong>Weekend Warrior:</strong> Wants to try before buying, rides once/month</li>
                  <li><strong>Garage Lender:</strong> Owns multiple boards, open to monetizing unused gear</li>
                  <li><strong>Nomadic Renter:</strong> Traveler who doesn’t want to own bulky gear</li>
                  <li><strong>Shop Owner:</strong> Wants to run demos without building their own tech stack</li>
                </ul>
              </section>
              <section>
                <h3>MVP & UX Strategy</h3>
                <p>We focused on minimizing friction while maximizing trust. Key MVP features:</p>
                <ul>
                  <li>Map-based gear discovery</li>
                  <li>Search filters by sport, date, and price</li>
                  <li>Profile listings with direct messaging</li>
                </ul>
                <p><em>Out of Scope: Payments, insurance, shop onboarding</em></p>
              </section>
              <section>
                <h3>Build Process</h3>
                <ul>
                  <li>Wireframes and flows created in Figma</li>
                  <li>Prototype built in lovable.dev</li>
                  <li>Landing page, brand tone, and early SEO strategy defined</li>
                </ul>
              </section>
              <section>
                <h3>Monetization</h3>
                <DemoStokeList>
                  <li>15% transaction fee on rentals</li>
                  <li>$49–$99/month for shop demo listings</li>
                  <li>Future: Add-ons for insurance, verified listings, affiliate referrals</li>
                </DemoStokeList>
              </section>
              <section>
                <h3>Learnings</h3>
                <p>This case study was born from real interviews and market gaps. I learned:</p>
                <DemoStokeList>
                  <li>User trust is central to any peer-based platform</li>
                  <li>UX must speak the cultural language of riders</li>
                  <li>Foundational research makes everything smoother downstream</li>
                </DemoStokeList>
              </section>
              <section>
                <h3>Next Steps</h3>
                <DemoStokeList>
                  <li>Conduct field testing with riders in Tahoe and SoCal</li>
                  <li>Increase gear listings via referral/early access program</li>
                  <li>Explore local shop pilot program</li>
                </DemoStokeList>
              </section>
              <section>
                <h3>Links</h3>
                <DemoStokeList>
                  <li>
                    <a href="https://demostoke.loveable.dev" target='_blank' rel='noopener noreferrer'>DemoStoke MVP</a>
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
