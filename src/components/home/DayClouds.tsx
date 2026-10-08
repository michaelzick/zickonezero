/**
 * Clouds over the day end scene (CityGapScene), drifting slowly from left to
 * right behind the airship, each at its own height, size, and speed. Flat,
 * like the airship: static SVG on HTML layers that only translate
 * (styles/cityGap.ts). Fixed, so the static HTML and the hydrated page agree.
 */

import type { CSSProperties } from 'react';

type Cloud = {
  /** Height in the scene and width, as percentages of the scene and viewport. */
  top: number;
  width: number;
  /** Seconds per crossing, and how far into it the cloud starts. */
  duration: number;
  delay: number;
  /** Where the cloud sits in the still frame, in vw. */
  still: number;
};

const CLOUDS: readonly Cloud[] = [
  { top: 5, width: 30, duration: 150, delay: -40, still: 4 },
  { top: 13, width: 22, duration: 120, delay: -86, still: 66 },
  { top: 33, width: 18, duration: 105, delay: -18, still: 30 },
  { top: 41, width: 26, duration: 160, delay: -122, still: 78 },
];

const OUTLINE = 'M28 96C8 96 0 80 10 68C14 54 34 50 46 58C50 34 76 22 98 34C110 10 152 6 170 30C188 18 222 24 228 50C254 46 276 60 272 80C290 84 292 96 280 96Z';
// The shaded underside, inside the outline.
const SHADE = 'M20 88C60 92 220 92 276 88C278 92 280 96 280 96H28C22 96 19 92 20 88Z';

const DayClouds = () => (
  <div className='clouds'>
    {CLOUDS.map(({ top, width, duration, delay, still }) => (
      <span
        key={`${top}-${width}`}
        className='cloud'
        style={{
          '--cloud-top': `${top}%`,
          '--cloud-w': `${width}vw`,
          '--cloud-duration': `${duration}s`,
          '--cloud-delay': `${delay}s`,
          '--cloud-still': `${still}vw`,
        } as CSSProperties}
      >
        <svg viewBox='0 0 300 100' focusable='false'>
          <path d={OUTLINE} fill='#fffaf0' opacity='0.85' />
          <path d={SHADE} fill='#e7d6bf' opacity='0.55' />
        </svg>
      </span>
    ))}
  </div>
);

export default DayClouds;
