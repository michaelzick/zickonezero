import { useRef } from 'react';
import type { CSSProperties } from 'react';

import { HeroRoot } from '../../../styles/home';
import { HudFrame } from '../../../styles/hud';
import usePointerParallax from '../../hooks/usePointerParallax';
import useSceneMotion from '../../hooks/useSceneMotion';
import useScrollProgress from '../../hooks/useScrollProgress';
import { generateFacade } from '../../lib/city/facade';
import type { FacadeOptions } from '../../lib/city/facade';
import BrandName from '../BrandName';
import AlleyWall from '../city/AlleyWall';
import LedTicker from '../city/LedTicker';
import { HEADLINE_PHRASES } from '../headlinePhrases';
import TrackedLink from '../TrackedLink';
import { AlleyPaving, AlleyRefuse, AlleyWallWear } from './AlleyDetails';

const WALL: Omit<FacadeOptions, 'seed'> = {
  length: 3200,
  height: 1400,
  groundHeight: 240,
  floorHeight: 82,
  windowWidth: 38,
  windowHeight: 44,
  windowGap: 26,
  minSegment: 260,
  maxSegment: 520,
  minRoof: 0.92,
  litChance: 0.1,
  coolShare: 0.3,
  unitChance: 0.18,
  maxUnits: 30,
  signs: 6,
  detailLength: 1700,
};

// Seeded, so the static HTML and the hydrated page draw the same alley.
const LEFT_WALL = generateFacade({ ...WALL, seed: 7 });
const RIGHT_WALL = generateFacade({ ...WALL, seed: 11 });

type Cable = {
  /** Distance down the alley, in pixels. */
  depth: number;
  /** Where the cable meets each wall, as a percentage of the plane's height. */
  left: number;
  right: number;
  sag: number;
};

const CABLES: readonly Cable[] = [
  { depth: 120, left: 14, right: 20, sag: 12 },
  { depth: 420, left: 26, right: 18, sag: 10 },
  { depth: 800, left: 34, right: 30, sag: 9 },
  { depth: 1300, left: 30, right: 38, sag: 8 },
  { depth: 1900, left: 42, right: 36, sag: 6 },
];

const cablePath = (left: number, right: number, sag: number) => (
  `M0 ${left}Q50 ${Math.max(left, right) + sag * 2} 100 ${right}`
);

// Fixed scraps with separate world-position and gust transforms. The first
// four also appear on phones; the rest never animate at that breakpoint.
const SCRAPS = [
  { x: -19, depth: 80, width: 17, drift: 180, lift: -28, duration: 11, delay: -3, turn: 210 },
  { x: 18, depth: 360, width: 22, drift: -220, lift: -44, duration: 14, delay: -9, turn: -260 },
  { x: -13, depth: 660, width: 19, drift: 155, lift: -32, duration: 12, delay: -6, turn: 280 },
  { x: 12, depth: 980, width: 24, drift: -170, lift: -38, duration: 16, delay: -2, turn: -220 },
  { x: -23, depth: 240, width: 15, drift: 240, lift: -22, duration: 17, delay: -12, turn: 340 },
  { x: 22, depth: 580, width: 20, drift: -160, lift: -52, duration: 13, delay: -4, turn: -300 },
  { x: -10, depth: 1200, width: 26, drift: 190, lift: -26, duration: 18, delay: -14, turn: 260 },
  { x: 15, depth: 1550, width: 21, drift: -210, lift: -34, duration: 15, delay: -8, turn: -240 },
];

// The panel has faded out by a third of the walk; past that it stops taking clicks.
const PANEL_FADED_AT = 0.34;

type HeroSceneProps = {
  onSeeCaseStudies: () => void;
};

/**
 * The homepage hero: a neon alley the visitor walks into as they
 * scroll. The lower-left introduction is the real heading; the market sign,
 * worn utilities, and windblown scraps are decorative city scenery.
 */
const HeroScene = ({ onSeeCaseStudies }: HeroSceneProps) => {
  const heroRef = useRef<HTMLElement | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);

  useScrollProgress(heroRef, { pastAt: PANEL_FADED_AT });
  usePointerParallax(stageRef);
  useSceneMotion(heroRef);

  return (
    <HeroRoot ref={heroRef} aria-labelledby='home-hero-title'>
      <div className='hero-stage' ref={stageRef}>
        <div className='hero-sky' aria-hidden='true' />

        <div className='hero-scene' aria-hidden='true'>
          <div className='alley'>
            <div className='plane street'>
              <div className='street-glow' />
              {/* Paint on the street leaf itself to avoid overlapping 3D planes. */}
              <AlleyPaving />
            </div>
            <div className='plane wall wall-left'>
              <AlleyWall facade={LEFT_WALL} />
              <AlleyWallWear />
            </div>
            <div className='plane wall wall-right'>
              <AlleyWall facade={RIGHT_WALL} />
              <AlleyWallWear />
            </div>

            <div className='plane refuse refuse-left'><AlleyRefuse /></div>
            <div className='plane refuse refuse-right'><AlleyRefuse /></div>
            <div className='plane service-crates'><i /><i /><i /></div>

            {SCRAPS.map(({ x, depth, width, drift, lift, duration, delay, turn }, index) => (
              <div
                key={depth}
                className={`plane scrap-position${index > 3 ? ' scrap-desktop' : ''}`}
                style={{
                  '--scrap-x': `${x}vw`, '--z': `${-depth}px`, '--scrap-width': `${width}px`,
                  '--scrap-drift': `${drift}px`, '--scrap-lift': `${lift}px`,
                  '--scrap-duration': `${duration}s`, '--scrap-delay': `${delay}s`,
                  '--scrap-turn': `${turn}deg`,
                } as CSSProperties}
              >
                <i className='paper-scrap' />
              </div>
            ))}

            {CABLES.map(({ depth, left, right, sag }, index) => (
              <div key={depth} className='plane cable' style={{ '--z': `${-depth}px` } as CSSProperties}>
                <svg data-art viewBox='0 0 100 100' preserveAspectRatio='none' focusable='false'>
                  <path d={cablePath(left, right, sag)} />
                  {index % 2 === 1 && <path className='cable-thin' d={cablePath(left + 3, right + 2, sag + 2)} />}
                </svg>
              </div>
            ))}

            <div className='plane blade blade-name' lang='ja'>
              <span>ジックワンゼロ</span>
            </div>
            <div className='plane blade blade-dream' lang='ja'>
              <span>夢</span>
            </div>
            <div className='plane blade blade-open' lang='ja'>
              <span>営業中</span>
            </div>

            <LedTicker className='plane banner' phrases={HEADLINE_PHRASES} />
          </div>
        </div>

        <div className='hero-haze' aria-hidden='true' />
        <div className='drone' aria-hidden='true'>
          <div className='drone-body' />
          <div className='drone-cone' />
        </div>
        <div className='cursor-glow' aria-hidden='true' />

        <div className='market-sign' aria-hidden='true'>
          <span className='market-sector'>Sector 10</span>
          <span className='market-name'>Night<br />Market</span>
          <span className='market-direction'>↙ <span>Street level</span></span>
        </div>

        <HudFrame className='hero-panel'>
          <p className='hero-eyebrow'>
            Product Engineer <span aria-hidden='true'>{'//'}</span> UX designer
          </p>
          <h1 id='home-hero-title' className='hero-title'>
            Michael Zick is{' '}<BrandName />
          </h1>
          <p className='hero-pitch'>Turning ideas into shipped products.</p>
          <div className='hero-ctas'>
            <button type='button' className='hero-cta' onClick={onSeeCaseStudies}>
              See Case Studies
            </button>
            <TrackedLink
              href='/contact'
              label='Contact'
              location='home_intro'
              className='hero-contact'
            >
              Contact
            </TrackedLink>
          </div>
        </HudFrame>

        <div className='scroll-cue' aria-hidden='true'>
          <span>Scroll</span>
          <i />
        </div>
      </div>
    </HeroRoot>
  );
};

export default HeroScene;
