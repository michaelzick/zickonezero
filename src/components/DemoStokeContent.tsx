import {
  useAppDispatch,
  useAppSelector
} from '../hooks';
import {
  showMobileMenu,
  getMobileMenuState
} from '../showMobileMenuSlice';

import { BioBox, Wrapper } from '../../styles';
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
          <div className='biobox-inner'>
            <div>
              <h2 className="text-4xl font-bold">DemoStoke Case Study</h2>
              <p className="text-xl">Peer-to-Peer Demo Marketplace for Riders: Surf, Snow, SUP, Skate</p>
              <section>
                <h3 className="text-2xl font-semibold">TL;DR (Executive Summary)</h3>
                <ul className="list-disc list-inside space-y-1">
                  <li><strong>What it is:</strong> A peer-to-peer platform where riders can demo gear from local owners.</li>
                  <li><strong>Problem:</strong> Riders want to try before they buy, but demos are rare, costly, and inconvenient.</li>
                  <li><strong>Solution:</strong> A location-based marketplace to safely connect riders and lenders.</li>
                  <li><strong>My Role:</strong> Founder, Product Lead, UX strategist, MVP architect.</li>
                </ul>
              </section>
              <section>
                <h3 className="text-2xl font-semibold">The Problem</h3>
                <p>Demo opportunities for rideable gear are limited, inconvenient, or nonexistent. Many riders either blindly purchase expensive equipment or wait for infrequent shop demos. Meanwhile, gear sits unused in garages, with no platform to connect owners and seekers.</p>
                <ul className="list-disc list-inside mt-2">
                  <li>“I want to try before I buy but there’s nothing around me.”</li>
                  <li>“Shops only have limited brands.”</li>
                  <li>“I don’t want to buy a $900 surfboard I’ve never ridden.”</li>
                </ul>
              </section>
              <section>
                <h3 className="text-2xl font-semibold">Market Research & Competitive Analysis</h3>
                <p className="mt-2">Conducted 10 interviews and 27 survey responses with riders. Key insight: People would pay to demo gear <em>if</em> trust and ease were guaranteed.</p>
                <h3 className="text-xl font-medium mt-4">Competitor Overview</h3>
                <table className="table-auto border mt-2">
                  <thead>
                    <tr>
                      <th className="border px-4 py-2">DemoStoke</th>
                      <th className="border px-4 py-2">FriendWithA</th>
                      <th className="border px-4 py-2">The Quiver</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border px-4 py-2">Multi-sport</td>
                      <td className="border px-4 py-2">✖️</td>
                      <td className="border px-4 py-2">✖️</td>
                    </tr>
                    <tr>
                      <td className="border px-4 py-2">Targeted lifestyle branding</td>
                      <td className="border px-4 py-2">✖️</td>
                      <td className="border px-4 py-2">✅</td>
                    </tr>
                    <tr>
                      <td className="border px-4 py-2">Verified local riders</td>
                      <td className="border px-4 py-2">✖️</td>
                      <td className="border px-4 py-2">✖️</td>
                    </tr>
                    <tr>
                      <td className="border px-4 py-2">Community messaging</td>
                      <td className="border px-4 py-2">✖️</td>
                      <td className="border px-4 py-2">✖️</td>
                    </tr>
                    <tr>
                      <td className="border px-4 py-2">Map-based discovery</td>
                      <td className="border px-4 py-2">✅</td>
                      <td className="border px-4 py-2">✖️</td>
                    </tr>
                  </tbody>
                </table>
              </section>
              <section>
                <h3 className="text-2xl font-semibold">Personas</h3>
                <ul className="list-disc list-inside space-y-1">
                  <li><strong>Weekend Warrior:</strong> Wants to try before buying, rides once/month</li>
                  <li><strong>Garage Lender:</strong> Owns multiple boards, open to monetizing unused gear</li>
                  <li><strong>Nomadic Renter:</strong> Traveler who doesn’t want to own bulky gear</li>
                  <li><strong>Shop Owner:</strong> Wants to run demos without building their own tech stack</li>
                </ul>
              </section>
              <section>
                <h3 className="text-2xl font-semibold">MVP & UX Strategy</h3>
                <p>We focused on minimizing friction while maximizing trust. Key MVP features:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Map-based gear discovery</li>
                  <li>Search filters by sport, date, and price</li>
                  <li>Profile listings with direct messaging</li>
                </ul>
                <p className="mt-2 italic">Out of Scope: Payments, insurance, shop onboarding</p>
              </section>
              <section>
                <h3 className="text-2xl font-semibold">Build Process</h3>
                <ul className="list-disc list-inside space-y-1">
                  <li>Wireframes and flows created in Figma</li>
                  <li>Prototype built in lovable.dev</li>
                  <li>Landing page, brand tone, and early SEO strategy defined</li>
                </ul>
              </section>
              <section>
                <h3 className="text-2xl font-semibold">Monetization</h3>
                <ul className="list-disc list-inside space-y-1">
                  <li>15% transaction fee on rentals</li>
                  <li>$49–$99/month for shop demo listings</li>
                  <li>Future: Add-ons for insurance, verified listings, affiliate referrals</li>
                </ul>
              </section>
              <section>
                <h3 className="text-2xl font-semibold">Learnings</h3>
                <p>This case study was born from real interviews and market gaps. I learned:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>User trust is central to any peer-based platform</li>
                  <li>UX must speak the cultural language of riders</li>
                  <li>Foundational research makes everything smoother downstream</li>
                </ul>
              </section>
              <section>
                <h3 className="text-2xl font-semibold">Next Steps</h3>
                <ul className="list-disc list-inside space-y-1">
                  <li>Conduct field testing with riders in Tahoe and SoCal</li>
                  <li>Increase gear listings via referral/early access program</li>
                  <li>Explore local shop pilot program</li>
                </ul>
              </section>
              <section>
                <h3 className="text-2xl font-semibold">Links</h3>
                <ul className="list-disc list-inside">
                  <li><a href="#" className="text-blue-600 hover:underline">Live MVP (lovable.dev)</a></li>
                  <li><a href="#" className="text-blue-600 hover:underline">Figma Prototype</a></li>
                  <li><a href="#" className="text-blue-600 hover:underline">Notion Case Study</a></li>
                </ul>
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
