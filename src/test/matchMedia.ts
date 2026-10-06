export const REDUCED_MOTION_QUERY = 'prefers-reduced-motion: reduce';

// jest.setup.ts installs window.matchMedia as a jest.fn, which jest.spyOn
// would edit in place rather than wrap, so the override is swapped in and out.
const setupMatchMedia = window.matchMedia;

/**
 * Makes window.matchMedia match every query that contains one of the given
 * fragments, such as REDUCED_MOTION_QUERY. Pair it with
 * afterEach(restoreMatchMedia).
 */
export const mockMatchMedia = (...matching: string[]): void => {
  window.matchMedia = (query: string) => ({
    matches: matching.some((fragment) => query.includes(fragment)),
    media: query,
    onchange: null,
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    addListener: jest.fn(),
    removeListener: jest.fn(),
    dispatchEvent: jest.fn(),
  }) as unknown as MediaQueryList;
};

export const restoreMatchMedia = (): void => {
  window.matchMedia = setupMatchMedia;
};
