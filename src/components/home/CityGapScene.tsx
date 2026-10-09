/**
 * The end of the homepage route (src/components/MainContent.tsx): open air
 * before the footer, where the persistent city shows through, with one giant
 * piece in the foreground. At night a carp streamer waves from the top of a
 * rooftop mast over a string of paper lanterns, between new buildings, while
 * police drones patrol behind it. By day a sightseeing airship drifts across
 * the sky among clouds and delivery drones, over a row of rooftops where a
 * window washer works. Both render in the static HTML and the theme shows one
 * (styles/cityGap.ts). The scene is decorative, so it is hidden from
 * assistive technology and holds nothing focusable.
 */

import { useRef } from 'react';

import { CityGapRoot } from '../../../styles/cityGap';
import useSceneMotion from '../../hooks/useSceneMotion';
import Airship from './Airship';
import DayClouds from './DayClouds';
import DayDrones from './DayDrones';
import DayRooftops from './DayRooftops';
import KoiStreamer from './KoiStreamer';
import PoliceDrones from './PoliceDrones';

const CityGapScene = () => {
  const rootRef = useRef<HTMLDivElement>(null);
  useSceneMotion(rootRef);

  return (
    <CityGapRoot ref={rootRef} aria-hidden='true'>
      {/* The patrol flies behind the carp, the lanterns, and the buildings. */}
      <div className='gap-night'>
        <PoliceDrones />
        <KoiStreamer />
      </div>
      {/* Back to front: the clouds, the airship, the drones, then the roofs. */}
      <div className='gap-day'>
        <DayClouds />
        <Airship />
        <DayDrones />
        <DayRooftops />
      </div>
    </CityGapRoot>
  );
};

export default CityGapScene;
