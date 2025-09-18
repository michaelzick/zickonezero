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
    grey: 'var(--color-grey)',
    blue: 'var(--color-blue)',
    white: 'var(--color-white)',
    demostoke: 'var(--color-demostoke)',
    hotYellow: 'var(--color-hotYellow)',
    hotRed: 'var(--color-hotRed)',
    darkGreen: 'var(--color-darkGreen)',
    contrast: 'var(--color-contrast)',
  },
} as const;

export type ThemeBreakpoints = typeof THEME.breakpoints;
export type ThemeColors = typeof THEME.colors;
