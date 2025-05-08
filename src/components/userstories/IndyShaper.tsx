import {
  BioBox,
  DemoStokeTitle,
  DemoStokeList,
} from '../../../styles';

const IndyShaper = () => {
  return (
    <>
      <BioBox direction='right' noBottomPadding>
        <div className='biobox-inner demostoke-inner'>
          <div>
            <img className='ds-logo' src='/img/squares/demostoke-logo-ds-transparent-cropped.webp' alt='DemoStoke Logo' /><DemoStokeTitle>User Story</DemoStokeTitle>
            <section>
              <h3>The Independent Shaper</h3>
              <p>Demo opportunities for rideable gear are limited, inconvenient, or nonexistent.
                Many riders either blindly purchase expensive equipment or wait for infrequent on-site demos.
                Meanwhile, gear sits unused in garages, with no unifying platform to connect owners and riders.</p>

              <h3>Current Complaints</h3>
              <DemoStokeList>
                <li className='complaint'>“I want to try before I buy but there’s nothing around me.”</li>
                <li className='complaint'>“Shops have limited brands and sizes.”</li>
                <li className='complaint'>“I don’t want to buy a $750 surfboard I’ve never ridden.”</li>
                <li className='complaint'>“Demo days at the beach or mountain are few and far inbetween.”</li>
                <li className='complaint'>“I need more people to try my boards but doing demo days takes me away from shaping.”</li>
                <li className='complaint'>“It would be cool to have all available demos, no matter who they’re from, in one place.”</li>
                <li className='complaint'>“Could I have the demo shipped to me so I don’t waste time picking it up?”</li>
                <li className='complaint'>“Demo boards at the resort are expensive and they have a limited selection.”</li>
                <li className='complaint'>“I want to try multiple pairs of skis before buying, but that gets very expensive.”</li>
                <li className='complaint'>“I’d like to get more people into my shop but I have a limited ad budget.”</li>
              </DemoStokeList>
            </section>
          </div>
        </div>
      </BioBox>
    </>
  );
};

export default IndyShaper;
