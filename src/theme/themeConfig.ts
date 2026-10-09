/** Night ('dark') is the default city; day ('light') is the visitor's opt-in. */
export type ThemeOption = 'dark' | 'light';

export const THEME_STORAGE_KEY = 'zickonezero-theme';
export const DEFAULT_THEME: ThemeOption = 'dark';

/** Browser chrome color (meta theme-color) for each time of day. */
export const THEME_COLORS: Record<ThemeOption, string> = {
  dark: '#050a14',
  light: '#cfe6e2',
};

/**
 * Anything but an explicit 'light', including the retired 'system' value and
 * unreadable storage, resolves to night.
 */
export const resolveStoredTheme = (stored: unknown): ThemeOption => (stored === 'light' ? 'light' : 'dark');

/**
 * Inline script that runs before first paint (see pages/_document.tsx) so the
 * stored time of day applies without a flash. It mirrors resolveStoredTheme.
 */
export const THEME_BOOTSTRAP_SCRIPT = `(function () {
  var theme = 'dark';
  try {
    theme = window.localStorage.getItem('${THEME_STORAGE_KEY}') === 'light' ? 'light' : 'dark';
  } catch (error) {}
  document.documentElement.setAttribute('data-theme', theme);
  var meta = document.querySelector('meta[name="theme-color"]');
  if (meta) {
    meta.setAttribute('content', theme === 'light' ? '${THEME_COLORS.light}' : '${THEME_COLORS.dark}');
  }
})();`;
