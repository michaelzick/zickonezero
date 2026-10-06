import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, ReactNode } from 'react';

import { DEFAULT_THEME, THEME_STORAGE_KEY, resolveStoredTheme, type ThemeOption } from './themeConfig';

export type { ThemeOption } from './themeConfig';
export type ResolvedTheme = ThemeOption;

interface ThemeContextValue {
  preference: ThemeOption;
  resolved: ResolvedTheme;
  setPreference: (value: ThemeOption) => void;
  /** Flips night and day with the city time-lapse. */
  toggle: () => void;
}

// Long enough for the slowest token transition in styles/globals.scss.
const TIMELAPSE_MS = 2000;
const TIMELAPSE_CLASS = 'is-timelapse';

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
  const timelapseTimer = useRef<number | undefined>(undefined);

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

  useEffect(() => () => {
    window.clearTimeout(timelapseTimer.current);
    document.documentElement.classList.remove(TIMELAPSE_CLASS);
  }, []);

  const setPreference = useCallback((value: ThemeOption) => {
    setPreferenceState(value);
    setHasReadStorage(true);
    writeStoredPreference(value);
  }, []);

  const toggle = useCallback(() => {
    const root = document.documentElement;
    root.classList.add(TIMELAPSE_CLASS);
    window.clearTimeout(timelapseTimer.current);
    timelapseTimer.current = window.setTimeout(() => {
      root.classList.remove(TIMELAPSE_CLASS);
    }, TIMELAPSE_MS);

    setPreference(preference === 'dark' ? 'light' : 'dark');
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
