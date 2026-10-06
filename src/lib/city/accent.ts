import type { CityAccent } from './routes';

/**
 * Sets the city's ambient neon color. pages/_document.tsx renders each route's
 * accent into the static HTML; client navigation and the homepage districts
 * change it here, and globals.scss maps it to --city-accent.
 */
export const setCityAccent = (accent: CityAccent): void => {
  const root = document.documentElement;
  if (root.getAttribute('data-accent') !== accent) {
    root.setAttribute('data-accent', accent);
  }
};
