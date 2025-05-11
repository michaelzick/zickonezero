import {
  BioBox,
  DemoStokeTitle,
  DemoStokeList,
  DemoStokeText,
  WhiteTransitionAnchor,
  FlexBox,
} from '../../../styles';

const IndyShaper = () => {
  const DSLink = <WhiteTransitionAnchor href="https://demostoke.lovable.app/" target='_blank' rel='noopener noreferrer'>DemoStoke</WhiteTransitionAnchor>;

  return (
    <>
      <BioBox direction='right' noBottomPadding top>
        <div className='biobox-inner demostoke-inner'>
          <div>
            <FlexBox>
              <img className='ds-logo' src='/img/squares/demostoke-logo-ds-transparent-cropped.webp' alt='DemoStoke Logo' />
              <h2 className='tab-header'>User Stories</h2>
            </FlexBox>
            <br />
            <DemoStokeTitle>The Independent Shaper</DemoStokeTitle>
            <p>
              From the lens of Curtis, an independent Southern California surfboard shaper, {DSLink} has the potential
              to radically simplify and expand his business by addressing key pain points around demo logistics, discovery,
              trust, and conversion.
            </p>

            <section>
              <h3>Current Pain Points</h3>
              <DemoStokeList spaced>
                <li className='complaint'>
                  <strong>High-effort demo days:</strong> Curtis manually hauls a van of boards to the beach, sets up, and hopes the right audience shows up. This is labor-intensive and hit-or-miss.
                </li>
                <li className='complaint'>
                  <strong>Limited reach:</strong> He relies on Instagram, local shops, and word-of-mouth. There’s no centralized platform that connects him with stoked, serious potential buyers.
                </li>
                <li className='complaint'>
                  <strong>Long wait times + uncertainty:</strong> Boards take 3–6 months to build. Buyers must commit a big deposit up front with no guarantee the board will ride well for them.
                </li>
                <li className='complaint'>
                  <strong>Eco-niche is under-leveraged:</strong> He builds eco-conscious boards, but there’s no scalable way to differentiate or educate the broader surf audience about that value.
                </li>
                <li className='complaint'>
                  <strong>SUPs are lucrative but hard to move:</strong> The price point is high, so buyers are even more hesitant to buy without trying.
                </li>
              </DemoStokeList>
            </section>

            <section>
              <h3>How DemoStoke Helps</h3>
              <DemoStokeList spaced>
                <li>
                  <strong>Low-effort, high-reach demo logistics:</strong> Instead of one demo day at one beach, Curtis can list all his demo boards on {DSLink} and have potential buyers reserve and try them on their own schedule.
                  <p>Boards can be stored with verified surf lockers, partner shops, or even designated reps. The app handles location, reservations, and messaging.</p>
                </li>
                <li>
                  <strong>Visibility beyond his bubble:</strong> {DSLink} attracts surfers specifically looking to try gear. It’s a highly targeted audience—people with intent to buy.
                  <p>His eco-conscious angle and hand-shaped custom boards get highlighted in his profile, making his values a selling point, not just a detail.</p>
                </li>
                <li>
                  <strong>Converts demos into deposits:</strong> The “Try Before You Buy” model builds trust. A surfer can try a board, love it, and put a deposit down through the app—no awkward sales push required.
                  <p>You can even use feedback from demo users to match surfers to the right shape.</p>
                </li>
                <li>
                  <strong>Bridges the trust gap for SUP buyers:</strong> SUPs are bulky and expensive. {DSLink} allows Curtis to offer local tryouts at beaches or shops without needing to be there himself.
                  <p>Reviews, demo history, and performance ratings can give hesitant buyers confidence before putting down thousands.</p>
                </li>
                <li>
                  <strong>Turns environmental values into a competitive edge:</strong> Boards can be tagged with attributes like “eco-epoxy,” “sustainable blanks,” or “bio-resin.” Surfers increasingly care about
                  sustainability—{DSLink} makes that visible at the decision-making stage.
                </li>
              </DemoStokeList>
            </section>

            <section>
              <h3>Use Case Scenario</h3>
              <DemoStokeText>
                Let’s say a surfer in San Clemente is curious about a 6’4 eco-friendly twin-fin but isn’t ready to commit $900 + a 4-month wait. They browse {DSLink}, see glowing reviews, reserve the demo
                for a Saturday morning pickup near Trestles, ride it, and love it.
                <br /><br />
                That evening, they tap Custom Order, upload photos of the waves they ride and their height/weight, and leave a deposit—all through the app.
                <br /><br />
                The shaper wakes up Sunday with a new order, a stoked rider, and zero beach setup effort.
              </DemoStokeText>
            </section>

            <section>
              <h3>Why This Helps Curtis Scale</h3>
              <DemoStokeList spaced>
                <li>
                  <strong>From 1-to-1 to many-to-1:</strong> He no longer needs to sell only through direct personal interactions.
                </li>
                <li>
                  <strong>More feedback, faster iteration:</strong> Demo feedback helps refine designs, understand trends, and guide inventory decisions.
                </li>
                <li>
                  <strong>New revenue streams:</strong> Curtis could even rent out boards on {DSLink} during the build waitlist to offset costs.
                </li>
                <li>
                  <strong>Geo-expansion:</strong> Surfboards can live and rotate in demo fleets in SD, LA, Ventura, and Santa Cruz without him ever leaving home.
                </li>
              </DemoStokeList>
            </section>
          </div>
        </div>
      </BioBox >
    </>
  );
};

export default IndyShaper;
