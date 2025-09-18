import { createContext, useCallback, useContext, useEffect, useMemo, useState, ReactNode } from 'react';

export type ThemeOption = 'light' | 'dark' | 'system';
export type ResolvedTheme = 'light' | 'dark';

interface ThemeContextValue {
  preference: ThemeOption;
  resolved: ResolvedTheme;
  setPreference: (value: ThemeOption) => void;
}

const STORAGE_KEY = 'zickonezero-theme';
const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

const isThemeOption = (value: unknown): value is ThemeOption =>
  value === 'light' || value === 'dark' || value === 'system';

const getStoredPreference = (): ThemeOption => {
  if (typeof window === 'undefined') {
    return 'system';
  }

  const stored = window.localStorage.getItem(STORAGE_KEY);
  return isThemeOption(stored) ? stored : 'system';
};

const getSystemTheme = (): ResolvedTheme => {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
    return 'dark';
  }

  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
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
  const [preference, setPreferenceState] = useState<ThemeOption>(() => getStoredPreference());
  const [systemTheme, setSystemTheme] = useState<ResolvedTheme>(() => getSystemTheme());

  const resolved = preference === 'system' ? systemTheme : preference;

  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
      return;
    }

    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (event: MediaQueryListEvent) => {
      setSystemTheme(event.matches ? 'dark' : 'light');
    };

    setSystemTheme(media.matches ? 'dark' : 'light');

    if (typeof media.addEventListener === 'function') {
      media.addEventListener('change', handleChange);
      return () => media.removeEventListener('change', handleChange);
    }

    media.addListener(handleChange);
    return () => media.removeListener(handleChange);
  }, []);

  useEffect(() => {
    if (typeof document === 'undefined') {
      return;
    }

    const root = document.documentElement;
    root.setAttribute('data-theme', resolved);
  }, [resolved]);

  const setPreference = useCallback((value: ThemeOption) => {
    setPreferenceState(value);

    if (typeof window !== 'undefined') {
      window.localStorage.setItem(STORAGE_KEY, value);
    }
  }, []);

  const contextValue = useMemo<ThemeContextValue>(() => ({
    preference,
    resolved,
    setPreference,
  }), [preference, resolved, setPreference]);

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};

export const THEME_OPTIONS: ThemeOption[] = ['system', 'light', 'dark'];
