import { act, render, renderHook, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { PropsWithChildren } from 'react';

import { AppThemeProvider, useThemePreference } from '../src/theme/ThemeContext';
import {
  THEME_BOOTSTRAP_SCRIPT,
  THEME_COLORS,
  THEME_STORAGE_KEY,
  resolveStoredTheme,
} from '../src/theme/themeConfig';

const root = document.documentElement;

const wrapper = ({ children }: PropsWithChildren) => <AppThemeProvider>{children}</AppThemeProvider>;

const ThemeProbe = () => {
  const { preference, resolved, toggle, setPreference } = useThemePreference();

  return (
    <>
      <p data-testid='resolved'>{resolved}</p>
      <p data-testid='preference'>{preference}</p>
      <button type='button' onClick={toggle}>Toggle</button>
      <button type='button' onClick={() => setPreference('dark')}>Night</button>
    </>
  );
};

describe('time of day', () => {
  beforeEach(() => {
    window.localStorage.clear();
    root.removeAttribute('data-theme');
    root.classList.remove('is-timelapse');
  });

  afterEach(() => {
    jest.restoreAllMocks();
    jest.useRealTimers();
  });

  describe('resolveStoredTheme', () => {
    it.each([
      ['light', 'light'],
      ['dark', 'dark'],
      ['system', 'dark'],
      ['LIGHT', 'dark'],
      [null, 'dark'],
      [undefined, 'dark'],
    ])('resolves a stored %p to %p', (stored, expected) => {
      expect(resolveStoredTheme(stored)).toBe(expected);
    });
  });

  describe('bootstrap script', () => {
    let meta: HTMLMetaElement;

    const runBootstrap = () => {
      new Function(THEME_BOOTSTRAP_SCRIPT)();
    };

    beforeEach(() => {
      meta = document.createElement('meta');
      meta.setAttribute('name', 'theme-color');
      meta.setAttribute('content', '#000000');
      document.head.appendChild(meta);
    });

    afterEach(() => {
      meta.remove();
    });

    it('starts at night with the night browser color', () => {
      runBootstrap();

      expect(root).toHaveAttribute('data-theme', 'dark');
      expect(meta).toHaveAttribute('content', THEME_COLORS.dark);
    });

    it('restores a stored day', () => {
      window.localStorage.setItem(THEME_STORAGE_KEY, 'light');

      runBootstrap();

      expect(root).toHaveAttribute('data-theme', 'light');
      expect(meta).toHaveAttribute('content', THEME_COLORS.light);
    });

    it('treats the retired system choice as night, like resolveStoredTheme', () => {
      window.localStorage.setItem(THEME_STORAGE_KEY, 'system');

      runBootstrap();

      expect(root).toHaveAttribute('data-theme', resolveStoredTheme('system'));
      expect(meta).toHaveAttribute('content', THEME_COLORS.dark);
    });

    it('falls back to night when storage is blocked', () => {
      jest.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
        throw new Error('blocked');
      });

      runBootstrap();

      expect(root).toHaveAttribute('data-theme', 'dark');
    });

    it('still sets the theme when the page has no theme-color tag', () => {
      meta.remove();
      window.localStorage.setItem(THEME_STORAGE_KEY, 'light');

      expect(runBootstrap).not.toThrow();
      expect(root).toHaveAttribute('data-theme', 'light');
    });
  });

  describe('AppThemeProvider', () => {
    it('defaults to night', () => {
      render(<ThemeProbe />, { wrapper });

      expect(screen.getByTestId('resolved')).toHaveTextContent('dark');
      expect(root).toHaveAttribute('data-theme', 'dark');
    });

    it('restores a stored day after mount', () => {
      window.localStorage.setItem(THEME_STORAGE_KEY, 'light');

      render(<ThemeProbe />, { wrapper });

      expect(screen.getByTestId('resolved')).toHaveTextContent('light');
      expect(root).toHaveAttribute('data-theme', 'light');
    });

    it('resolves the retired system choice to night', () => {
      window.localStorage.setItem(THEME_STORAGE_KEY, 'system');

      render(<ThemeProbe />, { wrapper });

      expect(screen.getByTestId('preference')).toHaveTextContent('dark');
      expect(root).toHaveAttribute('data-theme', 'dark');
    });

    it('toggles to day with a time-lapse and remembers the choice', async () => {
      jest.useFakeTimers();
      const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
      render(<ThemeProbe />, { wrapper });

      await user.click(screen.getByRole('button', { name: 'Toggle' }));

      expect(screen.getByTestId('resolved')).toHaveTextContent('light');
      expect(root).toHaveAttribute('data-theme', 'light');
      expect(window.localStorage.getItem(THEME_STORAGE_KEY)).toBe('light');
      expect(root).toHaveClass('is-timelapse');

      act(() => {
        jest.advanceTimersByTime(1999);
      });
      expect(root).toHaveClass('is-timelapse');

      act(() => {
        jest.advanceTimersByTime(1);
      });
      expect(root).not.toHaveClass('is-timelapse');
    });

    it('toggles back to night and persists it', async () => {
      window.localStorage.setItem(THEME_STORAGE_KEY, 'light');
      const user = userEvent.setup();
      render(<ThemeProbe />, { wrapper });

      await user.click(screen.getByRole('button', { name: 'Toggle' }));

      expect(root).toHaveAttribute('data-theme', 'dark');
      expect(window.localStorage.getItem(THEME_STORAGE_KEY)).toBe('dark');
    });

    it('keeps the choice for the visit when storage is blocked', async () => {
      jest.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
        throw new Error('blocked');
      });
      const user = userEvent.setup();
      render(<ThemeProbe />, { wrapper });

      await user.click(screen.getByRole('button', { name: 'Toggle' }));

      expect(screen.getByTestId('resolved')).toHaveTextContent('light');
      expect(root).toHaveAttribute('data-theme', 'light');
    });

    it('sets a preference directly', async () => {
      window.localStorage.setItem(THEME_STORAGE_KEY, 'light');
      const user = userEvent.setup();
      render(<ThemeProbe />, { wrapper });

      await user.click(screen.getByRole('button', { name: 'Night' }));

      expect(root).toHaveAttribute('data-theme', 'dark');
      expect(window.localStorage.getItem(THEME_STORAGE_KEY)).toBe('dark');
      expect(root).not.toHaveClass('is-timelapse');
    });

    it('clears a running time-lapse when it unmounts', async () => {
      const user = userEvent.setup();
      const { unmount } = render(<ThemeProbe />, { wrapper });

      await user.click(screen.getByRole('button', { name: 'Toggle' }));
      expect(root).toHaveClass('is-timelapse');

      unmount();
      expect(root).not.toHaveClass('is-timelapse');
    });
  });

  it('requires the provider', () => {
    jest.spyOn(console, 'error').mockImplementation(() => undefined);

    expect(() => renderHook(() => useThemePreference()))
      .toThrow('useThemePreference must be used within AppThemeProvider');
  });
});
