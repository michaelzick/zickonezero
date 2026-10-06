import { useEffect, useRef } from 'react';
import type { CSSProperties } from 'react';

import { BillboardStage } from '../../../styles/billboard';
import usePrefersReducedMotion from '../../hooks/usePrefersReducedMotion';
import { generateFacade } from '../../lib/city/facade';
import { subscribeToScroll } from '../../lib/city/scrollSignal';
import AlleyWall from '../city/AlleyWall';

type Slide = {
  src: string;
  alt: string;
};

const SLIDES: readonly Slide[] = [
  {
    src: '/img/demostoke/case-study/ds-explore-hybrid.webp',
    alt: 'DemoStoke hybrid catalog and map view',
  },
  {
    src: '/img/fleet-ops/ds-fleet-ops-widget-low.webp',
    alt: 'DemoStoke Fleet Ops embeddable booking widget',
  },
  {
    src: '/img/antisyphon/course-catalog.webp',
    alt: 'Antisyphon Training course catalog',
  },
  {
    src: '/img/nice-guy-university/ngu-courses.webp',
    alt: 'Nice Guy University course catalog',
  },
  {
    src: '/img/demostoke/case-study/ds-calendar-cal.webp',
    alt: 'DemoStoke events calendar',
  },
  {
    src: '/img/demostoke/case-study/ds-gear-quiz.webp',
    alt: 'DemoStoke gear quiz flow',
  },
];

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
const POWER_ON_THRESHOLD = 0.5;

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

  // Map the stage's scroll progress onto the track's overflow.
  useEffect(() => {
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
  useEffect(() => {
    const stage = stageRef.current;
    const frame = frameRef.current;
    if (!stage || !frame || prefersReducedMotion || typeof IntersectionObserver === 'undefined') {
      return undefined;
    }

    stage.setAttribute('data-standby', '');
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) {
        return;
      }

      stage.removeAttribute('data-standby');
      stage.setAttribute('data-powered', '');
      observer.disconnect();
    }, { threshold: POWER_ON_THRESHOLD });
    observer.observe(frame);

    return () => {
      observer.disconnect();
      stage.removeAttribute('data-standby');
    };
  }, [prefersReducedMotion]);

  return (
    <BillboardStage ref={stageRef} style={{ '--slide-count': SLIDES.length } as CSSProperties}>
      <div className='bb-frame' ref={frameRef} role='group' aria-label='Demostoke screenshot scroller'>
        <div className='bb-screen' ref={viewportRef}>
          <div className='bb-track' ref={trackRef}>
            {SLIDES.map(({ src, alt }) => (
              <div className='bb-slide' key={src}>
                <img src={src} alt={alt} loading='lazy' decoding='async' />
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
