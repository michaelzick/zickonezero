import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import type { DynamicOptionsLoadingProps } from 'next/dynamic';

import { StallRoot } from '../../../styles/nightMarket';
import { trackEvent } from '../../lib/analytics';
import { useThemePreference } from '../../theme/ThemeContext';
import TrackedLink from '../TrackedLink';

const RackStandby = ({ error, retry }: DynamicOptionsLoadingProps) => (
  error ? (
    <div className='rack-standby' role='alert'>
      <p>The rack wouldn&apos;t power up. Check your connection and try again.</p>
      {retry && <button type='button' className='stall-button' onClick={retry}>Try again</button>}
    </div>
  ) : (
    <div className='rack-standby' role='status'>
      <p>Warming up the rack…</p>
    </div>
  )
);

// Browser-only: the instrument needs Web Audio and window storage, and keeping
// it out of the static HTML keeps it off every other page's bundle.
const RacklooseStall = dynamic(() => import('./RacklooseStall'), {
  ssr: false,
  loading: RackStandby,
});

/**
 * The Night Market's headline stall: a gear vendor whose counter holds a
 * playable Rackloose rack.
 *
 * The market only opens after dark. Which state shows comes from
 * html[data-theme] in CSS, so the static HTML never flashes the wrong one; the
 * rack itself mounts only at night, once the stored theme is known, and
 * switching to day unmounts it, which stops its audio.
 */
const SynthStall = () => {
  const { resolved, toggle } = useThemePreference();
  // The provider reads the stored theme in its own effect, which lands in the
  // same render as this one, so a day visit never starts loading the rack.
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);

  const isOpen = hydrated && resolved === 'dark';

  const waitForDark = () => {
    trackEvent('theme_toggle', {
      location: 'night_market',
      from: 'day',
      to: 'night',
      page_path: window.location.pathname,
    });
    toggle();
  };

  return (
    <StallRoot aria-labelledby='synth-stall-title'>
      <div className='awning' aria-hidden='true'>
        <span className='awning-sign'>Synths <i>·</i> Drums <i>·</i> Cables</span>
      </div>

      <div className='stall-body'>
        <div className='stall-copy'>
          <p className='stall-tag'>Try before you buy</p>
          <h2 id='synth-stall-title'>Synth stall</h2>
          <p>
            Rackloose is a modular studio I built for the browser. Patch cables between synths, drum
            machines, and effects, program its sequencers, and play it from your keyboard.
          </p>
          <p className='stall-open-note'>
            It&apos;s warmed up on Neon Skyline. Press Play All, or click into the rack to play it
            from your keyboard. Click anywhere else to give the keys back.
          </p>
          <TrackedLink
            href='https://rackloose.michaelzick.com/'
            label='Open the full studio'
            location='night_market'
            section='synth_stall'
            target='_blank'
            className='stall-link'
          >
            Open the full studio <span aria-hidden='true'>↗</span>
          </TrackedLink>
        </div>

        <div className='stall-counter'>
          <div className='stall-slot'>
            {isOpen ? <RacklooseStall /> : <RackStandby />}
          </div>

          <div className='stall-shutter'>
            <p className='shutter-note'>
              <strong>Closed.</strong> The market opens at dusk.
            </p>
            <button type='button' className='stall-button' onClick={waitForDark}>
              Wait for dark
            </button>
          </div>
        </div>
      </div>
    </StallRoot>
  );
};

export default SynthStall;
