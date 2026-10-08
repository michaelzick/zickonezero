import { useEffect, useRef, useState } from 'react';
import type { CSSProperties, FocusEvent, RefObject } from 'react';

import { HomeHudRoot } from '../../../styles/homeHud';
import usePrefersReducedMotion from '../../hooks/usePrefersReducedMotion';
import {
  MINIMAP_DISTRICT_BLOCKS,
  MINIMAP_HEIGHT,
  MINIMAP_POIS,
  MINIMAP_ROUTE,
  MINIMAP_STOPS,
  MINIMAP_WIDTH,
  buildMinimapBlocks,
  locateOnRoute,
  routePath,
} from '../../lib/city/minimap';
import { subscribeToScroll } from '../../lib/city/scrollSignal';
import type { DistrictTone, HomeSectionKey } from '../../types';
import HudClock from '../hud/HudClock';
import QuestTracker from '../hud/QuestTracker';

export type HudDistrict = {
  section: HomeSectionKey;
  /** The pin's text and accessible name. */
  label: string;
  /** The district's full name, for the quest objective. */
  title: string;
  tone: DistrictTone;
};

type Props = {
  /** The districts in route order. */
  districts: readonly HudDistrict[];
  active: HomeSectionKey | null;
  onTravel: (section: HomeSectionKey, label: string) => void;
  /** The final objective returns to the top of the hero. */
  onReturnToSurface: () => void;
  /**
   * Scroll positions where the player reaches each stop: the start, each
   * district, then the end of the route. Called again whenever the page resizes.
   */
  measureStops: () => number[];
  /** The HUD tucks away while this element (the footer) is on screen. */
  parkRef: RefObject<HTMLElement | null>;
};

const MAP_ART = buildMinimapBlocks();
const ROUTE_PATH = routePath();
const START = MINIMAP_ROUTE[0];
const GOAL = MINIMAP_ROUTE[MINIMAP_ROUTE.length - 1];

// The distance readout's scale: a page of about 8,000 pixels is a 2 km walk.
const METERS_PER_PIXEL = 0.25;
// Over the first part of the hero, the bottom bar would cover its buttons.
const HERO_SHARE = 0.4;
// Smoothed scroll speed, in pixels per frame, that turns the player around.
const TURN_VELOCITY = 1.5;

const GLITCH_FRAMES: Keyframe[] = [
  { transform: 'none', filter: 'none' },
  { transform: 'translate3d(-3px, 0, 0) skewX(-5deg)', filter: 'hue-rotate(80deg) saturate(1.8)', offset: 0.18 },
  { transform: 'translate3d(3px, 1px, 0)', filter: 'hue-rotate(-50deg) brightness(1.5)', offset: 0.4 },
  { transform: 'translate3d(-1px, 0, 0)', filter: 'brightness(1.2)', offset: 0.62 },
  { transform: 'none', filter: 'none' },
];

export const formatDistance = (pixels: number): string => {
  const meters = Math.max(0, pixels) * METERS_PER_PIXEL;
  // Round first, so 996 m reads 1.0 km rather than 1000 m.
  const rounded = Math.round(meters / 10) * 10;
  return rounded < 1000 ? `${rounded} m` : `${(meters / 1000).toFixed(1)} km`;
};

// Keyboard focus brings a tucked HUD back; a pin left focused by a click or
// tap does not.
const isKeyboardFocus = (element: Element) => {
  try {
    return element.matches(':focus-visible');
  } catch {
    // Without :focus-visible support, any focus brings the HUD back.
    return true;
  }
};

const poiShape = ({ x, y, kind }: (typeof MINIMAP_POIS)[number]) => {
  const className = `map-poi poi-${kind}`;
  if (kind === 'fixer') {
    return <circle key={`${x}:${y}`} className={className} cx={x} cy={y} r={3} />;
  }

  if (kind === 'shop') {
    return <rect key={`${x}:${y}`} className={className} x={x - 3} y={y - 3} width={6} height={6} />;
  }

  return <path key={`${x}:${y}`} className={className} d={`M${x} ${y - 4}l4 4-4 4-4-4z`} />;
};

/**
 * The homepage's "Homepage sections" nav as a game HUD: a minimap whose
 * district pins fast travel down the page, a player arrow that walks the
 * route as the visitor scrolls, a clock, and a quest tracker. Narrow or short
 * screens get the same buttons as a bottom bar (see styles/homeHud.ts). The
 * map, clock, and distance are decoration; the pins and the quest objective
 * are the nav.
 */
const HomeHud = ({ districts, active, onTravel, onReturnToSurface, measureStops, parkRef }: Props) => {
  const rootRef = useRef<HTMLElement>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<HTMLSpanElement>(null);
  const distanceRef = useRef<HTMLSpanElement>(null);
  const [overHero, setOverHero] = useState(true);
  const [arrived, setArrived] = useState(false);
  const [parked, setParked] = useState(false);
  const [keyboardFocus, setKeyboardFocus] = useState(false);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const root = rootRef.current;
    const player = playerRef.current;
    if (!root || !player) {
      return undefined;
    }

    let stops = measureStops();
    // Unwrapped, so each turn eases the short way round. It starts facing the
    // way the route leaves the player's first spot, so the arrow does not
    // spin round on load.
    let heading = locateOnRoute(window.scrollY, stops).heading;
    let facingBack = false;
    let distanceText = '';
    let isOverHero: boolean | null = null;
    let hasArrived: boolean | null = null;

    const update = (y: number, velocity: number) => {
      const fix = locateOnRoute(y, stops);

      // Walking back up the page turns the player around; slowing down does not.
      if (velocity < -TURN_VELOCITY) {
        facingBack = true;
      } else if (velocity > TURN_VELOCITY) {
        facingBack = false;
      }

      const target = fix.heading + (facingBack ? 180 : 0);
      heading += ((((target - heading) % 360) + 540) % 360) - 180;

      player.style.transform = `translate3d(${fix.x.toFixed(1)}px, ${fix.y.toFixed(1)}px, 0)`;
      player.style.setProperty('--heading', `${Math.round(heading)}deg`);
      root.style.setProperty('--hud-progress', fix.progress.toFixed(4));

      const end = stops[stops.length - 1];
      const nextDistance = formatDistance(end - y);
      if (distanceRef.current && nextDistance !== distanceText) {
        distanceText = nextDistance;
        distanceRef.current.textContent = nextDistance;
      }

      const nextOverHero = y < window.innerHeight * HERO_SHARE;
      if (nextOverHero !== isOverHero) {
        isOverHero = nextOverHero;
        setOverHero(nextOverHero);
      }

      const nextArrived = y >= end - 2;
      if (nextArrived !== hasArrived) {
        hasArrived = nextArrived;
        setArrived(nextArrived);
      }
    };

    const remeasure = () => {
      stops = measureStops();
      update(window.scrollY, 0);
    };

    const unsubscribe = subscribeToScroll(({ y, velocity }) => update(y, velocity));
    // Images and fonts loading move the districts down the page.
    const resizeObserver = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(remeasure);
    resizeObserver?.observe(document.body);
    window.addEventListener('resize', remeasure);
    remeasure();

    return () => {
      unsubscribe();
      resizeObserver?.disconnect();
      window.removeEventListener('resize', remeasure);
    };
  }, [measureStops]);

  useEffect(() => {
    const target = parkRef.current;
    if (!target || typeof IntersectionObserver === 'undefined') {
      return undefined;
    }

    const observer = new IntersectionObserver((entries) => {
      setParked(entries[entries.length - 1].isIntersecting);
    });
    observer.observe(target);
    return () => observer.disconnect();
  }, [parkRef]);

  const handleFocus = (event: FocusEvent<HTMLElement>) => {
    setKeyboardFocus(isKeyboardFocus(event.target));
  };

  const handleBlur = (event: FocusEvent<HTMLElement>) => {
    if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
      setKeyboardFocus(false);
    }
  };

  const travel = (district: HudDistrict) => {
    onTravel(district.section, district.label);

    const map = mapRef.current;
    if (map && typeof map.animate === 'function' && !prefersReducedMotion) {
      map.animate(GLITCH_FRAMES, { duration: 420, easing: 'linear' });
    }
  };

  const activeIndex = districts.findIndex(({ section }) => section === active);
  // The objective always points to the next stop, then back to the surface.
  const questDistrict = districts[activeIndex + 1];
  const objective = questDistrict ? `Head to ${questDistrict.title}` : 'Return to surface';
  const handleObjectiveClick = () => {
    if (questDistrict) {
      travel(questDistrict);
    } else {
      onReturnToSurface();
    }
  };

  return (
    <HomeHudRoot
      ref={rootRef}
      aria-label='Homepage sections'
      data-hero={overHero ? '' : undefined}
      data-parked={parked ? '' : undefined}
      data-focus={keyboardFocus ? '' : undefined}
      onFocus={handleFocus}
      onBlur={handleBlur}
    >
      <div className='hud-map'>
        <div className='hud-map-art' ref={mapRef} aria-hidden='true'>
          <svg
            data-art
            viewBox={`0 0 ${MINIMAP_WIDTH} ${MINIMAP_HEIGHT}`}
            width={MINIMAP_WIDTH}
            height={MINIMAP_HEIGHT}
            focusable='false'
          >
            <path className='map-blocks' d={MAP_ART.blocks} />
            <path className='map-parks' d={MAP_ART.parks} />
            {districts.map(({ section, tone }, index) => (
              MINIMAP_DISTRICT_BLOCKS[index] && (
                <path
                  key={section}
                  className={`map-district tone-${tone}`}
                  d={MINIMAP_DISTRICT_BLOCKS[index]}
                  data-active={index === activeIndex ? '' : undefined}
                />
              )
            ))}
            {MINIMAP_POIS.map(poiShape)}
            <path className='map-route' d={ROUTE_PATH} />
            <circle className='map-start' cx={START.x} cy={START.y} r={4} />
            <path className='map-goal' d={`M${GOAL.x} ${GOAL.y - 6}l6 6-6 6-6-6z`} />
            <text className='map-north' x={MINIMAP_WIDTH - 9} y={13} textAnchor='middle'>N</text>
          </svg>
        </div>

        <span className='hud-player' ref={playerRef} aria-hidden='true'>
          <i />
        </span>

        <ul className='hud-pins'>
          {districts.map((district, index) => {
            const stop = MINIMAP_ROUTE[MINIMAP_STOPS[index + 1]] ?? START;
            const isActive = index === activeIndex;
            const isVisited = arrived || (activeIndex >= 0 && index < activeIndex);

            return (
              <li key={district.section}>
                <button
                  type='button'
                  className='hud-pin'
                  data-tone={district.tone}
                  data-state={isVisited ? 'visited' : undefined}
                  aria-current={isActive ? 'true' : undefined}
                  style={{ '--pin-x': `${stop.x}px`, '--pin-y': `${stop.y}px` } as CSSProperties}
                  onClick={() => travel(district)}
                >
                  <span className='pin-marker' aria-hidden='true' />
                  <span className='pin-label'>{district.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      <div className='hud-readouts'>
        <div aria-hidden='true'>
          <HudClock className='hud-clock' />
        </div>
        <QuestTracker objective={objective} onObjectiveClick={handleObjectiveClick} distanceRef={distanceRef} />
      </div>
    </HomeHudRoot>
  );
};

export default HomeHud;
