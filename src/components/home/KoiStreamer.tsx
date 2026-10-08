/**
 * The night half of the end-of-route scene (CityGapScene): a giant carp
 * streamer flying from the top of a mast on a rooftop, just under a spinning
 * arrow wheel, with a string of paper lanterns slung below it from the mast to
 * a tower across the street (NightRooftops). The carp wears the airship's 夢
 * on its crest and "I dream of the feature" on the sash along its side.
 * Original art, drawn once as static SVG. The carp is a chain of links, each a
 * window onto its drawing (src/lib/city/koi.ts), that bend at their joints,
 * so the fabric waves on the compositor and nothing is repainted
 * (styles/cityGap.ts). The lanterns glow steadily and sway from their hooks.
 */

import type { CSSProperties } from 'react';

import { THEME } from '../../../styles/theme';
import {
  KOI_HEIGHT,
  KOI_JOINTS,
  KOI_SWINGS,
  KOI_WIDTH,
  LANTERN_CORDS,
  SASH_HALF,
  chainWindows,
  koiBack,
  koiBelly,
  koiRim,
  koiScales,
  koiSilhouette,
  koiTailFin,
  lanternCord,
  lanternString,
} from '../../lib/city/koi';
import type { ChainWindow } from '../../lib/city/koi';
import NightRooftops from './NightRooftops';

const KOI_ART = 'gap-koi-art';
const LANTERN_ART = 'gap-koi-lantern-art';

const id = (name: string) => `gap-koi-${name}`;
const ref = (name: string) => `url(#${id(name)})`;

const KOI_WINDOWS = chainWindows(KOI_JOINTS, KOI_SWINGS, KOI_WIDTH, KOI_HEIGHT);
const LANTERNS = lanternString();
const CORDS = [
  ['wide', lanternCord(LANTERN_CORDS.wide)],
  ['tall', lanternCord(LANTERN_CORDS.tall)],
] as const;

const SILHOUETTE = koiSilhouette();
const TAIL_FIN = koiTailFin();
const BACK = koiBack();
const BELLY = koiBelly();
const RIM = koiRim();
const SCALES = koiScales();

const OUTLINE = '#1b0611';
const GOLD = '#ffcf6a';
const FIN_STRIPE = '#4a1d9e';

// The sash runs from under the crest to a swallowtail short of the tail.
const SASH = `M230 ${150 - SASH_HALF}H836L818 150L836 ${150 + SASH_HALF}H230Z`;

const GILL = 'M140 56C160 92 168 122 168 150C168 178 160 208 140 244C152 208 157 178 157 150C157 122 152 92 140 56Z';
const PECTORAL_FIN = 'M168 232C190 246 222 270 252 298C262 282 258 262 244 248C222 236 194 230 168 232Z';
const PECTORAL_STRIPES = 'M184 236L254 292M204 238L258 276M224 240L256 260';
const TAIL_STRIPES = 'M868 150L1000 22M868 150L990 76M868 150L966 120M868 150L966 180M868 150L990 224M868 150L1000 278';

const WHEEL_SPOKES = Array.from({ length: 8 }, (_, index) => index * 45);

// Rooftop windows under the parapet, in three floors of 17.
const ROOF_WINDOWS = Array.from({ length: 3 * 17 }, (_, index) => ({
  x: 14 + (index % 17) * 34,
  y: 96 + Math.floor(index / 17) * 32,
}));
// Lit windows. Fixed, so the static HTML and the hydrated page light the same ones.
const LIT_WINDOWS = new Set([1, 3, 5, 8, 9, 12, 15, 18, 22, 24, 27, 30, 33, 36, 38, 41, 43, 46, 48, 50]);
const windowPath = (indexes: Iterable<number>) => [...indexes]
  .map((index) => `M${ROOF_WINDOWS[index].x} ${ROOF_WINDOWS[index].y}h14v18h-14z`)
  .join('');

const KoiArt = () => (
  <g id={KOI_ART}>
    {/* The bridle from the mast to the mouth hoop. */}
    <path d='M0 150L24 58M0 150L24 242' fill='none' stroke='#9fb3c4' strokeWidth='2.5' strokeLinecap='round' />

    <g clipPath={ref('clip')}>
      <rect width={KOI_WIDTH} height={KOI_HEIGHT} fill='#e8196f' />
      <path d={BACK} fill='#8e0d4a' />
      <path d={SCALES} fill='none' stroke={GOLD} strokeWidth='3' strokeLinecap='round' />
      <path d={BELLY} fill='#ffd9ea' />
    </g>

    <path d={GILL} fill={GOLD} />

    {/* The eye. */}
    <circle cx='84' cy='116' r='25' fill='#fff4e6' stroke={OUTLINE} strokeWidth='3' />
    <circle cx='86' cy='117' r='17' fill={GOLD} />
    <circle cx='87' cy='118' r='11' fill='#0b0614' />
    <circle cx='81' cy='111' r='4.5' fill='#ffffff' />

    {/* The sash and its lettering, then the crest at its head. */}
    <path d={SASH} fill='#160a2c' stroke={GOLD} strokeWidth='2.5' strokeLinejoin='round' />
    <text
      x='276'
      y='160.5'
      textLength='516'
      lengthAdjust='spacing'
      fontSize='30'
      fontWeight='700'
      fill='#ffd36b'
      style={{ fontFamily: THEME.fonts.hud, textTransform: 'uppercase' }}
    >
      I dream of the feature
    </text>
    <circle cx='214' cy='150' r='38' fill='#fff3dc' stroke={GOLD} strokeWidth='6' />
    <circle cx='214' cy='150' r='30' fill='none' stroke='#c8123f' strokeWidth='1.5' />
    <text
      x='214'
      y='166'
      textAnchor='middle'
      fontSize='44'
      fontWeight='700'
      fill='#c8123f'
      lang='ja'
      style={{ fontFamily: THEME.fonts.cjk }}
    >
      夢
    </text>

    {/* Fins: cyan to violet, striped. */}
    <path d={TAIL_FIN} fill={ref('fin')} />
    <path d={TAIL_STRIPES} fill='none' stroke={FIN_STRIPE} strokeWidth='4' clipPath={ref('tail-clip')} />
    <path d={TAIL_FIN} fill='none' stroke={OUTLINE} strokeWidth='2.5' strokeLinejoin='round' />
    <path d={PECTORAL_FIN} fill={ref('fin')} stroke={OUTLINE} strokeWidth='2.5' strokeLinejoin='round' />
    <path d={PECTORAL_STRIPES} fill='none' stroke={FIN_STRIPE} strokeWidth='3' clipPath={ref('pectoral-clip')} />

    {/* The outline, the cyan rim light along the back, and the mouth hoop. */}
    <path d={SILHOUETTE} fill='none' stroke={OUTLINE} strokeWidth='3.5' strokeLinejoin='round' />
    <path d={RIM} fill='none' stroke='#2ff3ff' strokeWidth='3' strokeLinecap='round' />
    <ellipse cx='24' cy='150' rx='11' ry='92' fill='#2a0716' stroke={GOLD} strokeWidth='6' />
  </g>
);

// A paper lantern, 40x64: a hook, caps, the ribbed paper in the lantern's
// own color (currentColor), lit from inside, and a tassel.
const LANTERN_PAPER = 'M13 11C4 15 1 23 1 29.5C1 36 4 44 13 48H27C36 44 39 36 39 29.5C39 23 36 15 27 11Z';

const LanternArt = () => (
  <g id={LANTERN_ART}>
    <path d='M20 0V7' stroke='#9fb3c4' strokeWidth='1.5' />
    <path d={LANTERN_PAPER} fill='currentColor' />
    <path d={LANTERN_PAPER} fill={ref('lantern-light')} />
    <path
      d='M3 19Q20 23 37 19M1.5 26Q20 30 38.5 26M1.5 33Q20 37 38.5 33M3 40Q20 44 37 40M20 11V48M13 11C8 21 8 38 13 48M27 11C32 21 32 38 27 48'
      fill='none'
      stroke='#5a140a'
      strokeWidth='1'
      opacity='0.35'
    />
    <rect x='11' y='6' width='18' height='6' rx='2' fill={OUTLINE} />
    <rect x='11' y='47' width='18' height='6' rx='2' fill={OUTLINE} />
    <path d='M20 53V56M17 56H23L24.5 64H15.5Z' fill={GOLD} stroke={GOLD} strokeWidth='1' strokeLinejoin='round' />
  </g>
);

/**
 * The lantern string, slung from the mast to the tower across the street: to
 * a bracket on its face on wide screens, or a post on its roof on tall ones.
 * The cord fills its box, in the shape the screen shows (styles/cityGap.ts);
 * each lantern hangs where it meets the cord.
 */
const Lanterns = () => (
  <div className='koi-lanterns'>
    {CORDS.map(([shape, { viewBox, path }]) => (
      <svg
        key={shape}
        className='koi-cord'
        data-shape={shape}
        viewBox={viewBox}
        preserveAspectRatio='none'
        data-art
        focusable='false'
      >
        <path d={path} vectorEffect='non-scaling-stroke' />
      </svg>
    ))}
    <span className='koi-lantern-tie' />
    {LANTERNS.map(({ x, wide, tall }, index) => (
      <span
        key={x}
        className='koi-lantern'
        data-tone={index % 3 === 1 ? 'amber' : 'vermilion'}
        style={{ '--li': index, '--lx': `${x}%`, '--ly-wide': wide, '--ly-tall': tall } as CSSProperties}
      >
        <span className='koi-lantern-glow' />
        <svg viewBox='0 0 40 64' data-art focusable='false'>
          <use href={`#${LANTERN_ART}`} />
        </svg>
      </span>
    ))}
  </div>
);

type ChainProps = {
  art: string;
  height: number;
  windows: readonly ChainWindow[];
  swings: readonly number[];
  index?: number;
};

/**
 * A link and, nested inside it, the rest of the chain, so each link bends
 * from the one before it. Each shows its window of the drawing; the head
 * rides the slow gusts.
 */
const Chain = ({ art, height, windows, swings, index = 0 }: ChainProps) => {
  const view = windows[index];
  if (!view) {
    return null;
  }

  const offset = index === 0 ? 0 : view.from - windows[index - 1].from;
  const width = view.to - view.from;
  const notch = Math.round(((view.notch - view.from) / width) * 10000) / 100;

  return (
    <div
      className='koi-link'
      data-swing={index === 0 ? 'gust' : swings[index]}
      style={{ '--i': index, '--x': offset, '--w': width, '--notch': `${notch}%` } as CSSProperties}
    >
      <svg viewBox={`${view.from} 0 ${width} ${height}`} preserveAspectRatio='none' focusable='false'>
        <use href={`#${art}`} />
      </svg>
      <Chain art={art} height={height} windows={windows} swings={swings} index={index + 1} />
    </div>
  );
};

const Rooftop = () => (
  <div className='koi-roof'>
    <svg viewBox='0 0 600 200' focusable='false'>
      {/* A water tank on its stand, a stair bulkhead, the mast's footing, AC units, and an antenna. */}
      <path
        className='koi-roof-art'
        d='M40 18L82 2L124 18ZM40 18H124V52H40ZM48 52H52V74H48ZM70 52H74V74H70ZM90 52H94V74H90ZM112 52H116V74H112ZM44 60H120V63H44ZM142 40H210V76H142ZM224 60H256V76H224ZM332 50H392V76H332ZM402 56H452V76H402ZM523 4H526V74H523ZM514 16H535V19H514ZM517 28H532V31H517ZM0 74H600V200H0Z'
      />
      <path className='koi-roof-rim' d='M0 74.5H600' />
      <path
        className='koi-roof-window'
        d={windowPath(ROOF_WINDOWS.map((_, index) => index).filter((index) => !LIT_WINDOWS.has(index)))}
      />
      <path className='koi-roof-window is-lit' d={windowPath(LIT_WINDOWS)} />
    </svg>
  </div>
);

const KoiStreamer = () => (
  <div className='koi'>
    <span className='koi-mast' />
    <span className='koi-ball' />
    <NightRooftops />
    <Rooftop />

    {/* The drawings the links show; zero-size rather than hidden, so their gradients still paint. */}
    <svg className='koi-defs' width='0' height='0' focusable='false'>
      <defs>
        <clipPath id={id('clip')}>
          <path d={SILHOUETTE} />
        </clipPath>
        <clipPath id={id('tail-clip')}>
          <path d={TAIL_FIN} />
        </clipPath>
        <clipPath id={id('pectoral-clip')}>
          <path d={PECTORAL_FIN} />
        </clipPath>
        <linearGradient id={id('fin')} x1='0' y1='0' x2='1' y2='0'>
          <stop offset='0' stopColor='#7b3cff' />
          <stop offset='1' stopColor='#39f2ff' />
        </linearGradient>
        <radialGradient id={id('lantern-light')} cx='0.5' cy='0.55' r='0.55'>
          <stop offset='0' stopColor='#fff4d6' stopOpacity='0.95' />
          <stop offset='0.45' stopColor='#ffc46b' stopOpacity='0.5' />
          <stop offset='1' stopColor='#ffc46b' stopOpacity='0' />
        </radialGradient>
        <radialGradient id={id('beacon')}>
          <stop offset='0' stopColor='#ff4f45' stopOpacity='0.7' />
          <stop offset='1' stopColor='#ff4f45' stopOpacity='0' />
        </radialGradient>
        <LanternArt />
        <KoiArt />
      </defs>
    </svg>

    {/* Behind the carp, so its tail flies over the string. */}
    <Lanterns />
    <div className='koi-chain koi-fish'>
      <Chain art={KOI_ART} height={KOI_HEIGHT} windows={KOI_WINDOWS} swings={KOI_SWINGS} />
    </div>

    {/* The arrow wheel at the top of the mast, seen at an angle as it spins. */}
    <span className='koi-wheel'>
      <span className='koi-wheel-spin'>
        <svg viewBox='-50 -50 100 100' focusable='false'>
          {WHEEL_SPOKES.map((angle, index) => (
            <g key={angle} transform={`rotate(${angle})`}>
              <path d='M0 0V-44' stroke={GOLD} strokeWidth='3' />
              <path d='M0 -46L10 -40L10 -24L0 -28Z' fill={index % 2 === 0 ? '#2ff3ff' : '#ff2bd6'} />
            </g>
          ))}
          <circle r='7' fill={GOLD} stroke='#7a4b0c' strokeWidth='2' />
        </svg>
      </span>
    </span>
  </div>
);

export default KoiStreamer;
