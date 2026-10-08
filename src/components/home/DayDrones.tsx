/**
 * Delivery drones over the day end scene (CityGapScene): quadcopters
 * carrying parcels from left to right between the airship and the roofs,
 * each on its own route and timing. Original art: a static SVG drone,
 * pitched forward into its flight, with a parcel on a short tether below.
 * The drone crosses the sky, hovers up and down a little, and its parcel
 * sways, all on separate HTML layers, so only transforms move
 * (styles/cityGap.ts). The rotors are drawn as motion blur, so nothing
 * spins. The fleet is fixed, so the static HTML and the hydrated page agree.
 */

import type { CSSProperties } from 'react';

type Drone = {
  /** Height in the scene, as a percentage. */
  top: number;
  /** Width in CSS pixels at 1440px wide; it scales with the viewport. */
  size: number;
  /** Seconds per loop: about two thirds crossing, then a wait off screen. */
  duration: number;
  /** Seconds into the loop, so the drones arrive one at a time. */
  delay: number;
  /** Where the drone hovers in the still frame, in vw. */
  still: number;
  /** Seconds per hover bob, so no two bob in step. */
  bob: number;
};

// Nearer drones fly lower and larger.
const DRONES: readonly Drone[] = [
  { top: 61, size: 74, duration: 30, delay: -6, still: 24, bob: 2.3 },
  { top: 56, size: 54, duration: 37, delay: -27, still: 62, bob: 2.7 },
  { top: 58.5, size: 64, duration: 34, delay: -17, still: 84, bob: 2.1 },
];

const INK = '#12393f';
const BODY = '#f3e2c0';
const STRIPE = '#c06a4c';
const KRAFT = '#d8a86b';

const DroneFrame = () => (
  <svg className='drone-frame' data-art viewBox='0 0 120 44' focusable='false'>
    {/* Rotors as motion blur, seen edge on. */}
    <ellipse cx='22' cy='6' rx='21' ry='3' fill={INK} opacity='0.28' />
    <ellipse cx='98' cy='6' rx='21' ry='3' fill={INK} opacity='0.28' />
    <path d='M8 6H36M84 6H112' stroke={INK} strokeWidth='1.5' strokeLinecap='round' opacity='0.55' />
    {/* Masts, motors, and arms. */}
    <path d='M21 6H23V12H21ZM97 6H99V12H97Z' fill={INK} />
    <path d='M16 11H28V17H16ZM92 11H104V17H92Z' fill='#1d5a63' />
    <path d='M26 13H94V16H26Z' fill={INK} />
    {/* The body, with a stripe and a steady status light. */}
    <rect x='38' y='11' width='44' height='19' rx='9.5' fill={BODY} stroke={INK} strokeWidth='2' />
    <path d='M39 22H81V25H39Z' fill={STRIPE} />
    <circle cx='76' cy='17' r='2.4' fill='#ffcf6a' />
    {/* Landing legs. */}
    <path d='M47 29L42 38M73 29L78 38M36 38H50M70 38H84' stroke={INK} strokeWidth='2.5' strokeLinecap='round' />
  </svg>
);

const Parcel = () => (
  <svg data-art viewBox='0 0 40 40' focusable='false'>
    <path d='M20 0V8' stroke={INK} strokeWidth='2' />
    <rect x='4' y='8' width='32' height='26' rx='1.5' fill={KRAFT} stroke='#8a5a32' strokeWidth='1.5' />
    <path d='M17 8H23V34H17Z' fill={BODY} opacity='0.85' />
    <path d='M4 15H36' stroke='#8a5a32' strokeWidth='1' opacity='0.6' />
  </svg>
);

const DayDrones = () => (
  <div className='drones'>
    {DRONES.map(({ top, size, duration, delay, still, bob }) => (
      <span
        key={`${top}-${size}`}
        className='drone'
        style={{
          '--drone-top': `${top}%`,
          '--drone-size': size,
          '--drone-duration': `${duration}s`,
          '--drone-delay': `${delay}s`,
          '--drone-still': `${still}vw`,
          '--drone-bob': `${bob}s`,
        } as CSSProperties}
      >
        <span className='drone-hover'>
          <DroneFrame />
          <span className='drone-parcel'>
            <Parcel />
          </span>
        </span>
      </span>
    ))}
  </div>
);

export default DayDrones;
