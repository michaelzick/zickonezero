import localFont from 'next/font/local';

// Self-hosted from the @fontsource packages: next/font copies the files into
// the static export, preloads them, and generates size-adjusted fallbacks, so
// nothing is fetched from a font CDN and the CSP's font-src 'self' is enough.

/** Orbitron: the neon sign and display face. */
export const displayFont = localFont({
  src: '../../node_modules/@fontsource-variable/orbitron/files/orbitron-latin-wght-normal.woff2',
  weight: '400 900',
  display: 'swap',
  variable: '--font-display',
});

/** Rajdhani: HUD labels, navigation, and headings. */
export const hudFont = localFont({
  src: [
    { path: '../../node_modules/@fontsource/rajdhani/files/rajdhani-latin-500-normal.woff2', weight: '500' },
    { path: '../../node_modules/@fontsource/rajdhani/files/rajdhani-latin-700-normal.woff2', weight: '700' },
  ],
  display: 'swap',
  variable: '--font-hud',
});

/** Share Tech Mono: readouts, coordinates, and terminal text. */
export const monoFont = localFont({
  src: '../../node_modules/@fontsource/share-tech-mono/files/share-tech-mono-latin-400-normal.woff2',
  weight: '400',
  display: 'swap',
  variable: '--font-mono',
  adjustFontFallback: false,
  fallback: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
});
