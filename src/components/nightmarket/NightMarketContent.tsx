import { Wrapper } from '../../../styles';
import { MarketLane, MarketRoot } from '../../../styles/nightMarket';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { generateFacade } from '../../lib/city/facade';
import { getMobileMenuState, showMobileMenu } from '../../showMobileMenuSlice';
import AlleyWall from '../city/AlleyWall';
import FooterContent from '../FooterContent';
import TopNavContent from '../TopNavContent';
import TrackedLink from '../TrackedLink';
import SynthStall from './SynthStall';

// Seeded, so the static HTML and the hydrated page draw the same lane.
const BACK_WALL = generateFacade({
  seed: 43,
  length: 2400,
  height: 760,
  groundHeight: 150,
  floorHeight: 60,
  windowWidth: 26,
  windowHeight: 28,
  windowGap: 16,
  minSegment: 280,
  maxSegment: 520,
  minRoof: 0.62,
  litChance: 0.2,
  coolShare: 0.2,
  unitChance: 0.12,
  maxUnits: 20,
  // No wall signs: their lettering would sit behind the title and caption.
  signs: 0,
  detailLength: 2400,
});

type Strand = { from: number; to: number; sag: number; bulbs: number };

// Two strands of festoon bulbs slung across the lane, in a 1000x140 box.
const STRANDS: readonly Strand[] = [
  { from: 18, to: 34, sag: 96, bulbs: 15 },
  { from: 46, to: 28, sag: 128, bulbs: 11 },
];

/** Point t (0 to 1) along a strand's quadratic curve, in whole units. */
const strandPoint = ({ from, to, sag }: Strand, t: number) => ({
  x: Math.round(1000 * t),
  y: Math.round((1 - t) ** 2 * from + 2 * (1 - t) * t * sag + t ** 2 * to),
});

const STRAND_ART = STRANDS.map((strand) => ({
  wire: `M0 ${strand.from}Q500 ${strand.sag} 1000 ${strand.to}`,
  bulbs: Array.from({ length: strand.bulbs }, (_, index) => strandPoint(strand, (index + 0.5) / strand.bulbs)),
}));

/**
 * The hidden Night Market, reached from the sign in the homepage alley: an
 * after-hours lane under festoon lights, with a synth stall whose counter
 * holds a playable Rackloose rack. The lane's scenery is decorative; the
 * heading, copy, links, and the rack are real.
 */
const NightMarketContent = () => {
  const { isMobileMenuShown } = useAppSelector(getMobileMenuState);
  const dispatch = useAppDispatch();

  return (
    <>
      <TopNavContent />
      <Wrapper
        isMobileMenuShown={isMobileMenuShown}
        isAtPage
        $isProjectPage
        onClick={() => dispatch(showMobileMenu(false))}
      >
        <MarketRoot>
          <MarketLane>
            <div className='lane-wall' aria-hidden='true'>
              <AlleyWall facade={BACK_WALL} fit='xMidYMax slice' />
            </div>

            <svg className='lane-lights' data-art viewBox='0 0 1000 140' preserveAspectRatio='none' focusable='false' aria-hidden='true'>
              {STRAND_ART.map(({ wire, bulbs }) => (
                <g key={wire}>
                  <path className='wire' d={wire} />
                  {bulbs.map(({ x, y }) => (
                    <g key={x} className='bulb'>
                      <path className='bulb-cap' d={`M${x} ${y}v6`} />
                      <circle cx={x} cy={y + 11} r={5} />
                    </g>
                  ))}
                </g>
              ))}
            </svg>

            <div className='lantern lantern-left' aria-hidden='true'><i /></div>
            <div className='lantern lantern-right' aria-hidden='true'><i /></div>

            <p className='lane-eyebrow'>
              After hours <span aria-hidden='true'>{'//'}</span> Back alley
            </p>
            <h1 className='lane-title'>Night Market</h1>
            <p className='lane-caption' lang='ru' aria-hidden='true'>НОЧНОЙ РЫНОК</p>
            <p className='lane-intro'>
              Off the main drag, a few stalls stay lit till dawn. Everything here is something I
              build after hours, just to see if it can be done.
            </p>
          </MarketLane>

          <SynthStall />

          <div className='market-exit'>
            <TrackedLink href='/' label='Back to the alley' location='night_market' section='exit' className='exit-link'>
              <span aria-hidden='true'>←</span> Back to the alley
            </TrackedLink>
          </div>
        </MarketRoot>
      </Wrapper>
      <FooterContent />
    </>
  );
};

export default NightMarketContent;
