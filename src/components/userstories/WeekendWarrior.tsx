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
import { AnimatedSection } from '../../../styles/projectShowcases';
import HelpsCarousel from './HelpsCarousel';

type StoryProps = {
  wrapWithBioBox?: boolean;
  setAnimatedSectionRef?: (id: string) => (el: HTMLDivElement | null) => void;
  visibleSections?: Record<string, boolean>;
};

const WeekendWarrior = ({ wrapWithBioBox = true, setAnimatedSectionRef, visibleSections }: StoryProps) => {
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

  const getAnimateProps = (id: string) => ({
    ref: setAnimatedSectionRef ? setAnimatedSectionRef(id) : undefined,
    'data-animate-id': id,
    className: visibleSections ? (visibleSections[id] ? 'visible' : undefined) : 'visible'
  });

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

  const content = (
    <div>
      <AnimatedSection {...getAnimateProps('story-weekend-warrior')}>
        <section id='story-weekend-warrior' className='story-section'>
          <DemoStokeTitle $noMobileTopPad>The Weekend Warrior</DemoStokeTitle>
          <DemoStokeHeroAbstractLayout>
            <DemoStokeStoryHero
              className='image-animate'
              src='/img/demostoke/pop-art-snowboarder.webp'
              alt='Snowboarder carrying her board'
              loading='lazy'
            />

            <DemoStokeTldrSection className='text-animate' $borderless>
              <DemoStokeTldrTitle>Abstract</DemoStokeTldrTitle>
              <DemoStokeTldrCopy>
                Krista is a snowboarder who valued speed and precision, and wouldn’t buy a new board without riding it first. Her frustrations with traditional demo events opened the door for {DSLink} as a more flexible, trustworthy, and convenient solution.
              </DemoStokeTldrCopy>
            </DemoStokeTldrSection>
          </DemoStokeHeroAbstractLayout>
        </section>
      </AnimatedSection>

      <AnimatedSection {...getAnimateProps('story-weekend-warrior-pain')}>
        <section className='story-section'>
          <h3>Current Pain Points</h3>
          {renderTable(painPoints)}
        </section>
      </AnimatedSection>

      <AnimatedSection {...getAnimateProps('story-weekend-warrior-helps')}>
        <section className='story-section'>
          <HelpsCarousel items={howHelps} title='How DemoStoke Helps' />
        </section>
      </AnimatedSection>
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
