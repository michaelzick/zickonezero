/**
 * The night half of the end-of-route scene (CityGapScene): a giant carp
 * streamer flying from a mast on a rooftop, under a cyan ZICKONEZERO CREATIVE
 * banner and a spinning arrow wheel. The carp wears the airship's 夢 on its
 * crest and "I dream of the feature" on the sash along its side. Original
 * art, drawn once as static SVG. The carp and the banner are each a chain of
 * links, each a window onto its drawing (src/lib/city/koi.ts), that bend at
 * their joints, so the fabric waves on the compositor and nothing is
 * repainted (styles/cityGap.ts). The rooftop's window lights switch off and
 * on at night (useWindowLights in CityGapScene).
 */

import type { CSSProperties } from 'react';

import { THEME } from '../../../styles/theme';
import {
  BANNER_BOTTOM,
  BANNER_HEIGHT,
  BANNER_HOIST,
  BANNER_JOINTS,
  BANNER_LETTERING,
  BANNER_SWINGS,
  BANNER_TOP,
  BANNER_WIDTH,
  KOI_HEIGHT,
  KOI_JOINTS,
  KOI_SWINGS,
  KOI_WIDTH,
  SASH_HALF,
  bannerField,
  bannerHems,
  chainWindows,
  koiBack,
  koiBelly,
  koiRim,
  koiScales,
  koiSilhouette,
  koiTailFin,
} from '../../lib/city/koi';
import type { ChainWindow } from '../../lib/city/koi';
import { startsOff } from '../../lib/city/windowLights';

const KOI_ART = 'gap-koi-art';
const BANNER_ART = 'gap-koi-banner-art';

const id = (name: string) => `gap-koi-${name}`;
const ref = (name: string) => `url(#${id(name)})`;

const KOI_WINDOWS = chainWindows(KOI_JOINTS, KOI_SWINGS, KOI_WIDTH, KOI_HEIGHT);
const BANNER_WINDOWS = chainWindows(BANNER_JOINTS, BANNER_SWINGS, BANNER_WIDTH, BANNER_HEIGHT);

const SILHOUETTE = koiSilhouette();
const TAIL_FIN = koiTailFin();
const BACK = koiBack();
const BELLY = koiBelly();
const RIM = koiRim();
const SCALES = koiScales();
const BANNER_FIELD = bannerField();
const BANNER_HEMS = bannerHems();

const OUTLINE = '#1b0611';
const GOLD = '#ffcf6a';
const FIN_STRIPE = '#4a1d9e';
// The logo's cyan and hot pink (public/img/brand/zickonezero-mark-v4.png).
const LOGO_CYAN = '#15fcfd';
const HOT_PINK = '#ff2bd6';
const BANNER_INK = '#0b0614';

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
// Lit windows; most can switch off and on (useWindowLights). Fixed, so the
// static HTML and the hydrated page light the same ones.
const STEADY_WINDOWS = new Set([5, 30, 41, 46]);
const SWITCHING_WINDOWS = [1, 3, 8, 9, 12, 15, 18, 22, 24, 27, 33, 36, 38, 43, 48, 50];
const LIT_WINDOWS = new Set([...STEADY_WINDOWS, ...SWITCHING_WINDOWS]);
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

const BannerArt = () => (
  <g id={BANNER_ART}>
    {/* The halyard from the mast to the hoist's top and bottom. */}
    <path
      d={`M0 ${BANNER_HEIGHT / 2}L${BANNER_HOIST} ${BANNER_TOP + 4}M0 ${BANNER_HEIGHT / 2}L${BANNER_HOIST} ${BANNER_BOTTOM - 4}`}
      fill='none'
      stroke='#9fb3c4'
      strokeWidth='2'
      strokeLinecap='round'
    />
    <path d={BANNER_FIELD} fill={LOGO_CYAN} />
    <path d={BANNER_HEMS} fill='none' stroke={HOT_PINK} strokeWidth='4' clipPath={ref('banner-clip')} />
    {/* Outlined like the carp, which also keeps the steps at the joints dark on dark. */}
    <path d={BANNER_FIELD} fill='none' stroke={OUTLINE} strokeWidth='3' strokeLinejoin='round' />
    <rect
      x={BANNER_HOIST - 8}
      y={BANNER_TOP - 2}
      width='18'
      height={BANNER_BOTTOM - BANNER_TOP + 4}
      rx='4'
      fill='#12081f'
      stroke={GOLD}
      strokeWidth='2.5'
    />
    {BANNER_LETTERING.map(({ text, x, y, width, size, tone }) => (
      <text
        key={text}
        x={x}
        y={y}
        textLength={width}
        lengthAdjust='spacing'
        fontSize={size}
        fontWeight='900'
        fill={tone === 'one' ? HOT_PINK : BANNER_INK}
        stroke={tone === 'one' ? OUTLINE : undefined}
        strokeWidth={tone === 'one' ? 3 : undefined}
        strokeLinejoin='round'
        style={{ fontFamily: THEME.fonts.display, paintOrder: 'stroke' }}
      >
        {text}
      </text>
    ))}
  </g>
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
      {/* Covers that switch lights off: drawn, the window is dark. */}
      {SWITCHING_WINDOWS.map((window, index) => (
        <rect
          key={window}
          className={`koi-roof-window flicker-window${startsOff(index) ? ' is-off' : ''}`}
          x={ROOF_WINDOWS[window].x}
          y={ROOF_WINDOWS[window].y}
          width='14'
          height='18'
        />
      ))}
    </svg>
  </div>
);

const KoiStreamer = () => (
  <div className='koi'>
    <span className='koi-mast' />
    <span className='koi-ball' />
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
        <clipPath id={id('banner-clip')}>
          <path d={BANNER_FIELD} />
        </clipPath>
        <linearGradient id={id('fin')} x1='0' y1='0' x2='1' y2='0'>
          <stop offset='0' stopColor='#7b3cff' />
          <stop offset='1' stopColor='#39f2ff' />
        </linearGradient>
        <BannerArt />
        <KoiArt />
      </defs>
    </svg>

    <div className='koi-chain koi-banner'>
      <Chain art={BANNER_ART} height={BANNER_HEIGHT} windows={BANNER_WINDOWS} swings={BANNER_SWINGS} />
    </div>
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
