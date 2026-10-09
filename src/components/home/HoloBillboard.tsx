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
};

// Homepage-sized copies (1920px wide, 2x the largest screen): the full-size
// case-study captures decoded to 160 MB, enough for Chrome to evict them
// (and the gig cards) while the visitor is at the bottom of the page, so they
// flashed blank on the way back up. Each also has 960px and 1440px copies
// (name-960w.webp, name-1440w.webp) for smaller screens.
const SLIDES: readonly Slide[] = [
  {
    src: '/img/home/billboard/ds-explore-hybrid.webp',
    alt: 'DemoStoke hybrid catalog and map view',
  },
  {
    src: '/img/home/billboard/ds-fleet-ops-widget-low.webp',
    alt: 'DemoStoke Fleet Ops embeddable booking widget',
  },
  {
    src: '/img/home/billboard/course-catalog.webp',
    alt: 'Antisyphon Training course catalog',
  },
  {
    src: '/img/home/billboard/ngu-courses.webp',
    alt: 'Nice Guy University course catalog',
  },
  {
    src: '/img/home/billboard/ds-calendar-cal.webp',
    alt: 'DemoStoke events calendar',
  },
  {
    src: '/img/home/billboard/ds-gear-quiz.webp',
    alt: 'DemoStoke gear quiz flow',
  },
];

// Each slide is a 1920px copy with 960px and 1440px copies beside it.
const slideSrcSet = (src: string) => widthSrcSet(src, [960, 1440], 1920);

// How wide a slide's image renders (it covers the slide by height, see
// styles/billboard.ts): about the screen's width on phones, at most 960px.
const SLIDE_SIZES = '(max-width: 600px) 105vw, (max-width: 1137px) 85vw, 960px';

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
 * A giant screen on a tower that pans through product screenshots as the
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
    let slide = '';

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

      const slideWidth = track.scrollWidth / SLIDES.length;
      if (slideWidth > 0) {
        const centered = Math.floor((viewport.clientWidth / 2 - translateX) / slideWidth) + 1;
        const next = String(Math.min(Math.max(centered, 1), SLIDES.length));
        if (next !== slide) {
          slide = next;
          stage.style.setProperty('--slide', next);
        }
      }
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
      stage.style.removeProperty('--slide');
    };
  }, [prefersReducedMotion]);

  // Hold the screen dark until it scrolls into view, then power it on.
  usePowerOn(stageRef, { watch: frameRef, poweredAttribute: 'data-powered', observerOptions: POWER_ON_OBSERVER });

  return (
    <BillboardStage ref={stageRef} style={{ '--slide-count': SLIDES.length } as CSSProperties}>
      <div className='bb-frame' ref={frameRef} role='group' aria-label='Demostoke screenshot scroller'>
        <div className='bb-screen' ref={viewportRef}>
          <div className='bb-track' ref={trackRef}>
            {SLIDES.map(({ src, alt }) => (
              <div className='bb-slide' key={src}>
                <img src={src} srcSet={slideSrcSet(src)} sizes={SLIDE_SIZES} alt={alt} loading='lazy' decoding='sync' />
              </div>
            ))}
          </div>
          <div className='bb-scan' aria-hidden='true' />
          <div className='bb-bug' aria-hidden='true'>
            <i />
            Live
          </div>
          <div className='bb-channel' aria-hidden='true' />
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
