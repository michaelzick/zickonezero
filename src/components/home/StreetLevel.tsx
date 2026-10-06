import { useEffect, useRef, useState } from 'react';
import type { CSSProperties, RefObject } from 'react';

import { HudFrame } from '../../../styles/hud';
import { StreetRoot } from '../../../styles/street';
import { generateFacade } from '../../lib/city/facade';
import type { NeonTone } from '../../lib/city/skyline';
import AlleyWall from '../city/AlleyWall';
import NeonSign from '../city/NeonSign';
import type { NeonLine } from '../city/NeonSign';
import TrackedLink from '../TrackedLink';

// Seeded, so the static HTML and the hydrated page draw the same street.
const STOREFRONTS = generateFacade({
  seed: 31,
  length: 2400,
  height: 900,
  groundHeight: 170,
  floorHeight: 60,
  windowWidth: 26,
  windowHeight: 28,
  windowGap: 16,
  minSegment: 300,
  maxSegment: 560,
  minRoof: 0.6,
  litChance: 0.18,
  coolShare: 0.3,
  unitChance: 0.1,
  maxUnits: 24,
  signs: 5,
  detailLength: 2400,
});

const SIGN_LINES: readonly NeonLine[] = [
  { text: 'Now booking', variant: 'tube' },
  { text: 'new gigs', variant: 'led' },
];

type Heading = 'east' | 'west';

/** Walk and drive times are in seconds; --rest (in vw) is where each stands in a still frame. */
type Walker = { tone: NeonTone; heading: Heading; depth: 'near' | 'far'; duration: number; delay: number; rest: number };
type Car = { lane: 'near' | 'far'; kind?: 'taxi' | 'van'; duration: number; delay: number; rest: number };

const WALKERS: readonly Walker[] = [
  { tone: 'cyan', heading: 'east', depth: 'far', duration: 34, delay: -6, rest: 18 },
  { tone: 'magenta', heading: 'west', depth: 'near', duration: 29, delay: -17, rest: 42 },
  { tone: 'amber', heading: 'east', depth: 'near', duration: 27, delay: -11, rest: 71 },
  { tone: 'violet', heading: 'west', depth: 'far', duration: 38, delay: -25, rest: 88 },
  { tone: 'cyan', heading: 'west', depth: 'near', duration: 31, delay: -2, rest: 9 },
];

// Cars in a lane share a speed, so they never drive through each other.
const CARS: readonly Car[] = [
  { lane: 'far', kind: 'van', duration: 12, delay: -2, rest: 24 },
  { lane: 'far', kind: 'taxi', duration: 12, delay: -8, rest: 66 },
  { lane: 'near', kind: 'taxi', duration: 9, delay: -1, rest: 52 },
  { lane: 'near', duration: 9, delay: -5.5, rest: 92 },
];

const motion = (duration: number, delay: number, rest: number) => ({
  '--duration': `${duration}s`,
  '--delay': `${delay}s`,
  '--rest': `${rest}vw`,
} as CSSProperties);

type Props = {
  /** The section, for callers that measure where the street starts. */
  sectionRef?: RefObject<HTMLElement | null>;
};

/**
 * Where the homepage route ends: storefronts under a "Now booking new gigs"
 * sign, a panel that invites the visitor to jack in (go to Contact), and a
 * street with walkers and traffic. The street, the vacancy sign (空き枠有り,
 * "openings available"), and the status readout are decoration.
 */
const StreetLevel = ({ sectionRef }: Props) => {
  const ownRef = useRef<HTMLElement>(null);
  const ref = sectionRef ?? ownRef;
  const [powered, setPowered] = useState(false);
  const [live, setLive] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node || typeof IntersectionObserver === 'undefined') {
      setPowered(true);
      setLive(true);
      return undefined;
    }

    // Power the sign on just before the street scrolls into view, and only
    // move the traffic while it is on screen.
    const observer = new IntersectionObserver((entries) => {
      const isVisible = entries[entries.length - 1].isIntersecting;
      setLive(isVisible);
      if (isVisible) {
        setPowered(true);
      }
    }, { rootMargin: '0px 0px 10% 0px' });

    observer.observe(node);
    return () => observer.disconnect();
  }, [ref]);

  return (
    <StreetRoot
      ref={ref}
      aria-labelledby='street-level-title'
      data-standby={powered ? undefined : ''}
      data-live={live ? '' : undefined}
    >
      <div className='street-block'>
        <div className='st-row' aria-hidden='true'>
          <AlleyWall facade={STOREFRONTS} fit='xMidYMax slice' />
        </div>

        <div className='st-vacancy' aria-hidden='true'>
          <span lang='ja'>空き枠有り</span>
        </div>

        <NeonSign
          as='h2'
          id='street-level-title'
          className='street-sign'
          lines={SIGN_LINES}
          dying={[1, 4]}
        />

        <HudFrame className='street-panel'>
          <p className='street-status' aria-hidden='true'>Channel open</p>
          <p className='street-copy'>
            Have a product to ship or a flow that needs untangling? Send over the brief and let&apos;s build it.
          </p>
          <TrackedLink href='/contact' label='Jack In' location='home_street' className='street-cta'>
            Jack In
          </TrackedLink>
        </HudFrame>
      </div>

      <div className='street-ground' aria-hidden='true'>
        <div className='st-road' />
        <div className='st-reflections' />
        <div className='st-crosswalk' />

        {WALKERS.map(({ tone, heading, depth, duration, delay, rest }) => (
          <span
            key={`${heading}-${rest}`}
            className={`walker tone-${tone}`}
            data-heading={heading}
            data-depth={depth}
            style={motion(duration, delay, rest)}
          >
            <span className='walker-bob'>
              <i className='walker-umbrella' />
              <i className='walker-figure' />
            </span>
          </span>
        ))}

        {CARS.map(({ lane, kind, duration, delay, rest }) => (
          <span
            key={`${lane}-${rest}`}
            className={kind ? `car is-${kind}` : 'car'}
            data-lane={lane}
            data-heading={lane === 'far' ? 'west' : 'east'}
            style={motion(duration, delay, rest)}
          >
            <span className='car-body'>
              <i className='car-cabin' />
              <i className='car-wheels' />
              <i className='car-tail' />
            </span>
          </span>
        ))}
      </div>

      <div className='st-rain' aria-hidden='true' />
    </StreetRoot>
  );
};

export default StreetLevel;
