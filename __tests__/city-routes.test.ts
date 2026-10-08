import fs from 'fs';
import path from 'path';

import { CITY_ROUTES, getRouteMeta, isHomePath, normalizeRoutePath } from '../src/lib/city/routes';

const PAGES_DIR = path.join(__dirname, '..', 'pages');

const pageRoutes = fs.readdirSync(PAGES_DIR)
  .filter((file) => /\.(tsx|ts|jsx|js)$/.test(file) && !file.startsWith('_'))
  .map((file) => {
    const name = file.replace(/\.(tsx|ts|jsx|js)$/, '');
    return name === 'index' ? '/' : `/${name}`;
  });

describe('city routes', () => {
  it('gives every page its own registered spot in the city', () => {
    const registered = new Set(CITY_ROUTES.map((route) => route.path));

    expect(pageRoutes.length).toBeGreaterThan(10);
    pageRoutes.forEach((route) => {
      expect(registered.has(route)).toBe(true);
    });
  });

  it('keeps cameras on the map and paths unique', () => {
    CITY_ROUTES.forEach((route) => {
      expect(route.camera).toBeGreaterThanOrEqual(-1);
      expect(route.camera).toBeLessThanOrEqual(1);
      expect(route.label).not.toBe('');
    });
    expect(new Set(CITY_ROUTES.map((route) => route.path)).size).toBe(CITY_ROUTES.length);
  });

  it('colors districts by kind of work', () => {
    expect(getRouteMeta('/demostoke').accent).toBe('magenta');
    expect(getRouteMeta('/riptyde').accent).toBe('cyan');
    expect(getRouteMeta('/about').accent).toBe('violet');
    expect(getRouteMeta('/contact').accent).toBe('red');
    expect(getRouteMeta('/bar-four/')).toMatchObject({ label: 'Bar Four', accent: 'amber' });
  });

  it('normalizes trailing slashes, queries, and hashes', () => {
    expect(normalizeRoutePath('/demostoke/')).toBe('/demostoke');
    expect(normalizeRoutePath('/demostoke/?tab=ux#flows')).toBe('/demostoke');
    expect(normalizeRoutePath('')).toBe('/');
    expect(normalizeRoutePath('/')).toBe('/');
    expect(getRouteMeta('/bars-of-sand/')).toEqual(getRouteMeta('/bars-of-sand'));
    expect(isHomePath('/?utm_source=x')).toBe(true);
    expect(isHomePath('/about/')).toBe(false);
  });

  it('treats the error page as the 404 route', () => {
    expect(getRouteMeta('/_error')).toEqual(getRouteMeta('/404'));
    expect(getRouteMeta('/404').label).toBe('Signal lost');
  });

  it('falls back to the home glow with a readable label for unknown paths', () => {
    expect(getRouteMeta('/neon-alley/')).toEqual({
      path: '/neon-alley',
      label: 'Neon Alley',
      accent: 'cyan',
      camera: 0,
    });
  });
});
