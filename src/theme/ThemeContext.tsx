import { createContext, useCallback, useContext, useEffect, useMemo, useState, ReactNode } from 'react';
import { flushSync } from 'react-dom';

import { DEFAULT_THEME, THEME_STORAGE_KEY, resolveStoredTheme, type ThemeOption } from './themeConfig';

export type { ThemeOption } from './themeConfig';
export type ResolvedTheme = ThemeOption;

interface ThemeContextValue {
  preference: ThemeOption;
  resolved: ResolvedTheme;
  setPreference: (value: ThemeOption) => void;
  /** Flips night and day with a crossfade. */
  toggle: () => void;
}

const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';

/*
 * The crossfade is a view transition: the browser snapshots the old city and
 * fades it into the new one on the compositor, timed in styles/globals.scss.
 * Animating the color tokens instead restyled and repainted the whole page
 * every frame, which stalled and flashed the homepage, and left half-switched
 * colors mid-fade. Without view transitions or with reduced motion, the
 * switch is instant.
 */
const canCrossfade = () => (
  typeof document.startViewTransition === 'function'
  && !window.matchMedia?.(REDUCED_MOTION_QUERY).matches
);

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

const readStoredPreference = (): ThemeOption => {
  try {
    return resolveStoredTheme(window.localStorage.getItem(THEME_STORAGE_KEY));
  } catch {
    return DEFAULT_THEME;
  }
};

const writeStoredPreference = (value: ThemeOption) => {
  try {
    window.localStorage.setItem(THEME_STORAGE_KEY, value);
  } catch {
    // Storage can be blocked (private mode); the choice still applies to this visit.
  }
};

export const useThemePreference = (): ThemeContextValue => {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error('useThemePreference must be used within AppThemeProvider');
  }

  return context;
};

interface ThemeProviderProps {
  children: ReactNode;
}

export const AppThemeProvider = ({ children }: ThemeProviderProps) => {
  // Render night on the server and during hydration; the stored choice is
  // already on <html> from the bootstrap script, so no flash happens.
  const [preference, setPreferenceState] = useState<ThemeOption>(DEFAULT_THEME);
  const [hasReadStorage, setHasReadStorage] = useState(false);

  useEffect(() => {
    setPreferenceState(readStoredPreference());
    setHasReadStorage(true);
  }, []);

  useEffect(() => {
    if (!hasReadStorage) {
      return;
    }

    document.documentElement.setAttribute('data-theme', preference);
  }, [preference, hasReadStorage]);

  const setPreference = useCallback((value: ThemeOption) => {
    setPreferenceState(value);
    setHasReadStorage(true);
    writeStoredPreference(value);
  }, []);

  const toggle = useCallback(() => {
    const next: ThemeOption = preference === 'dark' ? 'light' : 'dark';

    if (!canCrossfade()) {
      setPreference(next);
      return;
    }

    // The new theme must be in the DOM before the callback returns, so the
    // browser snapshots the finished page rather than a half-rendered one.
    document.startViewTransition(() => {
      document.documentElement.setAttribute('data-theme', next);
      flushSync(() => setPreference(next));
    });
  }, [preference, setPreference]);

  const contextValue = useMemo<ThemeContextValue>(() => ({
    preference,
    resolved: preference,
    setPreference,
    toggle,
  }), [preference, setPreference, toggle]);

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};

export const THEME_OPTIONS: ThemeOption[] = ['dark', 'light'];
