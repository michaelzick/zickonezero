import { ReactElement } from 'react';

import { SoundToggleButton } from '../../../styles/hud';
import useAmbientSound from '../../hooks/useAmbientSound';
import { trackEvent } from '../../lib/analytics';

type Props = {
  location?: string;
};

/** Plays or mutes the city's synthesized ambience. Muted until asked. */
const SoundToggle = ({ location = 'top_nav' }: Props): ReactElement | null => {
  const { supported, enabled, playing, setEnabled } = useAmbientSound();

  if (!supported) {
    return null;
  }

  const handleClick = () => {
    const next = !enabled;
    trackEvent('sound_toggle', {
      location,
      enabled: next,
      page_path: window.location.pathname,
    });
    setEnabled(next);
  };

  return (
    <SoundToggleButton
      type='button'
      className='sound-toggle'
      aria-label='Ambient sound'
      aria-pressed={enabled}
      title={enabled ? 'Mute the city' : 'Play the city'}
      data-sound-toggle=''
      data-playing={playing ? 'true' : 'false'}
      onClick={handleClick}
    >
      <span className='track' aria-hidden='true'>
        <svg className='speaker' data-art viewBox='0 0 12 12' focusable='false'>
          <path d='M1 4.1h2.3L6.8 1.3v9.4L3.3 7.9H1Z' fill='currentColor' />
        </svg>
        <span className='bar' />
        <span className='bar' />
        <span className='bar' />
      </span>
    </SoundToggleButton>
  );
};

export default SoundToggle;
