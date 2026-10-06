export const THEME = {
  breakpoints: {
    largeTablet: '1137px',
    mediumTablet: '1045px',
    smallTablet: '899px',
    phone: '600px',
    smallPhone: '300px',
  },
  colors: {
    dark: 'var(--color-dark)',
    darkest: 'var(--color-darkest)',
    surface: 'var(--color-surface)',
    grey: 'var(--color-grey)',
    blue: 'var(--color-blue)',
    white: 'var(--color-white)',
    demostoke: 'var(--color-demostoke)',
    hotYellow: 'var(--color-hotYellow)',
    hotRed: 'var(--color-hotRed)',
    accent: 'var(--color-accent)',
    contrast: 'var(--color-contrast)',
    orange: 'var(--color-orange)',
    mutedLabel: 'var(--color-mutedLabel)',
  },
  neon: {
    cyan: 'var(--neon-cyan)',
    magenta: 'var(--neon-magenta)',
    violet: 'var(--neon-violet)',
    red: 'var(--neon-red)',
    amber: 'var(--neon-amber)',
    yellow: 'var(--hud-yellow)',
    hudRed: 'var(--hud-red)',
    hudTeal: 'var(--hud-teal)',
    cityAccent: 'var(--city-accent)',
  },
  surfaces: {
    glass: 'var(--glass-bg)',
    glassStrong: 'var(--glass-bg-strong)',
    glassBorder: 'var(--glass-border)',
    hudPanel: 'var(--hud-panel-bg)',
    hudPanelBorder: 'var(--hud-panel-border)',
    hudInk: 'var(--hud-ink)',
    hudInkDim: 'var(--hud-ink-dim)',
  },
  // next/font sets the --font-* variables in pages/_app.tsx; the fallbacks
  // keep Storybook and tests readable without them.
  fonts: {
    display: "var(--font-display, 'Arial Black', Impact, sans-serif)",
    hud: "var(--font-hud, 'Arial Narrow', 'Helvetica Neue', sans-serif)",
    mono: "var(--font-mono, ui-monospace, SFMono-Regular, Menlo, monospace)",
    body: '-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif',
  },
  // Stacking order, lowest first. The city layers sit below page content.
  z: {
    sky: -2,
    weather: -1,
    content: 1,
    hud: 90,
    sectionTabs: 95,
    nav: 400,
    dropdown: 500,
    fastTravel: 2000,
  },
  easing: {
    out: 'cubic-bezier(0.16, 1, 0.3, 1)',
    inOut: 'cubic-bezier(0.65, 0, 0.35, 1)',
    snap: 'cubic-bezier(0.2, 0.9, 0.1, 1.2)',
  },
  radii: {
    md: '6px',
  },
} as const;

export type ThemeBreakpoints = typeof THEME.breakpoints;
export type ThemeColors = typeof THEME.colors;
export type ThemeRadii = typeof THEME.radii;
