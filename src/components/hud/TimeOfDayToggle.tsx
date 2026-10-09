import { ReactElement } from 'react';

import { TimeToggleButton } from '../../../styles/hud';
import { trackEvent } from '../../lib/analytics';
import { useThemePreference } from '../../theme/ThemeContext';

type Props = {
  location?: string;
};

/** Switches the city between night (default) and day with a crossfade. */
const TimeOfDayToggle = ({ location = 'top_nav' }: Props): ReactElement => {
  const { resolved, toggle } = useThemePreference();
  const isNight = resolved === 'dark';
  const label = isNight ? 'Switch to day' : 'Switch to night';

  const handleClick = () => {
    trackEvent('theme_toggle', {
      location,
      from: isNight ? 'night' : 'day',
      to: isNight ? 'day' : 'night',
      page_path: window.location.pathname,
    });
    toggle();
  };

  return (
    <TimeToggleButton
      type='button'
      className='time-of-day-toggle'
      aria-label={label}
      title={label}
      onClick={handleClick}
      $isNight={isNight}
    >
      <span className='track' aria-hidden='true'>
        <span className='knob' />
        <svg className='icon-night' data-art viewBox='0 0 16 16' focusable='false'>
          <path
            d='M10.9 1.4a6.6 6.6 0 1 0 3.7 10.2A5.6 5.6 0 0 1 10.9 1.4Z'
            fill='currentColor'
          />
        </svg>
        <svg className='icon-day' data-art viewBox='0 0 16 16' focusable='false'>
          <circle cx='8' cy='8' r='3.2' fill='currentColor' />
          <path
            d='M8 .8v2M8 13.2v2M.8 8h2M13.2 8h2M2.9 2.9l1.4 1.4M11.7 11.7l1.4 1.4M2.9 13.1l1.4-1.4M11.7 4.3l1.4-1.4'
            stroke='currentColor'
            strokeWidth='1.5'
            strokeLinecap='round'
          />
        </svg>
      </span>
    </TimeToggleButton>
  );
};

export default TimeOfDayToggle;
