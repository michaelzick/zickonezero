import {
  BioBox,
  DemoStokeTitle,
  DemoStokeList,
  DemoStokeText,
  WhiteTransitionAnchor,
} from '../../../styles';

const DSLink = <WhiteTransitionAnchor href="https://www.demostoke.com/" target='_blank' rel='noopener noreferrer'>DemoStoke</WhiteTransitionAnchor>;

const SmallSkiBikeShop = () => {
  return (
    <>
      <BioBox direction='right' noBottomPadding someTopPadding>
        <div className='biobox-inner demostoke-inner'>
          <div>
            <DemoStokeTitle>The Small Ski & Bike Shop</DemoStokeTitle>
            <p>
              For Jason, the owner of <strong>Town & Country Outfitters</strong>, a high-end ski and bike shop in a mountain town, {DSLink} offers a way to modernize without losing what makes his shop personal and trusted. DemoStoke solves his toughest problems around demo logistics, digital visibility, and customer trust.
            </p>

            <section>
              <h3>Current Pain Points</h3>
              <DemoStokeList spaced>
                <li className='complaint'>
                  <strong>Clunky demo process:</strong> Jason still uses paper forms and waivers for all rentals and demos. Digital systems have felt too expensive or confusing to adopt.
                </li>
                <li className='complaint'>
                  <strong>Premium demos are hidden behind generic terms:</strong> High-end demo gear is labeled “Premium Rentals,” but there’s no easy way to know what brand or model you’re getting.
                </li>
                <li className='complaint'>
                  <strong>In-store knowledge bottleneck:</strong> The gear you get depends on the associate helping you. The website doesn’t list real-time gear, so customers arrive uncertain.
                </li>
                <li className='complaint'>
                  <strong>One-off demo days:</strong> The shop runs big demo events at Mountain View once or twice a year, but these are resource-heavy and miss most of the season’s foot traffic.
                </li>
                <li className='complaint'>
                  <strong>No real-time inventory online:</strong> Their Lightspeed POS manages gear, but there’s no sync to their website to show what’s actually available to try or rent.
                </li>
              </DemoStokeList>
            </section>

            <section>
              <h3>How DemoStoke Helps</h3>
              <DemoStokeList spaced>
                <li>
                  <strong>Paperless demos with full gear visibility:</strong> {DSLink} connects to Lightspeed to pull in real-time gear listings. Demo boards, skis, or bikes are listed by brand, model, size, and condition.
                  <p>No more paper forms. Customers sign waivers, pick dates, and reserve gear digitally—reducing staff time and improving the experience.</p>
                </li>
                <li>
                  <strong>Premium gear becomes discoverable:</strong> Instead of “Premium Rental,” Jason can show exactly what’s in the fleet: a Never Summer Proto Synthesis, a Santa Cruz Megatower, or Nordica Enforcer 100.
                  <p>This helps sell the value of trying before buying, especially for high-end customers.</p>
                </li>
                <li>
                  <strong>Improves trust and decision-making:</strong> Demo gear has reviews, usage history, and verified ratings. Customers can compare setups and reserve confidently.
                </li>
                <li>
                  <strong>Always-on demo days:</strong> Instead of waiting for an event, riders can test gear whenever it’s available. The mountain becomes a rolling demo hub.
                  <p>This builds a new channel of engagement without needing more staff.</p>
                </li>
                <li>
                  <strong>Light integration, big results:</strong> Jason doesn’t have to overhaul his site—{DSLink} becomes the gear discovery portal, syncing directly with Lightspeed and handling the UX lift.
                </li>
              </DemoStokeList>
            </section>

            <section>
              <h3>Use Case Scenario</h3>
              <DemoStokeText>
                A local rider wants to try a Never Summer snowboard before buying. He visits Town & Country’s {DSLink} page, sees that a 158cm Proto Synthesis is available for demo, and books it for this weekend.
                <br /><br />
                He picks it up Saturday morning after signing the waiver digitally. He rides it at Mountain View, loves it, and leaves a 5-star review.
                <br /><br />
                That night, he places an order for a brand new one—picked up the next week. Jason never had to explain sizing or features—the app did that work.
              </DemoStokeText>
            </section>

            <section>
              <h3>Why This Helps Jason Scale</h3>
              <DemoStokeList spaced>
                <li>
                  <strong>Streamlined workflow:</strong> Staff spends less time on paper forms and more time helping customers find the right gear.
                </li>
                <li>
                  <strong>Converts demo into retail:</strong> Customers who try gear are more confident buyers. Jason sees more sales with less friction.
                </li>
                <li>
                  <strong>Smart inventory utilization:</strong> Gear not being used can now be earning money or helping convert new buyers.
                </li>
                <li>
                  <strong>Expands market reach:</strong> Vacationers and new locals find the shop through DemoStoke’s gear discovery tools—not just Google Maps.
                </li>
              </DemoStokeList>
            </section>
          </div>
        </div>
      </BioBox >
    </>
  );
};

export default SmallSkiBikeShop;
