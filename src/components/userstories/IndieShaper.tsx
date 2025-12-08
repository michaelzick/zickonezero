import { OpenInNewWindowIcon } from '@radix-ui/react-icons';
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

const IndieShaper = ({ wrapWithBioBox = true, setAnimatedSectionRef, visibleSections }: StoryProps) => {
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

  const content = (
    <div>
      <AnimatedSection {...getAnimateProps('story-introduction')}>
        <section id='story-introduction'>
          <FlexBox>
            <img className='ds-logo' src='/img/squares/demostoke-logo-square.webp' alt='DemoStoke Logo' />
            <div>
              <h2 className='tab-header page-header'>User Stories</h2>
              <PitchDeckLink href="https://www.demostoke.com/" target='_blank' rel='noopener noreferrer'>
                DemoStoke.com <OpenInNewWindowIcon aria-hidden="true" />
              </PitchDeckLink>
            </div>
          </FlexBox>
        </section>
      </AnimatedSection>

      <AnimatedSection {...getAnimateProps('story-independent-surfboard-shaper-title')}>
        <section id='story-independent-surfboard-shaper-title' className='story-section'>
          <DemoStokeTitle $noMobileTopPad>The Independent Surfboard Shaper</DemoStokeTitle>
          <DemoStokeHeroAbstractLayout>
            <DemoStokeStoryHero
              className='image-animate'
              src='/img/demostoke/pop-art-shaper.webp'
              alt='Independent surfboard shaper with demo boards'
              loading='lazy'
            />

            <DemoStokeTldrSection className='text-animate' $borderless>
              <DemoStokeTldrTitle>Abstract</DemoStokeTldrTitle>
              <DemoStokeTldrCopy>
                From the lens of Curtis, an independent Southern California surfboard shaper, {DSLink} had the potential to radically simplify and expand his business by addressing key pain points around demo logistics, discovery, trust, and conversion.
              </DemoStokeTldrCopy>
            </DemoStokeTldrSection>
          </DemoStokeHeroAbstractLayout>
        </section>
      </AnimatedSection>

      <AnimatedSection {...getAnimateProps('story-independent-surfboard-shaper-pain')}>
        <section className='story-section'>
          <h3>Current Pain Points</h3>
          {renderTable(painPoints)}
        </section>
      </AnimatedSection>

      <AnimatedSection {...getAnimateProps('story-independent-surfboard-shaper-helps')}>
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
    <BioBox direction='right' noBottomPadding top>
      <div className='biobox-inner demostoke-inner'>
        {content}
      </div>
    </BioBox>
  );
};

export default IndieShaper;
