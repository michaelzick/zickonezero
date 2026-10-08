/**
 * The day half of the end-of-route scene (CityGapScene): a sightseeing
 * airship gliding over the street, nose first, with an LED band on its hull.
 * Original art: the hull, fins, gondola, and engine pods are static SVG; the
 * propellers and the scrolling band are HTML layers, so their motion stays
 * on the compositor (styles/cityGap.ts).
 */

import BrandName from '../BrandName';

const ART_ID = 'gap-ship';

// The hull in a 1200x380 box, nose at the left.
const HULL = 'M1140 160C1110 120 980 62 780 56L320 54C160 56 70 104 68 160C70 216 160 264 320 266L780 264C980 258 1110 200 1140 160Z';

// Hull ribs, evenly spaced between the nose and tail caps.
const RIBS = Array.from({ length: 14 }, (_, index) => `M${150 + index * 66} 40V280`).join('');

const GONDOLA_WINDOWS = Array.from({ length: 8 }, (_, index) => 498 + index * 30);

// One pass of the band; it is drawn twice so the loop is seamless.
const BandText = () => (
  <span>
    <span lang='ja'>夢</span> · I dream of the feature · <BrandName /> Creative ·{' '}
  </span>
);

const id = (name: string) => `${ART_ID}-${name}`;
const ref = (name: string) => `url(#${id(name)})`;

const Airship = () => (
  <div className='ship'>
    <div className='ship-bob'>
      <svg className='ship-art' data-art viewBox='0 0 1200 380' focusable='false'>
        <defs>
          <linearGradient id={id('hull')} x1='0' y1='0' x2='0' y2='1'>
            <stop offset='0' stopColor='#fffaf0' />
            <stop offset='0.45' stopColor='#f1e8d8' />
            <stop offset='0.85' stopColor='#cdbfa8' />
            <stop offset='1' stopColor='#b4a58b' />
          </linearGradient>
          <clipPath id={id('clip')}>
            <path d={HULL} />
          </clipPath>
        </defs>

        {/* Tail fins behind the hull; the side stabilizer goes in front. */}
        <path className='ship-fin' d='M990 98L1056 26L1150 30L1124 122Z' />
        <path className='ship-fin' d='M990 222L1056 296L1150 292L1124 198Z' />

        {/* Engine struts and pods. */}
        <path className='ship-strut' d='M352 262L338 284M884 262L898 286' />
        <rect className='ship-pod' x='282' y='270' width='108' height='38' rx='19' />
        <rect className='ship-pod' x='846' y='272' width='108' height='38' rx='19' />

        {/* Gondola. */}
        <path className='ship-gondola' d='M470 258L770 258L752 304C748 314 740 318 728 318L516 318C504 318 494 312 490 304Z' />
        {GONDOLA_WINDOWS.map((x) => (
          <rect key={x} className='ship-window' x={x} y='272' width='20' height='22' rx='3' />
        ))}

        <path d={HULL} fill={ref('hull')} />
        <g clipPath={ref('clip')}>
          <path className='ship-ribs' d={RIBS} />
          <rect className='ship-cap' x='0' y='0' width='128' height='380' />
          <rect className='ship-cap' x='1086' y='0' width='120' height='380' />
          <rect className='ship-stripe' x='0' y='206' width='1200' height='14' />
          <rect className='ship-pinstripe' x='0' y='226' width='1200' height='4' />
          <path className='ship-sheen' d='M200 78C380 62 760 60 980 78' />
        </g>
        <path className='ship-outline' d={HULL} />

        <path className='ship-stabilizer' d='M1004 152L1178 138L1186 176L1004 170Z' />

        {/* The dream emblem by the nose, and the LED screen the band scrolls in. */}
        <circle className='ship-emblem' cx='206' cy='158' r='40' />
        <text className='ship-emblem-glyph' x='206' y='176' textAnchor='middle' lang='ja'>夢</text>
        <rect className='ship-screen-frame' x='330' y='100' width='500' height='80' rx='6' />

        {/* Steady running lights. */}
        <circle className='ship-light ship-light-red' cx='74' cy='170' r='5' />
        <circle className='ship-light ship-light-green' cx='1146' cy='34' r='5' />
      </svg>

      <div className='ship-screen'>
        <div className='ship-ticker'>
          <BandText />
          <BandText />
        </div>
      </div>

      <span className='ship-prop ship-prop-front'><i /></span>
      <span className='ship-prop ship-prop-rear'><i /></span>
    </div>
  </div>
);

export default Airship;
