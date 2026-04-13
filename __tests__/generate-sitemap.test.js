const path = require('path');
const { routeFromPageFile, getPageFiles, buildXml, PAGES_DIR } = require('../scripts/generate-sitemap');

describe('generate-sitemap', () => {
  describe('routeFromPageFile', () => {
    it('converts index.tsx to /', () => {
      expect(routeFromPageFile(path.join(PAGES_DIR, 'index.tsx'))).toBe('/');
    });

    it('converts a page to a route with trailing slash', () => {
      expect(routeFromPageFile(path.join(PAGES_DIR, 'about.tsx'))).toBe('/about/');
    });

    it('converts hyphenated page names', () => {
      expect(routeFromPageFile(path.join(PAGES_DIR, 'demostoke-fleet-ops.tsx'))).toBe('/demostoke-fleet-ops/');
    });

    it('returns null for _app.tsx', () => {
      expect(routeFromPageFile(path.join(PAGES_DIR, '_app.tsx'))).toBeNull();
    });

    it('returns null for 404.tsx', () => {
      expect(routeFromPageFile(path.join(PAGES_DIR, '404.tsx'))).toBeNull();
    });

    it('returns null for 500.tsx', () => {
      expect(routeFromPageFile(path.join(PAGES_DIR, '500.tsx'))).toBeNull();
    });
  });

  describe('getPageFiles', () => {
    it('returns .tsx files from the pages directory', () => {
      const files = getPageFiles(PAGES_DIR);
      expect(files.length).toBeGreaterThan(0);
      expect(files.every(f => /\.(tsx|ts|js|jsx)$/.test(f))).toBe(true);
    });

    it('does not include files starting with underscore', () => {
      const files = getPageFiles(PAGES_DIR);
      expect(files.every(f => !path.basename(f).startsWith('_'))).toBe(true);
    });

    it('does not recurse into subdirectories (e.g., api/)', () => {
      const files = getPageFiles(PAGES_DIR);
      expect(files.every(f => path.dirname(f) === PAGES_DIR)).toBe(true);
    });
  });

  describe('buildXml', () => {
    it('produces valid XML with correct structure', () => {
      const xml = buildXml(['/', '/about/']);
      expect(xml).toMatch(/^<\?xml version="1\.0" encoding="UTF-8"\?>/);
      expect(xml).toContain('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">');
      expect(xml).toContain('</urlset>');
    });

    it('includes all provided URLs with base domain', () => {
      const xml = buildXml(['/', '/about/', '/demostoke/']);
      expect(xml).toContain('<loc>https://www.zickonezero.com/</loc>');
      expect(xml).toContain('<loc>https://www.zickonezero.com/about/</loc>');
      expect(xml).toContain('<loc>https://www.zickonezero.com/demostoke/</loc>');
    });

    it('includes lastmod dates in YYYY-MM-DD format', () => {
      const xml = buildXml(['/']);
      expect(xml).toMatch(/<lastmod>\d{4}-\d{2}-\d{2}<\/lastmod>/);
    });

    it('produces one <url> block per route', () => {
      const xml = buildXml(['/', '/about/', '/demostoke/']);
      const urlCount = (xml.match(/<url>/g) || []).length;
      expect(urlCount).toBe(3);
    });
  });
});
