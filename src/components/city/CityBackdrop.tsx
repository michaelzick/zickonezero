import { CSSProperties, useEffect, useRef } from 'react';

import usePageScrollVars from '../../hooks/usePageScrollVars';
import useWindowLights from '../../hooks/useWindowLights';
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
  // Safe to raise: this layer draws nothing else from the generator's random
  // stream after its flicker windows, so its skyline stays the same.
  flickerCount: 10,
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
  // Fixed: the strips and billboards are drawn after these from the same
  // random stream, so changing the count would rearrange them.
  flickerCount: 14,
  windowWidth: MID_WINDOWS.width,
  windowHeight: MID_WINDOWS.height,
  neonStrips: 7,
  billboards: 3,
  beacons: 2,
});

const ACCENT_TONES = ['cyan', 'magenta', 'amber', 'violet', 'red'] as const;

type Props = {
  /** The page route (router.pathname), which sets the camera and accent. */
  pathname: string;
};

/**
 * The living city behind every page: sky, searchlights, two skyline depths
 * whose odd window light switches off and on at night, flying traffic,
 * drifting fog, and the accent glow. It mounts once in
 * pages/_app.tsx and persists across navigation; each route pans the camera
 * to its own spot in the city.
 */
const CityBackdrop = ({ pathname }: Props) => {
  const rootRef = useRef<HTMLDivElement>(null);
  const route = getRouteMeta(pathname);
  const isHome = isHomePath(pathname);

  usePageScrollVars(rootRef);
  useWindowLights(rootRef);

  // Re-run on every route change: the homepage districts may have re-tinted
  // the city since the last navigation.
  useEffect(() => {
    setCityAccent(getRouteMeta(pathname).accent);
  }, [pathname]);

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
      <SkylineDepth data-depth='mid'>
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
