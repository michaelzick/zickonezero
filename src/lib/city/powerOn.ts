/*
 * The city's power-on effects (neon signs igniting, the billboard warming up,
 * the gig cards booting) belong to the visitor's arrival: they play on the
 * first page loaded, not again on every client navigation, where they read as
 * the page blinking out and back in. pages/_app.tsx marks the city started
 * once the first page has mounted.
 */
let started = false;

/** Called once by pages/_app.tsx after the first page has mounted. */
export const markCityStarted = (): void => {
  started = true;
};

/**
 * True while the first page is rendering (including in the static HTML), so
 * reading it during render never breaks hydration; false on later pages.
 */
export const isFirstCityLoad = (): boolean => !started;
