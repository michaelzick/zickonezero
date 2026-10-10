import { useLayoutEffect, useRef } from 'react';
import type { CSSProperties } from 'react';

import { BillboardStage } from '../../../styles/billboard';
import usePowerOn from '../../hooks/usePowerOn';
import usePrefersReducedMotion from '../../hooks/usePrefersReducedMotion';
import { generateFacade } from '../../lib/city/facade';
import { subscribeToScroll } from '../../lib/city/scrollSignal';
import { widthSrcSet } from '../../lib/responsiveImages';
import AlleyWall from '../city/AlleyWall';

type Slide = {
  src: string;
  alt: string;
  // The image's own size: each panel keeps its shape, so nothing is cropped.
  width: number;
  height: number;
  // Whether name-960w.webp and name-1440w.webp copies sit beside it.
  copies: boolean;
};

// Homepage-sized copies (1920px wide, 2x the largest panel): the full-size
// case-study captures decoded to 160 MB, enough for Chrome to evict them
// (and the gig cards) while the visitor is at the bottom of the page, so they
// flashed blank on the way back up. Each also has 960px and 1440px copies
// (name-960w.webp, name-1440w.webp) for smaller screens. The Riptyde phone
// screenshots are only 642px wide, already about 2x their panels, so they
// have none.
const SLIDES: readonly Slide[] = [
  {
    src: '/img/home/billboard/ds-explore-hybrid.webp',
    alt: 'DemoStoke hybrid catalog and map view',
    width: 1920,
    height: 1080,
    copies: true,
  },
  {
    src: '/img/home/billboard/ds-fleet-ops-widget-low.webp',
    alt: 'DemoStoke Fleet Ops embeddable booking widget',
    width: 1920,
    height: 1080,
    copies: true,
  },
  {
    src: '/img/projects/riptyde/riptyde-home.webp',
    alt: 'Riptyde home screen with RAD-O-METER™ score and ten-day outlook',
    width: 642,
    height: 1389,
    copies: false,
  },
  {
    src: '/img/projects/riptyde/riptyde-rad-page.webp',
    alt: 'RAD breakdown detail screen explaining each forecast factor',
    width: 642,
    height: 1389,
    copies: false,
  },
  {
    src: '/img/projects/riptyde/riptyde-spots.webp',
    alt: 'The Lineup spot list sorted by RAD-O-METER™ score',
    width: 642,
    height: 1389,
    copies: false,
  },
  {
    src: '/img/home/billboard/bars-of-sand-hero.webp',
    alt: 'Bars of Sand 3D terrain model of El Porto beach with a crescent sandbar, labeled with the bar crest depth and the first break',
    width: 1920,
    height: 1204,
    copies: true,
  },
  {
    src: '/img/home/billboard/ngu-courses.webp',
    alt: 'Nice Guy University course catalog',
    width: 1920,
    height: 1074,
    copies: true,
  },
];

// Each slide with copies is a 1920px file with 960px and 1440px copies beside it.
const slideSrcSet = (src: string) => widthSrcSet(src, [960, 1440], 1920);

// How wide a landscape panel renders (see --bb-slide-h in styles/billboard.ts).
const SLIDE_SIZES = '(max-width: 600px) 84vw, (max-width: 1137px) 78vw, min(64vw, 1024px)';

// Seeded, so the static HTML and the hydrated page draw the same tower.
const TOWER = generateFacade({
  seed: 23,
  length: 1800,
  height: 1500,
  groundHeight: 150,
  floorHeight: 46,
  windowWidth: 18,
  windowHeight: 24,
  windowGap: 14,
  minSegment: 420,
  maxSegment: 760,
  minRoof: 0.8,
  litChance: 0.12,
  coolShare: 0.35,
  unitChance: 0.06,
  maxUnits: 30,
  signs: 4,
  detailLength: 1800,
});

// The screen powers on once half the frame has scrolled into view.
const POWER_ON_OBSERVER: IntersectionObserverInit = { threshold: 0.5 };

/**
 * A full-width strip of product screenshots that pans across a tower as the
 * page scrolls. The stage is the scroll track; the sticky frame holds the
 * screen (the scroller's viewport, which clips the moving track) and the
 * decorative tower behind it. Reduced motion gets a still wall of panels.
 */
const HoloBillboard = () => {
  const stageRef = useRef<HTMLElement | null>(null);
  const frameRef = useRef<HTMLDivElement | null>(null);
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  // Map the stage's scroll progress onto the track's overflow, before paint
  // so a page restored mid-scroll never shows the track jump.
  useLayoutEffect(() => {
    const stage = stageRef.current;
    const viewport = viewportRef.current;
    const track = trackRef.current;
    if (!stage || !viewport || !track || prefersReducedMotion) {
      return undefined;
    }

    let isNear = true;

    const sync = () => {
      if (!isNear) {
        return;
      }

      const rect = stage.getBoundingClientRect();
      const totalDistance = Math.max(stage.offsetHeight - window.innerHeight, 1);
      const progress = Math.min(Math.max((-rect.top) / totalDistance, 0), 1);
      const maxTranslate = Math.max(track.scrollWidth - viewport.clientWidth, 0);
      const translateX = maxTranslate * progress * -1;
      track.style.transform = `translate3d(${translateX}px, 0, 0)`;
      stage.style.setProperty('--bp', progress.toFixed(4));
    };

    // Skip the per-frame measuring while the stage is well off-screen.
    const nearObserver = typeof IntersectionObserver === 'undefined'
      ? null
      : new IntersectionObserver(([entry]) => {
        isNear = entry.isIntersecting;
        sync();
      }, { rootMargin: '50% 0px' });
    nearObserver?.observe(stage);

    const unsubscribe = subscribeToScroll(sync);

    return () => {
      unsubscribe();
      nearObserver?.disconnect();
      track.style.removeProperty('transform');
      stage.style.removeProperty('--bp');
    };
  }, [prefersReducedMotion]);

  // Hold the screen dark until it scrolls into view, then power it on.
  usePowerOn(stageRef, { watch: frameRef, poweredAttribute: 'data-powered', observerOptions: POWER_ON_OBSERVER });

  return (
    <BillboardStage ref={stageRef}>
      <div className='bb-frame' ref={frameRef} role='group' aria-label='Shipped work screenshot scroller'>
        <div className='bb-screen' ref={viewportRef}>
          <div className='bb-track' ref={trackRef}>
            {SLIDES.map(({ src, alt, width, height, copies }) => (
              <div className='bb-slide' key={src} style={{ '--ar': `${width} / ${height}` } as CSSProperties}>
                <img
                  src={src}
                  srcSet={copies ? slideSrcSet(src) : undefined}
                  sizes={copies ? SLIDE_SIZES : undefined}
                  width={width}
                  height={height}
                  alt={alt}
                  loading='lazy'
                  decoding='sync'
                />
              </div>
            ))}
          </div>
          <div className='bb-progress' aria-hidden='true' />
        </div>

        <div className='bb-rig' aria-hidden='true'>
          <div className='bb-tower'>
            <AlleyWall facade={TOWER} fit='xMidYMax slice' />
          </div>
        </div>
        <div className='bb-spill' aria-hidden='true' />
        <div className='bb-plate' aria-hidden='true'>
          <i />
          <span>Now showing</span>
          <span lang='ja'>上映中</span>
          <b>Shipped work</b>
        </div>

        <div className='bb-street' aria-hidden='true' />
      </div>
    </BillboardStage>
  );
};

export default HoloBillboard;
