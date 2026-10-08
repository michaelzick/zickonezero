/**
 * The end of the homepage route (src/components/MainContent.tsx): open air
 * before the footer, where the persistent city shows through, with one giant
 * piece in the foreground. At night a street hologram towers over the road;
 * by day a sightseeing airship glides past. Both render in the static HTML
 * and the theme shows one (styles/cityGap.ts). The scene is decorative, so it
 * is hidden from assistive technology and holds nothing focusable.
 */

import { useRef } from 'react';

import { CityGapRoot } from '../../../styles/cityGap';
import useSceneMotion from '../../hooks/useSceneMotion';
import useScrollProgress from '../../hooks/useScrollProgress';
import Airship from './Airship';
import StreetHologram from './StreetHologram';

const CityGapScene = () => {
  const rootRef = useRef<HTMLDivElement>(null);
  useSceneMotion(rootRef);
  useScrollProgress(rootRef, { track: 'enter' });

  return (
    <CityGapRoot ref={rootRef} aria-hidden='true'>
      <div className='gap-night'>
        <StreetHologram />
      </div>
      <div className='gap-day'>
        <Airship />
      </div>
    </CityGapRoot>
  );
};

export default CityGapScene;
