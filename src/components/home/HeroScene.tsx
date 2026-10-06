import { useRef } from 'react';
import type { CSSProperties } from 'react';

import { HeroRoot } from '../../../styles/home';
import { HudFrame } from '../../../styles/hud';
import usePointerParallax from '../../hooks/usePointerParallax';
import useScrollProgress from '../../hooks/useScrollProgress';
import { generateFacade } from '../../lib/city/facade';
import type { FacadeOptions } from '../../lib/city/facade';
import BrandName from '../BrandName';
import AlleyWall from '../city/AlleyWall';
import LedTicker from '../city/LedTicker';
import NeonSign from '../city/NeonSign';
import type { NeonLine } from '../city/NeonSign';
import { HEADLINE_PHRASES } from '../headlinePhrases';
import TrackedLink from '../TrackedLink';

const WALL: Omit<FacadeOptions, 'seed'> = {
  length: 3200,
  height: 1400,
  groundHeight: 150,
  floorHeight: 64,
  windowWidth: 30,
  windowHeight: 30,
  windowGap: 18,
  minSegment: 260,
  maxSegment: 520,
  minRoof: 0.55,
  litChance: 0.16,
  coolShare: 0.3,
  unitChance: 0.12,
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

const SIGN_LINES: readonly NeonLine[] = [
  { text: 'I Dream', variant: 'tube' },
  { text: 'in', variant: 'caption' },
  { text: 'Features', variant: 'led' },
];

// The panel has faded out by a third of the walk; past that it stops taking clicks.
const PANEL_FADED_AT = 0.34;

type HeroSceneProps = {
  onSeeCaseStudies: () => void;
};

/**
 * The homepage hero: a neon alley the visitor walks into as they
 * scroll, under a hanging "I Dream in Features" sign. Everything but the
 * heading and the HUD panel is decorative and hidden from assistive
 * technology; the Japanese signs are scenery, marked lang="ja".
 */
const HeroScene = ({ onSeeCaseStudies }: HeroSceneProps) => {
  const heroRef = useRef<HTMLElement | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);

  useScrollProgress(heroRef, { pastAt: PANEL_FADED_AT });
  usePointerParallax(stageRef);

  return (
    <HeroRoot ref={heroRef} aria-labelledby='home-hero-title'>
      <div className='hero-stage' ref={stageRef}>
        <div className='hero-sky' aria-hidden='true' />

        <div className='hero-scene' aria-hidden='true'>
          <div className='alley'>
            <div className='plane street'>
              <div className='street-glow' />
              {/* Painted on the street itself: a second plane just above it z-fights. */}
              <div className='arrows'>
                <div className='arrows-track' />
              </div>
            </div>
            <div className='plane wall wall-left'>
              <AlleyWall facade={LEFT_WALL} />
            </div>
            <div className='plane wall wall-right'>
              <AlleyWall facade={RIGHT_WALL} />
            </div>

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

        <div className='sign-spill' aria-hidden='true' />
        <div className='hero-haze' aria-hidden='true' />
        <div className='drone' aria-hidden='true'>
          <div className='drone-body' />
          <div className='drone-cone' />
        </div>
        <div className='cursor-glow' aria-hidden='true' />

        <NeonSign
          as='h1'
          id='home-hero-title'
          className='hero-sign'
          lines={SIGN_LINES}
        />

        <HudFrame className='hero-panel'>
          <p className='hero-eyebrow'>
            Product Engineer <span aria-hidden='true'>{'//'}</span> UX designer
          </p>
          <p className='hero-pitch'>
            Michael Zick is <BrandName /> Creative, turning ideas into shipped products.
          </p>
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
