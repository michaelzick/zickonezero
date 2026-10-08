import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import type { DynamicOptionsLoadingProps } from 'next/dynamic';

import { BoothRoot } from '../../../styles/barFour';
import { trackEvent } from '../../lib/analytics';
import { useThemePreference } from '../../theme/ThemeContext';
import TrackedLink from '../TrackedLink';

const RackStandby = ({ error, retry }: DynamicOptionsLoadingProps) => (
  error ? (
    <div className='rack-standby' role='alert'>
      <p>The rack wouldn&apos;t power up. Check your connection and try again.</p>
      {retry && <button type='button' className='booth-button' onClick={retry}>Try again</button>}
    </div>
  ) : (
    <div className='rack-standby' role='status'>
      <p>Warming up the rack…</p>
    </div>
  )
);

// Browser-only: the instrument needs Web Audio and window storage, and keeping
// it out of the static HTML keeps it off every other page's bundle.
const RacklooseBooth = dynamic(() => import('./RacklooseBooth'), {
  ssr: false,
  loading: RackStandby,
});

/**
 * Bar Four's booth, where the house rack is a playable Rackloose open to
 * anyone after dark.
 *
 * The club only opens after dark. Which state shows comes from
 * html[data-theme] in CSS, so the static HTML never flashes the wrong one; the
 * rack itself mounts only at night, once the stored theme is known, and
 * switching to day unmounts it, which stops its audio.
 */
const RackBooth = () => {
  const { resolved, toggle } = useThemePreference();
  // The provider reads the stored theme in its own effect, which lands in the
  // same render as this one, so a day visit never starts loading the rack.
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);

  const isOpen = hydrated && resolved === 'dark';

  const waitForDark = () => {
    trackEvent('theme_toggle', {
      location: 'bar_four',
      from: 'day',
      to: 'night',
      page_path: window.location.pathname,
    });
    toggle();
  };

  return (
    <BoothRoot aria-labelledby='house-rack-title'>
      <div className='booth-copy'>
        <p className='booth-tag'>Open rack tonight</p>
        <h2 id='house-rack-title'>The house rack</h2>
        <p>
          Rackloose is a modular studio I built for the browser. Patch cables between synths, drum
          machines, and effects, program its sequencers, and play it from your keyboard.
        </p>
        <p className='booth-open-note'>
          It&apos;s warmed up on Neon Skyline. Press Play All, or click into the rack to play it
          from your keyboard. Click anywhere else to give the keys back.
        </p>
        <TrackedLink
          href='https://rackloose.michaelzick.com/'
          label='Open the full studio'
          location='bar_four'
          section='house_rack'
          target='_blank'
          className='booth-link'
        >
          Open the full studio <span aria-hidden='true'>↗</span>
        </TrackedLink>
      </div>

      <div className='booth-deck'>
        <div className='booth-slot'>
          {isOpen ? <RacklooseBooth /> : <RackStandby />}
        </div>

        {/* By day a flight-case lid closes over the rack. */}
        <div className='booth-case'>
          <p className='case-note'>
            <strong>Closed.</strong> Doors open at dusk.
          </p>
          <button type='button' className='booth-button' onClick={waitForDark}>
            Wait for dark
          </button>
        </div>
      </div>
    </BoothRoot>
  );
};

export default RackBooth;
