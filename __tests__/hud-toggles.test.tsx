import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef } from 'react';
import { renderToString } from 'react-dom/server.node';

import HudClock, { formatClock } from '../src/components/hud/HudClock';
import QuestTracker from '../src/components/hud/QuestTracker';
import SoundToggle from '../src/components/hud/SoundToggle';
import TimeOfDayToggle from '../src/components/hud/TimeOfDayToggle';
import useAmbientSound from '../src/hooks/useAmbientSound';
import { AppThemeProvider } from '../src/theme/ThemeContext';
import { THEME_STORAGE_KEY } from '../src/theme/themeConfig';

jest.mock('../src/hooks/useAmbientSound');

type TestWindow = Window & {
  amplitude?: {
    track?: jest.Mock;
  };
};

const mockedUseAmbientSound = useAmbientSound as jest.MockedFunction<typeof useAmbientSound>;

const mockSound = (state: { supported: boolean; enabled: boolean; playing: boolean }) => {
  const setEnabled = jest.fn();
  mockedUseAmbientSound.mockReturnValue({ ...state, setEnabled });
  return setEnabled;
};

describe('HUD toggles and readouts', () => {
  let track: jest.Mock;

  beforeEach(() => {
    window.localStorage.clear();
    document.documentElement.removeAttribute('data-theme');
    track = jest.fn();
    (window as TestWindow).amplitude = { track };
  });

  afterEach(() => {
    delete (window as TestWindow).amplitude;
    jest.useRealTimers();
  });

  describe('TimeOfDayToggle', () => {
    it('names the switch it offers and tracks the change', async () => {
      const user = userEvent.setup();
      render(<TimeOfDayToggle />, { wrapper: AppThemeProvider });

      await user.click(screen.getByRole('button', { name: 'Switch to day' }));

      expect(track).toHaveBeenCalledWith('theme_toggle', {
        location: 'top_nav',
        from: 'night',
        to: 'day',
        page_path: '/',
      });
      expect(document.documentElement).toHaveAttribute('data-theme', 'light');
      expect(window.localStorage.getItem(THEME_STORAGE_KEY)).toBe('light');

      await user.click(screen.getByRole('button', { name: 'Switch to night' }));

      expect(track).toHaveBeenLastCalledWith('theme_toggle', {
        location: 'top_nav',
        from: 'day',
        to: 'night',
        page_path: '/',
      });
      expect(document.documentElement).toHaveAttribute('data-theme', 'dark');
    });

    it('reports where it was used', async () => {
      const user = userEvent.setup();
      render(<TimeOfDayToggle location='test' />, { wrapper: AppThemeProvider });

      await user.click(screen.getByRole('button', { name: 'Switch to day' }));

      expect(track).toHaveBeenCalledWith('theme_toggle', expect.objectContaining({ location: 'test' }));
    });
  });

  describe('SoundToggle', () => {
    it('hides where the browser has no Web Audio', () => {
      mockSound({ supported: false, enabled: false, playing: false });

      const { container } = render(<SoundToggle />);

      expect(container).toBeEmptyDOMElement();
    });

    it('turns sound on with a pressed state and an event', async () => {
      const user = userEvent.setup();
      const setEnabled = mockSound({ supported: true, enabled: false, playing: false });
      render(<SoundToggle />);

      const toggle = screen.getByRole('button', { name: 'Ambient sound' });
      expect(toggle).toHaveAttribute('aria-pressed', 'false');
      expect(toggle).toHaveAttribute('data-playing', 'false');
      expect(toggle).toHaveAttribute('title', 'Play the city');

      await user.click(toggle);

      expect(setEnabled).toHaveBeenCalledWith(true);
      expect(track).toHaveBeenCalledWith('sound_toggle', {
        location: 'top_nav',
        enabled: true,
        page_path: '/',
      });
    });

    it('shows a playing city and mutes it', async () => {
      const user = userEvent.setup();
      const setEnabled = mockSound({ supported: true, enabled: true, playing: true });
      render(<SoundToggle location='test' />);

      const toggle = screen.getByRole('button', { name: 'Ambient sound' });
      expect(toggle).toHaveAttribute('aria-pressed', 'true');
      expect(toggle).toHaveAttribute('data-playing', 'true');
      expect(toggle).toHaveAttribute('title', 'Mute the city');

      await user.click(toggle);

      expect(setEnabled).toHaveBeenCalledWith(false);
      expect(track).toHaveBeenCalledWith('sound_toggle', {
        location: 'test',
        enabled: false,
        page_path: '/',
      });
    });
  });

  describe('QuestTracker', () => {
    it('repeats the page for sighted visitors only', () => {
      const distanceRef = createRef<HTMLSpanElement>();
      const { container } = render(
        <QuestTracker objective='Explore Product Engineering' distanceRef={distanceRef} />,
      );

      const quest = container.firstElementChild;
      expect(quest).toHaveAttribute('aria-hidden', 'true');
      expect(quest).toHaveTextContent('Current gig');
      expect(quest).toHaveTextContent('Explore Product Engineering');
      expect(distanceRef.current).toHaveTextContent('-.- km');
    });
  });

  describe('HudClock', () => {
    it('formats the 24-hour clock', () => {
      expect(formatClock(new Date(2026, 9, 6, 7, 5))).toBe('07:05');
      expect(formatClock(new Date(2026, 9, 6, 23, 59, 59))).toBe('23:59');
    });

    it('renders a placeholder in the static HTML', () => {
      const html = renderToString(
        <AppThemeProvider>
          <HudClock />
        </AppThemeProvider>,
      );

      expect(html).toContain('--:--');
    });

    it('shows local time and ticks over on the minute', () => {
      jest.useFakeTimers({ now: new Date(2026, 9, 6, 23, 59, 30) });
      const { container } = render(<HudClock className='clock' />, { wrapper: AppThemeProvider });

      expect(container).toHaveTextContent('23:59');

      act(() => {
        jest.advanceTimersByTime(30_000 + 1000);
      });

      expect(container).toHaveTextContent('00:00');
    });
  });
});
