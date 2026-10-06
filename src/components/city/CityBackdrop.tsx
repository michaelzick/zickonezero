import { CSSProperties, useEffect, useRef } from 'react';

import usePageScrollVars from '../../hooks/usePageScrollVars';
import usePrefersReducedMotion from '../../hooks/usePrefersReducedMotion';
import { setCityAccent } from '../../lib/city/accent';
import { getRouteMeta, isHomePath } from '../../lib/city/routes';
import { generateSkyline } from '../../lib/city/skyline';
import {
  AccentGlow,
  CityBackdropRoot,
  FogBand,
  GroundHaze,
  Searchlights,
  SkylineDepth,
  SunGlow,
  WorldDimmer,
} from '../../../styles/city';
import FlyingTraffic from './FlyingTraffic';
import Skyline, { SkylineWindows } from './Skyline';

const FAR_WINDOWS: SkylineWindows = { width: 2, gap: 2, height: 2 };
const MID_WINDOWS: SkylineWindows = { width: 3, gap: 3, height: 4 };

// Fixed seeds: the static HTML and the hydrated client draw the same city.
const FAR_SKYLINE = generateSkyline({
  seed: 2077,
  width: 1200,
  height: 300,
  minBuildingWidth: 28,
  maxBuildingWidth: 70,
  minHeight: 0.3,
  maxHeight: 0.82,
  minGap: -6,
  maxGap: 4,
  floorHeight: 6,
  litRowChance: 0.3,
  coolShare: 0.25,
  flickerCount: 0,
  windowWidth: FAR_WINDOWS.width,
  windowHeight: FAR_WINDOWS.height,
  neonStrips: 0,
  billboards: 0,
  beacons: 4,
});

const MID_SKYLINE = generateSkyline({
  seed: 1337,
  width: 1200,
  height: 420,
  minBuildingWidth: 52,
  maxBuildingWidth: 128,
  minHeight: 0.22,
  maxHeight: 0.7,
  minGap: -10,
  maxGap: 14,
  floorHeight: 9,
  litRowChance: 0.36,
  coolShare: 0.3,
  flickerCount: 14,
  windowWidth: MID_WINDOWS.width,
  windowHeight: MID_WINDOWS.height,
  neonStrips: 7,
  billboards: 3,
  beacons: 2,
});

const ACCENT_TONES = ['cyan', 'magenta', 'amber', 'violet', 'red'] as const;

const FLICKER_INTERVAL_MS = 1100;

type Props = {
  /** The page route (router.pathname), which sets the camera and accent. */
  pathname: string;
};

/**
 * The living city behind every page: sky, searchlights, two skyline depths,
 * flying traffic, drifting fog, and the accent glow. It mounts once in
 * pages/_app.tsx and persists across navigation; each route pans the camera
 * to its own spot in the city.
 */
const CityBackdrop = ({ pathname }: Props) => {
  const rootRef = useRef<HTMLDivElement>(null);
  const midRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();
  const route = getRouteMeta(pathname);
  const isHome = isHomePath(pathname);

  usePageScrollVars(rootRef);

  // Re-run on every route change: the homepage districts may have re-tinted
  // the city since the last navigation.
  useEffect(() => {
    setCityAccent(getRouteMeta(pathname).accent);
  }, [pathname]);

  // Apartment lights switch on and off, and the odd fluorescent tube buzzes.
  // Purely visual, so it mutates classes instead of React state.
  useEffect(() => {
    const container = midRef.current;
    if (prefersReducedMotion || !container) {
      return undefined;
    }

    const windows = Array.from(container.querySelectorAll<SVGRectElement>('.flicker-window'));
    if (windows.length === 0) {
      return undefined;
    }

    const timeouts = new Set<number>();
    const later = (callback: () => void, delay: number) => {
      const id = window.setTimeout(() => {
        timeouts.delete(id);
        callback();
      }, delay);
      timeouts.add(id);
    };

    const flicker = () => {
      if (document.hidden) {
        return;
      }

      const target = windows[Math.floor(Math.random() * windows.length)];
      if (Math.random() < 0.35) {
        target.classList.toggle('is-dim');
        return;
      }

      // Two partial dips, then back on: a buzz, never a strobe.
      target.classList.add('is-dim');
      later(() => target.classList.remove('is-dim'), 90);
      later(() => target.classList.add('is-dim'), 170);
      later(() => target.classList.remove('is-dim'), 260);
    };

    const interval = window.setInterval(flicker, FLICKER_INTERVAL_MS);

    return () => {
      window.clearInterval(interval);
      timeouts.forEach((id) => window.clearTimeout(id));
      timeouts.clear();
    };
  }, [prefersReducedMotion]);

  return (
    <CityBackdropRoot
      ref={rootRef}
      aria-hidden='true'
      data-route={route.path}
      style={{ '--camera': route.camera } as CSSProperties}
    >
      <SunGlow />
      <Searchlights>
        <span />
        <span />
        <span />
      </Searchlights>
      <SkylineDepth data-depth='far'>
        <div className='parallax'>
          <Skyline layer={FAR_SKYLINE} windows={FAR_WINDOWS} />
        </div>
      </SkylineDepth>
      <FogBand />
      <FlyingTraffic />
      <SkylineDepth data-depth='mid' ref={midRef}>
        <div className='parallax'>
          <Skyline layer={MID_SKYLINE} windows={MID_WINDOWS} />
        </div>
      </SkylineDepth>
      {ACCENT_TONES.map((tone) => (
        <AccentGlow key={tone} data-tone={tone} />
      ))}
      <GroundHaze />
      <WorldDimmer data-dimmed={!isHome} />
    </CityBackdropRoot>
  );
};

export default CityBackdrop;
