import { FileTextIcon } from '@radix-ui/react-icons';
import { type ReactNode } from 'react';
import {
  BioBox,
  DemoStokeTitle,
  DemoStokeTwoColumnLayout,
  DemoStokeTwoColumnRow,
  DemoStokeTwoColumnHeader,
  DemoStokeTwoColumnCopy,
  WhiteTransitionAnchor,
  FlexBox,
  PitchDeckLink,
  DemoStokeTldrSection,
  DemoStokeTldrTitle,
  DemoStokeTldrCopy,
} from '../../../styles';
import HelpsCarousel from './HelpsCarousel';

type StoryProps = {
  wrapWithBioBox?: boolean;
};

const IndieShaper = ({ wrapWithBioBox = true }: StoryProps) => {
  const DSLink = <WhiteTransitionAnchor href="https://www.demostoke.com/" target='_blank' rel='noopener noreferrer'>DemoStoke</WhiteTransitionAnchor>;

  const renderTable = (items: { title: string; description: ReactNode; }[]) => (
    <DemoStokeTwoColumnLayout>
      {items.map(({ title, description }) => (
        <DemoStokeTwoColumnRow key={title}>
          <DemoStokeTwoColumnHeader>{title}</DemoStokeTwoColumnHeader>
          <DemoStokeTwoColumnCopy>{description}</DemoStokeTwoColumnCopy>
        </DemoStokeTwoColumnRow>
      ))}
    </DemoStokeTwoColumnLayout>
  );

  const painPoints = [
    {
      title: 'High-effort demo days',
      description: 'Curtis manually hauled a van of boards to the beach, set up, and hoped the right audience showed up—labor-intensive and hit-or-miss.'
    },
    {
      title: 'Limited reach',
      description: 'He relied on Instagram, local shops, and word-of-mouth with no centralized platform to connect him with serious buyers.'
    },
    {
      title: 'Long wait times + uncertainty',
      description: 'Boards took 3–6 months to build, requiring big deposits with no guarantee the board would ride well.'
    },
    {
      title: 'Eco-niche under-leveraged',
      description: 'His eco-conscious boards weren’t visible enough to differentiate or educate a broader surf audience.'
    }
  ];

  const howHelps = [
    {
      title: 'Low-effort, high-reach demos',
      description: (
        <>
          Curtis could list demo boards on {DSLink} and let buyers reserve and try them on their own schedule, with storage through lockers, shops, or reps.
        </>
      )
    },
    {
      title: 'Visibility beyond his bubble',
      description: (
        <>
          {DSLink} attracted surfers seeking to try gear; his eco angle and hand-shaped boards were highlighted to make values a selling point.
        </>
      )
    },
    {
      title: 'Converts demos into deposits',
      description: (
        <>
          “Try Before You Buy” built trust so surfers could demo, love a board, and place deposits through the app—without awkward sales pushes.
        </>
      )
    },
    {
      title: 'Eco as a competitive edge',
      description: 'Boards could be tagged with attributes like eco-epoxy or bio-resin so sustainability influenced decisions at the right moment.'
    }
  ];

  const whyScale = [
    {
      title: 'From 1-to-1 to many-to-1',
      description: 'Sales no longer depended solely on direct personal interactions.'
    },
    {
      title: 'More feedback, faster iteration',
      description: 'Demo feedback refined designs, revealed trends, and guided inventory.'
    },
    {
      title: 'New revenue streams',
      description: (
        <>
          Curtis could even rent out boards on {DSLink} during build waitlists to offset costs.
        </>
      )
    },
    {
      title: 'Geo-expansion',
      description: 'Demo fleets could rotate across SD, LA, Ventura, and Santa Cruz without him leaving home.'
    }
  ];

  const content = (
    <div>
      <section id='story-introduction' aria-hidden='true'>
        <FlexBox>
          <img className='ds-logo' src='/img/squares/demostoke-logo-square.webp' alt='DemoStoke Logo' />
          <div>
            <h2 className='tab-header page-header'>User Stories</h2>
            <PitchDeckLink href="/demostoke-investor-deck.pdf" target='_blank' rel='noopener noreferrer'>
              Investor Pitch Deck <FileTextIcon aria-hidden="true" />
            </PitchDeckLink>
          </div>
        </FlexBox>
      </section>

      <section id='story-independent-surfboard-shaper-title' className='story-section'>
        <DemoStokeTitle>The Independent Surfboard Shaper</DemoStokeTitle>

        <DemoStokeTldrSection>
          <DemoStokeTldrTitle>Abstract</DemoStokeTldrTitle>
          <DemoStokeTldrCopy>
            From the lens of Curtis, an independent Southern California surfboard shaper, {DSLink} had the potential to radically simplify and expand his business by addressing key pain points around demo logistics, discovery, trust, and conversion.
          </DemoStokeTldrCopy>
        </DemoStokeTldrSection>
      </section>

      <section className='story-section'>
        <h3>Current Pain Points</h3>
        {renderTable(painPoints)}
      </section>

      <section className='story-section'>
        <HelpsCarousel items={howHelps} title='How DemoStoke Helps' />
      </section>

      <section className='story-section'>
        <h3>Why This Helps Curtis Scale</h3>
        {renderTable(whyScale)}
      </section>
    </div>
  );

  if (!wrapWithBioBox) {
    return content;
  }

  return (
    <BioBox direction='right' noBottomPadding top>
      <div className='biobox-inner demostoke-inner'>
        {content}
      </div>
    </BioBox>
  );
};

export default IndieShaper;
