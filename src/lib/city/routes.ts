import { CASE_STUDIES_LINKS } from '../../components/caseStudiesLinks';
import { PROJECT_LINKS } from '../../components/projectLinks';

/** Neon families the city can glow in; mirrors :root[data-accent] in globals.scss. */
export type CityAccent = 'cyan' | 'magenta' | 'amber' | 'violet' | 'red';

export type RouteMeta = {
  /** Normalized path: no query, hash, or trailing slash ("/" for home). */
  path: string;
  /** Destination name shown while fast traveling. */
  label: string;
  accent: CityAccent;
  /** Skyline camera position, from -1 (west edge) to 1 (east edge). */
  camera: number;
};

const HOME: RouteMeta = { path: '/', label: 'Home', accent: 'cyan', camera: 0 };
const NOT_FOUND: RouteMeta = { path: '/404', label: 'Signal lost', accent: 'red', camera: 0.12 };

const roundCamera = (value: number) => Math.round(value * 1000) / 1000;

// The city map: case studies in the magenta west, product engineering in the
// cyan east, home in the middle.
const CASE_STUDY_ROUTES = CASE_STUDIES_LINKS.map((link, index): RouteMeta => ({
  path: link.href,
  label: link.label,
  accent: 'magenta',
  camera: roundCamera(-1 + index * 0.2),
}));

const PRODUCT_ROUTES = PROJECT_LINKS.map((link, index): RouteMeta => ({
  path: link.href,
  label: link.label,
  accent: 'cyan',
  camera: roundCamera(0.4 + (index * 0.6) / Math.max(1, PROJECT_LINKS.length - 1)),
}));

export const CITY_ROUTES: readonly RouteMeta[] = [
  HOME,
  { path: '/about', label: 'About', accent: 'violet', camera: -0.38 },
  { path: '/contact', label: 'Contact', accent: 'red', camera: 0.24 },
  NOT_FOUND,
  ...CASE_STUDY_ROUTES,
  ...PRODUCT_ROUTES,
];

const ROUTES_BY_PATH = new Map(CITY_ROUTES.map((route) => [route.path, route]));

export const normalizeRoutePath = (path: string): string => {
  const [pathname] = path.split(/[?#]/);
  const trimmed = pathname.replace(/\/+$/, '');
  return trimmed === '' ? '/' : trimmed;
};

const labelFromPath = (path: string): string => {
  const slug = path.split('/').filter(Boolean).pop() ?? '';
  return slug
    .split('-')
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

/** Fast-travel label, glow color, and camera position for a route. */
export const getRouteMeta = (path: string): RouteMeta => {
  const normalized = normalizeRoutePath(path);
  if (normalized === '/_error') {
    return NOT_FOUND;
  }

  return ROUTES_BY_PATH.get(normalized) ?? {
    ...HOME,
    path: normalized,
    label: labelFromPath(normalized) || HOME.label,
  };
};

export const isHomePath = (path: string): boolean => normalizeRoutePath(path) === '/';
