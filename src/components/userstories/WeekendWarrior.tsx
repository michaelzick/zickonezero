import { type ReactNode } from 'react';
import {
  BioBox,
  DemoStokeTitle,
  DemoStokeTwoColumnLayout,
  DemoStokeTwoColumnRow,
  DemoStokeTwoColumnHeader,
  DemoStokeTwoColumnCopy,
  WhiteTransitionAnchor,
  DemoStokeTldrSection,
  DemoStokeTldrTitle,
  DemoStokeTldrCopy,
  DemoStokeStoryHero,
  DemoStokeHeroAbstractLayout,
} from '../../../styles';
import HelpsCarousel from './HelpsCarousel';
import WhyHighlights from './WhyHighlights';

type StoryProps = {
  wrapWithBioBox?: boolean;
};

const WeekendWarrior = ({ wrapWithBioBox = true }: StoryProps) => {
  const DSLink = <WhiteTransitionAnchor href="https://www.demostoke.com/" target='_blank' rel='noopener noreferrer'>DemoStoke</WhiteTransitionAnchor>;

  const renderTable = (
    items: { title: string; description: ReactNode; }[],
    options?: { variant?: 'default' | 'tinted'; }
  ) => {
    const isTinted = options?.variant === 'tinted';
    return (
      <DemoStokeTwoColumnLayout $variant={isTinted ? 'tinted' : undefined}>
        {items.map(({ title, description }) => (
          <DemoStokeTwoColumnRow key={title} $isBorderless={isTinted}>
            <DemoStokeTwoColumnHeader>{title}</DemoStokeTwoColumnHeader>
            <DemoStokeTwoColumnCopy>{description}</DemoStokeTwoColumnCopy>
          </DemoStokeTwoColumnRow>
        ))}
      </DemoStokeTwoColumnLayout>
    );
  };

  const painPoints = [
    {
      title: 'Inconvenient demo process',
      description: 'Resort demo days involved waivers and binding swaps that interrupted her riding flow.'
    },
    {
      title: 'Limited availability and timing',
      description: 'She often wanted to try new boards with updated tech, but they weren’t available or she missed the window.'
    },
    {
      title: 'Gear guesswork',
      description: 'She risked costly mismatches buying boots, bindings, and boards based on timing or availability instead of fit.'
    },
    {
      title: 'No platform to lend unused gear',
      description: 'She owned a board she never used but hadn’t considered renting it out.'
    },
    {
      title: 'Trust concerns',
      description: 'She was hesitant to demo unfamiliar gear without waxing, safety checks, or protection against damage.'
    }
  ];

  const howHelps = [
    {
      title: 'Frictionless try-before-you-buy',
      description: (
        <>
          Krista could demo boards near the resort on her own terms, without traditional setup hassles. She loved being able to just grab and ride.
        </>
      )
    },
    {
      title: 'Safe and trustworthy rentals',
      description: (
        <>
          Insurance, waivers, and ID verification made her feel safer lending or demoing gear through {DSLink}. Insurance add-ons or refundable deposits protected riders and lenders.
        </>
      )
    },
    {
      title: 'Peer-to-peer gear access',
      description: (
        <>
          She would list her unused powder board for $20–40/day, making use of idle gear and earning trust through reviews.
        </>
      )
    },
    {
      title: 'Flexible subscription model',
      description: 'She would pay $50–100/month to try up to 5 boards with insurance included, especially during seasons she hunted for a new setup.'
    }
  ];

  const whyHelps = [
    {
      title: 'Gives her options she can trust',
      description: 'Reviews, ID verification, and damage waivers built the confidence she needed to participate.'
    },
    {
      title: 'Turns idle gear into income',
      description: 'She saw potential to rent out rarely used gear while helping others ride more.'
    },
    {
      title: 'Supports experimentation',
      description: 'She wanted to try new tech without full commitment.'
    },
    {
      title: 'Aligns with real riding flow',
      description: (
        <>
          No more wasting powder days waiting at demo booths—{DSLink} fit into her actual ride plans.
        </>
      )
    }
  ];

  const content = (
    <div>
      <section id='story-weekend-warrior' className='story-section'>
        <DemoStokeTitle $noMobileTopPad>The Weekend Warrior</DemoStokeTitle>
        <DemoStokeHeroAbstractLayout>
          <DemoStokeStoryHero
            src='/img/demostoke/snowboard-girl-cp.webp'
            alt='Snowboarder carrying her board'
            loading='lazy'
          />

          <DemoStokeTldrSection $borderless>
            <DemoStokeTldrTitle>Abstract</DemoStokeTldrTitle>
            <DemoStokeTldrCopy>
              Krista is a snowboarder who valued speed and precision, and wouldn’t buy a new board without riding it first. Her frustrations with traditional demo events opened the door for {DSLink} as a more flexible, trustworthy, and convenient solution.
            </DemoStokeTldrCopy>
          </DemoStokeTldrSection>
        </DemoStokeHeroAbstractLayout>
      </section>

      <section className='story-section'>
        <h3>Current Pain Points</h3>
        {renderTable(painPoints)}
      </section>

      <section className='story-section'>
        <HelpsCarousel items={howHelps} title='How DemoStoke Helps' />
      </section>

      <section className='story-section'>
        <h3>Why This Helps Riders Like Krista</h3>
        <WhyHighlights items={whyHelps} />
      </section>
    </div>
  );

  if (!wrapWithBioBox) {
    return content;
  }

  return (
    <BioBox direction='right' noBottomPadding someTopPadding>
      <div className='biobox-inner demostoke-inner'>
        {content}
      </div>
    </BioBox>
  );
};

export default WeekendWarrior;
