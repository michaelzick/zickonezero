import { useEffect, useState } from 'react';

import { useThemePreference } from '../../theme/ThemeContext';
import ScrambleText from './ScrambleText';

const pad = (value: number) => String(value).padStart(2, '0');

export const formatClock = (date: Date): string => `${pad(date.getHours())}:${pad(date.getMinutes())}`;

type Props = {
  className?: string;
};

/**
 * The visitor's local time on the 24-hour clock, ticking over on the minute.
 * It reads --:-- until mounted, so the static HTML matches every visitor, and
 * the digits scramble when the city switches between night and day.
 * Decorative: render it inside an aria-hidden readout.
 */
const HudClock = ({ className }: Props) => {
  const [time, setTime] = useState('--:--');
  const { resolved } = useThemePreference();

  useEffect(() => {
    let timeout: number | undefined;

    const tick = () => {
      const now = new Date();
      setTime(formatClock(now));
      // Wake just after the next minute starts.
      const untilNextMinute = (60 - now.getSeconds()) * 1000 - now.getMilliseconds();
      timeout = window.setTimeout(tick, untilNextMinute + 20);
    };

    tick();
    return () => window.clearTimeout(timeout);
  }, []);

  return <ScrambleText className={className} text={time} replayKey={resolved} />;
};

export default HudClock;
