import {
  BioBox,
  DemoStokeTitle,
  DemoStokeList,
  DemoStokeText,
  WhiteTransitionAnchor,
} from '../../../styles';

const DSLink = <WhiteTransitionAnchor href="https://demostoke.lovable.app/" target='_blank' rel='noopener noreferrer'>DemoStoke</WhiteTransitionAnchor>;

const WeekendWarrior = () => {
  return (
    <>
      <BioBox direction='right' noBottomPadding someTopPadding>
        <div className='biobox-inner demostoke-inner'>
          <div>
            <DemoStokeTitle>User Story: The Weekend Warrior</DemoStokeTitle>
            <p>
              Krista is a Tahoe-based snowboarder who values speed and precision, and won’t buy a new board
              without riding it first. Her frustrations with traditional demo events opened the door for {DSLink} as a more
              flexible, trustworthy, and convenient solution.
            </p>

            <section>
              <h3>Current Pain Points</h3>
              <DemoStokeList spaced>
                <li className='complaint'>
                  <strong>Inconvenient demo process:</strong> Resort demo days involve waivers and time-consuming binding swaps that interrupt her riding flow.
                </li>
                <li className='complaint'>
                  <strong>Lack of availability and timing:</strong> She often wants to try new boards with updated tech, but they aren’t available—or she misses the window because she just wants to ride.
                </li>
                <li className='complaint'>
                  <strong>Gear guesswork:</strong> She’s bought boots, bindings, and boards based on timing or availability, not fit—risking costly mismatches.
                </li>
                <li className='complaint'>
                  <strong>No platform to lend unused gear:</strong> She owns a board she never uses but never considered renting it out.
                </li>
                <li className='complaint'>
                  <strong>Trust concerns:</strong> She’s hesitant to demo unfamiliar gear without waxing, safety checks, or protection against damage.
                </li>
              </DemoStokeList>
            </section>

            <section>
              <h3>How DemoStoke Helps</h3>
              <DemoStokeList spaced>
                <li>
                  <strong>Frictionless try-before-you-buy:</strong> Krista can demo boards near the resort, on her own terms, without the hassle of traditional setup.
                  <p>She’s especially excited by the idea of being able to just grab and ride, with no binding swaps or paperwork holding her back.</p>
                </li>
                <li>
                  <strong>Safe and trustworthy rentals:</strong> Insurance, waivers, and ID verification make her feel safer lending or demoing gear through {DSLink}.
                  <p>She suggested a rental car-style damage waiver or refundable deposit model to protect both lenders and riders.</p>
                </li>
                <li>
                  <strong>Peer-to-peer gear access:</strong> Krista would list her unused powder board for $20–40/day, adjusting based on demand.
                  <p>She sees value in making use of idle gear and appreciated that good reviews could help others trust her listings.</p>
                </li>
                <li>
                  <strong>Flexible membership model:</strong> She’d pay $50–100/month to try up to 5 boards with insurance included, especially during seasons she’s hunting for a new setup.
                </li>
              </DemoStokeList>
            </section>

            <section>
              <h3>Use Case Scenario</h3>
              <DemoStokeText>
                Krista is planning her next powder day at Palisades. She logs into {DSLink} and spots a board she’s been curious about. It’s available for pickup 5 minutes from the resort. She grabs it, rides it all day, and decides it’s not quite the right fit—but she’s stoked she didn’t waste $600 guessing.
                <br /><br />
                The next weekend, she tries a different shape through the same app—this time it rips. She books it again and eventually buys it through the platform with confidence.
              </DemoStokeText>
            </section>

            <section>
              <h3>Why This Helps Riders Like Krista</h3>
              <DemoStokeList spaced>
                <li>
                  <strong>Gives her options she can trust:</strong> Reviews, ID verification, and damage waivers build the confidence she needs to participate.
                </li>
                <li>
                  <strong>Turns idle gear into passive income:</strong> She sees potential to rent out her rarely used gear while helping others ride more.
                </li>
                <li>
                  <strong>Supports experimentation and tech curiosity:</strong> Krista wants to try new tech (rocker shapes, materials) without full commitment.
                </li>
                <li>
                  <strong>Aligns with real riding flow:</strong> No more wasting powder days waiting at demo booths—{DSLink} fits into her actual ride plans.
                </li>
              </DemoStokeList>
            </section>
          </div>
        </div>
      </BioBox>
    </>
  );
};

export default WeekendWarrior;
