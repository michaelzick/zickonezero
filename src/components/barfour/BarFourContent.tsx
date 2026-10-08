import { useRef } from 'react';

import { Wrapper } from '../../../styles';
import { ClubRoot, ClubScene } from '../../../styles/barFour';
import { useAppDispatch, useAppSelector } from '../../hooks';
import useSceneMotion from '../../hooks/useSceneMotion';
import { generateRecordWall, RECORD_TONES } from '../../lib/city/recordWall';
import { getMobileMenuState, showMobileMenu } from '../../showMobileMenuSlice';
import FooterContent from '../FooterContent';
import TopNavContent from '../TopNavContent';
import TrackedLink from '../TrackedLink';
import RackBooth from './RackBooth';

// Seeded, so the static HTML and the hydrated page draw the same records.
const RECORD_WALL = generateRecordWall({
  seed: 404,
  width: 1600,
  height: 560,
  rows: 4,
  shelfThickness: 8,
  minSpine: 6,
  maxSpine: 14,
  minRun: 5,
  maxRun: 14,
  maxDrop: 46,
  sleeves: 6,
});

const SPINES = RECORD_TONES
  .map((tone, index) => ({ tone, d: RECORD_WALL.spines[index] }))
  .filter(({ d }) => d !== '');

const SLEEVES = RECORD_WALL.sleeves.map(({ x, y, size, tone }) => ({
  key: `${x}-${y}`,
  tone: RECORD_TONES[tone],
  x,
  y,
  size,
  cx: x + Math.round(size / 2),
  cy: y + Math.round(size / 2),
  ring: Math.round(size * 0.3),
  label: Math.round(size * 0.09),
}));

type Signal = 'audio' | 'cv' | 'gate';
type Cable = { from: number; to: number; sag: number; signal: Signal };

// Patch cables slung between jacks in the ceiling rail, in Rackloose's own
// signal colors, in a 1200x160 box. Jacks sit every 48 units from 24.
const JACKS = Array.from({ length: 25 }, (_, index) => 24 + index * 48);
const CABLES: readonly Cable[] = [
  { from: 120, to: 264, sag: 92, signal: 'cv' },
  { from: 72, to: 504, sag: 150, signal: 'audio' },
  { from: 312, to: 840, sag: 128, signal: 'cv' },
  { from: 600, to: 1032, sag: 156, signal: 'gate' },
  { from: 888, to: 1128, sag: 100, signal: 'audio' },
];

const JACK_HOLES = JACKS.map((x) => `M${x - 6} 12a6 6 0 1 0 12 0a6 6 0 1 0 -12 0`).join('');
const CABLE_ART = CABLES.map(({ from, to, sag, signal }) => ({
  key: `${from}-${to}`,
  signal,
  cord: `M${from} 30C${from} ${sag} ${to} ${sag} ${to} 30`,
  plugs: `M${from - 5} 12h10v20h-10zM${to - 5} 12h10v20h-10z`,
}));

/**
 * Bar Four, reached from the sign in the homepage alley: a basement listening
 * bar, record exchange, and club, wired like a modular rack, with the house
 * Rackloose rack open in the booth after dark. The room is decorative; the
 * heading, copy, links, and the rack are real.
 */
const BarFourContent = () => {
  const { isMobileMenuShown } = useAppSelector(getMobileMenuState);
  const dispatch = useAppDispatch();
  const sceneRef = useRef<HTMLElement | null>(null);
  // The light beams sweep only while the room is on screen.
  useSceneMotion(sceneRef);

  return (
    <>
      <TopNavContent />
      <Wrapper
        isMobileMenuShown={isMobileMenuShown}
        isAtPage
        $isProjectPage
        onClick={() => dispatch(showMobileMenu(false))}
      >
        <ClubRoot>
          <ClubScene ref={sceneRef}>
            <div className='record-wall' aria-hidden='true'>
              <svg
                data-art
                viewBox={`0 0 ${RECORD_WALL.width} ${RECORD_WALL.height}`}
                preserveAspectRatio='xMidYMax slice'
                focusable='false'
              >
                {SPINES.map(({ tone, d }) => (
                  <path key={tone} className={`spine record-${tone}`} d={d} />
                ))}
                {SLEEVES.map(({ key, tone, x, y, size, cx, cy, ring, label }) => (
                  <g key={key} className={`sleeve record-${tone}`}>
                    <rect x={x} y={y} width={size} height={size} />
                    <circle className='sleeve-ring' cx={cx} cy={cy} r={ring} />
                    <circle className='sleeve-label' cx={cx} cy={cy} r={label} />
                  </g>
                ))}
                <path className='shelf' d={RECORD_WALL.shelves} />
              </svg>
            </div>

            <div className='dance-floor' aria-hidden='true'><i /></div>

            <div className='speaker speaker-left' aria-hidden='true'><i /><i /><i /></div>
            <div className='speaker speaker-right' aria-hidden='true'><i /><i /><i /></div>

            <div className='light light-left' aria-hidden='true'><i /></div>
            <div className='light light-right' aria-hidden='true'><i /></div>

            <svg
              className='patch-rail'
              data-art
              viewBox='0 0 1200 160'
              preserveAspectRatio='xMidYMin slice'
              focusable='false'
              aria-hidden='true'
            >
              <path className='rail' d='M0 0h1200v24h-1200z' />
              <path className='jack' d={JACK_HOLES} />
              {CABLE_ART.map(({ key, signal, cord, plugs }) => (
                <g key={key} className={`cable cable-${signal}`}>
                  <path className='cord' d={cord} />
                  <path className='plug' d={plugs} />
                </g>
              ))}
            </svg>

            <p className='club-eyebrow'>
              Downstairs <span aria-hidden='true'>{'//'}</span> Off the alley
            </p>
            <h1 className='club-title'>Bar Four</h1>
            <p className='club-caption' lang='ru' aria-hidden='true'>БАР ЧЕТЫРЕ</p>
            <p className='club-intro'>
              Every phrase has a bar four, the turnaround where the fill drops. Down here it&apos;s a
              listening bar, a record exchange, and an open booth till dawn. Everything on the racks is
              something I build after hours, just to see if it can be done.
            </p>
          </ClubScene>

          <RackBooth />

          <div className='club-exit'>
            <TrackedLink href='/' label='Back up to the alley' location='bar_four' section='exit' className='exit-link'>
              <span aria-hidden='true'>←</span> Back up to the alley
            </TrackedLink>
          </div>
        </ClubRoot>
      </Wrapper>
      <FooterContent />
    </>
  );
};

export default BarFourContent;
