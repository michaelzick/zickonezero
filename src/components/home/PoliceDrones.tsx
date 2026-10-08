/**
 * Police drones on patrol over the night end scene (CityGapScene), behind the
 * carp: one crosses from the left low over the roofs, the other from the
 * right high above the carp, never on screen together. Original art, after
 * the day's delivery drones: a static SVG quadcopter in dark livery, pitched
 * into its flight, with its rotors drawn as motion blur and a faint
 * searchlight below. Its light bar flashes red, then blue, each once a cycle:
 * small glows whose opacity alone animates, so nothing repaints and nothing
 * flashes more than twice a second (styles/cityGap.ts). The patrol is fixed,
 * so the static HTML and the hydrated page agree.
 */

import type { CSSProperties } from 'react';

type Patrol = {
  /** Which way it flies. */
  heading: 'east' | 'west';
  /** Width in CSS pixels at 1440px wide; it scales with the viewport. */
  size: number;
  /** Seconds into the shared loop, so the two take turns. */
  delay: number;
  /** Seconds per hover bob. */
  bob: number;
};

// The far one flies high and small; the near one low and larger.
const PATROLS: readonly Patrol[] = [
  { heading: 'west', size: 62, delay: -2, bob: 2.4 },
  { heading: 'east', size: 84, delay: -17, bob: 2.9 },
];

const INK = '#060b16';
const BODY = '#142238';
const BAND = '#e9f0f7';
const STRIPE = '#2f6bff';
const RIM = '#4f6f96';

const PoliceFrame = () => (
  <svg className='police-frame' data-art viewBox='0 0 120 48' focusable='false'>
    {/* Rotors as motion blur, seen edge on. */}
    <ellipse cx='22' cy='10' rx='21' ry='3' fill='#9fb3c4' opacity='0.22' />
    <ellipse cx='98' cy='10' rx='21' ry='3' fill='#9fb3c4' opacity='0.22' />
    <path d='M8 10H36M84 10H112' stroke='#9fb3c4' strokeWidth='1.5' strokeLinecap='round' opacity='0.4' />
    {/* Masts, motors, and arms. */}
    <path d='M21 10H23V16H21ZM97 10H99V16H97Z' fill={RIM} />
    <path d='M16 15H28V21H16ZM92 15H104V21H92Z' fill={BODY} stroke={RIM} strokeWidth='1' />
    <path d='M26 17H94V20H26Z' fill={INK} />
    {/* The light bar, its lenses dark between flashes. */}
    <rect x='46' y='9' width='28' height='7' rx='3' fill={INK} />
    <rect x='48' y='10.5' width='11' height='4' rx='2' fill='#5a1018' />
    <rect x='61' y='10.5' width='11' height='4' rx='2' fill='#10245a' />
    {/* The body, in a white band with a blue stripe. */}
    <rect x='38' y='15' width='44' height='19' rx='9.5' fill={BODY} stroke={RIM} strokeWidth='1.5' />
    <path d='M39 22H81V27H39Z' fill={BAND} />
    <path d='M39 27H81V29H39Z' fill={STRIPE} />
    <circle cx='79' cy='31' r='2' fill='#dff3ff' />
    {/* Landing legs. */}
    <path d='M47 33L42 42M73 33L78 42M36 42H50M70 42H84' stroke={RIM} strokeWidth='2.5' strokeLinecap='round' />
  </svg>
);

const PoliceDrones = () => (
  <div className='patrols'>
    {PATROLS.map(({ heading, size, delay, bob }) => (
      <span
        key={heading}
        className='police-drone'
        data-heading={heading}
        style={{
          '--patrol-size': size,
          '--patrol-delay': `${delay}s`,
          '--patrol-bob': `${bob}s`,
        } as CSSProperties}
      >
        <span className='police-hover'>
          <span className='police-body'>
            <span className='police-beam' />
            <PoliceFrame />
            <span className='police-siren is-red' />
            <span className='police-siren is-blue' />
          </span>
        </span>
      </span>
    ))}
  </div>
);

export default PoliceDrones;
