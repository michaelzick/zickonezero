/**
 * Birds over the day end scene (CityGapScene): a loose group of five, then a
 * pair, crossing from left to right between the airship and the roofs. Each
 * bird is a static SVG gull on two HTML layers, one crossing the sky and one
 * beating its wings in short bursts between glides, so only transforms move
 * (styles/cityGap.ts). The flock is fixed, so the static HTML and the
 * hydrated page agree.
 */

import type { CSSProperties } from 'react';

type Bird = {
  /** Height in the scene, as a percentage. */
  top: number;
  /** Wingspan in CSS pixels at 1440px wide; it scales with the viewport. */
  size: number;
  /** Seconds into the shared loop, so the group flies as a loose V. */
  delay: number;
  /** Where the bird hangs in the still frame, in vw. */
  still: number;
  /** Seconds per wing beat burst, so no two flap in step. */
  beat: number;
};

const BIRDS: readonly Bird[] = [
  { top: 61, size: 34, delay: -6, still: 46, beat: 1.7 },
  { top: 58.5, size: 30, delay: -5.4, still: 41, beat: 1.9 },
  { top: 63.5, size: 30, delay: -5.2, still: 40, beat: 1.6 },
  { top: 56.5, size: 26, delay: -4.7, still: 35, beat: 2.1 },
  { top: 65.5, size: 27, delay: -4.4, still: 34, beat: 1.8 },
  { top: 57, size: 28, delay: -19, still: 70, beat: 2 },
  { top: 58.8, size: 24, delay: -18.4, still: 66, beat: 1.75 },
];

const DayBirds = () => (
  <div className='birds'>
    {BIRDS.map(({ top, size, delay, still, beat }) => (
      <span
        key={`${top}-${delay}`}
        className='bird'
        style={{
          '--bird-top': `${top}%`,
          '--bird-size': size,
          '--bird-delay': `${delay}s`,
          '--bird-still': `${still}vw`,
          '--bird-beat': `${beat}s`,
        } as CSSProperties}
      >
        <span className='bird-flap'>
          <svg viewBox='0 0 40 18' focusable='false'>
            <path d='M1 10C7 3 13 2 20 10C27 2 33 3 39 10C33 7 27 8 20 15C13 8 7 7 1 10Z' fill='#26444b' />
          </svg>
        </span>
      </span>
    ))}
  </div>
);

export default DayBirds;
